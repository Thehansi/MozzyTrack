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
    RequisitionHistoryItemList: [],
  });

  const [Warehouse, setWarehouse] = useState([]);
  const [UOM, setUOM] = useState([]);
  const [departmentDetails, setDepartmentDetails] = useState([]);
  const [branchDetails, setBranchDetails] = useState([]);
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
  const [isView, setIsView] = useState(true);
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
              axios.get("/api/getRequisitionItemListHistoryDetails", {
                params: { UserName: authData.UserName },
              }),
              axios.get("/api/getDepartment"),
              axios.get("/api/getBranch"),
              axios.get("/api/getWarehouses"),
              axios.get("/api/getUOM"),
            ])
            .then(
              axios.spread(
                async (
                  RequisitionHistoryItemList,
                  department,
                  branch,
                  warehouse,
                  UOM
                ) => {
                  console.log("UserGroup", RequisitionHistoryItemList);
                  if (RequisitionHistoryItemList.data.length != 0) {
                    setState({
                      RequisitionHistoryItemList:
                        RequisitionHistoryItemList.data,
                    });
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
          "Requisition History Log Details " + date + ".xlsx"
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
      <Card title="Requisition History Log Details">
        <DataGrid
          allowColumnReordering={true}
          showBorders={true}
          dataSource={state.RequisitionHistoryItemList}
          columnAutoWidth={true}
          hoverStateEnabled={true}
          onExporting={onExporting}
        >
          <Paging enabled={true} />
          <SearchPanel visible={true} />
          <Editing mode="row" />
          <Export enabled={true} />
          <Column dataField="PRHeaderID" caption="PR ID" />
          {/* <Column dataField="Term" /> */}
          <Column dataField="PRType" caption="PR Type" />
          <Column dataField="ItemType" caption="Item Category" />
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
          <Column dataField="Remarks1" />
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
          <Column dataField="ApproveRemarks" />
          <Column
            dataField="ApproveDate"
            editorType="dxDateBox"
            caption="Approve Date"
            dataType="date"
          ></Column>
          <Column dataField="ApproveUser" />

          <Column dataField="Module">
            <Lookup items={productModule} valueExpr="ID" displayExpr="Name" />
          </Column>
          <Column dataField="ItemCode" />
          <Column dataField="ItemDescription" />
          <Column dataField="Warehouse" caption="Warehouse">
            <Lookup
              items={Warehouse}
              valueExpr="WhseCode"
              displayExpr="WhseName"
            ></Lookup>
          </Column>
          <Column dataField="UOM" caption="UOM">
            <Lookup
              items={UOM}
              valueExpr="cUnitCode"
              displayExpr="cUnitDescription"
            ></Lookup>
          </Column>
          {/* <Column dataField="OnhandQty" caption="On Hand Quantity" /> */}
          <Column dataField="Qty" caption="Quantity" />
          <Column dataField="UnitCost" />
          <Column dataField="UnitPrice" />
          <Column dataField="TotalAmount" />
          <Column dataField="TotalCost" />

          {/* <Column dataField="PRHeaderID" />
          <Column dataField="Module" />
          <Column dataField="PRType" />
          <Column dataField="ItemType" />
          <Column dataField="PRNumber" />
          <Column dataField="CreatedDate" />
          <Column dataField="ExpectedDate" />
          <Column dataField="ValidityPeriod" />
          <Column dataField="ValidFrom" />
          <Column dataField="ValidTo" />
          <Column dataField="Validity Status" />
          <Column dataField="Currency Code" />
          <Column dataField="Currency Rate" />
          <Column dataField="Purchase Justification" />
          <Column dataField="Header Remarks" />

          <Column dataField="Module" />
          <Column dataField="Item/ Service Code" />
          <Column dataField="Item/ Service Description" />
          <Column dataField="Warehouse" />
          <Column dataField="Unit Of Measure" />
          <Column dataField="Quantity" />
          <Column dataField="Onhand Quantity " />
          <Column dataField="Unit Cost" />
          <Column dataField="Total Cost" />
          <Column dataField="Unit Price" />
          <Column dataField="Tax Rate" />
          <Column dataField="Total Amount Exclusive" />
          <Column dataField="Total Amount Inclusive" />
          <Column dataField="Required Date" />
          <Column dataField="Items Remark" />

          <Column dataField="Request Name" />
          <Column dataField="Requestor Department" />
          <Column dataField="Requestor Branch" />
          <Column dataField="Requestor Email" />
          <Column dataField="Requestor Contact No" />
          <Column dataField="Requestor Other Details" />

          <Column dataField="Approval Status" />
          <Column dataField="Approval Level" />
          <Column dataField="Approval Remarks" />
          <Column dataField="Approved Date" />
          <Column dataField="Approved User" /> */}
        </DataGrid>
      </Card>
    </div>
  );
};

export default RequisitionHistoryLogDetails;
