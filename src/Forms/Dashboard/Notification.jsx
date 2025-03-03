import DataGrid, {
  Column,
  Editing,
  Paging,
  SearchPanel,
  Lookup,
} from "devextreme-react/data-grid";
import React, { useState, useEffect } from "react";
import Card from "../../App/components/MainCard";
import axios from "axios";

const Notification = () => {
  const [notification, setNotification] = useState([]);
  const [state, setState] = useState({
    Status: [
      { ID: "0", Name: "Pending" },
      { ID: 1, Name: "Cancel" },
      { ID: 2, Name: "Approve" },
      { ID: 3, Name: "Reject" },
      { ID: 4, Name: "Hold" },
    ],
  });

  useEffect(() => {
    setdetails();
  }, []);

  const setdetails = async () => {
    // const notificationDetails = await axios.get("/api/getAllNotification");
    // console.log("notificationDetails", notificationDetails);
    // setNotification(notificationDetails.data);
  };
  return (
    <div>
      <Card title="Notification">
        <DataGrid
          id="Notification"
          allowColumnReordering={true}
          showBorders={true}
          allowSearch={true}
          dataSource={notification}
        >
          <Paging enabled={true} />
          <SearchPanel visible={true} />
          <Editing mode="row" />
          <Column dataField="CreateDate" caption="Create Date" />
          <Column
            dataField="IsFinal"
            editorType="dxCheckBox"
            caption="Is Final Stage"
          />
          <Column dataField="Item_Type" caption="Item Type" />
          <Column dataField="PR_Type" caption="PR Type" />
          <Column dataField="PR_Number" caption="PR Number" />
          <Column dataField="Status" caption="Status">
            <Lookup
              items={state.Status}
              valueExpr="ID"
              displayExpr="Name"
            ></Lookup>
          </Column>
          <Column dataField="Priority" caption="Priority" />
        </DataGrid>
      </Card>
    </div>
  );
};
export default Notification;

// import React, { Component } from "react";
// import {
//   Row,
//   Col,
//   Card,
//   Table,
//   Tabs,
//   Tab,
//   DropdownButton,
//   Dropdown,
// } from "react-bootstrap";
// import DEMO from "../../store/constant";
// import axios from "axios";
// import { connect } from "react-redux";
// import avatar1 from "../../assets/images/user/avatar-1.jpg";
// import { LoadPanel } from "devextreme-react/load-panel";
// import notify from "devextreme/ui/notify";
// import Swal from "sweetalert2";
// import Moment from "moment";
// import { TabPanel, Item } from "devextreme-react/tab-panel";
// import { Popup } from "devextreme-react/popup";
// import ScrollView from "devextreme-react/scroll-view";

// export class Notification extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       jlNotification: [],
//       LoadPanelVisible: false,
//       jlBulkUpload: [],
//       LoadingID: 0,

//       LoadingExamSetUp: false,
//       LoadingExamSetUpID: 0,
//       LoadingDocumentID: 0,
//       LoadingViewPanel: false,

//       SchoolID: 0,
//       SubjectID: 0,
//       PartID: 0,

//       LoadingVisiblePlanale: false,
//       ViewDocumentTypeID: 0,
//     };

//     this.updateMyData = this.updateMyData.bind(this);
//     this.VisibleFalse = this.VisibleFalse.bind(this);
//   }
//   OnLayoutClickEvent = () => {
//     if (this.state.ExamID === 0)
//       this.OnNotification("No data to print", "warning");
//     else this.setState({ LayoutViewing: !this.state.LayoutViewing });
//   };
//   OnNotification = (message, type) => {
//     notify({
//       message: message,
//       type: type,
//       displayTime: 3000,
//       position: { at: "top right", offset: "50" },
//     });
//   };
//   componentDidMount() {
//     this._isMounted = true;
//     console.log("reducer data", this.props.data.user.Id);
//     axios
//       .all([
//         axios.get("/api/approvalTransaction", {
//           params: { UserID: this.props.data.user.Id },
//         }),
//       ])
//       .then(
//         axios.spread((Approval) => {
//           if (this._isMounted)
//             this.setState({
//               jlNotification: JSON.parse(Approval.data[0].ApprovalTransaction),
//             });
//         })
//       )
//       .catch((error) => console.log(error));
//   }
//   onClickApprove(e) {
//     if (e != undefined || e != null) {
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
//           this.setState({ LoadPanelVisible: true });
//           this.serverRequest = axios
//             .post("/api/approvalTransactionApprove", {
//               ApprovalTransactionID: e,
//             })
//             .then((response) => {
//               console.log("res", response);

//               if (response.data[0].DocumentType == 5005) {
//                 this.serverRequest = axios
//                   .post("/api/bulk-credit-note-approval-post-sap", {
//                     DocumentPostingData: response.data[0].DocumentPostingData,
//                     DocumentNumber: response.data[0].DocumentNumber,
//                   })
//                   .then((response) => {
//                     if (response.status != 400) {
//                       this.onLoadPanelHiding();
//                       this.OnClearForm();
//                     } else {
//                       this.setState({
//                         LoadPanelVisible: false,
//                       });

