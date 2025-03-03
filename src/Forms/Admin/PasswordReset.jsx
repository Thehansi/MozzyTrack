import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import Aux from "../../hoc/_Aux";
import Form, { Item, Label, RequiredRule } from "devextreme-react/form";
import DataGrid, {
  Column,
  Editing,
  Popup,
  Lookup,
  Scrolling,
  Paging,
  Selection,
  SearchPanel,
} from "devextreme-react/data-grid";
import Card from "../../App/components/MainCard";
import { Button, Navbar, Dropdown, DropdownButton } from "react-bootstrap";
import { LoadPanel } from "devextreme-react/load-panel";
import notify from "devextreme/ui/notify";
import Swal from "sweetalert2";
import axios from "axios";
import Layout from "../../component/Report/ReportList";
import { connect } from "react-redux";
import Moment from "moment";
import DropDownBox from "devextreme-react/drop-down-box";
import TextBox from "devextreme-react/text-box";

const PasswordRest = () => {
  // const [passwordreset, setPasswordreset] = useState({
  //   jPasswordReset: {},
  // });
  const [passwordreset, setPasswordreset] = useState([]);
  const FormRef = useRef(null);

  const [username, setUsername] = useState([]);
  const [CurrentPassword, setpassword] = useState([]);

  const [selectedUserName, setSelectedUserName] = useState(null); // Add this line

  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  // const [passwordMode, setPasswordMode] = useState<TextBoxTypes.TextBoxType>('password');
  const [isAdd, setISAdd] = useState(true);
  const [isEdit, setISEdit] = useState(true);
  const [isView, setIsView] = useState(true);
  const [userName, setUserName] = useState({});

  useEffect(() => {
    fetchUserNameDetails();
  }, []);

  const fetchUserNameDetails = async () => {
    const authData = JSON.parse(localStorage.getItem("user"));
    const checkAuthentication = await axios.get(
      "/api/CheckUserAuthentication",
      {
        params: { UsersID: authData.UserName, MenuID: 9006 },
      }
    );
    setUserName(authData.UserName);
    if (checkAuthentication.data.length != 0) {
      if (checkAuthentication.data[0].UserView) {
        setIsView(false);
        try {
          const usernameResponse = await axios.get(
            "/api/getallPasswordDetails"
          );
          setUsername(usernameResponse.data);
          console.log("get all pw details");
        } catch (error) {
          console.error("Error fetching details:", error);
        }
      }
      if (checkAuthentication.data[0].UserAdd) {
        setISAdd(false);
      }
      if (checkAuthentication.data[0].UserEdit) {
        setISEdit(false);
      }
    }
  };

  const [state, setState] = useState({
    jPasswordReset: {
      UserName: "",
      Password: "",
      NewPassword: "",
      ConfirmPassword: "",
      // CreatedDate: null,
    },
    viewPasswordreset: 0,
    passwordresets: [],
    LoadPanelVisible: false,
    ListViewing: false,
    PasswordResetTable: [],
    jSetPasswordReset: {},
    boolValue: false,
    fvdfv: false,
  });

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
    //  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for email validation
    //  const existingUsernames = user.map((user) => user.UserName.toLowerCase());

    //  console.log("validation  2", !FormLayout.validate().isValid);
    //  console.log( "user group awa",state.jForm);

    const { jPasswordReset } = state;

    if (!FormLayout.validate().isValid) {
      OnNotification("Fields marked with * are required", "error");
      return false;
    } else if (
      jPasswordReset.UserName == "" ||
      jPasswordReset.UserName == NaN ||
      jPasswordReset.UserName == undefined
    ) {
      OnNotification("UserName is Required", "error");
      return false;
    }
    //  if (state.jForm.PasswordChange) {
    else if (
      jPasswordReset.Password == "" ||
      jPasswordReset.Password == NaN ||
      jPasswordReset.Password == undefined
    ) {
      OnNotification("Password is Required", "error");
      return false;
    } else if (matchPassword.test(jPasswordReset.Password) == false) {
      OnNotification(
        "Passwords must contain at least 8 characters, including uppercase, lowercase letters and numbers.",
        "error"
      );
      return false;
    } else if (jPasswordReset.Password != jPasswordReset.ConfirmPassword) {
      OnNotification("New password & Confirm password must match", "error");
      return false;
    }
    return true;
  };

  const handleSave = async (e) => {
    // Handle form submission
    // console.log('Selected group:', selectedGroup);
    // console.log('Selected department:', selectedDepartment);

    console.log(state.jPasswordReset.UserName, "awaa user name");
    if (await OnSaveValidation()) {
      axios
        .post("/api/addResetPassword", {
          user: JSON.stringify(state.jPasswordReset),
          UserName: state.jPasswordReset.UserName,
          addResetPassword: userName,
        })
        .then((response) => {
          console.log(response.data);
          // Handle success response
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Reset Password details saved successfully!",
          }).then((res) => {
            const newReset = response.data;
            setState((prevState) => ({
              ...prevState,
              passwordresets: [...prevState.passwordresets, newReset],
              jPasswordReset: {},
              boolValue: false,
              fvdfv: false,
            }));
          });
        })
        .catch((error) => {
          console.error("Error:", error);
          // Handle error
          Swal.fire({
            icon: "error",
            title: '<span style="color: red;">Error!</span>',
            text: "Failed to save password details",
            confirmButtonColor: "#d33",
            confirmButtonText: "OK",
          });
        });
      // }
    }
  };

  const setValue = async (UserName) => {
    console.log("user name print", UserName);
    try {
      const usernameResponse = await axios.post("/api/getcurrentpassword", {
        UserName: UserName,
      });
      console.log("user response", usernameResponse.data[0].Password);
      setpassword(usernameResponse.data[0].Password);
      console.log("get all password each users");
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  // const passwordButton = useMemo<ButtonTypes.Properties>(
  //   () => ({
  //     icon: 'eyeopen',
  //     stylingMode: 'text',
  //     onClick: () => {
  //       setPasswordMode(passwordMode === 'text' ? 'password' : 'text');
  //     },
  //   }),

  //   [passwordMode, setPasswordMode]

  //   );
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const OnClearForm = () => {
    setState({
      ...state,
      jPasswordReset: {},
    });
  };

  return (
    <Aux>
      <Card title="Password Reset">
        <Form ref={FormRef} formData={state.jPasswordReset}>
          <Item
            dataField="UserName"
            editorType="dxSelectBox"
            editorOptions={{
              dataSource: username,
              //items: state.Sts,
              valueExpr: "UserName",
              displayExpr: "UserName",
              // layout: "horizontal",
              // value: Value,
              onValueChanged: (e) => setValue(e.value),
            }}
          >
            <RequiredRule />
          </Item>

          <Item
            dataField="CurrentPassword"
            editorOptions={{
              maxLength: 50,
              // mode: "password",
              value: CurrentPassword,
              readOnly: "true",
            }}
          >
            <RequiredRule />
          </Item>
          <Item
            dataField="Password"
            editorType="dxTextBox"
            editorOptions={{
              mode: passwordVisible ? "text" : "password",
              maxLength: 50,
              icon: passwordVisible ? "eye-slash" : "eye",
              onIconClick: togglePasswordVisibility,
              value: password,
            }}
          >
            <Label text="New Password" />
            <RequiredRule />
          </Item>
          <Item
            dataField="ConfirmPassword"
            editorOptions={{
              maxLength: 50,
              mode: "password",
            }}
          >
            <RequiredRule />
          </Item>
        </Form>
      </Card>

      <Navbar bg="light" variant="light">
        <Button
          variant="secondary"
          icon="feather icon-layers"
          onClick={handleSave}
          disabled={isEdit}
        >
          Update
        </Button>
        <Button
          variant="secondary"
          icon="feather icon-layers"
          disabled={isEdit}
          onClick={OnClearForm}
        >
          Clear
        </Button>
      </Navbar>
    </Aux>
  );
};

export default PasswordRest;
