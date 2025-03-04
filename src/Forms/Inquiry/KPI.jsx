import React, { useState, useEffect } from "react";
import Card from "../../App/components/MainCard";
import DataGrid, {
  Column,
  Editing,
  Lookup,
  Paging,
  SearchPanel,
  Export,
} from "devextreme-react/data-grid";
import axios from "axios";
import Swal from "sweetalert2";

import { Workbook } from "exceljs";
import saveAs from "file-saver";
import { exportDataGrid } from "devextreme/excel_exporter";

const KPI = () => {
  const [state, setState] = useState({
    KPI: [],
    Status: [],
  });
  const [index, SetIndex] = useState(0);
  const [departmentDetails, setDepartmentDetails] = useState([]);
  const [folder, setFolder] = useState({
    Choose: [
      { ID: "N/A", Name: "N/A" },
      { ID: "Archived", Name: "Archived" },
      {
        ID: "AllowToFeedFurtherToAMP/MP",
        Name: "Allow to feed further to AMP/MP",
      },
    ],
  });

  const [bidding, setBidding] = useState({
    Type: [
      { ID: "Shopping", Name: "Shopping" },
      { ID: "LNB", Name: "LNB" },
      { ID: "NCB", Name: "NCB" },
      { ID: "ICB", Name: "ICB" },
      { ID: "Direct", Name: "Direct" },
      { ID: "Repeat", Name: "Repeat" },
    ],
  });

  const [authorityLevel, setAuthorityLevel] = useState({
    AuthorityLevel: [
      { ID: "HOD/P", Name: "HOD/P" },
      { ID: "FM", Name: "FM" },
      { ID: "GCOO", Name: "GCOO" },
      { ID: "GCFO", Name: "GCFO" },
      { ID: "DCEO", Name: "DCEO" },
      { ID: "GCEO", Name: "GCEO" },
      { ID: "PC", Name: "PC" },
      { ID: "BOD", Name: "BOD" },
    ],
  });

  const [warranty, setWarranty] = useState({
    Warranty: [
      { ID: "1", Name: "1 Year" },
      { ID: "2", Name: "2 Year" },
      { ID: "3", Name: "3 Year" },
      { ID: "4", Name: "4 Year" },
      { ID: "5", Name: "5 Year" },
      { ID: "6", Name: "6 Year" },
      { ID: "7", Name: "7 Year" },
      { ID: "8", Name: "8 Year" },
      { ID: "9", Name: "9 Year" },
      { ID: "10", Name: "10 Year" },
    ],
  });
  const [isView, setIsView] = useState(true);

  useEffect(() => {
    fetchGroupDetails();
  }, []);
  const fetchGroupDetails = async () => {
    const authData = JSON.parse(localStorage.getItem("user"));
    const checkAuthentication = await axios.get(
      "/api/CheckUserAuthentication",
      {
        params: { UsersID: authData.UserName, MenuID: 1107 },
      }
    );
    if (checkAuthentication.data.length != 0) {
      if (checkAuthentication.data[0].UserView) {
        setIsView(false);
        try {
          axios
            .all([
              axios.get("/api/getKPI"),
              axios.get("/api/getStatus"),
              axios.get("/api/getDepartment"),
            ])
            .then(
              axios.spread(async (kpi, status, Department) => {
                console.log("kpi", kpi.data);
                if (kpi.data.length != 0) {
                  let dataArray = kpi.data;
                  dataArray.forEach(async (obj) => {
                    obj.UpdatedOn = new Date();
                    const getSAPDetails = await axios.get(
                      "/api/getSAPDetails",
                      {
                        params: { PRNumber: obj.PRNumber },
                      }
                    );
                    if (getSAPDetails.data.value.length != 0) {
                      obj.PONo = getSAPDetails.data.value[0].DocNum;
                      obj.PODate = getSAPDetails.data.value[0].DocDate;
                      setState({
                        KPI: dataArray,
                        Status: status.data,
                      });
                    }
                  });
                  setState({
                    KPI: dataArray,
                    Status: status.data,
                  });
                  setDepartmentDetails(Department.data);
                }
              })
            )
            .catch((error) => console.error(error));
        } catch (error) {
          console.log(error);
        }
      }
    }
  };
  const getIndex = (e) => {
    SetIndex(e.rowIndex);
  };

  const onClickSave = (e) => {
    let formatDate = (date) =>
      date ? new Date(date).toISOString().split("T")[0] : null;

    let CallUpDate = formatDate(state.KPI[index].CallUpDate);
    let BidCalledOn = formatDate(state.KPI[index].BidCalledOn);
    let BIDClosingON = formatDate(state.KPI[index].BIDClosingON);
    let SubmittedEvaluation = formatDate(state.KPI[index].SubmittedEvaluation);
    let TECReport = formatDate(state.KPI[index].TECReport);
    let NegotiationDoneOn = formatDate(state.KPI[index].NegotiationDoneOn);
    let FinalApprovalReceivedON = formatDate(
      state.KPI[index].FinalApprovalReceivedON
    );
    let PerformanceBondExpiryON = formatDate(
      state.KPI[index].PerformanceBondExpiryON
    );

    // let CallUpDate;
    // let BidCalledOn;
    // let BIDClosingON;
    // let SubmittedEvaluation;
    // let TECReport;
    // let NegotiationDoneOn;
    // let FinalApprovalReceivedON;
    // let PerformanceBondExpiryON;

    // if (state.KPI[index].CallUpDate == undefined) CallUpDate = null;
    // else CallUpDate = state.KPI[index].CallUpDate;
    // if (state.KPI[index].BidCalledOn == undefined) BidCalledOn = null;
    // else BidCalledOn = state.KPI[index].BidCalledOn;
    // if (state.KPI[index].BIDClosingON == undefined) BIDClosingON = null;
    // else BIDClosingON = state.KPI[index].BIDClosingON;
    // if (state.KPI[index].SubmittedEvaluation == undefined)
    //   SubmittedEvaluation = null;
    // else SubmittedEvaluation = state.KPI[index].SubmittedEvaluation;
    // if (state.KPI[index].TECReport == undefined) TECReport = null;
    // else TECReport = state.KPI[index].TECReport;
    // if (state.KPI[index].NegotiationDoneOn == undefined)
    //   NegotiationDoneOn = null;
    // else NegotiationDoneOn = state.KPI[index].NegotiationDoneOn;
    // if (state.KPI[index].FinalApprovalReceivedON == undefined)
    //   FinalApprovalReceivedON = null;
    // else FinalApprovalReceivedON = state.KPI[index].FinalApprovalReceivedON;
    // if (state.KPI[index].PerformanceBondExpiryON == undefined)
    //   PerformanceBondExpiryON = null;
    // else PerformanceBondExpiryON = state.KPI[index].PerformanceBondExpiryON;

    console.log(CallUpDate);
    console.log(SubmittedEvaluation);
    console.log(BIDClosingON);
    console.log(NegotiationDoneOn);
    console.log(FinalApprovalReceivedON);
    console.log(PerformanceBondExpiryON);

    axios
      .post("/api/KPI", {
        // KPI: JSON.stringify(state.KPI[index]),
        CallUpDate: CallUpDate,
        CurrentStatus: state.KPI[index].CurrentStatus,
        LocationFolder: state.KPI[index].LocationFolder,
        ArchivedBOXNo: state.KPI[index].ArchivedBOXNo,
        TypeOfbidding: state.KPI[index].TypeOfbidding,
        BidCalledOn: BidCalledOn,
        BIDClosingON: BIDClosingON,
        SubmittedEvaluation: SubmittedEvaluation,
        TECReport: TECReport,
        NegotiationDoneOn: NegotiationDoneOn,
        FinalApprovalReceivedON: FinalApprovalReceivedON,
        WarrantyIfAny: state.KPI[index].WarrantyIfAny,
        PerformanceBondExpiryON: PerformanceBondExpiryON,
        RemarksKPI: state.KPI[index].RemarksKPI,
        PRNumber: state.KPI[index].PRNumber,
      })
      .then((response) => {
        console.log(response.data);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Saved Successfully!",
        }).then(async (res) => {});
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: '<span style="color: red;">Error!</span>',
          text: "Failed to save KPI details",
          confirmButtonColor: "#d33",
          confirmButtonText: "OK",
        });
      });
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
          "KPI List " + date + ".xlsx"
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
      <Card title="KPI">
        <div>
          <DataGrid
            // allowColumnReordering={true}
            height={"750"}
            showBorders={true}
            dataSource={state.KPI}
            allowColumnResizing={true}
            allowColumnReordering={true}
            wordWrapEnabled={true}
            columnAutoWidth={true}
            hoverStateEnabled={true}
            onCellClick={getIndex}
            onSaved={onClickSave}
            onExporting={onExporting}
          >
            <Paging enabled={true} />
            <SearchPanel visible={true} />
            <Export enabled={true} />
            <Editing mode="row" allowUpdating={true} useIcons={true} />
            <Column type="buttons" buttons={["edit"]} />
            <Column
              dataField="PRNumber"
              caption="PR Number"
              editorOptions={{ readOnly: true }}
            />
            <Column
              dataField="CreatedDate"
              dataType="date"
              editorOptions={{ readOnly: true }}
            />
            <Column
              dataField="ProcurementOfficer"
              editorOptions={{ readOnly: true }}
            />
            <Column dataField="FileNo" editorOptions={{ readOnly: true }} />
            <Column dataField="CurrentStatus">
              <Lookup
                dataSource={state.Status}
                valueExpr="ID"
                displayExpr="Status"
              ></Lookup>
            </Column>
            <Column dataField="Quantity" editorOptions={{ readOnly: true }} />
            <Column
              dataField="UpdatedOn"
              dataType="date"
              editorOptions={{ readOnly: true }}
            />
            <Column
              dataField="CallUpDate"
              dataType="date"
              caption="Call Update"
            />
            <Column dataField="LocationFolder" caption="Location/Folder">
              <Lookup
                dataSource={folder.Choose}
                valueExpr="ID"
                displayExpr="Name"
              ></Lookup>
            </Column>
            <Column dataField="ArchivedBOXNo" caption="Archived BOX No" />
            <Column
              dataField="RequestorsDepartment"
              caption="Department"
              editorOptions={{ readOnly: true }}
            >
              <Lookup
                dataSource={departmentDetails}
                valueExpr="DepartmentCode"
                displayExpr="Discription"
              ></Lookup>
            </Column>
            <Column dataField="TypeOfbidding" caption="Type Of Bidding">
              <Lookup
                dataSource={bidding.Type}
                valueExpr="ID"
                displayExpr="Name"
              ></Lookup>
            </Column>
            <Column
              dataField="BidCalledOn"
              caption="CID Called On"
              dataType="date"
            />
            <Column
              dataField="BIDClosingON"
              caption="CID Closing On"
              dataType="date"
            />
            <Column
              dataField="SubmittedEvaluation"
              caption="Submitted for Evaluation On"
              dataType="date"
            />
            <Column
              dataField="TECReport"
              caption="TEC Report/Recommendation received On"
              dataType="date"
            />
            <Column dataField="NegotiationDoneOn" dataType="date" />
            <Column
              dataField="ApproveLevel"
              caption="Authority Level (final)"
              editorOptions={{ readOnly: true }}
            >
              <Lookup
                dataSource={authorityLevel.AuthorityLevel}
                valueExpr="ID"
                displayExpr="Name"
              ></Lookup>
            </Column>
            <Column
              dataField="FinalApprovalReceivedON"
              caption="Final Approval Received On"
              dataType="date"
            />
            <Column
              dataField="PONo"
              caption="PO No"
              editorOptions={{ readOnly: true }}
            />
            <Column
              dataField="PODate"
              caption="PO Date"
              dataType="date"
              editorOptions={{ readOnly: true }}
            />
            <Column
              dataField="GoodsReceivedOn"
              editorOptions={{ readOnly: true }}
            />
            <Column dataField="WarrantyIfAny" caption="Warranty If Any">
              <Lookup
                dataSource={warranty.Warranty}
                valueExpr="ID"
                displayExpr="Name"
              ></Lookup>
            </Column>
            <Column
              dataField="PerformanceBondExpiryON"
              caption="Performance Bond Expiry On"
              dataType="date"
            />
            <Column
              dataField="RemarksKPI"
              caption="Remarks"
              dataType="TextArea"
            />
          </DataGrid>
        </div>
      </Card>
    </div>
  );
};

export default KPI;
