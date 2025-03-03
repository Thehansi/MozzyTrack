// import React, { Component, Fragment } from "react";
// import Modal from "react-bootstrap/Modal";
// import { Button } from "react-bootstrap";
// import DataGrid, {
//   Column,
//   SearchPanel,
//   GroupPanel,
//   Paging,
// } from "devextreme-react/data-grid";

// export class Parameter extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       SelectID: 0,
//       Type: 0,
//     };
//   }

//   componentDidMount() {}

//   onSelectionChanged = (e) => {
//     console.log(e);
//     this.setState({
//       SelectID: e.selectedRowsData[0].AutoID,
//       Type: e.selectedRowsData[0].Type,
//     });
//   };

//   onSelectClick = (e) => {
//     this.props.OnHide(this.state.SelectID, this.state.Type);
//   };

//   onCloseClick = (e) => {
//     this.props.OnHide(0);
//   };

//   customizeItem(item) {
//     if(item.itemType == "simple") {

//     }
// }

//   render() {
//     return (
//       <Fragment>
//         <Modal
//           size="xl"
//           show={this.props.Show}
//           onHide={this.onCloseClick}
//           backdrop="static"
//           keyboard={false}
//         >
//           <Modal.Header closeButton>
//             <Modal.Title>List of Parameter</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//           <Form
//                 formData={this.props.Parameter}
//                 customizeItem={this.customizeItem}>
//             </Form>

//             <br></br>
//             <br></br>

//             <Button variant="secondary" onClick={this.onSelectClick}>
//               Open
//             </Button>
//             <Button
//               variant="secondary"
//               onClick={this.onCloseClick}
//               icon="feather icon-layers"
//             >
//               Close
//             </Button>
//           </Modal.Body>
//         </Modal>
//       </Fragment>
//     );
//   }
// }

// export default Parameter;
