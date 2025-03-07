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

export class NDCU extends Component {
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

    this.FormRef = React.createRef();
    this.FormRef2 = React.createRef();
    this.jStatusList = [
      { ID: 1, Name: "Active" },
      { ID: 2, Name: "Inactive" },
      { ID: 3, Name: "Completed" },
    ];
    this.jProvince = [
      { ID: 1, Name: "Western Province" },
      { ID: 2, Name: "Central Province" },
      { ID: 3, Name: "Southern Province" },
      { ID: 4, Name: "Northern Province" },
      { ID: 5, Name: "Eastern Province" },
      { ID: 6, Name: "North Western Province" },
      { ID: 7, Name: "North Central Province" },
      { ID: 8, Name: "Uva Province" },
      { ID: 9, Name: "Sabaragamuwa Province" },
    ];

    this.jDistricts = {
      1: [
        { ID: 1, Name: "Colombo" },
        { ID: 2, Name: "Gampaha" },
        { ID: 3, Name: "Kalutara" },
      ],
      2: [
        { ID: 4, Name: "Kandy" },
        { ID: 5, Name: "Matale" },
        { ID: 6, Name: "Nuwara Eliya" },
      ],
      3: [
        { ID: 7, Name: "Galle" },
        { ID: 8, Name: "Matara" },
        { ID: 9, Name: "Hambantota" },
      ],
      4: [
        { ID: 10, Name: "Jaffna" },
        { ID: 11, Name: "Kilinochchi" },
        { ID: 12, Name: "Mannar" },
        { ID: 13, Name: "Vavuniya" },
        { ID: 14, Name: "Mullaitivu" },
      ],
      5: [
        { ID: 15, Name: "Trincomalee" },
        { ID: 16, Name: "Batticaloa" },
        { ID: 17, Name: "Ampara" },
      ],
      6: [
        { ID: 18, Name: "Kurunegala" },
        { ID: 19, Name: "Puttalam" },
      ],
      7: [
        { ID: 20, Name: "Anuradhapura" },
        { ID: 21, Name: "Polonnaruwa" },
      ],
      8: [
        { ID: 22, Name: "Badulla" },
        { ID: 23, Name: "Monaragala" },
      ],
      9: [
        { ID: 24, Name: "Ratnapura" },
        { ID: 25, Name: "Kegalle" },
      ],
    };

    this.jPhi = [];
    this.ApprovalStatus = [
      { ID: 1, Name: "Pending" },
      { ID: 2, Name: "Approve" },
      { ID: 3, Name: "Hold" },
      { ID: 4, Name: "Cancel" },
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

  render() {
    return (
      <div>
        <Card title='Complaint List'>
          <Form
            onContentReady={this.validateForm}
            ref={this.FormRef}
            formData={this.state.jFeedback}
          >
            <GroupItem caption='General Details' colCount={2}>
              <Item dataField='Province'>
                <Label text='Province' />
                <SelectBox
                  items={this.jProvince}
                  valueExpr='ID'
                  displayExpr='Name'
                  onValueChanged={this.handleProvinceChange}
                />
              </Item>

              {/* District Dropdown (Filtered) */}
              <Item dataField='District'>
                <Label text='District' />
                <SelectBox
                  items={this.state.filteredDistricts}
                  valueExpr='ID'
                  displayExpr='Name'
                  disabled={!this.state.selectedProvince}
                />
              </Item>
              <Item
                dataField='ImpotentType'
                editorType='dxSelectBox'
                editorOptions={{
                  items: this.jPhi,
                  valueExpr: "ID",
                  displayExpr: "Name",
                }}
              >
                <Label text='PHI' />
              </Item>
            </GroupItem>
          </Form>
          <br />
          <Form>
            <GroupItem caption='Complaint Details' colCount={2}></GroupItem>
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
              <Popup title='Complaint List' showTitle={true}></Popup>
            </Editing>
            <SearchPanel visible={true} />
            <GroupPanel visible={true} />
            <Paging defaultPageSize={6} />
            <Column dataField='FormID' />
            <Column dataField='SituationType' />
            <Column dataField='Date' />
            <Column dataField='CustomerName' />
            <Column dataField='ImmediateActionTaken' />
            <Column dataField='NextFollowUpDate' />
            <Column dataField='NICNo' />
            <Column dataField='ApprovalStatus' caption='Approval Status'>
              <Lookup
                dataSource={this.ApprovalStatus}
                valueExpr='ID'
                displayExpr='Name'
              />
            </Column>
            <Column
              caption={"Actions"}
              type='buttons'
              buttons={[
                "edit",
                {
                  hint: "Save",
                  icon: "save",
                  visible: true,
                  // onClick: this.onUploadUploadAttchmentClick,
                },
              ]}
            />
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

export default connect(mapStateToProps)(NDCU);
//export default Feedback;
