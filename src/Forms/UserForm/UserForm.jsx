import Form, {
  Item,
  GroupItem,
  Label,
  RequiredRule,
} from "devextreme-react/form";
import React, { Component } from "react";
import Card from "../../App/components/MainCard";
//import { Button, Navbar } from "react-bootstrap";
//import List from "./FeedbackList";
import { LoadPanel } from "devextreme-react";
import DataGrid, {
  Column,
  SearchPanel,
  GroupPanel,
  Paging,
  Editing,
  Lookup,
  Popup,
} from "devextreme-react/data-grid";
import { FileUploader } from "devextreme-react";
import notify from "devextreme/ui/notify";
import Swal from "sweetalert2";
import axios from "axios";
import { connect } from "react-redux";
import SelectBox from "devextreme-react/select-box";
import { TextBox } from "devextreme-react/text-box";
import { Button } from "devextreme-react/button";

export class Household extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FeedbackID: 0,
      jFeedback: {},
      DocReadOnly: false,
      jlCustomers: [],
      jlUser: [],
      jFormList: [],
      UploadAttchment: false,
      FileInfo: {},
      DocViewList: false,
      SelectedID: 0,
      //  FeedbackList: [],
      LoadPanelVisible: false,
      ListViewing: false,
      DocumentID: 5002,
      jFeedbackAction: [],
      messages: [], // Ensure messages is an array
      newMessage: "",
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.FormRef = React.createRef();
    this.FormRef2 = React.createRef();
    this.jStatusList = [
      { ID: 1, Name: "Active" },
      { ID: 2, Name: "Inactive" },
      { ID: 3, Name: "Completed" },
    ];
  }
  get FormLayout() {
    return this.FormRef.current.instance;
  }
  get FormLayout2() {
    return this.FormRef2.current.instance;
  }

  handleProvinceChange = (e) => {
    const provinceID = e.value;
    this.setState({
      selectedProvince: provinceID,
      filteredDistricts: this.jDistricts[provinceID] || [],
    });
  };

  sendMessage() {
    if (this.state.newMessage.trim() === "") return;

    const newMsg = {
      user: "You", // You can replace this with a dynamic user
      text: this.state.newMessage,
    };

    this.setState((prevState) => ({
      messages: [...prevState.messages, newMsg],
      newMessage: "", // Clear input field after sending
    }));
  }

  render() {
    return (
      <div>
        <Card title='Household Owner Details'>
          <Form
            onContentReady={this.validateForm}
            ref={this.FormRef}
            formData={this.state.jFeedback}
          ></Form>

          <br />
          <Form>
            <GroupItem caption='Complain Details' colCount={2}></GroupItem>
          </Form>
          <DataGrid
            id='grid-list'
            keyExpr='ConcernsID'
            showBorders={true}
            wordWrapEnabled={true}
            allowSearch={true}
            selection={{ mode: "single" }}
            hoverStateEnabled={true}
            dataSource={this.state.jFormList}
          >
            <Editing
              mode='popup'
              allowDeleting={true}
              allowAdding={true}
              allowUpdating={true}
              useIcons={true}
            >
              <Popup title='Complain Details List' showTitle={true}></Popup>
            </Editing>
            <SearchPanel visible={true} />
            <GroupPanel visible={true} />
            <Paging defaultPageSize={6} />
            <Column dataField='ComplainID' />
            <Column dataField='SituationType' />
            <Column dataField='Date' />
            <Column dataField='HouseholdName' />
            <Column dataField='ImmediateActionTaken' />
            <Column dataField='NextFollowUpDate' />
            <Column dataField='NICNo' />
          </DataGrid>
        </Card>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  console.log(state.loggedReducer);
  return {
    data: state.loggedReducer,
  };
};

export default connect(mapStateToProps)(Household);
//export default Feedback;
