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

const RequisitionHistoryLog = () => {
  const [state, setState] = useState({
    RequisitionList: [],
    Attachment: [],
  });
  const [isView, setIsView] = useState(true);
  const [departmentDetails, setDepartmentDetails] = useState([]);
  const [branchDetails, setBranchDetails] = useState([]);

  useEffect(() => {
    fetchGroupDetails();
  }, []);

  const [newApproveStatus, setNewApproveStatus] = useState({
    Status: [
      { ID: 0, Name: "Pending" },
      { ID: 1, Name: "Cancel" },
      { ID: 2, Name: "Approve" },
      { ID: 3, Name: "Reject" },
      { ID: 4, Name: "Hold" },
    ],
  });
  const fetchGroupDetails = async () => {
    const authData = JSON.parse(localStorage.getItem("user"));
    const checkAuthentication = await axios.get(
      "/api/CheckUserAuthentication",
      {
        params: { UsersID: authData.UserName, MenuID: 1102 },
      }
    );
    if (checkAuthentication.data.length != 0) {
      console.log("checkAuthentication", checkAuthentication.data[0].UserView);
      if (checkAuthentication.data[0].UserView) {
        setIsView(false);
        try {
          axios
            .all([
              axios.get(
                "/api/getRequisitionListSAP"
                // , {
                //   params: { UserName: authData.UserName },
                // }
              ),
              axios.get("/api/getRequisitionListSAPAttachmment", {
                params: { UserName: authData.UserName },
              }),
              axios.get("/api/getDepartment"),
              axios.get("/api/getBranch"),
            ])
            .then(
              axios.spread(
                async (RequisitionList, attachment, department, branch) => {
                  console.log("attachment", attachment);
                  console.log("RequisitionList", RequisitionList);
                  if (RequisitionList.data.length != 0) {
                    setState({
                      RequisitionList: RequisitionList.data,
                      Attachment: attachment.data,
                    });
                    // setState({ Attachment: attachment.data });
                  }
                  if (department.data.length != 0) {
                    setDepartmentDetails(department.data);
                  }
                  if (branch.data.length != 0) {
                    setBranchDetails(branch.data);
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
          "Requisition History Log " + date + ".xlsx"
        );
      });
    });
  };

  const onExportingAttachment = async (e) => {
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
          "Attachments History " + date + ".xlsx"
        );
      });
    });
  };

  return (
    <div>
      <Card title="Requisition History Log">
        <DataGrid
          allowColumnReordering={true}
          showBorders={true}
          dataSource={state.RequisitionList}
          columnAutoWidth={true}
          columnFixing={true}
          allowColumnResizing={true}
          wordWrapEnabled={true}
          hoverStateEnabled={true}
          onExporting={onExporting}
        >
          <Paging enabled={true} />
          <Export enabled={true} />
          <SearchPanel visible={true} />
          <Editing mode="row" />
          <Column dataField="PRHeaderID" caption="PR ID" />
          {/* <Column dataField="Terms" /> */}
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
            // format="dd/MM/yyyy"
            // customizeText={(cellInfo) => {
            //   const date = new Date(cellInfo.value);
            //   const formattedDate = `${date.getDate()}/${
            //     date.getMonth() + 1
            //   }/${date.getFullYear()}`;
            //   return formattedDate;
            // }}
          ></Column>
          <Column dataField="ValidityPeriod" />
          <Column
            dataField="ValidFrom"
            editorType="dxDateBox"
            caption="Valid From"
            dataType="date"
          ></Column>
          <Column
            dataField="ValidTo"
            editorType="dxDateBox"
            caption="Valid To"
            dataType="date"
          ></Column>
          <Column dataField="ValidityStatus" />
          <Column dataField="CurrencyCode" />
          <Column dataField="ExchangeRate" />
          {/* <Column dataField="Purchase Justification" /> */}
          <Column dataField="Remarks" />
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
          <Column dataField="IsSapPost" />
        </DataGrid>

        <br />
        <br />
      </Card>
      <Card title="Attachments History">
        <div>
          <DataGrid
            allowColumnReordering={true}
            showBorders={true}
            dataSource={state.Attachment}
            columnAutoWidth={true}
            hoverStateEnabled={true}
            onExporting={onExportingAttachment}
          >
            <Paging enabled={true} />
            <Export enabled={true} />
            <SearchPanel visible={true} />
            <Column dataField="PRHeaderID" caption="PR ID" />
            <Column dataField="FileName" />
            <Column dataField="FileUploadedUser" />
            <Column
              dataField="FileUploadedDate"
              editorType="dxDateBox"
              caption="File Uploaded Date"
              dataType="date"
            ></Column>
            {/* <Column dataField="PR Number" /> */}
            {/* <Column dataField="Specification Attached" />
            <Column dataField="BOQ Attached" />
            <Column dataField="Drawing Attached" /> */}
          </DataGrid>
        </div>
      </Card>
    </div>
  );
};

export default RequisitionHistoryLog;
