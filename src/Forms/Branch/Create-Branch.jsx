///new///
import React, { useRef, useState, useEffect, useCallback } from "react";
import Card from "../../App/components/MainCard";
import { Button, Navbar } from "react-bootstrap";
import { CheckBox, LoadPanel } from "devextreme-react";
import DataGrid, {
  Column,
  SearchPanel,
  GroupPanel,
  Paging,
  Editing,
  Label,
} from "devextreme-react/data-grid";
import { FileUploader } from "devextreme-react";
import axios from "axios";
import Swal from "sweetalert2";
import notify from "devextreme/ui/notify";
import Form, { Item, GroupItem, RequiredRule } from "devextreme-react/form";
import { json } from "body-parser";
// import DataGrid, {
//   Column,
// } from "devextreme-react/data-grid";

const Branch = () => {
  const FormRef = useRef(null);
  const [isAdd, setISAdd] = useState(true);
  const [isView, setIsView] = useState(true);
  const [isEdit, setISEdit] = useState(true);
  const [rowIndex, setRowIndex] = useState(0);
  const [updateRow, setUpdateRow] = useState(true);

  const [userName, setUserName] = useState({});

  useEffect(() => {
    setDetails();
  }, []);

  const setDetails = async () => {
    const authData = JSON.parse(localStorage.getItem("user"));
    const checkAuthentication = await axios.get(
      "/api/CheckUserAuthentication",
      {
        params: { UsersID: authData.UserName, MenuID: 1007 },
      }
    );
    setUserName(authData.UserName);
    if (checkAuthentication.data.length != 0) {
      if (checkAuthentication.data[0].UserView) {
        setIsView(false);
        axios
          .get("/api/getallbranch")
          .then((response) => {
            console.log(response.data);
            setState((prevState) => ({
              ...prevState,
              branches: response.data,
            }));
          })
          .catch((error) => {
            console.error("Error:", error);
            Swal.fire({
              icon: "error",
              title: '<span style="color: red;">Error!</span>',
              text: "Failed to view user branch details",
              confirmButtonColor: "#d33",
              confirmButtonText: "OK",
            });
          });
      }
      if (checkAuthentication.data[0].UserAdd) {
        setISAdd(false);
      }
      if (checkAuthentication.data[0].UserEdit) {
        console.log("AWA");
        setISEdit(false);
      }
    }
  };

  const [state, setState] = useState({
    jForm: {
      BranchCode: "",
      Discription: "",
      Active: true,
    },
    viewBranchCode: 0,
    branches: [], // To store fetched branches
    LoadPanelVisible: false,
    ListViewing: false,
    GroupTable: [],
    jSetForm: {},
    boolValue: false,
    fvdfv: false,
  });

  const FormLayout = FormRef.current && FormRef.current.instance;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      jForm: {
        ...prevState.jForm,
        [name]: value,
      },
    }));
  };

  const OnNotification = (message, type) => {
    notify({
      message: message,
      type: type,
      displayTime: 3000,
      position: { at: "top right", offset: "50" },
    });
  };

  const OnSaveValidation = async () => {
    console.log("validation  2", !FormLayout.validate().isValid);
    if (!FormLayout.validate().isValid) {
      OnNotification("Fields marked with * are required", "error");
      return false;
    }
    return true;
  };

  const handleSave = async (e) => {
    if (await OnSaveValidation()) {
      const isUpdate = await axios.get("/api/checkBranchCode", {
        params: { BranchCode: state.jForm.BranchCode },
      });
      if (updateRow) {
        if (isUpdate.data[0].branch_exists == 0) {
          axios
            .post("/api/addBranch", {
              branch: JSON.stringify(state.jForm),
              UserID: userName,
            })
            .then((response) => {
              Swal.fire({
                icon: "success",
                title: "Success",
                text: "Data saved successfully!",
              }).then((res) => {
                const newBranch = state.jForm;
                if (!isView) {
                  if (state.boolValue) {
                    const oldBranch = state.branches;
                    oldBranch[rowIndex] = state.jForm;
                    setState((prevState) => ({
                      ...prevState,
                      groups: oldBranch,
                      jForm: { Active: true },
                      boolValue: false,
                    }));
                    window.location.reload();
                  } else {
                    setState((prevState) => ({
                      ...prevState,
                      branches: [...prevState.branches, newBranch],
                      jForm: { Active: true },
                      boolValue: false,
                    }));
                    window.location.reload();
                  }
                }
              });
            })
            .catch((error) => {
              console.error("Error:", error);
              Swal.fire({
                icon: "error",
                title: '<span style="color: red;">Error!</span>',
                text: "Failed to save user branch details",
                confirmButtonColor: "#d33",
                confirmButtonText: "OK",
              });
            });
        } else {
          OnNotification("Already added Branch Code", "error");
        }
      } else {
        axios
          .post("/api/addBranch", {
            branch: JSON.stringify(state.jForm),
            UserID: userName,
          })
          .then((response) => {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Data update successfully!",
            }).then((res) => {
              const newBranch = state.jForm;
              if (!isView) {
                if (state.boolValue) {
                  const oldBranch = state.branches;
                  oldBranch[rowIndex] = state.jForm;
                  setState((prevState) => ({
                    ...prevState,
                    groups: oldBranch,
                    jForm: { Active: true },
                    boolValue: false,
                  }));
                  window.location.reload();
                } else {
                  setState((prevState) => ({
                    ...prevState,
                    branches: [...prevState.branches, newBranch],
                    jForm: { Active: true },
                    boolValue: false,
                  }));
                  window.location.reload();
                }
              }
            });
          })
          .catch((error) => {
            console.error("Error:", error);
            Swal.fire({
              icon: "error",
              title: '<span style="color: red;">Error!</span>',
              text: "Failed to save user branch details",
              confirmButtonColor: "#d33",
              confirmButtonText: "OK",
            });
          });
      }
    }
  };

  const handleClear = () => {
    setState({
      ...state,
      jForm: {Active: true},
      boolValue: false,
    });
  };

  const updateTable = (e) => {
    if (!isEdit) {
      setState({ jForm: e.data, branches: state.branches, boolValue: true });
      setUpdateRow(false);
      setRowIndex(e.data.rowIndex);
      setTimeout(() => {
        focusTextBox();
      }, 100);
    }
  };

  const focusTextBox = useCallback(() => {
    if (FormRef.current) {
      const formInstance = FormRef.current.instance;
      const editor = formInstance.getEditor("Discription");
      if (editor) {
        editor.focus();
      }
    }
  }, []);

  return (
    <div>
      <Card title="User Branch">
        <Form
          //onContentReady={validateForm}
          ref={FormRef}
          formData={state.jForm}
        >
          <GroupItem colCount={2}>
            <Item
              dataField="BranchCode"
              editorOptions={{
                maxLength: 20,
                readOnly: state.boolValue,
              }}
            >
              <RequiredRule message="Field required" />
              <Label text="Branch Code"></Label>
            </Item>
            <Item dataField="Discription" editorOptions={{}}>
              <RequiredRule message="Field required" />
              <Label text="Description"></Label>
            </Item>
            <Item
              dataField="Active"
              editorType="dxCheckBox"
              editorOptions={{}}
            ></Item>
          </GroupItem>
        </Form>
        <br />

        <Navbar variant="light">
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
      <br />
      <Card title="User Branch List">
        <div>

          <DataGrid
            dataSource={state.branches}
            showBorders={true}
            wordWrapEnabled={true}
            allowSearch={true}
            selection={{ mode: "single" }}
            hoverStateEnabled={true}
            onCellDblClick={updateTable}
          >
            <SearchPanel visible={true} />
            <Paging defaultPageSize={20} />

            <Column dataField="BranchCode" caption="Branch Code" />
            <Column dataField="Discription" caption="Description" />
            <Column dataField="Active" caption="Active" dataType="bit" />
          </DataGrid>
        </div>
      </Card>
    </div>
  );
};

export default Branch;


