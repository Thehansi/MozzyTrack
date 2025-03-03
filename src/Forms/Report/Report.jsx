import React, { Component, useState, useRef, useEffect } from "react";
import { jsPDF } from "jspdf";
// import CrystalReportViewer from "some-crystal-reports-viewer-component";
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
import { exportDataGrid } from "devextreme/pdf_exporter";

const Report = () => {
  const [isProcurementOfficer, setIsProcurementOfficer] = useState(false);
  const [isUserName, setIsUserName] = useState(false);
  const [isItemCategory, setIsItemCategory] = useState(false);
  const [isApproveDate, setIsApproveDate] = useState(false);
  const [isApproveLevel, setIsApproveLevel] = useState(false);
  const [isRequestorsDepartment, setIsRequestorsDepartment] = useState(false);
  const [isDisable, setIsDisable] = useState(true);

  const [viewReport, setViewReport] = useState([]);
  const [emptyArray, setEmptyArray] = useState([]);
  const [userName, setUsername] = useState([]);
  const [itemCategory, setItemCategory] = useState([]);
  // const [requestorsDepartment, setRequestorsDepartment] = useState([]);
  const [approveLevel, setApproveLevel] = useState([]);
  const [department, setDepartment] = useState([]);
  const [pmOfficerDetails, setPMOfficerDetails] = useState([]);

  const [reportType, setReportType] = useState(-1);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [columns, setColumns] = useState([]);
  const [isView, setIsView] = useState(true);

  const gdpFormat = {
    type: "percent",
    precision: 1,
  };
  const exportFormats = ["pdf"];
  const [userAuthentication, setUserAuthentication] = useState({});
  const [pdfDataUrl, setPdfDataUrl] = useState(null);
  const [state, setState] = useState({
    jForm: {},
  });
  const reports = [
    {
      ID: 0,
      ReportName:
        "Purchase Requisition Creator User-wise/ Purchase Requisition Assigned User wise",
    },
    { ID: 1, ReportName: "Report 1" },
    { ID: 2, ReportName: "Report 2" },
    { ID: 3, ReportName: "Report 3" },
    { ID: 4, ReportName: "Report 4" },
    { ID: 5, ReportName: "Report 5" },
  ];
  useEffect(() => {
    fetchGroupDetails();
  }, []);
  const fetchGroupDetails = async () => {
    const authData = JSON.parse(localStorage.getItem("user"));
    const checkAuthentication = await axios.get(
      "/api/CheckUserAuthentication",
      {
        params: { UsersID: authData.UserName, MenuID: 1201 },
      }
    );
    console.log("checkAuthentication", checkAuthentication.data[0]);
    if (checkAuthentication.data.length != 0) {
      if (checkAuthentication.data[0].UserView) {
        console.log("AWA");
        setIsView(false);
        try {
          axios
            .all([
              axios.get("/api/getPMOfficer"),
              axios.get("/api/getDepartment"),
              axios.get("/api/getApprovalLevel"),
              axios.get("/api/getItemType"),
              axios.get("/api/getUser"),
            ])
            .then(
              axios.spread(
                async (
                  pmOfficer,
                  department,
                  approvalLevel,
                  itemType,
                  user
                ) => {
                  if (pmOfficer.data.length != 0) {
                    setPMOfficerDetails(pmOfficer.data);
                  }
                  if (department.data.length != 0) {
                    setDepartment(department.data);
                  }
                  if (approvalLevel.data.length != 0) {
                    setApproveLevel(approvalLevel.data);
                  }
                  if (itemType.data.length != 0) {
                    setItemCategory(itemType.data);
                  }
                  if (user.data.length != 0) {
                    setUsername(user.data);
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
  // const CreateDateTime = (dateTime) => {
  //   const year = dateTime.getFullYear();
  //   const month = (dateTime.getMonth() + 1).toString().padStart(2, "0");
  //   const date = dateTime.getDate().toString().padStart(2, "0");
  //   const hours = dateTime.getHours().toString().padStart(2, "0");
  //   const minutes = dateTime.getMinutes().toString().padStart(2, "0");
  //   const formattedDateTime = `${year}.${month}.${date}.${hours}:${minutes}`;
  //   console.log(formattedDateTime);
  //   return formattedDateTime;
  // };
  const updateTable = (e) => {
    if (!isView) {
      if (e.row.data.ID == 0) {
        // setState((state.jForm = {}));
        setIsRequestorsDepartment(false);
        setIsUserName(true);
        setIsProcurementOfficer(true);
        setIsApproveDate(false);
        setIsItemCategory(false);
        setIsApproveLevel(false);
        setIsDisable(false);
        setReportType(0);
        setViewReport(null);
        setState((prevState) => ({
          jForm: {
            ...prevState.jForm,
            ItemCategory: null,
            RequestorsDepartment: null,
            ApproveLevel: null,
            ApproveDate: null,
          },
        }));
      } else if (e.row.data.ID == 1) {
        // setState((state.jForm = {}));
        setIsRequestorsDepartment(false);
        setIsUserName(false);
        setIsProcurementOfficer(false);
        setIsApproveDate(false);
        setIsItemCategory(true);
        setIsApproveLevel(false);
        setIsDisable(false);
        setReportType(1);
        setViewReport(null);
        setState((prevState) => ({
          jForm: {
            ...prevState.jForm,
            RequestorsDepartment: null,
            ApproveLevel: null,
            ApproveDate: null,
            ProcurementOfficer: null,
            UserName: null,
          },
        }));
      } else if (e.row.data.ID == 2) {
        setIsRequestorsDepartment(true);
        setIsUserName(false);
        setIsProcurementOfficer(false);
        setIsApproveDate(false);
        setIsItemCategory(false);
        setIsApproveLevel(false);
        setIsDisable(false);
        setReportType(2);
        setViewReport(null);
        setState((prevState) => ({
          jForm: {
            ...prevState.jForm,
            ItemCategory: null,
            ApproveLevel: null,
            ApproveDate: null,
            ProcurementOfficer: null,
            UserName: null,
          },
        }));
      } else if (e.row.data.ID == 3) {
        setIsRequestorsDepartment(false);
        setIsUserName(false);
        setIsProcurementOfficer(false);
        setIsApproveDate(true);
        setIsItemCategory(false);
        setIsApproveLevel(false);
        setIsDisable(false);
        setReportType(3);
        setViewReport([]);
        setState((prevState) => ({
          jForm: {
            ...prevState.jForm,
            ItemCategory: null,
            RequestorsDepartment: null,
            ApproveLevel: null,
            ProcurementOfficer: null,
            UserName: null,
          },
        }));
      } else if (e.row.data.ID == 4) {
        setIsRequestorsDepartment(false);
        setIsUserName(false);
        setIsProcurementOfficer(false);
        setIsApproveDate(false);
        setIsItemCategory(false);
        setIsApproveLevel(true);
        setIsDisable(false);
        setReportType(4);
        setViewReport(emptyArray);
        setState((prevState) => ({
          jForm: {
            ...prevState.jForm,
            ItemCategory: null,
            RequestorsDepartment: null,
            ApproveDate: null,
            ProcurementOfficer: null,
            UserName: null,
          },
        }));
      } else if (e.row.data.ID == 5) {
        setIsRequestorsDepartment(false);
        setIsUserName(true);
        setIsProcurementOfficer(false);
        setIsApproveDate(false);
        setIsItemCategory(false);
        setIsApproveLevel(false);
        setIsDisable(false);
        setReportType(5);
        setViewReport(emptyArray);
        setState((prevState) => ({
          jForm: {
            ...prevState.jForm,
            ItemCategory: null,
            RequestorsDepartment: null,
            ApproveLevel: null,
            ApproveDate: null,
            ProcurementOfficer: null,
          },
        }));
      }
    }
  };

  const OnNotification = (message, type) => {
    notify({
      message: message,
      type: type,
      displayTime: 3000,
      position: { at: "top right", offset: "50" },
    });
  };

  const isValidation = () => {
    if (reportType == 0) {
      if (
        state.jForm.UserName == "" ||
        state.jForm.UserName == NaN ||
        state.jForm.UserName == undefined
      ) {
        OnNotification("User Name is Required", "error");
        return false;
      } else if (
        state.jForm.ProcurementOfficer == "" ||
        state.jForm.ProcurementOfficer == NaN ||
        state.jForm.ProcurementOfficer == undefined
      ) {
        OnNotification("Procurement Officer is Required", "error");
        return false;
      }
      return true;
    } else if (reportType == 1) {
      if (
        state.jForm.ItemCategory == "" ||
        state.jForm.ItemCategory == NaN ||
        state.jForm.ItemCategory == undefined
      ) {
        OnNotification("Item Category is Required", "error");
        return false;
      }
      return true;
    } else if (reportType == 2) {
      if (
        state.jForm.RequestorsDepartment == "" ||
        state.jForm.RequestorsDepartment == NaN ||
        state.jForm.RequestorsDepartment == undefined
      ) {
        OnNotification("Requestors Department is Required", "error");
        return false;
      }
      return true;
    } else if (reportType == 3) {
      if (
        state.jForm.ApproveDate == "" ||
        state.jForm.ApproveDate == NaN ||
        state.jForm.ApproveDate == undefined
      ) {
        OnNotification("Approve Date is Required", "error");
        return false;
      }
      return true;
    } else if (reportType == 4) {
      if (
        state.jForm.ApproveLevel == "" ||
        state.jForm.ApproveLevel == NaN ||
        state.jForm.ApproveLevel == undefined
      ) {
        OnNotification("Approve Level is Required", "error");
        return false;
      }
      return true;
    } else if (reportType == 5) {
      if (
        state.jForm.UserName == "" ||
        state.jForm.UserName == NaN ||
        state.jForm.UserName == undefined
      ) {
        OnNotification("User Name is Required", "error");
        return false;
      }
      return true;
    }
    return true;
  };

  const formatDateMonth = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}/${day}/${year}`;
  };

  const handleSave = async (e) => {
    console.log("e", state.jForm);
    if (await isValidation()) {
      try {
        let response = "";
        if (reportType == 0) {
          response = await axios.get("/api/UserPMWise", {
            params: {
              UserName: state.jForm.UserName,
              ProcurementOfficer: state.jForm.ProcurementOfficer,
            },
          });
        } else if (reportType == 1) {
          response = await axios.get("/api/CategoryWise", {
            params: {
              ItemCategory: state.jForm.ItemCategory,
            },
          });
        } else if (reportType == 2) {
          response = await axios.get("/api/DepartmentWise", {
            params: {
              RequestorsDepartment: state.jForm.RequestorsDepartment,
            },
          });
        } else if (reportType == 3) {
          const formattedDate = await formatDateMonth(
            new Date(state.jForm.ApproveDate)
          );
          console.log("formattedDate", formattedDate);
          response = await axios.get("/api/ApprovallevelTimeWise", {
            params: {
              ApproveDate: formattedDate,
            },
          });
        } else if (reportType == 4) {
          response = await axios.get("/api/PendingApprovalLevelWise", {
            params: {
              ApproveLevel: state.jForm.ApproveLevel,
            },
          });
        } else if (reportType == 5) {
          response = await axios.get("/api/UserWise", {
            params: {
              UserName: state.jForm.UserName,
            },
          });
        }
        console.log("res Data", response.data);
        setViewReport(response.data);
        console.log("res Data", response.data.length);
        if (response.data.length > 0) {
          const firstRow = response.data[0];
          const dynamicColumns = Object.keys(firstRow).map((key) => {
            const value = firstRow[key];
            let dataType = "string";

            console.log("key", key);
            console.log("value", value);

            if (
              typeof value === "string" &&
              isNaN(value) &&
              !isNaN(Date.parse(value))
            ) {
              dataType = "date";
            }

            return {
              dataField: key,
              caption: key, //.replace(/([A-Z])/g, " $1").trim()
              dataType,
            };

            // const isDate = isNaN(Date.parse(firstRow[key])) ? false : true;
            // console.log("key", key);
            // console.log("date", isDate);
            // console.log("caption", key.replace(/([A-Z])/g, " $1").trim());
            // return {
            //   dataField: key,
            //   caption: key, //key.replace(/([A-Z])/g, " $1").trim()
            //   dataType: isDate ? "date" : "string",
            // };
          });
          setColumns(dynamicColumns);
        }
      } catch (error) {
        console.error("Error fetching report data:", error);
        setError("Error fetching report data. Please try again later.");
      }

      // try {
      //   const response = await axios.get("/api/reports", {
      //     responseType: "blob",
      //   });
      //   console.log("response API", response.data);
      //   // const data = response.data;
      //   const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      //   const url = URL.createObjectURL(pdfBlob);
      //   setPdfUrl(url);
      //   // setReportData(data);
      // } catch (error) {
      //   console.error("Error fetching report data:", error);
      //   setError("Error fetching report data. Please try again later.");
      // }
      // console.log("AWA", e);
      // let parameter1 = "c";
      // let parameter2 = "Chn";
      // let reportName = "Purchase Requisition Creator User-wise.rpt";
      // const reportPath = "Z:LH-ReportPurchase Requisition Creator User-wise.rpt";
      // // const parameters = `parameter1=${parameter1}&parameter2=${parameter2}`;
      // const parameter = `parameter=${parameter1}`;
      // window.open(
      //   `${window["Config"].ReportURL}?f=${reportPath}${reportName}&${parameter}`,
      //   "_blank"
      // );
    }
  };
  //   <CrystalReportViewer
  //   reportPath="Z:\LH-Report\Purchase Requisition Category wise.rpy"
  //   // Additional props or configuration for the viewer component
  // />;

  const onExporting = (e) => {
    // const doc = new jsPDF();
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [420, 297],
    });
    const lastPoint = { x: 0, y: 0 };

    exportDataGrid({
      jsPDFDocument: doc,
      component: e.component,
      topLeft: { x: 1, y: 25 },
      // columnWidths: [
      //   30, 20, 30, 15, 22, 22, 20, 20, 30, 20, 30, 15, 22, 22, 20, 20, 20,
      // ],
      customDrawCell({ rect }) {
        if (lastPoint.x < rect.x + rect.w) {
          lastPoint.x = rect.x + rect.w;
        }
        if (lastPoint.y < rect.y + rect.h) {
          lastPoint.y = rect.y + rect.h;
        }
      },
    }).then(() => {
      const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;

      for (let i = 1; i <= pageNumber; i++) {
        doc.setPage(i);
        const header = `${reports[reportType].ReportName} Report - (Page ${i} of ${pageNumber})`; //
        const pageWidth = doc.internal.pageSize.getWidth();
        const headerWidth = doc.getTextDimensions(header).w;
        doc.setFontSize(15);
        doc.text(header, (pageWidth - headerWidth) / 2, 5);
      }

      const pdfBase64 = doc.output("datauristring");
      const pdfWindow = window.open();
      pdfWindow.document.write(
        '<iframe src="' +
          pdfBase64 +
          '" width="100%" height="100%" style="border:none;"></iframe>'
      );
      // footer
      // const footer = "www.wikipedia.org";
      // const footerWidth = doc.getTextDimensions(footer).w;

      // doc.setFontSize(9);
      // doc.setTextColor("#cccccc");
      // doc.text(footer, lastPoint.x - footerWidth, lastPoint.y + 5);

      // doc.save("Companies.pdf");
    });
  };

  return (
    <div>
      <Card title='Reports List'>
        <DataGrid
          allowColumnReordering={true}
          showBorders={true}
          dataSource={reports}
          hoverStateEnabled={true}
          columnAutoWidth={true}
          onCellDblClick={updateTable}
        >
          <Paging enabled={true} />
          <Editing mode='row' />
          <SearchPanel visible={true} />
          <Column dataField='ID' visible={false} />
          <Column dataField='ReportName' />
        </DataGrid>
      </Card>
      <Card title='Parameters'>
        <Form formData={state.jForm}>
          <GroupItem colCount={2}>
            <Item
              dataField='ProcurementOfficer'
              visible={isProcurementOfficer}
              editorType='dxSelectBox'
              editorOptions={{
                dataSource: pmOfficerDetails,
                valueExpr: "OfficerID",
                displayExpr: "OfficerID",
              }}
            >
              <RequiredRule />
              <Label text='Procurement Officer'></Label>
            </Item>
            <Item
              dataField='UserName'
              visible={isUserName}
              editorType='dxSelectBox'
              editorOptions={{
                dataSource: userName,
                valueExpr: "UserName",
                displayExpr: "UserName",
              }}
            >
              <RequiredRule message='Field required' />
              <Label text='User Name'></Label>
            </Item>
            <Item
              dataField='ItemCategory'
              visible={isItemCategory}
              editorType='dxSelectBox'
              editorOptions={{
                dataSource: itemCategory,
                valueExpr: "FldValue",
                displayExpr: "FldValue",
              }}
            >
              <Label text='Item Category'></Label>
            </Item>
            <Item
              dataField='RequestorsDepartment'
              visible={isRequestorsDepartment}
              editorType='dxSelectBox'
              editorOptions={{
                dataSource: department,
                valueExpr: "DepartmentCode",
                displayExpr: "Discription",
              }}
            >
              <RequiredRule />
              <Label text='Requestors Department'></Label>
            </Item>
            <Item
              dataField='ApproveDate'
              visible={isApproveDate}
              editorType='dxDateBox'
            >
              <RequiredRule />
              <Label text='Approve Date'></Label>
            </Item>
            <Item
              dataField='ApproveLevel'
              visible={isApproveLevel}
              editorType='dxSelectBox'
              editorOptions={{
                dataSource: approveLevel,
                valueExpr: "ApprovalLevel",
                displayExpr: "ApprovalLevel",
              }}
            >
              <RequiredRule />
              <Label text='Approve Level'></Label>
            </Item>
          </GroupItem>
        </Form>
        <br />
        <br />
        <br />
        <Navbar bg='light' variant='light'>
          <Button
            variant='secondary'
            icon='feather icon-layers'
            onClick={handleSave}
            disabled={isDisable}
          >
            View Report
          </Button>
        </Navbar>
      </Card>

      <Card title='Report Form'>
        <DataGrid
          dataSource={viewReport}
          showBorders={true}
          hoverStateEnabled={true}
          columnAutoWidth={true}
          wordWrapEnabled={true}
          onExporting={onExporting}
          // focusedRowEnabled={true}
        >
          <Paging enabled={true} />
          <Editing mode='row' />
          <Export enabled={true} formats={exportFormats} />
          <SearchPanel visible={true} />
          {columns.map((column) => (
            <Column key={column.dataField} {...column} />
          ))}
        </DataGrid>
      </Card>
    </div>
  );
};

export default Report;
