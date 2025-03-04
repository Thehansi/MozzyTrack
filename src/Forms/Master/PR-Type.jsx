import React, { useRef, useState, useEffect, useCallback } from "react";
import Card from "../../App/components/MainCard";
import { Button, Navbar } from "react-bootstrap";
import { ColorBox, LoadPanel } from "devextreme-react";
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

const CreatePRType = () => {
  const FormRef = useRef(null);
  const [rowIndex, setRowIndex] = useState(0);
  const [isAdd, setISAdd] = useState(true);
  const [isEdit, setISEdit] = useState(true);
  const [isView, setIsView] = useState(true);
  const [updateRow, setUpdateRow] = useState(true);

  const [userName, setUserName] = useState({});
  const [state, setState] = useState({
    // jForm: {
    //   PRTypeCode: "",
    //   Discription: "",
    //   Active: true,
    // },
    // viewPRTypeCode: 0,
    prtypes: [],
    // LoadPanelVisible: false,
    // ListViewing: false,
    // GroupTable: [],
    // jSetForm: {},
    // boolValue: false,
  });

  useEffect(() => {
    setDetails();
  }, []);
  const setDetails = async () => {
    const authData = JSON.parse(localStorage.getItem("user"));
    const checkAuthentication = await axios.get(
      "/api/CheckUserAuthentication",
      {
        params: { UsersID: authData.UserName, MenuID: 1011 },
      }
    );
    setUserName(authData.UserName);
    if (checkAuthentication.data.length != 0) {
      if (checkAuthentication.data[0].UserView) {
        setIsView(false);
        axios
          .get("/api/getallprtype")
          .then((response) => {
            console.log(response.data);
            setState((prevState) => ({
              ...prevState,
              prtypes: response.data,
            }));
          })
          .catch((error) => {
            console.error("Error:", error);
            Swal.fire({
              icon: "error",
              title: '<span style="color: red;">Error!</span>',
              text: "Failed to view PRType details",
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

  // const OnNotification = (message, type) => {
  //   notify({
  //     message: message,
  //     type: type,
  //     displayTime: 3000,
  //     position: { at: "top right", offset: "50" },
  //   });
  // };

  // const OnSaveValidation = async () => {
  //   if (!FormLayout.validate().isValid) {
  //     OnNotification("Fields marked with * are required", "error");
  //     return false;
  //   }
  //   return true;
  // };

  // const handleSave = async (e) => {
  //   if (await OnSaveValidation()) {
  //     const isUpdate = await axios.get("/api/checkPRCode", {
  //       params: { PRTypeCode: state.jForm.PRTypeCode },
  //     });

  //     if (updateRow) {
  //       if (isUpdate.data[0].prType_exists == 0) {
  //         axios
  //           .post("/api/addPRType", {
  //             prtype: JSON.stringify(state.jForm),
  //             PRTypeCode: JSON.stringify(state.jForm.PRTypeCode),
  //             UserID: userName,
  //           })
  //           .then((response) => {
  //             console.log(response.data);
  //             Swal.fire({
  //               icon: "success",
  //               title: "Success",
  //               text: "Data saved successfully!",
  //             }).then((res) => {
  //               const newPRType = state.jForm;
  //               if (!isView) {
  //                 if (state.boolValue) {
  //                   const oldPrtypes = state.prtypes;
  //                   oldPrtypes[rowIndex] = state.jForm;
  //                   setState((prevState) => ({
  //                     ...prevState,
  //                     prtypes: oldPrtypes,
  //                     jForm: { Active: true },
  //                     boolValue: false,
  //                   }));
  //                   window.location.reload();
  //                 } else {
  //                   setState((prevState) => ({
  //                     ...prevState,
  //                     prtypes: [...prevState.prtypes, newPRType],
  //                     jForm: {},
  //                     boolValue: false,
  //                   }));
  //                   window.location.reload();
  //                 }
  //               }
  //             });
  //           })
  //           .catch((error) => {
  //             console.error("Error:", error);
  //             Swal.fire({
  //               icon: "error",
  //               title: '<span style="color: red;">Error!</span>',
  //               text: "Failed to save PR Type details",
  //               confirmButtonColor: "#d33",
  //               confirmButtonText: "OK",
  //             });
  //           });
  //       } else {
  //         OnNotification("Already added PR Type Code", "error");
  //       }
  //     } else {
  //       axios
  //         .post("/api/addPRType", {
  //           prtype: JSON.stringify(state.jForm),
  //           PRTypeCode: JSON.stringify(state.jForm.PRTypeCode),
  //           UserID: userName,
  //         })
  //         .then((response) => {
  //           console.log(response.data);
  //           Swal.fire({
  //             icon: "success",
  //             title: "Success",
  //             text: "Data update successfully!",
  //           }).then((res) => {
  //             const newPRType = state.jForm;
  //             if (!isView) {
  //               if (state.boolValue) {
  //                 const oldPrtypes = state.prtypes;
  //                 oldPrtypes[rowIndex] = state.jForm;
  //                 setState((prevState) => ({
  //                   ...prevState,
  //                   prtypes: oldPrtypes,
  //                   jForm: { Active: true },
  //                   boolValue: false,
  //                 }));
  //                 window.location.reload();
  //               } else {
  //                 setState((prevState) => ({
  //                   ...prevState,
  //                   prtypes: [...prevState.prtypes, newPRType],
  //                   jForm: {},
  //                   boolValue: false,
  //                 }));
  //                 window.location.reload();
  //               }
  //             }
  //           });
  //         })
  //         .catch((error) => {
  //           console.error("Error:", error);
  //           Swal.fire({
  //             icon: "error",
  //             title: '<span style="color: red;">Error!</span>',
  //             text: "Failed to save PR Type details",
  //             confirmButtonColor: "#d33",
  //             confirmButtonText: "OK",
  //           });
  //         });
  //     }
  //   }
  // };

  // const handleClear = () => {
  //   setState({
  //     ...state,
  //     jForm: {},
  //     boolValue: false,
  //   });
  // };

  // const updateTable = (e) => {
  //   if (!isEdit) {
  //     setState({ jForm: e.data, prtypes: state.prtypes, boolValue: true });
  //     setUpdateRow(false);
  //     setRowIndex(e.data.rowIndex);
  //     // setState((prevState) => ({
  //     //   ...prevState,
  //     //   prtypes: state.prtypes,
  //     //   boolValue: true,
  //     // }));
  //     setTimeout(() => {
  //       focusTextBox();
  //     }, 100);
  //   }
  // };

  // const focusTextBox = useCallback(() => {
  //   if (FormRef.current) {
  //     const formInstance = FormRef.current.instance;
  //     const editor = formInstance.getEditor("Discription");
  //     if (editor) {
  //       editor.focus();
  //     }
  //   }
  // }, []);
  // const borderOption = {
  //   style: { border: "2px solid black", fontWeight: "bold" },
  // };

  return (
    <div>
      {/* <Card title="PR Type Create" style={{ backgroundColor: "Blue" }}>
        <Form ref={FormRef} formData={state.jForm}>
          <GroupItem colCount={2}>
            <Item
              dataField="PRTypeCode"
              editorOptions={{
                style: { border: "6px solid black" },
                maxLength: 20,
                readOnly: state.boolValue,
              }}
            >
              <RequiredRule />
              <Label text="PR Type Code"></Label>
            </Item>
            <Item
              dataField="Discription"
              editorOptions={{
                style: { border: "6px solid black" },
              }}
            >
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
      </Card> */}
      <Card title="PR Type List">
        <DataGrid
          dataSource={state.prtypes}
          showBorders={true}
          wordWrapEnabled={true}
          allowSearch={true}
          selection={{ mode: "single" }}
          hoverStateEnabled={true}
          // onCellDblClick={updateTable}
        >
          <SearchPanel visible={true} />

          <Paging defaultPageSize={20} />

          <Column dataField="PRTypeCode" caption="PR Type Code" />
          <Column dataField="Discription" caption="Description" />
          {/* <Column
            dataField="Active"
            editorType="dxCheckBox"
            caption="Active"
            dataType="bit"
          /> */}
        </DataGrid>
      </Card>
    </div>
  );
};

export default CreatePRType;
