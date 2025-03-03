import React, { Component, useState, useRef } from "react";
import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import Form, {
  Item,
  GroupItem,
  RequiredRule,
  Label,
  PatternRule,
} from "devextreme-react/form";
import { Button, Navbar, Nav } from "react-bootstrap";
import List from "./UserGroupList";
import { TreeList, Editing, Column, Lookup } from "devextreme-react/tree-list";
import { Switch, Route } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import notify from "devextreme/ui/notify";
import { SelectBox, TagBox } from "devextreme-react";
import { LoadPanel } from "devextreme-react/load-panel";
import { connect } from "react-redux";

const UserGroup = () => {
  const FormRef = useRef(null);

  const [state, setState] = useState({
    Group: {},
  });
  return (
    <Aux>
      <Card title="User Group">
        <Form ref={FormRef} formData={state.Group}>
          <GroupItem caption="User Group Information" colCount={2}>
            <Item
              dataField="GroupCode"
              className="bg-danger"
              editorOptions={{
                maxLength: 50,
                //  readOnly: this.state.GroupID != 0,
              }}
            >
              <RequiredRule message="Field required" />
              <Label text="Group Code"></Label>
            </Item>
            <Item
              dataField="Description"
              editorOptions={{
                maxLength: 100,
              }}
            >
              {/* <RequiredRule message="Field required" /> */}
            </Item>

            <Item dataField="Active" editorType="dxCheckBox">
              <RequiredRule></RequiredRule>
            </Item>
          </GroupItem>
        </Form>
      </Card>

      <Card title="User Group Details">
        <TreeList
          id="GroupID"
          dataSource={state.Group}
          columnAutoWidth={true}
          wordWrapEnabled={true}
          showBorders={true}
          keyExpr="MenuID"
          parentIdExpr="ParentID"
          //   onRowUpdated={this.onRowUpdated}
          //   onRowUpdating={this.onRowUpdating}
        >
          <Editing allowUpdating={true} mode="cell" />
          <Column
            minWidth={250}
            dataField="GroupCode"
            caption="Group Code"
            allowEditing={false}
          >
            {/* <RequiredRule /> */}
          </Column>
          <Column minWidth={120} dataField="Description" caption="Description">
            {/* <Lookup
            dataSource={this.Auth}
            valueExpr="ID"
            displayExpr="Name"
          /> 
          <RequiredRule />*/}
          </Column>
          <Column
            minWidth={250}
            dataField="Active"
            caption="Active"
            editorType="dxCheckBox"
            allowEditing={false}
          >
            {/* <RequiredRule /> */}
          </Column>
        </TreeList>
      </Card>
      <Navbar bg="light" variant="light">
        <Button
          variant="secondary"
          icon="feather icon-layers"
          // onClick={this.SaveData}
          // disabled={this.state.DocReadOnly}
        >
          Save
        </Button>
        <Button
          variant="secondary"
          icon="feather icon-layers"
          //onClick={this.OnClearForm}
        >
          Clear
        </Button>
        <Button
          variant="secondary"
          icon="feather icon-layers"
          // onClick={this.OnListClickEvent}
        >
          View List
        </Button>
      </Navbar>

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

      {/* <List
        Show={this.state.ListViewing}
        OnHide={this.OnListClickEvent}
        List={this.state.jlGroupList}
      ></List> */}
    </Aux>
  );
};

export default UserGroup;

// export class UsersGroup extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       GroupID: 0,
//       Group: { Status: 1 },
//       Authorization: [],

//       jlGroupList: [],

//       ListViewing: false,
//       DocReadOnly: false,
//     };

//     this.Auth = [
//       { ID: 0, Name: "Full Authorization" },
//       { ID: 1, Name: "Read-Only" },
//       { ID: 2, Name: "No Authorization" },
//       { ID: 9, Name: "Various Authorization" },
//     ];

//     this.Status = [
//       { ID: 1, Name: "Active" },
//       { ID: 0, Name: "Inactive" },
//     ];

//     this.onLoadPanelHiding = this.onLoadPanelHiding.bind(this);
//     this.SaveData = this.SaveData.bind(this);
//     this.FormRef = React.createRef();
//   }

//   get FormLayout() {
//     return this.FormRef.current.instance;
//   }

//   componentDidMount() {
//     axios
//       .all([axios.get("/api/user-auth-tree")])
//       .then(
//         axios.spread((User) => {
//           this.setState({
//             Authorization: User.data,
//             DocReadOnly: false,
//           });
//         })
//       )
//       .catch((error) => console.log(error));
//   }

