import React from "react";
import { useState, useEffect } from "react";
import "devextreme/dist/css/dx.light.css";
import { Button, Navbar, Tabs } from "react-bootstrap";
import Swal from "sweetalert2";
import notify from "devextreme/ui/notify";
import DataGrid, {
  Column,
  Export,
  Selection,
  GroupPanel,
  Grouping,
  Paging,
  Editing,
  Item,
  Lookup,
} from "devextreme-react/data-grid";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver-es";
import { exportDataGrid } from "devextreme/excel_exporter";
import "devextreme/dist/css/dx.light.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { RadioGroup } from "devextreme-react/radio-group";

const PendingDocuments = () => {
  useEffect(() => {
    fetchGroupDetails();
  }, []);

  const [pr, SetPR] = useState([]);
  const [index, SetIndex] = useState(0);
  const [approvalLevel, SeAapprovalLevel] = useState([]);
  const [isView, setIsView] = useState(true);
  const history = useHistory();

  const statusOptions = [
    { ID: "0", Name: "Pending" },
    { ID: "1", Name: "Cancel" },
    { ID: "2", Name: "Approve" },
    { ID: "3", Name: "Reject" },
    { ID: "4", Name: "Hold" },
  ];

  const fetchGroupDetails = async () => {
    // debugger;
    const authData = JSON.parse(localStorage.getItem("user"));
    const checkAuthentication = await axios.get(
      "/api/CheckUserAuthentication",
      {
        params: { UsersID: authData.UserName, MenuID: 1103 },
      }
    );
    if (checkAuthentication.data.length != 0) {
      if (checkAuthentication.data[0].UserView) {
        setIsView(false);

        try {
          axios
            .all([
              axios.get("/api/getUserGroup", {
                params: { UserName: authData.UserName },
              }),
              axios.get("/api/getUserGroupAprrovalLevel", {
                params: { UserName: authData.UserName },
              }),
            ])
            .then(
              axios.spread(async (UserGroup, level) => {
                if (UserGroup.data.length != 0) {
                  const allPR = await axios.get(
                    "/api/getAllRequisitionItemList",
                    {
                      //getAllRequisitionItemList getAllPRDetails
                      params: {
                        EnterUser: authData.UserName,
                        UserGroup: UserGroup.data[0].UserGroup,
                      },
                    }
                  );
                  console.log("allPR", allPR);
                  const approvalLevel = await axios.get(
                    "/api/getUserGroupAprrovalLevel",
                    { params: { UserGroup: UserGroup.data[0].UserGroup } }
                  );
                  SeAapprovalLevel(approvalLevel.data);
                  SetPR(allPR.data);
                  // let dataArray = allPR.data;
                  // dataArray.forEach((obj) => {
                  //   obj.Approved = false;
                  //   obj.Rejected = false;
                  //   obj.Cancel = false;
                  //   obj.Pending = false;
                  //   obj.Hold = false;
                  // });

                  // dataArray.forEach((obj) => {
                  //   switch (parseInt(obj.ApproveStatus)) {
                  //     case 0:
                  //       obj.Pending = true;
                  //       break;
                  //     case 1:
                  //       obj.Cancel = true;
                  //       obj.ApproveLevel = null;
                  //       break;
                  //     case 2:
                  //       obj.Approved = true;
                  //       obj.ApproveLevel = null;
                  //       break;
                  //     case 3:
                  //       obj.Rejected = true;
                  //       obj.ApproveLevel = null;
                  //       break;
                  //     case 4:
                  //       obj.Hold = true;
                  //       break;
                  //     default:
                  //       break;
                  //   }
                  // });
                  // SetPR(dataArray);
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

  // const [selectedValue, setSelectedValue] = useState({
  //   GroupTable: {},
  // });

  const boldBorderStyle = {
    border: "2px solid #000",
  };

  const redHeaderStyle = {
    color: "red",
  };

  // const customHeaderCellRender = (props) => {
  //   return (
  //     <th
  //       style={props.column.caption === "Column Name" ? redHeaderStyle : null}
  //     >
  //       {props.column.caption}
  //     </th>
  //   );
  // };

  // const gridStyle = {
  //   backgroundColor: "lightblue",
  //   padding: "20px",
  //   marginBottom: "20px",
  // };

  // const cellPrepared = (e) => {
  //   if (e.rowType === "data") {
  //     // if (e.column.dataField === "Approved") {
  //     //   e.cellElement.style.cssText = "color: black; background-color: #F7E9BB";
  //     // } else if (e.column.dataField === "Rejected") {
  //     //   e.cellElement.style.cssText = "color: black; background-color: #F7E9BB";
  //     // } else if (e.column.dataField === "Review") {
  //     //   e.cellElement.style.cssText = "color: black; background-color: #F7E9BB";
  //     // } else if (e.column.dataField === "Pending") {
  //     //   e.cellElement.style.cssText = "color: black; background-color: #F7E9BB";
  //     // } else if (e.column.dataField === "Hold") {
  //     //   e.cellElement.style.cssText = "color: black; background-color: #F7E9BB";
  //     // }
  //     //  else if (e.column.dataField === "Remarks") {
  //     //   e.cellElement.style.cssText = "color: black; background-color: #F7E9BB";
  //     // } else if (e.column.dataField === "Date") {
  //     //   e.cellElement.style.cssText = "color: black; background-color: #F7E9BB";
  //     // } else if (e.column.dataField === "User") {
  //     //   e.cellElement.style.cssText = "color: black; background-color: #F7E9BB";
  //     // } else if (e.column.dataField === "Select") {
  //     //   e.cellElement.style.cssText = "color: black; background-color: #F7E9BB";
  //     // }
  //   }
  // };

  // const handleRadioChange = (value, key) => {
  //   setSelectedValue(value);
  //   console.log("Selected value:", value);
  //   console.log("Row key:", key);
  // };

  const updatePRTable = async (e) => {
    const dataToPass = e.data;
    history.push({
      pathname: "/forms/Purchase-Request/Purchase-Request",
      state: { data: dataToPass, isPD: true, rowIndex: e.data.rowIndex },
    });
    // window.open(`/forms/Purchase-Request/Purchase-Request`, "_self");
  };
  // const getEditorOptions = (rowData) => {
  //   console.log("rowData", rowData.data);
  //   return {
  //     readOnly: rowData.data.ApproveLevelReadOnly,
  //   };
  // };

  // const changeApprove = (e) => {
  //   console.log(e);
  //   console.log(index);
  //   if (e.value == true) {
  //     let arrayPurchas = [...pr];
  //     arrayPurchas[index].Pending = false;
  //     arrayPurchas[index].Cancel = false;
  //     arrayPurchas[index].Rejected = false;
  //     arrayPurchas[index].Hold = false;
  //     arrayPurchas[index].Approved = true;

  //     SetPR(arrayPurchas);
  //   }
  // };

  // const changePending = (e) => {
  //   if (e.value == true) {
  //     let arrayPurchas = [...pr];
  //     arrayPurchas[index].Pending = true;
  //     arrayPurchas[index].Cancel = false;
  //     arrayPurchas[index].Rejected = false;
  //     arrayPurchas[index].Hold = false;
  //     arrayPurchas[index].Approved = false;

  //     SetPR(arrayPurchas);
  //   }
  // };
  // const changeCansel = (e) => {
  //   if (e.value == true) {
  //     let arrayPurchas = [...pr];
  //     arrayPurchas[index].Pending = false;
  //     arrayPurchas[index].Cancel = true;
  //     arrayPurchas[index].Rejected = false;
  //     arrayPurchas[index].Hold = false;
  //     arrayPurchas[index].Approved = false;

  //     SetPR(arrayPurchas);
  //   }
  // };
  // const changeReject = (e) => {
  //   if (e.value == true) {
  //     let arrayPurchas = [...pr];
  //     arrayPurchas[index].Pending = false;
  //     arrayPurchas[index].Cancel = false;
  //     arrayPurchas[index].Rejected = true;
  //     arrayPurchas[index].Hold = false;
  //     arrayPurchas[index].Approved = false;

  //     SetPR(arrayPurchas);
  //   }
  // };
  // const changeHold = (e) => {
  //   if (e.value == true) {
  //     let arrayPurchas = [...pr];
  //     arrayPurchas[index].Pending = false;
  //     arrayPurchas[index].Cancel = false;
  //     arrayPurchas[index].Rejected = false;
  //     arrayPurchas[index].Hold = true;
  //     arrayPurchas[index].Approved = false;

  //     SetPR(arrayPurchas);
  //   }
  // };
  const getIndex = (e) => {
    console.log(e.rowIndex);
    SetIndex(e.rowIndex);
  };

  const OnNotification = (message, type) => {
    notify({
      message: message,
      type: type,
      displayTime: 3000,
      position: { at: "top right", offset: "50" },
    });
  };

  const onSaveValidation = async () => {
    console.log("index", pr[index]);
    const authData = JSON.parse(localStorage.getItem("user"));
    let ApprovalName = -1;
    if (pr[index].ApproveLevel != undefined) {
      const ApprovalNameCheck = await axios.get("/api/checkApprovalName", {
        params: {
          UserName: authData.UserName,
          ApprovalLevel: pr[index].ApproveLevel,
          PRType: pr[index].PRType,
        },
      });
      ApprovalName = ApprovalNameCheck.data.length;
    }

    if (pr[index].ApproveLevel == "" || pr[index].ApproveLevel == undefined) {
      OnNotification("Approval Level is Required", "error");
      return false;
    } else if (ApprovalName == 0) {
      OnNotification(
        "You Don't have permission to this Approval Level",
        "error"
      );
      return false;
    }
    return true;
    // else if (
    //   pr[index].PR_ID == "" ||
    //   pr[index].PR_ID == NaN ||
    //   pr[index].PR_ID == undefined
    // ) {
    //   OnNotification("Item Type is Required", "error");
    //   return false;
    // }
  };

  const onClickSave = (e) => {
    if (onSaveValidation()) {
      const authData = JSON.parse(localStorage.getItem("user"));
      axios
        .post("/api/updateApproval", {
          ApproveStatus: pr[index].ApproveStatus,
          ApproveLevel: pr[index].ApproveLevel,
          ApproveRemarks: pr[index].ApproveRemarks,
          PRHeaderID: pr[index].PRHeaderID,
          EnterUser: authData.UserName,
        })
        .then((response) => {
          console.log(response.data);
          const updateRequest = axios.post("/api/updateRequest", {
            ApproveStatus: pr[index].ApproveStatus,
            ApproveLevel: pr[index].ApproveLevel,
            ApproveRemarks: pr[index].ApproveRemarks,
            PRHeaderID: pr[index].PRHeaderID,
            PRType: pr[index].PRType,
            PRNumber: pr[index].PRNumber,
            EnterUser: authData.UserName,
          });
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Saved Successfully!",
          }).then(async (res) => {
            console.log("ApproveStatus", pr[index].ApproveStatus);
            const getfinalLevel = await axios.get("/api/getfinalLevel", {
              params: {
                ApprovalLevel: pr[index].ApproveLevel,
                TransactionType: pr[index].PRType,
              },
            });
            console.log("getfinalLevel", getfinalLevel.data[0].FinalLevel);
            if (getfinalLevel.data.length != 0) {
              if (
                getfinalLevel.data[0].FinalLevel &&
                pr[index].ApproveStatus == "2"
              ) {
                sapPost();
              } else {
                // window.location.reload();
              }
            }
          });
        })
        .catch((error) => {
          console.error("Error:", error);
          Swal.fire({
            icon: "error",
            title: '<span style="color: red;">Error!</span>',
            text: "Failed to save document details",
            confirmButtonColor: "#d33",
            confirmButtonText: "OK",
          });
        });
    }
  };

  const sapPost = async () => {
    let PRnumberSeries = pr[index].PRNumber;

    const PurchaseRequisitionHeader = await axios.get(
      "/api/getPurchaseRequisitionHeader",
      {
        params: { PRHeaderID: pr[index].PRHeaderID },
      }
    );

    const PurchaseRequisitionItems = await axios.get(
      "/api/getPurchaseRequisitionItems",
      {
        params: { PRHeaderID: pr[index].PRHeaderID },
      }
    );

    axios
      .post("/api/PurchesRequest-sync", {
        PurchaseRequisitionHeader: PurchaseRequisitionHeader.data[0],
        PurchaseRequisitionItems: PurchaseRequisitionItems.data,
        PR_Number: pr[index].PRNumber,
      })
      .then(async (res) => {
        if (!res.data.error) {
          const updateHeader = await axios.post("/api/updateIsSapPost", {
            params: {
              PRNumber: PRnumberSeries,
              IsSapPost: true,
            },
          });
          const updateStatus = await axios.post("/api/updateStatus", {
            params: {
              PRNumber: PRnumberSeries,
              Status: "2",
            },
          });
          window.location.reload();
        } else {
          const updateHeader = await axios.post("/api/updateIsSapPost", {
            params: {
              PRNumber: PRnumberSeries,
              IsSapPost: false,
            },
          });
          const updateStatus = await axios.post("/api/updateStatus", {
            params: {
              PRNumber: PRnumberSeries,
              Status: "0",
            },
          });
          Swal.fire({
            icon: "error",
            title: '<span style="color: red;">SAP Error!</span>',
            text: res.data.message.error.message.value,
            confirmButtonColor: "#d33",
            confirmButtonText: "OK",
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: '<span style="color: red;">Error!</span>',
          text: "Failed to save purchase request details",
          confirmButtonColor: "#d33",
          confirmButtonText: "OK",
        });
        console.log(error);
        console.error("Error:", error);
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
          "Pending Documents " + date + ".xlsx"
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

  // const customCheckboxStyles = {
  //   border: "2px solid #000000",
  //   backgroundColor: "#ffffff",
  //   color: "#ffffff",
  // };
  // const applyCustomStyles = (element) => {
  //   if (element) {
  //     const checkboxIcon = element.querySelector(".dx-checkbox-icon");
  //     const checkedIcon = element.querySelector(
  //       ".dx-checkbox-checked .dx-checkbox-icon"
  //     );
  //     if (checkboxIcon) {
  //       checkboxIcon.style.border = customCheckboxStyles.border;
  //     }
  //     if (checkedIcon) {
  //       checkedIcon.style.backgroundColor =
  //         customCheckboxStyles.backgroundColor;
  //       checkedIcon.style.borderColor = customCheckboxStyles.border;
  //     }
  //   }
  // };

  // const renderCheckBox = (data, rowIndex, field) => {
  //   return (
  //     <RadioGroup
  //       value={data[field] == true}
  //       onValueChanged={(e) => handleCheckBoxChange(rowIndex, field, e.value)}
  //     />
  //   );
  // };
  // const handleCheckBoxChange = (rowIndex, field, value) => {
  //   let permisionData = pr;
  //   permisionData[rowIndex][field] = value;
  //   SetPR({ permisionData });
  //   return permisionData;
  // };

  // const renderRadioGroup = ({ data, rowIndex }) => {
  //   const selectedValue = statusOptions.find(
  //     (option) => data[option.value] === true
  //   )?.value;

  //   const handleValueChange = (e) => {
  //     const newStatus = e.value;
  //     const updatedData = pr.map((item, index) =>
  //       index === rowIndex
  //         ? {
  //             ...item,
  //             Approved: newStatus === "Approved",
  //             Rejected: newStatus === "Rejected",
  //             Cancel: newStatus === "Cancel",
  //             Pending: newStatus === "Pending",
  //             Hold: newStatus === "Hold",
  //           }
  //         : item
  //     );
  //     SetPR(updatedData);
  //   };

  //   return (
  //     <RadioGroup
  //       items={statusOptions}
  //       value={selectedValue}
  //       layout="horizontal"
  //       onValueChanged={handleValueChange}
  //     />
  //   );
  // };

  return (
    <div>
      <DataGrid
        dataSource={pr}
        showBorders={true}
        allowColumnResizing={true}
        wordWrapEnabled={true}
        hoverStateEnabled={true}
        // onCellPrepared={cellPrepared}
        columnAutoWidth={true}
        onCellDblClick={updatePRTable}
        onCellClick={getIndex}
        onSaved={onClickSave}
        onExporting={onExporting}
        // onEditingStart={onEditButtonClick} allowUpdating={true} onClick={onEditButtonClick}
      >
        <Editing mode="col" useIcons={true} allowUpdating={true} />
        <Export enabled={true} />
        <Column type="buttons">
          <Button name="edit" />
        </Column>
        {/* <Column type="buttons" buttons={["edit"]} /> */}
        <Column
          dataField="PRNumber"
          caption="PR Number"
          editorOptions={{ readOnly: true }}
        />
        <Column dataField="ApproveLevel" caption="Current Approval Level">
          <Lookup
            dataSource={approvalLevel}
            valueExpr="ApprovalLevel"
            displayExpr="ApprovalLevel"
            // placeholder="Select an approval level"
          />
        </Column>
        <Column dataField="CreatedDate" dataType="date" caption="Create Date" />
        {/* <Column
          dataField="ValidFrom"
          editorType="dxDateBox"
          caption="Approve Date"
          format="dd/MM/yyyy"
          customizeText={(cellInfo) => {
            const date = new Date(cellInfo.value);
            const formattedDate = `${date.getDate()}/${
              date.getMonth() + 1
            }/${date.getFullYear()}`;
            return formattedDate;
          }}
        /> */}
        <Column
          dataField="PRType"
          caption="PR Type"
          editorOptions={{ readOnly: true }}
        />
        <Column dataField="RequestorName" editorOptions={{ readOnly: true }} />
        <Column
          dataField="ApproveUser"
          caption="Current Approved User"
          editorOptions={{ readOnly: true }}
        />
        <Column dataField="ApproveStatus" caption="Approve Status">
          <Lookup
            dataSource={statusOptions}
            valueExpr="ID"
            displayExpr="Name"
          />
        </Column>
        {/* <Column
          dataField="ValidTo"
          dataType="date"
          editorOptions={{ readOnly: true }}
        />
        <Column dataField="TotalAmount" editorOptions={{ readOnly: true }} /> */}
        {/* <Column
          dataField="ApproveUser"
          caption="Current Approved User"
          editorOptions={{ readOnly: true }}
        /> */}

        {/* <Column
          alignment="center"
          caption="Approve Status"
          cellRender={renderRadioGroup} 
        /> */}

        {/* <Column alignment="center" caption="Approve Status">
          <Column
            dataField="Approved"
            caption="Approved"
            cellRender={({ data, rowIndex }) =>
              renderCheckBox(data, rowIndex, "Approved")
            }
            // editorOptions={{
            //   onValueChanged: changeApprove,
            //   onContentReady: (e) => applyCustomStyles(e.element),
            // }}
          />
          <Column
            dataField="Rejected"
            caption="Rejected"
            cellRender={({ data, rowIndex }) =>
              renderCheckBox(data, rowIndex, "Rejected")
            }
            // editorOptions={{
            //   onContentReady: (e) => applyCustomStyles(e.element),
            //   onValueChanged: changeReject,
            // }}
          />
          <Column
            dataField="Cancel"
            caption="Cancel"
            cellRender={({ data, rowIndex }) =>
              renderCheckBox(data, rowIndex, "Cancel")
            }
            // editorOptions={{
            //   onContentReady: (e) => applyCustomStyles(e.element),
            //   onValueChanged: changeCansel,
            // }}
          />
          <Column
            dataField="Pending"
            caption="Pending"
            cellRender={({ data, rowIndex }) =>
              renderCheckBox(data, rowIndex, "Pending")
            }
            // editorOptions={{
            //   onContentReady: (e) => applyCustomStyles(e.element),
            //   onValueChanged: changePending,
            // }}
          />
          <Column
            dataField="Hold"
            caption="Hold"
            cellRender={({ data, rowIndex }) =>
              renderCheckBox(data, rowIndex, "Hold")
            }
            // editorOptions={{
            //   onContentReady: (e) => applyCustomStyles(e.element),
            //   onValueChanged: changeHold,
            // }}
          />
        </Column> */}
        <Column dataField="Remarks" />
      </DataGrid>
    </div>
  );
};

export default PendingDocuments;
