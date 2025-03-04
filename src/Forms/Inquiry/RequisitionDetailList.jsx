import React, { Component, useState, useRef, useEffect } from "react";
import Aux from "../../hoc/_Aux";
import Form, {
  Item,
  Label,
  RequiredRule,
  Tab,
  GroupItem,
} from "devextreme-react/form";
import Card from "../../App/components/MainCard";
import { Button, Navbar, Tabs } from "react-bootstrap";
import Swal from "sweetalert2";
import DataGrid, {
  Column,
  Editing,
  Popup,
  Lookup,
  Paging,
  SearchPanel,
  Export,
} from "devextreme-react/data-grid";
import axios from "axios";
import notify from "devextreme/ui/notify";
import { LoadPanel } from "devextreme-react/load-panel";
import { connect } from "react-redux";
import { Workbook } from "exceljs";
import saveAs from "file-saver";
import { exportDataGrid } from "devextreme/excel_exporter";

const RequisitionHistoryLogDetails = () => {
  const [state, setState] = useState({
    RequisitionItemList: [],
  });
  const [isView, setIsView] = useState(true);

  const [newApproveStatus, setNewApproveStatus] = useState({
    Status: [
      { ID: 0, Name: "Pending" },
      { ID: 1, Name: "Cancel" },
      { ID: 2, Name: "Approve" },
      { ID: 3, Name: "Reject" },
      { ID: 4, Name: "Hold" },
    ],
  });

  const productModule = [
    { ID: "Y", Name: "Item" },
    { ID: "N", Name: "Service" },
  ];
  const [Warehouse, setWarehouse] = useState([]);
  const [UOM, setUOM] = useState([]);
  const [departmentDetails, setDepartmentDetails] = useState([]);
  const [branchDetails, setBranchDetails] = useState([]);

  useEffect(() => {
    fetchGroupDetails();
  }, []);

  const fetchGroupDetails = async () => {
    const authData = JSON.parse(localStorage.getItem("user"));
    const checkAuthentication = await axios.get(
      "/api/CheckUserAuthentication",
      {
        params: { UsersID: authData.UserName, MenuID: 1104 },
      }
    );
    if (checkAuthentication.data.length != 0) {
      if (checkAuthentication.data[0].UserView) {
        setIsView(false);
        try {
          axios
            .all([
              axios.get("/api/getRequisitionItemList"
              // , {
              //   params: { UserName: authData.UserName },
              // }
            ),
              axios.get("/api/getDepartment"),
              axios.get("/api/getBranch"),
              axios.get("/api/getWarehouses"),
              axios.get("/api/getUOM"),
            ])
            .then(
              axios.spread(
                async (
                  RequisitionItemList,
                  department,
                  branch,
                  warehouse,
                  UOM
                ) => {
                  console.log("UserGroup", RequisitionItemList.data);
                  if (RequisitionItemList.data.length != 0) {
                    setState({ RequisitionItemList: RequisitionItemList.data });
                  }
                  if (department.data.length != 0) {
                    setDepartmentDetails(department.data);
                  }
                  if (branch.data.length != 0) {
                    setBranchDetails(branch.data);
                  }
                  if (warehouse.data.length != 0) {
                    setWarehouse(warehouse.data);
                  }
                  if (UOM.data.length != 0) {
                    setUOM(UOM.data);
                  }
                }
              )
            )
            .catch((error) => console.error(error));
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const onExporting = async (e) => {
    let date = await CreateDateTime(new Date());
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Main sheet");
    exportDataGrid({
      component: e.component,
      worksheet: worksheet,
      customizeCell: function (options) {
        options.excelCell.font = { name: "Arial", size: 12 };
        options.excelCell.alignment = { horizontal: "left" };
      },
    }).then(function () {
      workbook.xlsx.writeBuffer().then(function (buffer) {
        saveAs(
          new Blob([buffer], { type: "application/octet-stream" }),
          "Requisition Detail List (Item Vise) " + date + ".xlsx"
        );
      });
    });
  };

  const CreateDateTime = (dateTime) => {
    const year = dateTime.getFullYear();
    const month = (dateTime.getMonth() + 1).toString().padStart(2, "0");
    const date = dateTime.getDate().toString().padStart(2, "0");
    const hours = dateTime.getHours().toString().padStart(2, "0");
    const minutes = dateTime.getMinutes().toString().padStart(2, "0");
    const formattedDateTime = `${year}.${month}.${date}.${hours}:${minutes}`;
    console.log(formattedDateTime);
    return formattedDateTime;
  };

  return (
    <div>
      <Card title="Requisition Detail List (Item Wise)">
        <DataGrid
          allowColumnReordering={true}
          showBorders={true}
          dataSource={state.RequisitionItemList}
          columnAutoWidth={true}
          hoverStateEnabled={true}
          onExporting={onExporting}
        >
          <Paging enabled={true} />
          <Export enabled={true} />
          <Editing mode="row" />
          <SearchPanel visible={true} />
          <Column dataField="PRHeaderID" caption="PR ID" />
          {/* <Column dataField="Term" /> */}
          <Column dataField="PRType" caption="PR Type" />
          <Column dataField="ItemCategory" />
          <Column dataField="PRNumber" caption="PR Number" />
          <Column
            dataField="CreatedDate"
            editorType="dxDateBox"
            caption="Created Date"
            dataType="date"
          ></Column>

          <Column
            dataField="ExpectedDate"
            editorType="dxDateBox"
            caption="Expected Date"
            dataType="date"
          ></Column>
          <Column dataField="Remarks1" caption="Remarks" />
          {/* <Column dataField="Purchase Justification" /> */}

          <Column dataField="RequestorName" />
          <Column dataField="RequestorsDepartment">
            <Lookup
              items={departmentDetails}
              valueExpr="DepartmentCode"
              displayExpr="Discription"
            ></Lookup>
          </Column>
          <Column dataField="RequestorsBranch">
            <Lookup
              items={branchDetails}
              valueExpr="BranchCode"
              displayExpr="Discription"
            ></Lookup>
          </Column>
          <Column dataField="RequestorEmail" />
          <Column
            dataField="Requestorcontanctno"
            caption="Requestor Contact No"
          />
          <Column dataField="OtherDetails" />

          <Column dataField="ApproveStatus">
            <Lookup
              items={newApproveStatus.Status}
              valueExpr="ID"
              displayExpr="Name"
            ></Lookup>
          </Column>
          <Column dataField="ApproveLevel" />
          <Column dataField="ApproveRemarks" caption="Approve Remarks" />
          <Column
            dataField="ApproveDate"
            editorType="dxDateBox"
            caption="Approved Date"
            dataType="date"
          ></Column>
          <Column dataField="ApproveUser" />

          <Column dataField="Module">
            <Lookup items={productModule} valueExpr="ID" displayExpr="Name" />
          </Column>
          <Column dataField="ItemCode" />
          <Column dataField="ItemDescription" width={"150"} />
          <Column dataField="WarehouseCode" caption="Warehouse">
            <Lookup
              items={Warehouse}
              valueExpr="WhseCode"
              displayExpr="WhseName"
            ></Lookup>
          </Column>
          <Column dataField="UoMCode" caption="UOM">
            <Lookup
              items={UOM}
              valueExpr="cUnitCode"
              displayExpr="cUnitDescription"
            ></Lookup>
          </Column>
          <Column dataField="OnhandQty" caption="On Hand Quantity" />
          <Column dataField="Quantity" />
          <Column dataField="UnitCost" />
          <Column dataField="UnitPrice" />
          <Column dataField="TotalAmount" caption="Total Amount Exclusive" />
          <Column dataField="TotalCost" caption="Total Cost Exclusive" />
          {/* <Column dataField="Required Date" /> */}
          {/* <Column dataField="Items Remark" /> */}
        </DataGrid>
      </Card>
    </div>
  );
};

export default RequisitionHistoryLogDetails;
