import React, { useState, useRef, useEffect } from "react";
import Form, {
  Item,
  RequiredRule,
  Label,
  GroupItem,
} from "devextreme-react/form";
import DataGrid, {
  Column,
  Paging,
  Editing,
  Grouping,
} from "devextreme-react/data-grid";
import { Button, Navbar } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import notify from "devextreme/ui/notify";
import { CheckBox } from "devextreme-react/check-box";

const UserPermission = () => {
  const [UserNames, setUserName] = useState({});
  const [loginUser, setLoginUser] = useState({});
  const [form, setform] = useState({
    jUser: {
      userNameUpdate: "",
    },
  });
  const [state, setState] = useState({
    permissions: [],
    LoadPanelVisible: false,
  });

  const [isAdd, setISAdd] = useState(true);
  const [isEdit, setISEdit] = useState(true);
  const [isView, setIsView] = useState(true);
  const [isSave, setIsSave] = useState(true);
  // const [isDisabled, setIsDisabled] = useState(false);

  const FormRef = useRef(null);
  const FormLayout = FormRef.current && FormRef.current.instance;

  useEffect(() => {
    fetchGroupDetails();
  }, []);

  const fetchGroupDetails = async () => {
    const authData = JSON.parse(localStorage.getItem("user"));
    const checkAuthentication = await axios.get(
      "/api/CheckUserAuthentication",
      {
        params: { UsersID: authData.UserName, MenuID: 9003 },
      }
    );
    setLoginUser(authData.UserName);
    if (checkAuthentication.data.length != 0) {
      if (checkAuthentication.data[0].UserView) {
        setIsView(false);
        try {
          const userResponse = await axios.get(
            "/api/getallUserNameforPermission"
          );
          setUserName(userResponse.data);
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

  // const onSelectionChanged = (e) => {
  //   const selectedUser = e.selectedRowsData[0]?.UserName;
  //   const updatedPermissions = state.permissions.map((item) => ({
  //     ...item,
  //     UserName: selectedUser,
  //   }));
  //   setState((prevState) => ({
  //     ...prevState,
  //     permissions: updatedPermissions,
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

  const ValidationItems = async () => {
    console.log("awa 2");
    if (
      form.jUser.UserName == "" ||
      form.jUser.UserName == NaN ||
      form.jUser.UserName == undefined
    ) {
      OnNotification("User Name is Required", "error");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (await ValidationItems()) {
      let userID = form.jUser.UserName;
      try {
        const response = await axios.post("/api/addPermission", {
          permission: JSON.stringify(state.permissions),
          permissionHeader: JSON.stringify(form.jUser),
          UsersID: userID,
          UserID: loginUser,
        });
        console.log(response.data);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "User Permission details saved successfully!",
        }).then(async (res) => {
          try {
            const ActivityResponse = await axios.get(
              "/api/userPermission_Activity_Load"
            );
            setState({ permissions: ActivityResponse.data });
            setform({ jUser: {} });
          } catch (error) {
            console.error("Error:", error);
            Swal.fire({
              icon: "error",
              title: '<span style="color: red;">Error!</span>',
              text: "Failed to load User Permission details",
              confirmButtonColor: "#d33",
              confirmButtonText: "OK",
            });
          }
        });
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: '<span style="color: red;">Error!</span>',
          text: "Failed to save User Permission details",
          confirmButtonColor: "#d33",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const getPermissionDetails = async (username) => {
    if (username.value != undefined) {
      const permisionDetails = await axios.get(
        "/api/getUserPermissionDetails",
        {
          params: { UsersID: username.value },
        }
      );
      console.log("permissions", permisionDetails.data);
      setIsSave(false);
      if (permisionDetails.data.length > 0) {
        setState({ permissions: permisionDetails.data });
      } else {
        const ActivityResponse = await axios.get(
          "/api/userPermission_Activity_Load"
        );

        setState({ permissions: ActivityResponse.data });
      }
    }
  };


  const clearAll = () => {
    const updatedPermissions = state.permissions.map((permission) => ({
      ...permission,
      UserView: false,
      UserAdd: false,
      UserEdit: false,
      UserCancel: false,
      UserHold: false,
    }));

    setState({ permissions: updatedPermissions });
  };

  const isFieldDisabled = (data, field) => {
    const disabledConditions = [
      {
        activity: "Dashboard",
        fields: ["UserAdd", "UserCancel", "UserHold"],
      },
      {
        activity: "Inventory Master",
        fields: ["UserAdd", "UserEdit", "UserCancel", "UserHold"],
      },
      {
        activity: "Warehouse Master",
        fields: ["UserAdd", "UserEdit", "UserCancel", "UserHold"],
      },
      {
        activity: "Supplier Master",
        fields: ["UserAdd", "UserEdit", "UserCancel", "UserHold"],
      },
      {
        activity: "Inventory Warehouse Master",
        fields: ["UserAdd", "UserEdit", "UserCancel", "UserHold"],
      },
      {
        activity: "Unit of Measure",
        fields: ["UserAdd", "UserEdit", "UserCancel", "UserHold"],
      },
      {
        activity: "PR Type",
        fields: ["UserAdd", "UserEdit", "UserCancel", "UserHold"],
      },
      {
        activity: "Create User Branch",
        fields: ["UserCancel", "UserHold"],
      },
      {
        activity: "Create User Group",
        fields: ["UserCancel", "UserHold"],
      },
      {
        activity: "Create User Department",
        fields: ["UserCancel", "UserHold"],
      },
      {
        activity: "Requisition List (Summery)",
        fields: ["UserAdd", "UserEdit", "UserCancel", "UserHold"],
      },
      {
        activity: "Requisition List (Item Details)",
        fields: ["UserAdd", "UserEdit", "UserCancel", "UserHold"],
      },
      {
        activity: "Requisition History Log (Summery)",
        fields: ["UserAdd", "UserEdit", "UserCancel", "UserHold"],
      },
      {
        activity: "Requisition History Log (Details)",
        fields: ["UserAdd", "UserEdit", "UserCancel", "UserHold"],
      },
      {
        activity: "Pending Documents",
        fields: ["UserAdd", "UserCancel", "UserHold"],
      },
      {
        activity: "Pending Approval List",
        fields: ["UserAdd", "UserCancel", "UserHold"],
      },
      {
        activity: "KPI",
        fields: ["UserHold", "UserCancel"],
      },
      {
        activity: "Report",
        fields: ["UserAdd", "UserEdit", "UserCancel", "UserHold"],
      },
      {
        activity: "Users",
        fields: ["UserCancel", "UserHold"],
      },
      {
        activity: "User Permission",
        fields: ["UserCancel", "UserHold"],
      },
      {
        activity: "Approval Level",
        fields: ["UserCancel", "UserHold"],
      },
      {
        activity: "Approval Level Mapping",
        fields: ["UserCancel", "UserHold"],
      },
      {
        activity: "Password Reset",
        fields: ["UserAdd", "UserCancel", "UserHold"],
      },
    ];
    return disabledConditions.some(
      (condition) =>
        condition.activity === data.Activity && condition.fields.includes(field)
    );
  };

  const selectAll = () => {
    const updatedPermissions = state.permissions.map((permission) => {
      return {
        ...permission,
        UserView: true,
        UserAdd: !isFieldDisabled(permission, "UserAdd")
          ? true
          : permission.UserAdd,
        UserEdit: !isFieldDisabled(permission, "UserEdit")
          ? true
          : permission.UserEdit,
        UserCancel: !isFieldDisabled(permission, "UserCancel")
          ? true
          : permission.UserCancel,
        UserHold: !isFieldDisabled(permission, "UserHold")
          ? true
          : permission.UserHold,
      };
    });

    setState({ permissions: updatedPermissions });
  };


  const handleCheckBoxChange = (rowIndex, field, value) => {
    let permisionData = state.permissions;
    console.log("permisionData", permisionData);
    console.log("value", value);
    permisionData[rowIndex][field] = value; //? 1 : 0
    console.log("permisionData after", permisionData);
    setState({ permissions: permisionData });
    return permisionData;
  };

  const renderCheckBox = (data, rowIndex, field) => {
    let isDisabled = false;
    let changeIndex = rowIndex;
    let changeFeild = field;
    // console.log("data", data.Activity);
    // console.log("field", field);
    if (
      data.Activity == "Dashboard" &&
      (field == "UserAdd" || field == "UserCancel" || field == "UserHold")
    ) {
      changeIndex = -1;
      changeFeild = "CHANGE";
      isDisabled = true;
    } else if (
      data.Activity == "Inventory Master" &&
      (field == "UserAdd" ||
        field == "UserEdit" ||
        field == "UserCancel" ||
        field == "UserHold")
    ) {
      changeIndex = -1;
      changeFeild = "CHANGE";
      isDisabled = true;
    } else if (
      data.Activity == "Warehouse Master" &&
      (field == "UserAdd" ||
        field == "UserEdit" ||
        field == "UserCancel" ||
        field == "UserHold")
    ) {
      changeIndex = -1;
      changeFeild = "CHANGE";
      isDisabled = true;
    } else if (
      data.Activity == "Supplier Master" &&
      (field == "UserAdd" ||
        field == "UserEdit" ||
        field == "UserCancel" ||
        field == "UserHold")
    ) {
      changeIndex = -1;
      changeFeild = "CHANGE";
      isDisabled = true;
    } else if (
      data.Activity == "Inventory Warehouse Master" &&
      (field == "UserAdd" ||
        field == "UserEdit" ||
        field == "UserCancel" ||
        field == "UserHold")
    ) {
      changeIndex = -1;
      changeFeild = "CHANGE";
      isDisabled = true;
    } else if (
      data.Activity == "Unit of Measure" &&
      (field == "UserAdd" ||
        field == "UserEdit" ||
        field == "UserCancel" ||
        field == "UserHold")
    ) {
      changeIndex = -1;
      changeFeild = "CHANGE";
      isDisabled = true;
    } else if (
      data.Activity == "PR Type" &&
      (field == "UserAdd" ||
        field == "UserEdit" ||
        field == "UserCancel" ||
        field == "UserHold")
    ) {
      changeIndex = -1;
      changeFeild = "CHANGE";
      isDisabled = true;
    } else if (
      data.Activity == "Create User Branch" &&
      (field == "UserCancel" || field == "UserHold")
    ) {
      changeIndex = -1;
      changeFeild = "CHANGE";
      isDisabled = true;
    } else if (
      data.Activity == "Create User Group" &&
      (field == "UserCancel" || field == "UserHold")
    ) {
      changeIndex = -1;
      changeFeild = "CHANGE";
      isDisabled = true;
    } else if (
      data.Activity == "Create User Department" &&
      (field == "UserCancel" || field == "UserHold")
    ) {
      changeIndex = -1;
      changeFeild = "CHANGE";
      isDisabled = true;
    } else if (
      data.Activity == "Requisition List (Summery)" &&
      (field == "UserAdd" ||
        field == "UserEdit" ||
        field == "UserCancel" ||
        field == "UserHold")
    ) {
      changeIndex = -1;
      changeFeild = "CHANGE";
      isDisabled = true;
    } else if (
      data.Activity == "Requisition List (Item Details)" &&
      (field == "UserAdd" ||
        field == "UserEdit" ||
        field == "UserCancel" ||
        field == "UserHold")
    ) {
      changeIndex = -1;
      changeFeild = "CHANGE";
      isDisabled = true;
    } else if (
      data.Activity == "Requisition History Log (Summery)" &&
      (field == "UserAdd" ||
        field == "UserEdit" ||
        field == "UserCancel" ||
        field == "UserHold")
    ) {
      changeIndex = -1;
      changeFeild = "CHANGE";
      isDisabled = true;
    } else if (
      data.Activity == "Requisition History Log (Details)" &&
      (field == "UserAdd" ||
        field == "UserEdit" ||
        field == "UserCancel" ||
        field == "UserHold")
    ) {
      changeIndex = -1;
      changeFeild = "CHANGE";
      isDisabled = true;
    } else if (
      data.Activity == "Pending Documents" &&
      (field == "UserAdd" || field == "UserCancel" || field == "UserHold")
    ) {
      changeIndex = -1;
      changeFeild = "CHANGE";
      isDisabled = true;
    } else if (
      data.Activity == "Pending Approval List" &&
      (field == "UserAdd" || field == "UserCancel" || field == "UserHold")
    ) {
      changeIndex = -1;
      changeFeild = "CHANGE";
      isDisabled = true;
    } else if (
      data.Activity == "KPI" &&
      (field == "UserHold" || field == "UserCancel")
    ) {
      changeIndex = -1;
      changeFeild = "CHANGE";
      isDisabled = true;
    } else if (
      data.Activity == "Report" &&
      (field == "UserAdd" ||
        field == "UserEdit" ||
        field == "UserCancel" ||
        field == "UserHold")
    ) {
      changeIndex = -1;
      changeFeild = "CHANGE";
      isDisabled = true;
    }
    // else if (
    //   data.Activity == 17 &&
    //   (field == "UserAdd" ||
    //     field == "UserEdit" ||
    //     field == "UserCancel" ||
    //     field == "UserHold")
    // ) {
    //   changeIndex = -1;
    //   changeFeild = "CHANGE";
    //   isDisabled = true;
    // }
    else if (
      data.Activity == "Users" &&
      (field == "UserCancel" || field == "UserHold")
    ) {
      changeIndex = -1;
      changeFeild = "CHANGE";
      isDisabled = true;
    } else if (
      data.Activity == "User Permission" &&
      (field == "UserCancel" || field == "UserHold")
    ) {
      changeIndex = -1;
      changeFeild = "CHANGE";
      isDisabled = true;
    } else if (
      data.Activity == "Approval Level" &&
      (field == "UserCancel" || field == "UserHold")
    ) {
      changeIndex = -1;
      changeFeild = "CHANGE";
      isDisabled = true;
    } else if (
      data.Activity == "Approval Level Mapping" &&
      (field == "UserCancel" || field == "UserHold")
    ) {
      changeIndex = -1;
      changeFeild = "CHANGE";
      isDisabled = true;
    } else if (
      data.Activity == "Password Reset" &&
      (field == "UserAdd" || field == "UserCancel" || field == "UserHold")
    ) {
      changeIndex = -1;
      changeFeild = "CHANGE";
      isDisabled = true;
    }

    return (
      <CheckBox
        value={data[field] == true}
        onValueChanged={(e) =>
          isDisabled
            ? handleCheckBoxChange(rowIndex, field, false)
            : handleCheckBoxChange(rowIndex, field, e.value)
        }
        disabled={isDisabled}
        style={
          changeIndex === -1 && changeFeild === "CHANGE"
            ? { backgroundColor: "#000000", color: "white" }
            : {}
        }
      />
    );
  };

  return (
    <div>
      <Form ref={FormRef} formData={form.jUser}>
        <GroupItem caption="Permission" colCount={2}>
          <Item
            dataField="UserName"
            editorType="dxSelectBox"
            editorOptions={{
              searchEnabled: true,
              dataSource: UserNames,
              valueExpr: "UserName",
              displayExpr: "UserName",
              maxLength: 50,
              onValueChanged: getPermissionDetails,
            }}
          >
            <RequiredRule message="Field required" />
            <Label text="Username"></Label>
          </Item>
          <Item>
            <Button variant="secondary" onClick={selectAll} disabled={isSave}>
              Select All
            </Button>

            <Button variant="secondary" onClick={clearAll} disabled={isSave}>
              Clear
            </Button>
          </Item>
        </GroupItem>
      </Form>
      <DataGrid
        id="Approval"
        allowColumnReordering={true}
        showBorders={true}
        wordWrapEnabled={true}
        hoverStateEnabled={true}
        dataSource={state.permissions}
        // onEditorPreparing={onEditorPreparing}
        // onRowPrepared={onRowPrepared}
        // onCellPrepared={onCellPrepared}
      >
        <Paging enabled={false} />
        {/* <Editing mode="row" allowUpdating={true} useIcons={true} /> */}
        <Column
          dataField="Activity"
          caption="Activity"
          editorOptions={{ readOnly: true }}
        />
        <Column
          dataField="MenuID"
          caption="Menu ID"
          visible={false}
          editorOptions={{ readOnly: true }}
        />
        <Column
          dataField="UserView"
          caption="View"
          cellRender={({ data, rowIndex }) =>
            renderCheckBox(data, rowIndex, "UserView")
          }
        ></Column>
        <Column
          dataField="UserAdd"
          caption="Add"
          cellRender={({ data, rowIndex }) =>
            renderCheckBox(data, rowIndex, "UserAdd")
          }
          // editorOptions={{
          //   onContentReady: (e) => applyCustomStyles(e.element),
          // }}
        />
        <Column
          dataField="UserEdit"
          caption="Edit"
          cellRender={({ data, rowIndex }) =>
            renderCheckBox(data, rowIndex, "UserEdit")
          }
          // editorOptions={{
          //   onContentReady: (e) => applyCustomStyles(e.element),
          // }}
        />
        <Column
          dataField="UserCancel"
          caption="Cancel"
          cellRender={({ data, rowIndex }) =>
            renderCheckBox(data, rowIndex, "UserCancel")
          }
        />
        <Column
          dataField="UserHold"
          caption="Hold"
          cellRender={({ data, rowIndex }) =>
            renderCheckBox(data, rowIndex, "UserHold")
          }
        />
        <Column
          dataField="UserPrint"
          caption="Print"
          editorType="dxCheckBox"
          visible={false}
        />
        {/* <Column
          type="buttons"
          buttons={["edit"]}
          caption="Actions"
          headerCellRender={() => <div>Actions</div>}
        /> */}
      </DataGrid>

      <Navbar bg="light" variant="light">
        <Button variant="secondary" onClick={handleSave} disabled={isAdd}>
          Save
        </Button>
      </Navbar>
    </div>
  );
};

export default UserPermission;