//                       notify({
//                         message:
//                           "Document Not Posting to SAP Please Check Document",
//                         type: "warning",
//                         displayTime: 3000,
//                         position: { at: "top right", offset: "50" },
//                       });
//                       this.OnClearForm();
//                     }
//                   })
//                   .catch((error) => {
//                     this.onLoadPanelHiding();
//                     console.log(error);
//                   });
//               } else if (response.data[0].DocumentType == 5004) {
//                 this.serverRequest = axios
//                   .post("/api/bulk-invoice-approval-post-sap", {
//                     DocumentPostingData: response.data[0].DocumentPostingData,
//                     DocumentNumber: response.data[0].DocumentNumber,
//                   })
//                   .then((response) => {
//                     if (response.status != 400) {
//                       this.onLoadPanelHiding();
//                       this.OnClearForm();
//                     } else {
//                       this.setState({
//                         LoadPanelVisible: false,
//                       });

//                       notify({
//                         message:
//                           "Document Not Posting to SAP Please Check Document",
//                         type: "warning",
//                         displayTime: 3000,
//                         position: { at: "top right", offset: "50" },
//                       });
//                       this.OnClearForm();
//                     }
//                   })
//                   .catch((error) => {
//                     this.onLoadPanelHiding();
//                     console.log(error);
//                   });
//               } else {
//                 this.onLoadPanelHiding();
//                 this.OnClearForm();
//               }
//             })
//             .catch((error) => {
//               this.onLoadPanelHiding();
//               console.log(error);
//             });
//         } else if (res.dismiss == "cancel") {
//         } else if (res.dismiss == "esc") {
//         }
//       });
//     } else {
//       notify({
//         message: "Fields marked with * are required",
//         type: "error",
//         displayTime: 3000,
//         position: { at: "top right", offset: "50" },
//       });
//     }
//   }
//   onClickReject(e) {
//     if (e != undefined || e != null) {
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
//           this.setState({ LoadPanelVisible: true });
//           this.serverRequest = axios
//             .post("/api/ApprovalTransactionReject", {
//               ApprovalTransactionID: e,
//             })
//             .then((response) => {
//               this.onLoadPanelHiding();
//               this.OnClearForm();
//             })
//             .catch((error) => {
//               this.onLoadPanelHiding();
//               console.log(error);
//             });
//         } else if (res.dismiss == "cancel") {
//         } else if (res.dismiss == "esc") {
//         }
//       });
//     } else {
//       notify({
//         message: "Fields marked with * are required",
//         type: "error",
//         displayTime: 3000,
//         position: { at: "top right", offset: "50" },
//       });
//     }
//   }
//   OnClearForm = () => {
//     this.setState({
//       LoadPanelVisible: false,
//     });

//     this.componentDidMount();
//   };
//   onLoadPanelHiding = () => {
//     this.setState({
//       LoadPanelVisible: false,
//     });

//     notify({
//       message: "Successfully Saved",
//       type: "success",
//       displayTime: 3000,
//       position: { at: "top right", offset: "50" },
//     });
//   };

//   ViewSetUp = (LoadID, DocumentID, SchoolID, SubjectID, PartID) => {

//   };

//   VisibleFalse = () => {
//     this.setState({
//       LoadingExamSetUp: false,
//       LoadingID: 0,
//       LoadingViewPanel: false,
//     });
//   };

//   hideInfo = () => {
//     this.setState({
//       LoadingExamSetUp: false,
//     });
//   };

//   updateMyData = (autoID) => {
//     if (
//       this.state.jlBulkUpload == null ||
//       this.state.jlBulkUpload.length == 0
//     ) {
//       this.state.jlBulkUpload.push({
//         AutoID: autoID,
//       });

//       return;
//     }
//     let app = [...this.state.jlBulkUpload];
//     let idx = app.find((obj) => obj.AutoID === autoID);
//     if (idx == undefined || idx == null) {
//       this.state.jlBulkUpload.push({
//         AutoID: autoID,
//       });
//     } else {
//       let app = [...this.state.jlBulkUpload];
//       var index = app.findIndex((obj) => obj.AutoID === autoID);

//       if (index !== -1) {
//         this.state.jlBulkUpload.splice(index, 1);
//       }
//     }
//   };

//   onBulkApprove = () => {
//     if (this.state.jlBulkUpload.length != 0) {
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
//           this.setState({ LoadPanelVisible: true });
//           this.state.jlBulkUpload.forEach((element) => {
//             this.serverRequest = axios
//               .post("/api/approvalTransactionApprove", {
//                 ApprovalTransactionID: element.AutoID,
//               })
//               .then((response) => { })
//               .catch((error) => {
//                 this.onLoadPanelHiding();
//                 console.log(error);
//               });
//           });
//           this.onLoadPanelHiding();
//           this.componentDidMount();
//           this.OnClearForm();
//         } else if (res.dismiss == "cancel") {
//         } else if (res.dismiss == "esc") {
//         }
//       });
//     } else {
//       notify({
//         message: "Pleace select document",
//         type: "warning",
//         displayTime: 3000,
//         position: { at: "top right", offset: "50" },
//       });
//     }
//   };

