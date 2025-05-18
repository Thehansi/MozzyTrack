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
  Lookup,
} from "devextreme-react/data-grid";
import { FileUploader } from "devextreme-react";
import axios from "axios";
import Swal from "sweetalert2";
import notify from "devextreme/ui/notify";
import Form, {
  Item,
  GroupItem,
  RequiredRule,
  StringLengthRule,
  CompareRule,
  Input,
  Icon,
} from "devextreme-react/form";
import { NumberBox } from "devextreme-react/number-box";

import { SelectBox, DateBox } from "devextreme-react";
import { Label } from "devextreme-react/form";
import { Break } from "devextreme-react/cjs/range-selector";
import Province from "../CommanData/Province";
import Districts from "../CommanData/District";
import DivisionalSecretariats from "../CommanData/DivisionalSecretariats";
import UserGroupData from "../CommanData/UserGroup";

const User = () => {
  const [user, setUser] = useState([]);
  const FormRef = useRef(null);

  const [groups, setGroups] = useState([
    { ID: "1", Name: "Admin" },
    { ID: "2", Name: "PHI" },
    { ID: "3", Name: "NDCU" },
    { ID: "4", Name: "Household" },
  ]);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedDivSect, setSelectedDivSect] = useState(null);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredDivSectors, setFilteredDivSectors] = useState([]);

  const [isAdd, setISAdd] = useState(true);
  const [isEdit, setISEdit] = useState(true);
  const [isView, setIsView] = useState(true);
  const [number, setNumber] = useState(0);
  const [UserName, setUserName] = useState(true);
  const [isUpdate, setIsUpdate] = useState(true);
  const [state, setState] = useState({
    jForm: {
      UserName: "",
      UserGroup: "",
      Password: "",
      ConfirmPassword: "",
      Province: "",
      District: "",
      Email: "",
      ContactNo: "",
      Active: true,
      DiviSector: "",
    },
    viewUser: 0,
    users: [],
    LoadPanelVisible: false,
    ListViewing: false,
    GroupTable: [],
    jSetForm: {},
    boolValue: false,
  });

  useEffect(() => {
    fetchGroupDetails();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      const districts = Districts[selectedProvince] || [];
      setFilteredDistricts(districts);
      setSelectedDistrict(null);
      setFilteredDivSectors([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      const divSectors = DivisionalSecretariats[selectedDistrict] || [];
      setFilteredDivSectors(divSectors);
      setSelectedDivSect(null);
    }
  }, [selectedDistrict]);

  const fetchGroupDetails = async () => {
    const authData = JSON.parse(localStorage.getItem("user"));
    const checkAuthentication = await axios.get(
      "/api/CheckUserAuthentication",
      {
        params: {
          UserGroup: authData.UserGroup,
          MenuID: 9001,
        },
      }
    );
    setUserName(authData.UserName);
    if (checkAuthentication.data[0].IsEdit == 1) {
      //
      if (true) {
        //checkAuthentication.data[0].UserView
        setISAdd(false);
        try {
          const getUsers = await axios.get("/api/getalluser");

          setState((prevState) => ({
            ...prevState,
            users: getUsers.data,
            jForm: { Active: true },
          }));
        } catch (error) {
          console.error("Error fetching details:", error);
        }
      }
      // if (checkAuthentication.data[0].UserAdd) {
      //   setISAdd(false);
      // }
      // if (checkAuthentication.data[0].UserEdit) {
      //   setISEdit(false);
      // }
    }
  };

  const FormLayout = FormRef.current && FormRef.current.instance;

  const OnNotification = (message, type) => {
    notify({
      message: message,
      type: type,
      displayTime: 3000,
      position: { at: "top right", offset: "50" },
    });
  };

  const OnSaveValidation = async () => {
    // const { jForm } = state;
    const matchPassword =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const existingUsernames = user.map((user) => user.UserName.toLowerCase());

    const { jForm } = state;

    // if (!FormLayout.validate().isValid) {
    //   OnNotification("Fields marked with * are required", "error");
    //   return false;
    // }
    //  else
    if (
      jForm.UserName == "" ||
      jForm.UserName == NaN ||
      jForm.UserName == undefined
    ) {
      OnNotification("UserName is Required", "error");
      return false;
    } else if (
      jForm.UserGroup == "" ||
      jForm.UserGroup == NaN ||
      jForm.UserGroup == undefined
    ) {
      OnNotification("UserGroup is Required", "error");
      return false;
    } else if (
      jForm.Password == "" ||
      jForm.Password == NaN ||
      jForm.Password == undefined
    ) {
      OnNotification("Password is Required", "error");
      return false;
    } else if (
      jForm.Province == "" ||
      jForm.Province == NaN ||
      jForm.Province == undefined
    ) {
      OnNotification("Province is Required", "error");
      return false;
    } else if (
      jForm.District == "" ||
      jForm.District == NaN ||
      jForm.District == undefined
    ) {
      OnNotification("District is Required", "error");
      return false;
    } else if (
      jForm.DiviSector == "" ||
      jForm.DiviSector == NaN ||
      jForm.DiviSector == undefined
    ) {
      OnNotification("Divisional Secretariats is Required", "error");
      return false;
    } else if (matchPassword.test(jForm.Password) == false) {
      OnNotification(
        "Passwords length must be 8+ and uppercase,lowercase,numbers.",
        "error"
      );
      return false;
    } else if (jForm.Password != jForm.ConfirmPassword) {
      OnNotification("New password & Confirm password must match", "error");
      return false;
    } else if (!emailRegex.test(jForm.Email.trim())) {
      OnNotification("Invalid Email", "error");
      return false;
    }
    return true;
  };

  const handleSave = async (e) => {
    if (await OnSaveValidation()) {
      //
      axios
        .post("/api/addUser", {
          group: JSON.stringify(state.jForm),
          UserID: UserName,
        })
        .then((response) => {
          console.log(response.data);
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "User details saved successfully!",
          }).then(async (res) => {
            console.log("awa");
            const getUsers = await axios.get("/api/getalluser");
            console.log("getUsers", getUsers);
            setState((prevState) => ({
              ...prevState,
              users: getUsers.data,
            }));
            setNumber(0);
            setState((prevState) => ({
              ...prevState,
              jForm: {},
            }));
          });
        })
        .catch((error) => {
          console.error("Error:", error);
          // Handle error
          Swal.fire({
            icon: "error",
            title: '<span style="color: red;">Error!</span>',
            text: "Failed to save user details",
            confirmButtonColor: "#d33",
            confirmButtonText: "OK",
          });
        });
      // }
    }
  };

  const handleClear = () => {
    setNumber(0);
    setState({
      ...state,
      jForm: { Active: true },
      boolValue: false,
    });
  };

  const updateTable = (e) => {
    if (true) {
      //!isEdit

      setNumber(e.data.ContactNo);
      setState({
        jForm: {
          UserName: e.data.UserName,
          UserGroup: e.data.UserGroup,
          Password: e.data.Password,
          ConfirmPassword: e.data.Password,
          Province: e.data.Province,
          District: e.data.District,
          Email: e.data.Email,
          ContactNo: e.data.ContactNo,
          Active: e.data.Active,
          DiviSector: e.data.DiviSector,
        },
        users: state.users,
        boolValue: true,
      });
      setIsUpdate(false);
      setTimeout(() => {
        focusTextBox();
      }, 100);
    }
  };

  const focusTextBox = useCallback(() => {
    if (FormRef.current) {
      const formInstance = FormRef.current.instance;
      const editor = formInstance.getEditor("UserName");
      if (editor) {
        editor.focus();
      }
    }
  }, []);

  const handleInput = (e) => {
    const inputElement = e.event.target;
    const value = inputElement.value;
    if (value.length <= 10) {
      inputElement.value = value.slice(0, 10);
      setNumber(inputElement.value);
      setState((prevState) => ({
        ...prevState,
        jForm: {
          ...prevState.jForm,
          ContactNo: value,
        },
      }));
    }
  };

  const PasswordCell = ({ value }) => {
    const maskedValue = "*".repeat(value.length);

    return (
      <div
        style={{
          border: "none",
          outline: "none",
          background: "transparent",
          width: "50%",
        }}
      >
        {maskedValue}
      </div>
    );
  };

  return (
    <div>
      <Card title='User'>
        <Form ref={FormRef} formData={state.jForm}>
          <GroupItem caption='User Information' colCount={2}>
            <GroupItem>
              <Item
                dataField='UserName'
                editorOptions={{
                  readOnly: state.boolValue,
                }}
                className='w-50'
              >
                <RequiredRule message='Field required' />
                <Label text='User Name'></Label>
              </Item>
              <Item
                dataField='UserGroup'
                editorType='dxSelectBox'
                editorOptions={{
                  items: groups,
                  valueExpr: "ID",
                  displayExpr: "Name",
                }}
              >
                <RequiredRule message='Field required' />
                <Label text='User Group'></Label>
              </Item>
              <Item
                dataField='Password'
                editorOptions={{
                  mode: "password",
                  // minLength: 8,
                }}
              >
                <RequiredRule message='Field required' />
                <Label text='Password'></Label>
              </Item>
              <Item
                dataField='ConfirmPassword'
                editorOptions={{
                  mode: "password",
                  minLength: 8,
                }}
              >
                <RequiredRule message='Field required' />
                <Label text='Confirm Password'></Label>
              </Item>
              <Item
                dataField='Province'
                editorType='dxSelectBox'
                editorOptions={{
                  searchEnabled: true,
                  dataSource: Province,
                  valueExpr: "ID",
                  displayExpr: "Name",
                  onValueChanged: (e) => setSelectedProvince(e.value),
                }}
              >
                <RequiredRule message='Field required' />
                <Label text='Province'></Label>
              </Item>
              <Item
                dataField='District'
                editorType='dxSelectBox'
                editorOptions={{
                  searchEnabled: true,
                  dataSource: filteredDistricts,
                  valueExpr: "ID",
                  displayExpr: "Name",
                  onValueChanged: (e) => setSelectedDistrict(e.value),
                }}
              >
                <RequiredRule message='Field required' />
                <Label text='District'></Label>
              </Item>
              <Item
                dataField='DiviSector'
                editorType='dxSelectBox'
                editorOptions={{
                  searchEnabled: true,
                  dataSource: filteredDivSectors,
                  valueExpr: "ID",
                  displayExpr: "Name",
                  onValueChanged: (e) => setSelectedDivSect(e.value),
                }}
              >
                <RequiredRule message='Field required' />
                <Label text='Divisional Secretariats'></Label>
              </Item>
              <Item dataField='Email' caption='Email'>
                <Label text='Email'></Label>
              </Item>

              <Item dataField='ContactNo'>
                <NumberBox
                  onInput={handleInput}
                  showSpinButtons={false}
                  value={number}
                ></NumberBox>
                <Label text='Contact No'></Label>
              </Item>
              <Item dataField='Active' editorType='dxCheckBox'></Item>
            </GroupItem>
            <GroupItem></GroupItem>
          </GroupItem>
        </Form>
        <br></br>

        <Navbar bg='light' variant='light'>
          <Button
            variant='secondary'
            icon='feather icon-layers'
            onClick={handleSave}
            disabled={isAdd}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
            }}
          >
            Save
          </Button>
          <Button
            variant='secondary'
            icon='feather icon-layers'
            onClick={handleClear}
            disabled={isAdd}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
            }}
          >
            Clear
          </Button>
        </Navbar>
      </Card>
      <Card title='User Group List'>
        <div>
          <DataGrid
            dataSource={state.users}
            showBorders={true}
            wordWrapEnabled={true}
            allowSearch={true}
            selection={{ mode: "single" }}
            hoverStateEnabled={true}
            onCellDblClick={updateTable}
            allowColumnResizing={true}
          >
            <SearchPanel visible={true} />
            <Paging defaultPageSize={20} />

            <Column dataField='UserName' caption='User Name' />
            <Column dataField='UserGroup' caption='User Group' />
            <Column dataField='Province' caption='Province' />
            <Column
              dataField='Password'
              caption='Password'
              cellRender={PasswordCell}
            />
            <Column dataField='District' caption='District' />
            <Column dataField='DiviSector' caption='Divisional Secretariats' />
            <Column dataField='Email' caption='Email' />
            <Column dataField='ContactNo' caption='Contact No' />
            <Column dataField='Active' caption='Active' dataType='bit' />
          </DataGrid>
          <br></br>
        </div>
      </Card>

      <LoadPanel
        message='Processing.... Please, wait...'
        shadingColor='rgba(0,0,0,0.4)'
        showIndicator={true}
        shading={true}
        showPane={true}
        closeOnOutsideClick={false}
        width={500}
      />
    </div>
  );
};

export default User;