//   IDValidation = () => {
//     return new Promise((resolve, reject) => {
//       axios
//         .get("/api/user-group-exist", {
//           params: {
//             AutoID: this.state.GroupID,
//             Code: this.state.Group.GroupCode,
//             Name: this.state.Group.GroupName,
//           },
//         })
//         .then((res) => {
//           resolve(res.data[0].Exist === 1);
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     });
//   };

//   OnSaveValidation = async () => {
//     if (!this.FormLayout.validate().isValid) {
//       this.OnNotification("Fields marked with * are required", "error");
//       return false;
//     } else if (await this.IDValidation()) {
//       this.OnNotification("Code or Name already exist", "error");
//       return false;
//     } else return true;
//   };

//   onLoadPanelHiding = (message, type) => {
//     this.setState({
//       LoadPanelVisible: false,
//     });

//     this.OnNotification(message, type);
//   };

//   OnNotification = (message, type) => {
//     notify({
//       message: message,
//       type: type,
//       displayTime: 3000,
//       position: { at: "top right", offset: "50" },
//     });
//   };

//   OnClickEvent = () => {};

//   SaveData = async () => {
//     if (await this.OnSaveValidation()) {
//       Swal.fire({
//         type: "info",
//         showCancelButton: true,
//         text: "Do you want to save ?",
//         confirmButtonText: "Yes",
//         cancelButtonText: "No",
//         allowOutsideClick: false,
//         allowEscapeKey: false,
//       }).then((res) => {
//         if (res.value) {
//           this.setState(
//             { LoadPanelVisible: true },
//             () =>
//               (this.serverRequest = axios
//                 .post("/api/user-group", {
//                   GroupID: this.state.GroupID,
//                   UserGroup: JSON.stringify(this.state.Group),
//                   Authorization: JSON.stringify(this.state.Authorization),
//                 })
//                 .then((response) => {
//                   this.onLoadPanelHiding("Successfully Saved", "success");
//                   this.OnClearForm();
//                 })
//                 .catch((error) => {
//                   this.onLoadPanelHiding("Something went wrong", "error");
//                   console.log(error);
//                 }))
//           );
//         } else if (res.dismiss == "cancel") {
//           //console.log("cancel");
//         } else if (res.dismiss == "esc") {
//           //console.log("cancel");
//         }
//       });
//     }
//   };

//   OnClearForm = () => {
//     let auth = this.state.Authorization;

//     auth = auth.map((el) => (el.Auth !== 2 ? { ...el, Auth: 2 } : el));

//     this.setState({
//       GroupID: 0,
//       Group: { Status: 1 },
//       Authorization: auth,
//     });
//   };

//   OnListClickEvent = (SelectID) => {
//     this.setState({ ListViewing: !this.state.ListViewing }, () => {
//       if (this.state.ListViewing) {
//         //Open
//         this.serverRequest = axios
//           .get("/api/user-group-lookup")
//           .then((res) => {
//             console.log(res.data);
//             this.setState({ jlGroupList: JSON.parse(res.data[0].List) });
//           })
//           .catch((error) => {
//             console.log(error);
//           });
//       }
//       if (!this.state.ListViewing && SelectID != 0) {
//         //Close
//         this.setState({ GroupID: SelectID }, () => this.OnLoadData());
//       }
//     });
//   };

//   OnLoadData() {
//     axios
//       .all([
//         axios.get("/api/user-group", {
//           params: { GroupID: this.state.GroupID },
//         }),
//       ])
//       .then(
//         axios.spread((People) => {
//           console.log("data view", People);
//           this.setState({
//             Group: JSON.parse(People.data[0].UserGroup),
//             Authorization: JSON.parse(People.data[0].UserWiseAuthontication),
//           });
//         })
//       )
//       .catch((error) => console.log(error));
//   }

//   onRowUpdating = (e) => {
//     if (e.newData.Auth === 9) {
//       e.cancel = true;
//     }
//   };

//   onRowUpdated = (e) => {
//     let auth = this.state.Authorization;

//     if (e.data.Type === 1) {
//       auth = auth.map((el) =>
//         el.RootParent === e.data.MenuID || el.ParentID === e.data.MenuID
//           ? { ...el, Auth: e.data.Auth }
//           : el
//       );
//     } else {
//       let allParentCount = auth.filter(
//         (item) => item.ParentID === e.data.ParentID
//       );
//       let typeParentCount = auth.filter(
//         (item) => item.ParentID === e.data.ParentID && item.Auth === e.data.Auth
//       );

