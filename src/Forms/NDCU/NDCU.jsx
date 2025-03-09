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
import notify from "devextreme/ui/notify";
import Swal from "sweetalert2";
import axios from "axios";
import { connect } from "react-redux";
import SelectBox from "devextreme-react/select-box";
import Province from "../CommanData/Province";
import Districts from "../CommanData/District";
import DivisionalSecretariats from "../CommanData/DivisionalSecretariats";

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
      filteredDistricts: Districts[provinceID] || [],
    });
  };

  handleDistrictChange = (e) => {
    const districtID = e.value;
    this.setState({
      selectedDistrict: districtID,
      filteredDivSectors: DivisionalSecretariats[districtID] || [],
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
                  searchEnabled={true}
                  items={Province}
                  valueExpr='ID'
                  displayExpr='Name'
                  onValueChanged={this.handleProvinceChange}
                />
              </Item>

              {/* District Dropdown (Filtered) */}
              <Item dataField='District'>
                <Label text='District' />
                <SelectBox
                  searchEnabled={true}
                  items={this.state.filteredDistricts}
                  valueExpr='ID'
                  displayExpr='Name'
                  disabled={!this.state.selectedProvince}
                  onValueChanged={this.handleDistrictChange}
                />
              </Item>

              <Item dataField='DivSectors'>
                <Label text='Divisional Sectors' />
                <SelectBox
                  searchEnabled={true}
                  items={this.state.filteredDivSectors}
                  valueExpr='ID'
                  displayExpr='Name'
                  disabled={!this.state.selectedDistrict}
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
            <Column dataField='Date' dataType='date' />
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
