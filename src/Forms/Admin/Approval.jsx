import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  Component,
} from "react";
import Aux from "../../hoc/_Aux";
import Form, { Item, Label, RequiredRule, Tab } from "devextreme-react/form";
import Card from "../../App/components/MainCard";
import { Button, Navbar, Tabs } from "react-bootstrap";
import Swal from "sweetalert2";
import DataGrid, {
  Column,
  SearchPanel,
  Editing,
  Paging,
  Popup,
  Lookup,
} from "devextreme-react/data-grid";
import axios from "axios";
import notify from "devextreme/ui/notify";
import List from "./ApprovalList";
import ListTemplate from "./ApprovalTemplateList";
import { LoadPanel } from "devextreme-react/load-panel";
import { connect } from "react-redux";
import { ConstantLine } from "devextreme-react/cjs/polar-chart";

const Aproval = () => {
  const FormRef = useRef(null);

  const [isUpdate, setIsUpdate] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const [isAdd, setISAdd] = useState(true);
  const [isEdit, setISEdit] = useState(true);
  const [isView, setIsView] = useState(true);
  const [userName, setUserName] = useState({});
  const [prType, setPrType] = useState([]);

  const [state, setState] = useState({
    ApprovalStageFields: {
      TransactionType: "PR", // Set default value to "PR"
      ApprovalLevel: "",
      ApprovalLevelName: "",
      Priority: "",
      FinalLevel: false,
      Active: true,
    },
    viewTransactionType: 0,
    approvals: [],
    LevelID: 0,
    LoadPanelVisible: true,
    ListViewing: false,
    ApproveTable: [],
    ApprovalSetStageFields: {},
    boolValue: false,
    fvdfv: false,
    // transaction: [
    //   { ID: 0, Name: "PR" },
    //   // { ID: 1, Name: "Other" },
    // ],
  });

  const FormLayout = FormRef.current && FormRef.current.instance;

  useEffect(() => {
    handleViewList();
  }, []);

  const OnNotification = (message, type) => {
    notify({
      message: message,
      type: type,
      displayTime: 3000,
      position: { at: "top right", offset: "50" },
    });
  };

  const OnSaveValidation = async () => {
    let isHasFinalLevel = false;

    const checkfinalLevel = await axios.get("/api/checkfinalLevel", {
      params: {
        TransactionType: state.ApprovalStageFields.TransactionType,
      },
    });

    // const checkUpdatefinalLevel = await axios.get(
    //   "/api/checkUpdatefinalLevel",
    //   {
    //     params: {
    //       TransactionType: state.ApprovalStageFields.TransactionType,
    //       ApprovalLevel: state.ApprovalStageFields.ApprovalLevel,
    //     },
    //   }
    // );

    if (checkfinalLevel.data[0].priority_exists_Check != 0)
      isHasFinalLevel = true;

    if (!FormLayout.validate().isValid) {
      OnNotification("Fields marked with * are required", "error");
      return false;
    } else if (state.ApprovalStageFields.ApprovalLevel <= 0) {
      OnNotification("Approval Level is greater than 0", "error");
      return false;
    } else if (!Number.isInteger(state.ApprovalStageFields.ApprovalLevel)) {
      OnNotification("Approval Level must be Numeric", "error");
      return false;
    } else if (state.ApprovalStageFields.Priority <= 0) {
      OnNotification("Priority is greater than 0", "error");
      return false;
    } else if (!Number.isInteger(state.ApprovalStageFields.Priority)) {
      OnNotification("Priority must be Numeric", "error");
      return false;
    } else if (
      isHasFinalLevel &&
      state.ApprovalStageFields.FinalLevel &&
      !isUpdate
    ) {
      OnNotification("The PR type has a final level.", "error");
      return false;
    }
    return true;
  };

  const handleSave = async (e) => {
    if (await OnSaveValidation()) {
      // console.log("TransactionType", state.ApprovalStageFields);
      axios
        .all([
          axios.get("/api/getPriorityandApproveLevelcheck", {
            params: {
              Priority: state.ApprovalStageFields.Priority,
              ApprovalLevel: state.ApprovalStageFields.ApprovalLevel,
              TransactionType: state.ApprovalStageFields.TransactionType,
            },
          }),
          axios.get("/api/checkPriorty", {
            params: {
              Priority: state.ApprovalStageFields.Priority,
              TransactionType: state.ApprovalStageFields.TransactionType,
            },
          }),
          axios.get("/api/checkUpdatefinalLevel", {
            params: {
              TransactionType: state.ApprovalStageFields.TransactionType,
              ApprovalLevel: state.ApprovalStageFields.ApprovalLevel,
            },
          }),
        ])
        .then(
          axios.spread(
            (PriorityandApproveLevel, checkPriorty, checkFinalLevel) => {
              // console.log(
              //   "priority checked",
              //   PriorityandApproveLevel.data[0].priority_exists
              // );
              // console.log(
              //   "priority checked 2",
              //   checkPriorty.data[0].priority_exists_Check
              // );
              console.log("uPdate", isUpdate);
              console.log(
                "priority_exists",
                PriorityandApproveLevel.data[0].priority_exists
              );
              console.log(
                "priority_exists_Check",
                checkPriorty.data[0].priority_exists_Check
              );
              if (!isUpdate) {
                if (
                  PriorityandApproveLevel.data[0].priority_exists == 0 &&
                  checkPriorty.data[0].priority_exists_Check == 0
                ) {
                  axios
                    .post("/api/addApprovalLevel", {
                      approve: JSON.stringify(state.ApprovalStageFields),
                      UserID: userName,
                    })
                    .then((response) => {
                      console.log(response.data);
                      Swal.fire({
                        title: "Success",
                        text: "Approval Level details saved successfully!",
                      }).then(async (res) => {
                        const approvalLevel = await axios.get(
                          "/api/getallApprovedLevel"
                        );
                        // console.log("getUsers", approvalLevel);
                        setState((prevState) => ({
                          ...prevState,
                          approvals: approvalLevel.data,
                        }));
                        handleClear();
                        window.location.reload();
                      });
                    })
                    .catch((error) => {
                      console.error("Error:", error);
                      // Handle error
                      Swal.fire({
                        icon: "error",
                        title: '<span style="color: red;">Error!</span>',
                        text: "Failed to save approve level details",
                        confirmButtonColor: "#d33",
                        confirmButtonText: "OK",
                      });
                    });
                } else if (
                  PriorityandApproveLevel.data[0].priority_exists == 0 &&
                  checkPriorty.data[0].priority_exists_Check == 1
                ) {
                  OnNotification("Already added priority ", "error");
                } else if (
                  PriorityandApproveLevel.data[0].priority_exists == 1 &&
                  checkPriorty.data[0].priority_exists_Check == 1
                ) {
                  OnNotification("Already added", "error");
                } else {
                  OnNotification("Already added", "error");
                }
              } else {
                console.log("uPdate");
                console.log(checkFinalLevel.data[0].priority_exists_Check);
                if (checkFinalLevel.data[0].priority_exists_Check == 1) {
                  axios
                    .post("/api/addApprovalLevel", {
                      approve: JSON.stringify(state.ApprovalStageFields),
                      UserID: userName,
                    })
                    .then((response) => {
                      console.log(response.data);
                      Swal.fire({
                        title: "Success",
                        text: "Approval Level details update successfully!",
                      }).then(async (res) => {
                        const approvalLevel = await axios.get(
                          "/api/getallApprovedLevel"
                        );
                        console.log("getUsers", approvalLevel);
                        setState((prevState) => ({
                          ...prevState,
                          approvals: response.data,
                          LoadPanelVisible: false,
                        }));
                        handleClear();
                        window.location.reload();
                      });
                    })
                    .catch((error) => {
                      console.error("Error:", error);
                      // Handle error
                      Swal.fire({
                        icon: "error",
                        title: '<span style="color: red;">Error!</span>',
                        text: "Failed to save approve level details",
                        confirmButtonColor: "#d33",
                        confirmButtonText: "OK",
                      });
                    });
                } else {
                  OnNotification("Already added Final Level", "error");
                }
              }
            }
          )
        )
        .catch((error) => {
          console.error("Error:", error);
          // Handle error
          Swal.fire({
            icon: "error",
            title: '<span style="color: red;">Error!</span>',
            text: "Failed to save approve level details",
            confirmButtonColor: "#d33",
            confirmButtonText: "OK",
          });
        });
    }
  };

  const handleViewList = async () => {
    const authData = JSON.parse(localStorage.getItem("user"));
    const checkAuthentication = await axios.get(
      "/api/CheckUserAuthentication",
      {
        params: { UsersID: authData.UserName, MenuID: 9004 },
      }
    );
    setUserName(authData.UserName);
    if (checkAuthentication.data.length != 0) {
      if (checkAuthentication.data[0].UserView) {
        setIsView(false);
        // Clear the form
        const PR_Type = await axios.get("/api/getallPR_Type");
        setPrType(PR_Type.data);
        axios
          .get("/api/getallApprovedLevel")
          .then((response) => {
            console.log(response.data);
            setState((prevState) => ({
              ...prevState,
              approvals: response.data,
              LoadPanelVisible: false,
            }));
          })
          .catch((error) => {
            console.error("Error:", error);
            // Handle error
            Swal.fire({
              icon: "error",
              title: '<span style="color: red;">Error!</span>',
              text: "Failed to save approve level details",
              confirmButtonColor: "#d33",
              confirmButtonText: "OK",
            });
            setState((prevState) => ({
              ...prevState,
              LoadPanelVisible: false,
            }));
          });
      }
      if (checkAuthentication.data[0].UserAdd) {
        setISAdd(false);
      }
      if (checkAuthentication.data[0].UserEdit) {
        setISEdit(false);
      }
    }
  };

  // const handleSelectionChanged = (selectedItems) => {
  //   // Update the form fields with the selected row's data
  //   setState((prevState) => ({
  //     ...prevState,
  //     ApprovalStageFields: { ...selectedItems[0] },
  //   }));
  // };

  const handleClear = () => {
    setIsEditable(false);
    setState({
      ...state,
      ApprovalStageFields: { TransactionType: "PR", Active: true },
    });
  };

  const updateTable = (e) => {
    console.log(e.data.Index);
    if (!isEdit) {
      setIsUpdate(true);
      setIsEditable(true);
      setState({
        ApprovalStageFields: e.data,
        approvals: state.approvals,
        boolValue: true,
      });
      // setState((prevState) => ({
      //   ...prevState,
      //   approvals: state.approvals,
      //   boolValue: true,
      // }));
      setTimeout(() => {
        focusTextBox();
      }, 100);
    }
  };

  const focusTextBox = useCallback(() => {
    if (FormRef.current) {
      const formInstance = FormRef.current.instance;
      const editor = formInstance.getEditor("ApprovalLevel");
      if (editor) {
        editor.focus();
      }
    }
  }, []);

  return (
    <Aux>
      <Card title="Approval Process">
        <Form ref={FormRef} colCount={2} formData={state.ApprovalStageFields}>
          <Item
            dataField="TransactionType"
            editorType="dxSelectBox"
            editorOptions={{
              items: prType,
              valueExpr: "PRTypeCode",
              displayExpr: "Discription",
              maxLength: 50,
              readOnly: isEditable,
            }}
          >
            <RequiredRule message="Field required" />
            <Label text="PR Type"></Label>
          </Item>
          <Item
            dataField="ApprovalLevel"
            caption="Approval Level"
            editorType="dxNumberBox"
            editorOptions={{
              maxLength: 50,
              readOnly: isEditable,
            }}
          >
            <RequiredRule message="Field required" />
          </Item>
          <Item
            dataField="ApprovalLevelName"
            caption="Approval Level Name"
            editorOptions={{
              maxLength: 50,
            }}
          >
            <RequiredRule message="Field required" />
          </Item>

          <Item
            dataField="Priority"
            caption="Priority"
            editorType="dxNumberBox"
            editorOptions={{
              maxLength: 50,
              readOnly: isEditable,
            }}
          >
            <RequiredRule message="Field required" />
          </Item>
          <Item
            dataField="FinalLevel"
            caption="Final Level"
            editorType="dxCheckBox"
          ></Item>
          <Item
            dataField="Active"
            caption="Active"
            editorType="dxCheckBox"
          ></Item>
        </Form>
        <br></br>

        <Navbar bg="light" variant="light">
          <Button
            variant="secondary"
            icon="feather icon-layers"
            onClick={handleSave}
            disabled={isAdd}
          >
            Save
          </Button>
          <Button
            variant="secondary"
            icon="feather icon-layers"
            onClick={handleClear}
            disabled={isAdd}
          >
            Clear
          </Button>
        </Navbar>
      </Card>
      <Card title="Approval Level List">
        <div>
          <DataGrid
            dataSource={state.approvals}
            showBorders={true}
            wordWrapEnabled={true}
            allowSearch={true}
            selection={{ mode: "single" }}
            hoverStateEnabled={true}
            onCellDblClick={updateTable}
          >
            <SearchPanel visible={true} />
            {/* <GroupPanel visible={true} /> */}
            <Paging defaultPageSize={20} />

            <Column dataField="TransactionType" caption="PR Type">
              <Lookup
                items={prType}
                valueExpr="PRTypeCode"
                displayExpr="Discription"
              />
            </Column>
            <Column dataField="ApprovalLevel" caption="Approval Level" />
            <Column
              dataField="ApprovalLevelName"
              caption="Approval Level Name"
            />
            <Column dataField="Priority" caption="Priority" />
            <Column
              dataField="FinalLevel"
              caption="Final Level"
              dataType="bit"
            />
            <Column dataField="Active" caption="Active" dataType="bit" />
          </DataGrid>
          <br></br>
        </div>
      </Card>

      {/* <LoadPanel
        message="Processing.... Please, wait..."
        shadingColor="rgba(0,0,0,0.4)"
        showIndicator={true}
        shading={true}
        showPane={true}
        closeOnOutsideClick={false}
        width={500}
      /> */}
    </Aux>
  );
};

export default Aproval;
