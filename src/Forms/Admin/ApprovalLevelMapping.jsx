import React, {
  FormRef,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import { Button, Navbar } from "react-bootstrap";
import Form, {
  Item,
  Label,
  RequiredRule,
  GroupItem,
  EmptyItem,
} from "devextreme-react/form";
import DataGrid, {
  Column,
  SearchPanel,
  Lookup,
  Paging,
} from "devextreme-react/data-grid";
import { LoadPanel } from "devextreme-react/load-panel";
import axios from "axios";
import Swal from "sweetalert2";
import notify from "devextreme/ui/notify";
import Card from "../../App/components/MainCard";

const ApprovalLevelMapping = () => {
  // const [approvalMapping, setApprovalMapping] = useState([]); // Define users state variable
  const FormRef = useRef(null);

  const [groups, setGroups] = useState([]);
  const [prtype, setPRType] = useState([]);
  const [items, setItems] = useState([]);
  const [appovallevel, setappovallevel] = useState([]);
  // const [approvallevelName, setApprovalLevelName] = useState([]);
  // const [isUpdate, setIsUpdate] = useState(true);
  const [rowIndex, setRowIndex] = useState(-1);

  const [isUpdate, setIsUpdate] = useState(false);
  const [isAdd, setISAdd] = useState(true);
  const [isEdit, setISEdit] = useState(true);
  const [isView, setIsView] = useState(true);
  const [userName, setUserName] = useState({});

  const [state, setState] = useState({
    jForm: {
      PRType: "",
      ItemCategory: "",
      UserGroup: "",
      ApprovalLevel: "",
      ApprovalLevelName: "",
      IncreaseQty: false,
      DecreaseQty: false,
      MinValue: "",
      MaxValue: "",
      RequiredAttachments_1: false,
      RequiredAttachments_2: false,
      RequiredAttachments_3: false,
    },
    viewApprovalLevelMapping: 0,
    approvalMappings: [],
    LoadPanelVisible: false,
    ListViewing: false,
    GroupTable: [],
    jSetForm: {},
    boolValue: false,
    // fvdfv: false,
    RequiredAttachments: [
      { ID: 0, Name: "Min" },
      { ID: 1, Name: "Medium" },
      { ID: 2, Name: "Max" },
    ],
  });

  const FormLayout = FormRef.current && FormRef.current.instance;

  useEffect(() => {
    fetchGroupDetails();
  }, []);

  const fetchGroupDetails = async () => {
    const authData = JSON.parse(localStorage.getItem("user"));
    const checkAuthentication = await axios.get(
      "/api/CheckUserAuthentication",
      {
        params: { UsersID: authData.UserName, MenuID: 9005 },
      }
    );
    setUserName(authData.UserName);
    if (checkAuthentication.data.length != 0) {
      if (checkAuthentication.data[0].UserView) {
        setIsView(false);
        try {
          const groupResponse = await axios.get("/api/getallgroupforapproval");
          setGroups(groupResponse.data);

          const prtypeResponse = await axios.get(
            "/api/getallPRTypeforapproval"
          );
          setPRType(prtypeResponse.data);

          const itemResponse = await axios.get("/api/getallitemforapproval");
          setItems(itemResponse.data);

          const getApprovalLevelMapping = await axios.get(
            "/api/getallapprovallevelmapping"
          );
          console.log("getApprovalLevelMapping", getApprovalLevelMapping.data);
          setState((prevState) => ({
            ...prevState,
            jForm: { MinValue: 0, MaxValue: 1 },
            approvalMappings: getApprovalLevelMapping.data,
          }));
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

  const handleApprovalLevelChange = async (e) => {
    // console.log("ApprovalLevel", state.jForm.ApprovalLevel);
    // console.log("isUpdate", isUpdate);
    // if (!isUpdate) {
    if (state.jForm.ApprovalLevel != undefined) {
      try {
        const response = await axios.get("/api/getApprovalLevelName", {
          params: {
            ApprovalLevel: state.jForm.ApprovalLevel,
            TransactionType: state.jForm.PRType,
          },
        });

        const approvalLevelName = response.data;

        setState((prevState) => ({
          jForm: {
            ...prevState.jForm,
            ApprovalLevelName: approvalLevelName.ApprovalLevelName,
          },
          approvalMappings: [...prevState.approvalMappings],
          // jForm: { ApprovalLevelName: approvalLevelName.ApprovalLevelName },
        }));
      } catch (error) {
        console.error("Error fetching approval level name:", error);
        setState((prevState) => ({
          ...prevState,
          ApprovalLevelName: "Default Approval Level Name",
        }));
        // setApprovalLevelName(() => ({
        //   approvallevelName: "Default Approval Level Name",
        // }));
      }
    }
    // }
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
    const { jForm } = state;
    let max = parseFloat(jForm.MaxValue);
    let min = parseFloat(jForm.MinValue);
    if (!FormLayout.validate().isValid) {
      OnNotification("Fields marked with * are required", "error");
      return false;
    } else if (
      jForm.PRType == "" ||
      jForm.PRType == NaN ||
      jForm.PRType == undefined
    ) {
      OnNotification("PRType is Required", "error");
      return false;
    } else if (
      jForm.UserGroup == "" ||
      jForm.UserGroup == NaN ||
      jForm.UserGroup == undefined
    ) {
      OnNotification("UserGroup is Required", "error");
      return false;
    } else if (
      jForm.ItemCategory == "" ||
      jForm.ItemCategory == NaN ||
      jForm.ItemCategory == undefined
    ) {
      OnNotification("ItemCategory is Required", "error");
      return false;
    } else if (
      jForm.ApprovalLevel == "" ||
      jForm.ApprovalLevel == NaN ||
      jForm.ApprovalLevel == undefined
    ) {
      OnNotification("ApprovalLevel is Required", "error");
      return false;
    } else if (max < 1) {
      OnNotification("Max Value is Should be Greater Than 0", "error");
      return false;
    } else if (min < 0) {
      OnNotification("Min Value is Should be Greater Than or Equal 0", "error");
      return false;
    } else if (max <= min) {
      OnNotification("Max Value is Should be Greater Than Min Value", "error");
      return false;
    }
    return true;
  };

  const handleSave = async (e) => {
    if (await OnSaveValidation()) {
      console.log(JSON.stringify(state.jForm));
      axios
        .post("/api/addApprovalMapping", {
          approvalMapping: JSON.stringify(state.jForm),
          UserID: userName,
          Index: rowIndex,
        })
        .then((response) => {
          console.log(response.data);
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Approval Level Mapping details saved successfully!",
          }).then((res) => {
            handleViewList();
          });
        })
        .catch((error) => {
          console.error("Error:", error);
          Swal.fire({
            icon: "error",
            title: '<span style="color: red;">Error!</span>',
            text: "Failed to save approval level mapping details",
            confirmButtonColor: "#d33",
            confirmButtonText: "OK",
          });
        });
    }
  };

  const handleViewList = async () => {
    const getApprovalLevelMapping = await axios.get(
      "/api/getallapprovallevelmapping"
    );
    console.log(getApprovalLevelMapping.data);
    setState((prevState) => ({
      ...prevState,
      approvalMappings: getApprovalLevelMapping.data,
      jForm: { MinValue: 0, MaxValue: 1 },
      boolValue: false,
    }));
    // handleClear();
  };

  const handleClear = async () => {
    setState({
      ...state,
      jForm: { MinValue: 0, MaxValue: 1 },
      boolValue: false,
    });
    // setIsUpdate(false);
  };

  // const onSelectionChanged = (e) => {
  //   console.log(e.selectedRowsData[0]);
  //   setState((prevState) => ({
  //     ...prevState,
  //     jSetForm: e.selectedRowsData[0],
  //   }));
  // };

  // const onOpenClick = () => {
  //   setState({ jForm: state.jSetForm });
  //   setState((prevState) => ({
  //     ...prevState,
  //     approvalMappings: state.approvalMappings,
  //     // jForm: state.jSetForm,
  //     boolValue: true,
  //     fvdfv: false,
  //   }));
  // };

  const updateTable = (e) => {
    console.log(e.data.Index);
    if (!isEdit) {
      setIsUpdate(true);
      setState({
        jForm: e.data,
        approvalMappings: state.approvalMappings,
        boolValue: true,
      });
      // setIsUpdate(false);
      setRowIndex(e.data.Index);
      setIsUpdate(false);
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

  const setApprovalLevelDetails = async (level) => {
    console.log("ApprovalLevel", state.jForm.ApprovalLevel);
    console.log("isUpdate", isUpdate);
    // if () {
    console.log("AWA");
    const getApprovalLevelMapping = await axios.get(
      "/api/getallapprovallevelmapping"
    );
    if (!isUpdate) {
      setState((prevState) => ({
        ...prevState,
        jForm: {
          ...prevState.jForm,
          ApprovalLevel: null,
          ApprovalLevelName: null,
        },
        approvalMappings: getApprovalLevelMapping.data,
      }));
    }

    const approvalLevel = await axios.get("/api/filterApprovalLevelDetails", {
      params: { TransactionType: level.value },
    });

    if (approvalLevel.data.length != 0) {
      setappovallevel(approvalLevel.data);
    } else setappovallevel([]);
    // }
  };

  return (
    <div>
      <Card title="Approval Level Mapping">
        <Form ref={FormRef} formData={state.jForm}>
          <GroupItem caption="Approval" colCount={2}>
            <Item
              dataField="PRType"
              editorType="dxSelectBox"
              editorOptions={{
                readOnly: state.boolValue,
                dataSource: prtype,
                valueExpr: "PRTypeCode",
                displayExpr: "Discription",
                maxLength: 50,
                onValueChanged: setApprovalLevelDetails,
              }}
            >
              <RequiredRule message="Field required" />
              <Label text="PR Type"></Label>
            </Item>
            <Item
              dataField="ItemCategory"
              editorType="dxSelectBox"
              editorOptions={{
                readOnly: state.boolValue,
                dataSource: items,
                valueExpr: "FldValue",
                displayExpr: "FldValue",
                maxLength: 50,
              }}
            >
              <RequiredRule message="Field required" />
              <Label text="Item Type "></Label>
            </Item>
            <Item
              dataField="UserGroup"
              editorType="dxSelectBox"
              editorOptions={{
                readOnly: state.boolValue,
                dataSource: groups,
                valueExpr: "GroupCode",
                displayExpr: "Discription",
                maxLength: 50,
              }}
            >
              <RequiredRule message="Field required" />
              <Label text="User Group"></Label>
            </Item>
            <EmptyItem />
          </GroupItem>

          <GroupItem caption="Approval Level" colCount={2}>
            <Item
              dataField="ApprovalLevel"
              editorType="dxSelectBox"
              editorOptions={{
                readOnly: state.boolValue,
                dataSource: appovallevel,
                valueExpr: "ApprovalLevel",
                displayExpr: "ApprovalLevel",
                maxLength: 50,
                onValueChanged: handleApprovalLevelChange,
              }}
            >
              <RequiredRule message="Field required" />
              <Label text="Approval Level ID"></Label>
            </Item>

            <Item
              dataField="ApprovalLevelName"
              editorOptions={{
                maxLength: 50,
                readOnly: true,
                // value: state.ApprovalLevelName,
              }}
            >
              <Label text="Approval Level Description"></Label>
            </Item>
          </GroupItem>

          <GroupItem caption="Quantity Limit" colCount={2}>
            <Item dataField="IncreaseQty" editorType="dxCheckBox">
              <Label text="Allow To Increase Qty"></Label>
            </Item>

            <Item dataField="DecreaseQty" editorType="dxCheckBox">
              <Label text="Allow To Decrease Qty"></Label>
            </Item>
          </GroupItem>

          <GroupItem caption="Finance Limit" colCount={2}>
            <Item
              dataField="MinValue"
              editorType="dxNumberBox"
              editorOptions={{
                maxLength: 50,
              }}
            >
              <Label text="Min Value" location="left"></Label>
            </Item>
            <Item
              dataField="MaxValue"
              editorType="dxNumberBox"
              editorOptions={{
                maxLength: 50,
              }}
            >
              <Label text="Max Value" location="left"></Label>
            </Item>
          </GroupItem>

          <GroupItem caption="Required Attachments" colCount={2}>
            <Item dataField="RequiredAttachments_1" editorType="dxCheckBox">
              <Label text="Specification"></Label>
            </Item>
            <Item dataField="RequiredAttachments_2" editorType="dxCheckBox">
              <Label text="BOQ"></Label>
            </Item>
            <Item dataField="RequiredAttachments_3" editorType="dxCheckBox">
              <Label text="Drawing"></Label>
            </Item>
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
        <br></br>
      </Card>
      <br></br>

      <h3>Mapping Details</h3>
      <br></br>

      {!state.LoadPanelVisible && (
        <DataGrid
          showBorders={true}
          dataSource={state.approvalMappings}
          wordWrapEnabled={true}
          allowSearch={true}
          selection={{ mode: "single" }}
          allowColumnResizing={true}
          hoverStateEnabled={true}
          // onSelectionChanged={onSelectionChanged}
          onCellDblClick={updateTable}
        >
          <SearchPanel visible={true} />
          <Paging defaultPageSize={20} />
          <Column dataField="Index" visible={false} />
          <Column dataField="PRType" caption="PR Type">
            <Lookup
              items={prtype}
              valueExpr="PRTypeCode"
              displayExpr="Discription"
            />
          </Column>
          <Column dataField="ItemCategory" caption="Item Category" />
          <Column dataField="UserGroup" caption="User Group">
            <Lookup
              items={groups}
              valueExpr="GroupCode"
              displayExpr="Discription"
            />
          </Column>

          <Column caption="Approval Level">
            <Column dataField="ApprovalLevel" caption="Approval Level ID" />
            <Column
              dataField="ApprovalLevelName"
              caption="Approval Level Name"
            />
          </Column>

          <Column caption="Quantity Limit ">
            <Column
              dataField="IncreaseQty"
              caption="Allow To Increase Qty"
              dataType="bit"
            />
            <Column
              dataField="DecreaseQty"
              caption="Allow To Decrease Qty"
              dataType="bit"
            />
          </Column>

          <Column caption="Finance Limit ">
            <Column dataField="MinValue" caption="Min Value" />
            <Column dataField="MaxValue" caption="Max Value" />
          </Column>

          <Column caption="Required Attachment">
            <Column
              dataField="RequiredAttachments_1"
              caption="Specification"
              dataType="bit"
            />
            <Column
              dataField="RequiredAttachments_2"
              caption="BOQ"
              dataType="bit"
            />
            <Column
              dataField="RequiredAttachments_3"
              caption="Drawing"
              dataType="bit"
            />
          </Column>
        </DataGrid>
      )}

      <LoadPanel
        message="Processing.... Please, wait..."
        shadingColor="rgba(0,0,0,0.4)"
        // onHiding={this.onLoadPanelHiding}
        // visible={this.state.LoadPanelVisible}
        showIndicator={true}
        shading={true}
        showPane={true}
        closeOnOutsideClick={false}
        width={500}
      />
    </div>
  );
};

export default ApprovalLevelMapping;