//   onBulkReject = () => {
//     if (this.state.jlBulkUpload.length != 0) {
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
//           this.setState({ LoadPanelVisible: true });
//           this.state.jlBulkUpload.forEach((element) => {
//             this.serverRequest = axios
//               .post("/api/ApprovalTransactionReject", {
//                 ApprovalTransactionID: element.AutoID,
//               })
//               .then((response) => { })
//               .catch((error) => {
//                 this.onLoadPanelHiding();
//                 console.log(error);
//               });
//           });
//           this.onLoadPanelHiding();
//           this.componentDidMount();
//           this.OnClearForm();
//         } else if (res.dismiss == "cancel") {
//         } else if (res.dismiss == "esc") {
//         }
//       });
//     } else {
//       notify({
//         message: "Pleace select document",
//         type: "warning",
//         displayTime: 3000,
//         position: { at: "top right", offset: "50" },
//       });
//     }
//   };

//   render() {
//     return (
//       <Col md={12} xl={12}>
//         <Card className="Recent-Users">
//           <Card.Header>
//             <Card.Title as="h5">Approve Document's</Card.Title>
//           </Card.Header>
//           <Card.Body className="px-0 py-2">
//             <Table responsive hover>
//               <tbody>{this.renderTableData()}</tbody>
//             </Table>
//           </Card.Body>
//         </Card>

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
//         <Popup
//           visible={this.state.LoadingExamSetUp}
//           onHiding={this.hideInfo}
//           dragEnabled={false}
//           closeOnOutsideClick={true}
//           showTitle={true}
//           title="Information"
//         >
//           <ScrollView width="100%" height="100%">
//           </ScrollView>
//         </Popup>
//       </Col>
//     );
//   }

//   renderTableData() {
//     return this.state.jlNotification.map((documentData, index) => {
//       return (
//         <tr className="unread" key={documentData.AutoID}>
//           <td>
//             <input
//               type="checkbox"
//               onClick={() => this.updateMyData(documentData.AutoID)}
//             />
//           </td>
//           <td>
//             <img
//               className="rounded-circle"
//               style={{ width: "40px" }}
//               src={avatar1}
//               alt="activity-user"
//             />
//           </td>
//           <td>
//             <h6 className="mb-1">{documentData.Name}</h6>
//             <p className="m-0">{documentData.FullName}</p>
//           </td>
//           <td>
//             <h6 className="text-muted">
//               <i className="fa fa-circle text-c-green f-10 m-r-15" />
//               {Moment(documentData.CreateDate).format("YYYY-MM-DD")}
//             </h6>
//           </td>
//           <td>
//             <div>
//               {documentData.IsApproved == 1 ? (
//                 <a
//                   href={DEMO.BLANK_LINK}
//                   className="label theme-bg2 text-white f-12"
//                 >
//                   Approve
//                 </a>
//               ) : documentData.IsReject == 1 ? (
//                 <a
//                   href={DEMO.BLANK_LINK}
//                   className="label theme-bg2 text-white f-12"
//                 >
//                   Reject
//                 </a>
//               ) : (
//                 <a
//                   href={DEMO.BLANK_LINK}
//                   className="label theme-bg2 text-white f-12"
//                 >
//                   Pending
//                 </a>
//               )}
//             </div>
//           </td>
//           <td>
//             {documentData.IsReject == 1 || documentData.IsApproved == 1 ? (
//               <div></div>
//             ) : (
//               <a
//                 href={DEMO.BLANK_LINK}
//                 className="label theme-bg2 text-white f-12"
//                 onClick={() => this.onClickReject(documentData.AutoID)}
//               >
//                 Reject
//               </a>
//             )}

//             {documentData.IsReject == 1 || documentData.IsApproved == 1 ? (
//               <div></div>
//             ) : (
//               <a
//                 href={DEMO.BLANK_LINK}
//                 onClick={() => this.onClickApprove(documentData.AutoID)}
//                 className="label theme-bg text-white f-12"
//               >
//                 Approve
//               </a>
//             )}

//             <a
//               href={DEMO.BLANK_LINK}
//               onClick={() =>
//                 this.ViewSetUp(
//                   documentData.DocumentNumber,
//                   documentData.DocumentTypeID,
//                   documentData.SchoolID,
//                   documentData.SunjectID,
//                   documentData.PartID
//                 )
//               }
//               className="label theme-bg text-white f-12"
//             >
//               View
//             </a>

//             {/* <a
//               href={DEMO.BLANK_LINK}
//               onClick={() => this.VisibleFalse()}
//               className="label theme-bg text-white f-12"
//             >
//               Close
//             </a> */}
//           </td>
//         </tr>
//       );
//     });
//   }
// }

// const mapStateToProps = (state) => {
//   return {
//     data: state.loggedReducer,
//   };
// };

// export default connect(mapStateToProps)(Notification);
