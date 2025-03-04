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
import { BackgroundColor } from "devextreme-react/cjs/chart";

const Department = () => {
  const FormRef = useRef(null);
  const [rowIndex, setRowIndex] = useState(0);
  const [isAdd, setISAdd] = useState(true);
  const [isEdit, setISEdit] = useState(true);
  const [userName, setUserName] = useState({});
  const [updateRow, setUpdateRow] = useState(true);

  useEffect(() => {
    setdetails();
  }, []);

  const setdetails = async () => {
    const authData = JSON.parse(localStorage.getItem("user"));
    const checkAuthentication = await axios.get(
      "/api/CheckUserAuthentication",
      {
        params: { UsersID: authData.UserName, MenuID: 1010 },
      }
    );
    if (checkAuthentication.data.length != 0) {
      console.log("checkAuthentication", checkAuthentication);
      setUserName(authData.UserName);
      if (checkAuthentication.data[0].UserView) {
        const departmentDetails = await axios.get("/api/getalldepartment");
        setState((prevState) => ({
          ...prevState,
          departments: departmentDetails.data,
        }));
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
      DepartmentCode: "",
      Discription: "",
      Active: true,
    },
    viewDepartmentCode: 0,
    departments: [],
    LoadPanelVisible: false,
    ListViewing: false,
    GroupTable: [],
    jSetForm: {},
    boolValue: false,
  });

  const FormLayout = FormRef.current && FormRef.current.instance;

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setState((prevState) => ({
  //     ...prevState,
  //     jForm: {
  //       ...prevState.jForm,
  //       [name]: value,
  //     },
  //   }));
  // };

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
      const isUpdate = await axios.get("/api/checkDepartmentCode", {
        params: { DepartmentCode: state.jForm.DepartmentCode },
      });
      if (updateRow) {
        if (isUpdate.data[0].department_exists == 0) {
          axios
            .post("/api/addDepartment", {
              department: JSON.stringify(state.jForm),
              UserID: userName,
            })
            .then((response) => {
              console.log(response.data);
              Swal.fire({
                icon: "success",
                title: "Success",
                text: "Data saved successfully!",
              }).then((res) => {
                const newDepartment = state.jForm;

                if (state.boolValue) {
                  const oldDepartments = state.departments;
                  oldDepartments[rowIndex] = state.jForm;
                  setState((prevState) => ({
                    ...prevState,
                    departments: oldDepartments,
                    jForm: { Active: true },
                    boolValue: false,
                  }));
                  window.location.reload();
                } else {
                  setState((prevState) => ({
                    ...prevState,
                    departments: [...prevState.departments, newDepartment],
                    jForm: { Active: true },
                    boolValue: false,
                  }));
                  window.location.reload();
                }
              });
            })
            .catch((error) => {
              console.error("Error:", error);
              let Title = "Error";
              // Handle error
              Swal.fire({
                icon: "error",
                title: '<span style="color: red;">Error!</span>',
                text: "Failed to save user department details",
                confirmButtonColor: "#d33",
                confirmButtonText: "OK",
              });
            });
        } else {
          OnNotification("Already added Department Code", "error");
        }
      } else {
        axios
          .post("/api/addDepartment", {
            department: JSON.stringify(state.jForm),
            UserID: userName,
          })
          .then((response) => {
            console.log(response.data);
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Data update successfully!",
            }).then((res) => {
              const newDepartment = state.jForm;

              if (state.boolValue) {
                const oldDepartments = state.departments;
                oldDepartments[rowIndex] = state.jForm;
                setState((prevState) => ({
                  ...prevState,
                  departments: oldDepartments,
                  jForm: { Active: true },
                  boolValue: false,
                }));
                window.location.reload();
              } else {
                setState((prevState) => ({
                  ...prevState,
                  departments: [...prevState.departments, newDepartment],
                  jForm: { Active: true },
                  boolValue: false,
                }));
                window.location.reload();
              }
            });
          })
          .catch((error) => {
            console.error("Error:", error);
            let Title = "Error";
            // Handle error
            Swal.fire({
              icon: "error",
              title: '<span style="color: red;">Error!</span>',
              text: "Failed to save user department details",
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
      jForm: { Active: true },
      boolValue: false,
    });
  };

  const textColor = {
    background: "rgb(185, 210, 214)",
  };

  const updateTable = (e) => {
    if (!isEdit) {
      setState({
        jForm: e.data,
        departments: state.departments,
        boolValue: true,
      });
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
      <Card title="User Department">
        <Form ref={FormRef} formData={state.jForm}>
          <GroupItem colCount={2}>
            <Item
              dataField="DepartmentCode"
              style={textColor}
              editorOptions={{
                readOnly: state.boolValue,
                maxLength: 20,
                // style: BackgroundColor.apply("red"),
              }}
            >
              <RequiredRule message="Field required" />
              <Label text="Department Code"></Label>
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
        <br />
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
      <Card title="User Department List">
        <DataGrid
          dataSource={state.departments}
          showBorders={true}
          wordWrapEnabled={true}
          allowSearch={true}
          selection={{ mode: "single" }}
          hoverStateEnabled={true}
          onCellDblClick={updateTable}
        >
          <SearchPanel visible={true} />

          <Paging defaultPageSize={20} />

          <Column dataField="DepartmentCode" caption="Department Code" />
          <Column dataField="Discription" caption="Description" />
          <Column
            dataField="Active"
            editorType="dxCheckBox"
            caption="Active"
            dataType="bit"
          />
        </DataGrid>
      </Card>
    </div>
  );
};

export default Department;