//       if (allParentCount.length === typeParentCount.length)
//         auth = auth.map((el) =>
//           el.MenuID === e.data.ParentID ? { ...el, Auth: e.data.Auth } : el
//         );
//       else
//         auth = auth.map((el) =>
//           el.MenuID === e.data.ParentID ? { ...el, Auth: 9 } : el
//         );

//       //////////////////////////

//       let allRootCount = auth.filter(
//         (item) => item.RootParent === e.data.RootParent
//       );
//       let typeRootCount = auth.filter(
//         (item) =>
//           item.RootParent === e.data.RootParent && item.Auth === e.data.Auth
//       );

//       if (allRootCount.length === typeRootCount.length)
//         auth = auth.map((el) =>
//           el.MenuID === e.data.RootParent ? { ...el, Auth: e.data.Auth } : el
//         );
//       else
//         auth = auth.map((el) =>
//           el.MenuID === e.data.RootParent ? { ...el, Auth: 9 } : el
//         );
//     }
//     this.setState({ Authorization: auth });
//   };

//   render() {
//     return (
//       <Aux>
//         <Card title="User">
//           <Form ref={this.FormRef} formData={this.state.Group}>
//             <GroupItem caption="User Information" colCount={2}>
//               <Item
//                 dataField="GroupCode"
//                 editorOptions={{
//                   maxLength: 50,
//                   readOnly: this.state.GroupID != 0,
//                 }}
//               >
//                 <RequiredRule message="Field required" />
//                 <Label text="Group Code"></Label>
//               </Item>
//               <Item
//                 dataField="Description"
//                 editorOptions={{
//                   maxLength: 100,
//                 }}
//               >
//                 {/* <RequiredRule message="Field required" /> */}
//               </Item>

//               <Item
//                 dataField="Status"
//                 editorType="dxSelectBox"
//                 editorOptions={{
//                   searchEnabled: true,
//                   items: this.Status,
//                   displayExpr: "Name",
//                   valueExpr: "ID",
//                 }}
//               >
//                 <RequiredRule></RequiredRule>
//               </Item>
//             </GroupItem>
//           </Form>
//         </Card>

//         <Card title="User Group Details">
//           <TreeList
//             id="GroupID"
//             dataSource={state.Authorization}
//             columnAutoWidth={true}
//             wordWrapEnabled={true}
//             showBorders={true}
//             keyExpr="MenuID"
//             parentIdExpr="ParentID"
//             onRowUpdated={this.onRowUpdated}
//             onRowUpdating={this.onRowUpdating}
//           >
//             <Editing allowUpdating={true} mode="cell" />
//             <Column
//               minWidth={250}
//               dataField="GroupCode"
//               caption="Group Code"
//               allowEditing={false}
//             >
//               {/* <RequiredRule /> */}
//             </Column>
//             <Column
//               minWidth={120}
//               dataField="Description"
//               caption="Description"
//             >
//               {/* <Lookup
//                 dataSource={this.Auth}
//                 valueExpr="ID"
//                 displayExpr="Name"
//               />
//               <RequiredRule />*/}
//             </Column>
//             <Column
//               minWidth={250}
//               dataField="GroupCode"
//               caption="Group Code"
//               allowEditing={false}
//             >
//               {/* <RequiredRule /> */}
//             </Column>
//           </TreeList>
//         </Card>
//         <Navbar bg="light" variant="light">
//           <Button
//             variant="secondary"
//             icon="feather icon-layers"
//             onClick={this.SaveData}
//             disabled={this.state.DocReadOnly}
//           >
//             Save
//           </Button>
//           <Button
//             variant="secondary"
//             icon="feather icon-layers"
//             onClick={this.OnClearForm}
//           >
//             Clear
//           </Button>
//           <Button
//             variant="secondary"
//             icon="feather icon-layers"
//             onClick={this.OnListClickEvent}
//           >
//             View List
//           </Button>
//         </Navbar>

//         <LoadPanel
//           message="Processing.... Please, wait..."
//           shadingColor="rgba(0,0,0,0.4)"
//           onHiding={this.onLoadPanelHiding}
//           visible={this.state.LoadPanelVisible}
//           showIndicator={true}
//           shading={true}
//           showPane={true}
//           closeOnOutsideClick={false}
//           width={500}
//         />

//         <List
//           Show={this.state.ListViewing}
//           OnHide={this.OnListClickEvent}
//           List={this.state.jlGroupList}
//         ></List>
//       </Aux>
//     );
//   }
// }

// const mapStateToProps = (state) => {
//   console.log(state.loggedReducer);
//   return {
//     data: state.loggedReducer,
//   };
// };

// export default connect(mapStateToProps)(UsersGroup);

// export default Users;
