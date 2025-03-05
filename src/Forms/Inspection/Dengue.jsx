import Form, {
  Item,
  GroupItem,
  Label,
  RequiredRule,
} from "devextreme-react/form";
import React, { Component } from "react";
import Card from "../../App/components/MainCard";
import { Button, Navbar } from "react-bootstrap";
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
import UploadAttchment from "../UploadAttachmentTemplate/UploadAttchment";
import { connect } from "react-redux";
import { RadioGroup } from "devextreme-react/radio-group";

export class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FeedbackID: 0,
      jFeedback: {},
      DocReadOnly: false,
      jlCustomers: [],
      jlUser: [],
      jFeedbackAttachment: [],
      UploadAttchment: false,
      FileInfo: {},
      DocViewList: false,
      SelectedID: 0,
      //  FeedbackList: [],
      LoadPanelVisible: false,
      ListViewing: false,
      DocumentID: 5002,
      jFeedbackAction: [],
    };
    this.FormRef = React.createRef();
    this.FormRef2 = React.createRef();
    this.jStatusList = [
      { ID: 1, Name: "Active" },
      { ID: 2, Name: "Inactive" },
      { ID: 3, Name: "Completed" },
    ];
    this.jFeedBAckType = [
      { ID: 1, Name: "Feed Back Form" },
      { ID: 2, Name: "Server" },
    ];
    this.AnswerResult = [
      { ID: 1, Name: "Yes" },
      { ID: 2, Name: "No" },
      // { ID: 3, Name: "Good" },
      // { ID: 4, Name: "Better" },
      // { ID: 5, Name: "Best" },
    ];

    this.RiskLevel = [
      { ID: 1, Name: "Low" },
      { ID: 2, Name: "Medium" },
      { ID: 3, Name: "High" },
    ];

    this.waseDisposed = [
      { ID: 1, Name: "General Waste" },
      { ID: 2, Name: "Recycling " },
      { ID: 3, Name: "Food Waste " },
      { ID: 4, Name: "Hazardous Waste " },
      { ID: 5, Name: "Garden Waste " },
    ];

    this.mimeTypes = {
      txt: "text/plain",
      html: "text/html",
      css: "text/css",
      js: "application/javascript",
      json: "application/json",
      xml: "application/xml",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ppt: "application/vnd.ms-powerpoint",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    };
  }
  get FormLayout() {
    return this.FormRef.current.instance;
  }
  get FormLayout2() {
    return this.FormRef2.current.instance;
  }

  render() {
    return (
      <div>
        <Card title='Feedback'>
          <Form
            onContentReady={this.validateForm}
            ref={this.FormRef}
            formData={this.state.jFeedback}
          >
            <GroupItem caption='General Details' colCount={2}>
              <Item
                dataField='FormID'
                editorOptions={{
                  readOnly: true,
                }}
              ></Item>
              <Item
                dataField='PhiID'
                // editorOptions={{
                //   readOnly: true,
                // }}
              >
                <Label text='PHI ID' />
                <RequiredRule message='Field is required to fill' />
              </Item>
              <Item
                dataField='ImpotentType'
                editorType='dxSelectBox'
                editorOptions={{
                  items: this.jFeedBAckType,
                  valueExpr: "ID",
                  displayExpr: "Name",
                }}
              >
                <RequiredRule message='Field is required to fill' />
                <Label text='Situation Type' />
              </Item>
              {/* <Item
                dataField='Status'
                editorType='dxSelectBox'
                editorOptions={{
                  items: this.jStatusList,
                  valueExpr: "ID",
                  displayExpr: "Name",
                }}
              >
                <RequiredRule message='Field is required to fill' />
              </Item> */}
              <Item dataField='FillDate' editorType='dxDateBox'>
                <Label text='Submission Date' />
              </Item>
            </GroupItem>
            <GroupItem caption='Customer Details' colCount={2}>
              <Item
                dataField='CustomerName'
                // editorType='dxSelectBox'
                // editorOptions={{
                //   items: this.state.jlCustomers,
                //   valueExpr: "CardCode",
                //   displayExpr: "CardCode",
                //   onValueChanged: this.onCustomerChanged,
                // }}
              >
                <RequiredRule message='Field is required to fill' />
                <Label text='Customer Name' />
              </Item>

              <Item dataField='CusIdentificationNo'>
                <RequiredRule message='Field is required to fill' />
                <Label text='NIC No' />
              </Item>
              <Item dataField='CusEmail'>
                <Label text='Email' />
              </Item>
              <Item dataField='CusContactNo'>
                <Label text='Mobile No' />
              </Item>
            </GroupItem>
          </Form>

          <Form ref={this.FormRef} formData={this.state.jFeedback}>
            <GroupItem caption='Dengue Inspection Form'>
              <Item
                dataField='Question1'
                editorType='dxRadioGroup'
                editorOptions={{
                  items: this.AnswerResult,
                  valueExpr: "ID",
                  displayExpr: "Name",
                  layout: "horizontal",
                }}
              >
                <Label text='Are there any stagnant water collections in the premises?' />
              </Item>
              <Item dataField='Remark1' editorType='dxTextArea'>
                <Label text='Remark' />
              </Item>
              <Item
                dataField='Question2'
                editorType='dxRadioGroup'
                editorOptions={{
                  items: this.AnswerResult,
                  valueExpr: "ID",
                  displayExpr: "Name",
                  layout: "horizontal",
                }}
              >
                <Label text='Are there discarded tries,coconut shells,or plastic waste in open areas?' />
              </Item>
              <Item dataField='Remark2' editorType='dxTextArea'>
                <Label text='Remark' />
              </Item>
              <Item
                dataField='Question3'
                editorType='dxRadioGroup'
                editorOptions={{
                  items: this.AnswerResult,
                  valueExpr: "ID",
                  displayExpr: "Name",
                  layout: "horizontal",
                }}
              >
                <Label text='Are there uncovered water storage containers?' />
              </Item>
              <Item dataField='Remark3' editorType='dxTextArea'>
                <Label text='Remark' />
              </Item>
              <Item
                dataField='Question4'
                editorType='dxRadioGroup'
                editorOptions={{
                  items: this.AnswerResult,
                  valueExpr: "ID",
                  displayExpr: "Name",
                  layout: "horizontal",
                }}
              >
                <Label text='Are mosquito larvae found in any water holding containers?' />
              </Item>
              <Item dataField='Remark4' editorType='dxTextArea'>
                <Label text='Remark' />
              </Item>
              <Item
                dataField='Question5'
                editorType='dxRadioGroup'
                editorOptions={{
                  items: this.AnswerResult,
                  valueExpr: "ID",
                  displayExpr: "Name",
                  layout: "horizontal",
                }}
              >
                <Label text='Have dengue cases been reported in this household before?' />
              </Item>
              <Item dataField='Remark5' editorType='dxTextArea'>
                <Label text='If yes, how many residents were affected?' />
              </Item>

              <Item
                dataField='Question7'
                editorType='dxRadioGroup'
                editorOptions={{
                  items: this.AnswerResult,
                  valueExpr: "ID",
                  displayExpr: "Name",
                  layout: "horizontal",
                }}
              >
                <Label text='Are there any water-filled potholes or drains nearby?' />
              </Item>
              <Item dataField='Remark7' editorType='dxTextArea'>
                <Label text='Remark' />
              </Item>
              <Item
                dataField='Question8'
                editorType='dxRadioGroup'
                editorOptions={{
                  items: this.AnswerResult,
                  valueExpr: "ID",
                  displayExpr: "Name",
                  layout: "horizontal",
                }}
              >
                <Label text='Are there unused household items that collect water??' />
              </Item>
              <Item dataField='Remark8' editorType='dxTextArea'>
                <Label text='Remark' />
              </Item>
              <Item
                dataField='Question9'
                editorType='dxSelectBox'
                editorOptions={{
                  items: this.waseDisposed,
                  valueExpr: "ID",
                  displayExpr: "Name",
                  // layout: "horizontal",
                }}
              >
                <Label text='How is household waste disposed of?' />
              </Item>

              <Item
                dataField='Question10'
                editorType='dxRadioGroup'
                editorOptions={{
                  items: this.AnswerResult,
                  valueExpr: "ID",
                  displayExpr: "Name",
                  layout: "horizontal",
                }}
              >
                <Label text='If there a proper waste segregation system?' />
              </Item>
              <Item dataField='Remark10' editorType='dxTextArea'>
                <Label text='Remark' />
              </Item>
              <Item
                dataField='Question11'
                editorType='dxRadioGroup'
                editorOptions={{
                  items: this.AnswerResult,
                  valueExpr: "ID",
                  displayExpr: "Name",
                  layout: "horizontal",
                }}
              >
                <Label text='Do household members use mosquito nets?' />
              </Item>
              <Item dataField='Remark11' editorType='dxTextArea'>
                <Label text='Remark' />
              </Item>
              <Item
                dataField='Question12'
                editorType='dxRadioGroup'
                editorOptions={{
                  items: this.RiskLevel,
                  valueExpr: "ID",
                  displayExpr: "Name",
                  layout: "horizontal",
                }}
              >
                <Label text='Dengue Risk level for the Household?' />
              </Item>
              <Item dataField='Remark12' editorType='dxTextArea'>
                <Label text='Remark' />
              </Item>
              <Item
                dataField='Question13'
                editorType='dxSelectBox'
                editorOptions={{
                  items: this.AnswerResult,
                  valueExpr: "ID",
                  displayExpr: "Name",
                }}
              >
                <Label text='Immediate Action Taken?' />
              </Item>

              <Item dataField='followUpDate' editorType='dxDateBox'>
                <Label text='Next Follow-up Date' />
              </Item>

              <Item dataField='InspectionNotes' editorType='dxTextArea'>
                <Label text='Inspection Notes' />
              </Item>
            </GroupItem>
          </Form>

          <br />
          <Form>
            <GroupItem caption='Additional Concerns' colCount={2}></GroupItem>
          </Form>
          <DataGrid
            id='grid-list'
            keyExpr='ConcernsID'
            showBorders={true}
            wordWrapEnabled={true}
            allowSearch={true}
            selection={{ mode: "single" }}
            hoverStateEnabled={true}
            dataSource={this.state.jFeedbackAttachment}
          >
            <Editing
              mode='popup'
              allowDeleting={true}
              allowAdding={true}
              allowUpdating={true}
              useIcons={true}
            >
              <Popup title='Add Concerns' showTitle={true}></Popup>
            </Editing>
            <SearchPanel visible={true} />
            <GroupPanel visible={true} />
            <Paging defaultPageSize={6} />
            <Column dataField='Concerns' />
            <Column dataField='Answer' caption='Concerns'>
              <Lookup
                dataSource={this.AnswerResult}
                valueExpr='ID'
                displayExpr='Name'
              />
            </Column>
            <Column dataField='remark' caption='Remark'></Column>
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
                // {
                //   hint: "View",
                //   icon: "fa fa-eye",
                //   // onClick: this.onAppViewClick,
                // },
                "delete",
              ]}
            />
          </DataGrid>

          <br />
          <Form>
            <GroupItem
              caption='Report a Dengue Concern'
              colCount={2}
            ></GroupItem>
          </Form>
          <DataGrid
            id='grid-list'
            keyExpr='AttachmentID'
            showBorders={true}
            wordWrapEnabled={true}
            allowSearch={true}
            selection={{ mode: "single" }}
            hoverStateEnabled={true}
            dataSource={this.state.jFeedbackAttachment}
          >
            <Editing
              mode='popup'
              allowDeleting={true}
              allowAdding={true}
              allowUpdating={true}
              useIcons={true}
            >
              <Popup
                title='Add complaint/inquiry attachments'
                showTitle={true}
              ></Popup>
            </Editing>
            <SearchPanel visible={true} />
            <GroupPanel visible={true} />
            <Paging defaultPageSize={6} />
            <Column dataField='AttachmentName' />
            {/* <Column
              dataField='AttachmentName'
              editorOptions={{ readOnly: true }}
            /> */}
            <Column
              caption={"Actions"}
              type='buttons'
              buttons={[
                "edit",
                {
                  hint: "Upload",
                  icon: "upload",
                  visible: true,
                  // onClick: this.onUploadUploadAttchmentClick,
                },
                {
                  hint: "View",
                  icon: "fa fa-eye",
                  // onClick: this.onAppViewClick,
                },
                "delete",
              ]}
            />
          </DataGrid>

          <Navbar bg='light' variant='light'>
            <Button
              variant='dark'
              icon='feather icon-layers'
              //  onClick={this.onSaveClick}
              disabled={this.state.DocReadOnly}
            >
              Save
            </Button>
            <Button
              variant='dark'
              icon='feather icon-layers'
              // onClick={this.onClearClick}
            >
              Clear
            </Button>
            {/* <Button
              variant='dark'
              icon='feather icon-layers'
              onClick={this.onViewListClick}
              disabled={this.state.DocViewList}
            >
              View List
            </Button> */}
          </Navbar>
        </Card>

        {/* <LoadPanel
          message="Processing.... Please, wait..."
          shadingColor="rgba(0,0,0,0.4)"
          onHiding={this.onLoadPanelHiding}
          visible={this.state.LoadPanelVisible}
          showIndicator={true}
          shading={true}
          showPane={true}
          closeOnOutsideClick={false}
          width={500}
        /> */}
        {/* <List
          Show={this.state.ListViewing}
          OnHide={this.onViewListClick}
          //FeedbackList={this.state.FeedbackList}
        ></List>*/}

        <UploadAttchment
          ref={this.ReportRef}
          Show={this.state.UploadAttchment}
          OnHide={this.onUploadUploadAttchmentClick}
          FileInfo={this.state.FileInfo}
        ></UploadAttchment>
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

export default connect(mapStateToProps)(Feedback);
//export default Feedback;
