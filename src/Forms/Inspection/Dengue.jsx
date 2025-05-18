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
import Province from "../CommanData/Province";
import Districts from "../CommanData/District";
import DivisionalSecretariats from "../CommanData/DivisionalSecretariats";
import { param } from "jquery";

export class Dengue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FeedbackID: 0,
      jFeedback: {
        //  FormID: this.generateFormID(),
      },
      DocReadOnly: false,
      jlCustomers: [],
      // jPHI: [],
      userName:"",
      ApplicationAttachment: [],
      UploadAttchment: false,
      jFeedbackAttachment: [],
      jFeedbackAConcerns: [],
      FileInfo: {},
      DocViewList: false,
      SelectedID: 0,
      LoadPanelVisible: false,
      ListViewing: false,
      DocumentID: 2,
      jFeedbackAction: [],
      FormData: [],
      isEdit: true,
    };
    this.FormRef = React.createRef();
    this.FormRef2 = React.createRef();
    this.jStatusList = [
      { ID: "1", Name: "Active" },
      { ID: "2", Name: "Inactive" },
      { ID: "3", Name: "Completed" },
    ];
    this.jSituationType = [
      { ID: "1", Name: "No Complaint" },
      { ID: "2", Name: "Complaint Issued" },
    ];
    this.AnswerResult = [
      { ID: "1", Name: "Yes" },
      { ID: "2", Name: "No" },
      // { ID: 3, Name: "Good" },
      // { ID: 4, Name: "Better" },
      // { ID: 5, Name: "Best" },
    ];

    this.RiskLevel = [
      { ID: "1", Name: "Low" },
      { ID: "2", Name: "Medium" },
      { ID: "3", Name: "High" },
    ];

    this.waseDisposed = [
      { ID: "1", Name: "General Waste" },
      { ID: "2", Name: "Recycling " },
      { ID: "3", Name: "Food Waste " },
      { ID: "4", Name: "Hazardous Waste " },
      { ID: "5", Name: "Garden Waste " },
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

  generateFormID() {
    const now = new Date();
    return (
      "FORM-" +
      now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, "0") +
      now.getDate().toString().padStart(2, "0") +
      now.getHours().toString().padStart(2, "0") +
      now.getMinutes().toString().padStart(2, "0") +
      now.getSeconds().toString().padStart(2, "0")
    );
  }

  OnNotification = (message, type) => {
    notify({
      message: message,
      type: type,
      displayTime: 3000,
      position: { at: "top right", offset: "50" },
    });
  };

  OnSaveValidation = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      this.state.jFeedback.PhiID == "" ||
      this.state.jFeedback.PhiID == NaN ||
      this.state.jFeedback.PhiID == undefined
    ) {
      this.OnNotification("PHI ID is Required", "error");
      return false;
    } else if (
      this.state.jFeedback.HouseOwnerName == "" ||
      this.state.jFeedback.HouseOwnerName == NaN ||
      this.state.jFeedback.HouseOwnerName == undefined
    ) {
      this.OnNotification("House Owner Name is Required", "error");
      return false;
    } else if (
      this.state.jFeedback.CusIdentificationNo == "" ||
      this.state.jFeedback.CusIdentificationNo == NaN ||
      this.state.jFeedback.CusIdentificationNo == undefined
    ) {
      this.OnNotification("NIC is Required", "error");
      return false;
    } else if (
      this.state.jFeedback.CusContactNo == "" ||
      this.state.jFeedback.CusContactNo == NaN ||
      this.state.jFeedback.CusContactNo == undefined
    ) {
      this.OnNotification("Contact No is Required", "error");
      return false;
    } else if (
      this.state.jFeedback.FillDate == "" ||
      this.state.jFeedback.FillDate == NaN ||
      this.state.jFeedback.FillDate == undefined
    ) {
      this.OnNotification("Submission Date is Required", "error");
      return false;
    } else if (
      this.state.jFeedback.CusEmail == "" ||
      this.state.jFeedback.CusEmail == NaN ||
      this.state.jFeedback.CusEmail == undefined
    ) {
      this.OnNotification("Email is Required", "error");
      return false;
    } else if (
      this.state.jFeedback.Address == "" ||
      this.state.jFeedback.Address == NaN ||
      this.state.jFeedback.Address == undefined
    ) {
      this.OnNotification("Address is Required", "error");
      return false;
    } else if (!emailRegex.test(this.state.jFeedback.CusEmail.trim())) {
      this.OnNotification("Invalid Email", "error");
      return false;
    } else {
      return true;
    }
  };

  onSaveClick = async () => {
    if (await this.OnSaveValidation()) {
      Swal.fire({
        type: "info",
        showCancelButton: true,
        text: "Do you want to save ?",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((res) => {
        if (true) {
          if (res.value) {
            try {
              axios
                .post("/api/addDengueForm", {
                  Feedback: JSON.stringify(this.state.jFeedback),
                  FeedbackAConcerns: JSON.stringify(
                    this.state.jFeedbackAConcerns
                  ),
                  ApplicationAttachment: JSON.stringify(
                    this.state.ApplicationAttachment
                  ),
                })
                .then((response) => {
                  Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "User details saved successfully!",
                  }).then(async (res) => {
                    const getUsers = await axios.get("/api/getAllFormData",
                         {
            params: { PhiID: this.state.userName },
          },
                    );
                    this.setState({
                      FormData: getUsers.data,
                    });
                    this.setState((prevState) => ({
                      ...prevState,
                      jFeedback: {
                        FormID: this.generateFormID(),
                      },
                      jFeedbackAConcerns: [],
                      ApplicationAttachment: [],
                    }));
                  });
                })
                .catch((error) => {
                  console.error(error);
                  this.onLoadPanelHiding("Something went wrong", "error");
                });
            } catch (error) {
              console.log(error);
            }
          }
        }
      });
    }
  };

  onUploadUploadAttchmentClick = (e, FileName, FilePath, AttachmentID) => {
    let Id = 0;

    this.setState({ UploadAttchment: !this.state.UploadAttchment }, () => {
      if (this.state.UploadAttchment) {
        Id = e.row.data.AttachmentID;

        this.setState({
          FileInfo: e.row.data,
        });
      }
      let FileName_ = FileName + "";
      let Count = 0;
      if (!this.state.ListViewing) {
        for (var i = 0; i < this.state.ApplicationAttachment.length; i++) {
          // if (
          //   this.state.ApplicationAttachment[i].AttachmentID == AttachmentID
          // ) {
          Count = i;
          // console.log("AWAAA loop", e);
          // console.log("AWAAA1 loop", FileName);
          // this.state.ApplicationAttachment[Count].AttachmentFilePath =
          //   FileName + "";
          // this.state.ApplicationAttachment[Count].AttachmentName = e;
          // }
        }

        this.state.ApplicationAttachment[Count].AttachmentFilePath =
          FileName + "";
        this.state.ApplicationAttachment[Count].AttachmentName = e;
        this.setState((prevState) => ({
          ApplicationAttachment: this.state.ApplicationAttachment,
        }));
      }
    });
  };

  

  onAppViewClick = async (e) => {
    const filePath = e.row.data.AttachmentFilePath;

    if (!filePath) {
      this.onLoadPanelHiding("Please select the file", "error");
      return;
    }

    try {
      const response = await axios.get("/api/viewFile", {
        responseType: "blob",
        params: { FilePath: filePath },
      });

      // Get file extension
      const extension = filePath.split(".").pop().toLowerCase();

      // Map extension to MIME type
      const mimeTypes = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        bmp: "image/bmp",
        svg: "image/svg+xml",
        pdf: "application/pdf",
      };

      const mimeType = mimeTypes[extension] || "application/octet-stream";

      const blob = new Blob([response.data], { type: mimeType });
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, "_blank");
    } catch (error) {
      console.error("Error opening file", error);
      this.onLoadPanelHiding("Failed to open file", "error");
    }
  };

  componentDidMount = async () => {
    const authData = JSON.parse(localStorage.getItem("user"));
    console.log("authData", authData.UserName);

    const checkAuthentication = await axios.get(
      "/api/CheckUserAuthentication",
      {
        params: {
          UserGroup: authData.UserGroup,
          MenuID: this.state.DocumentID,
        },
      }
    );
    if (checkAuthentication.data[0].IsEdit == 1) {
      this.setState({
        userName: authData.UserName,
        isEdit: false,
      });

      axios
        .all([
          axios.get("/api/gePHIDetails", {
            params: { UserName: authData.UserName },
          }),
          axios.get("/api/getAllFormData",
          {
            params: { PhiID: authData.UserName },
          }),
        ])
        .then(
          axios.spread((phiRes, formRes) => {
          if (phiRes.data.length != 0 || formRes.data.length != 0) {
            this.setState((prevState) => ({
              ...prevState,
              jFeedback: {
                FormID: this.generateFormID(),
                PhiID: phiRes.data[0].Name,
                Province: phiRes.data[0].Province,
                District: phiRes.data[0].District,
                DiviSector: phiRes.data[0].DiviSector,
              },
              FormData: formRes.data,
            }));
          }
          })


        )
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  };

  updatePRTable = async (e) => {
    const headerDetails = await axios.get("/api/getHeadrerDetails", {
      params: { FormID: e.data.FormID },
    });
    const Conserns = await axios.get("/api/getConserns", {
      params: { FormID: e.data.FormID },
    });

    const AttachmentDetails = await axios.get("/api/getAttachment", {
      params: { FormID: e.data.FormID },
    });

    this.setState({
      jFeedback: headerDetails.data[0],
      jFeedbackAConcerns: Conserns.data,
      ApplicationAttachment: AttachmentDetails.data,
    });
  };

  onClearClick = () => {
    this.setState((prevState) => ({
      ...prevState,
      jFeedback: {
        FormID: this.generateFormID(),
      },
      jFeedbackAConcerns: [],
      ApplicationAttachment: [],
    }));
  };

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
        <Card title='Inspection Form'>
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
                editorOptions={{
                  readOnly: true,
                }}
                // editorType='dxSelectBox'
                // editorOptions={{
                //   items: this.state.jPHI,
                //   valueExpr: "ID",
                //   displayExpr: "Name",
                // }}
              >
                <Label text='PHI ID' />
                <RequiredRule message='Field is required to fill' />
              </Item>
              {/* <Item
                dataField='ImpotentType'
                editorType='dxSelectBox'
                editorOptions={{
                  items: this.jSituationType,
                  valueExpr: "ID",
                  displayExpr: "Name",
                }}
              >
                <Label text='Situation Type' />
              </Item> */}
              <Item dataField='FillDate' editorType='dxDateBox'>
                <Label text='Submission Date' />
                <RequiredRule message='Field is required to fill' />
              </Item>
            </GroupItem>
            <GroupItem caption='Household Owner Details' colCount={2}>
              <Item dataField='HouseOwnerName'>
                <RequiredRule message='Field is required to fill' />
                <Label text='Household Owner Name' />
              </Item>

              <Item
                dataField='Province'
                editorType='dxSelectBox'
                editorOptions={{
                  readOnly: true,
                  // searchEnabled: true,
                  items: Province,
                  valueExpr: "ID",
                  displayExpr: "Name",
                  onValueChanged: this.handleProvinceChange,
                }}
              >
                <Label text='Province' />
              </Item>

              <Item
                dataField='District'
                editorType='dxSelectBox'
                editorOptions={{
                  readOnly: true,
                  //searchEnabled: true,
                  items: this.state.filteredDistricts,
                  valueExpr: "ID",
                  displayExpr: "Name",
                  disabled: !this.state.selectedProvince,
                  onValueChanged: this.handleDistrictChange,
                }}
              >
                <Label text='District' />
              </Item>

              <Item
                dataField='DiviSector'
                editorType='dxSelectBox'
                editorOptions={{
                  readOnly: true,
                  // searchEnabled: true,
                  items: this.state.filteredDivSectors,
                  valueExpr: "ID",
                  displayExpr: "Name",
                  disabled: !this.state.selectedDistrict,
                }}
              >
                <Label text='Divisional Sectors' />
              </Item>

              <Item dataField='CusIdentificationNo'>
                <RequiredRule message='Field is required to fill' />
                <Label text='NIC No' />
              </Item>
              <Item dataField='CusEmail'>
                <Label text='Email' />
                <RequiredRule message='Field is required to fill' />
              </Item>
              <Item dataField='CusContactNo' editorType='dxNumberBox'>
                <RequiredRule message='Field is required to fill' />
                <Label text='Mobile No' />
              </Item>
              <Item dataField='Address' editorType='dxTextArea'>
                <Label text='Address' />
                <RequiredRule message='Field is required to fill' />
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
              <Item
                dataField='ImpotentType'
                editorType='dxSelectBox'
                editorOptions={{
                  items: this.jSituationType,
                  valueExpr: "ID",
                  displayExpr: "Name",
                }}
              >
                <Label text='Situation Type' />
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
            dataSource={this.state.jFeedbackAConcerns}
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
            <Column dataField='ConcernsID' editorOptions={{ readOnly: true }} />
            <Column dataField='Concerns' />
            <Column dataField='Answer' caption='Status'>
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
          {/* <DataGrid
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
            /> 
            </Card><Column
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
          </DataGrid>  */}

          <DataGrid
            id='grid-list'
            keyExpr='AttachmentID'
            showBorders={true}
            wordWrapEnabled={true}
            allowSearch={true}
            hoverStateEnabled={true}
            dataSource={this.state.ApplicationAttachment}
            onRowRemoving={this.handleAttachmentDeleteClick}
          >
            <Editing
              mode='popup'
              allowDeleting={true}
              allowAdding={true}
              allowUpdating={true}
              useIcons={true}
            >
              <Popup
                title='Add Your Attachment Information'
                showTitle={true}
              ></Popup>
            </Editing>
            <SearchPanel visible={true} />
            <GroupPanel visible={true} />
            <Paging defaultPageSize={20} />
            <Column dataField='Name' />
            <Column
              dataField='AttachmentID'
              editorOptions={{ readOnly: true }}
            />
            <Column
              dataField='AttachmentFilePath'
              editorOptions={{ readOnly: true }}
            />
            <Column
              dataField='AttachmentName'
              editorOptions={{ readOnly: true }}
            />
            {/* <Validator>
              <CustomRule
                validationCallback={this.validateBRCopy}
                message="Business Registration Copy is mandatory!"
              />
            </Validator> */}
            <Column
              caption='Actions'
              type='buttons'
              buttons={[
                {
                  hint: "Upload",
                  icon: "upload",
                  visible: true,
                  //onClick: this.onUploadUploadAttchmentClick,
                  onClick: (e) =>
                    this.onUploadUploadAttchmentClick(
                      e,
                      e.row.data.AttachmentName,
                      e.row.data.AttachmentFilePath,
                      e.row.data.AttachmentID
                    ),
                },
                "edit",
                {
                  hint: "View",
                  icon: "fa fa-eye",
                  onClick: this.onAppViewClick,
                },
                // "delete",
              ]}
            />
          </DataGrid>

          <Navbar bg='light' variant='light'>
            <Button
              variant='dark'
              icon='feather icon-layers'
              style={{
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
              }}
              onClick={this.onSaveClick}
              disabled={this.state.isEdit}
            >
              Save
            </Button>
            <Button
              variant='dark'
              icon='feather icon-layers'
              style={{
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
              }}
              onClick={this.onClearClick}
              disabled={this.state.isEdit}
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

        <Card title='Form List'>
          <DataGrid
            dataSource={this.state.FormData}
            showBorders={true}
            wordWrapEnabled={true}
            allowSearch={true}
            selection={{ mode: "single" }}
            hoverStateEnabled={true}
            onCellDblClick={this.updatePRTable}
            allowColumnResizing={true}
            columnAutoWidth={true}
          >
            <SearchPanel visible={true} />
            <Paging defaultPageSize={20} />
            <Column dataField='FormID' caption='Form ID' />
            <Column dataField='PhiID' caption='Phi ID'>
              {/* <Lookup
                items={PRType}
                valueExpr='PRTypeCode'
                displayExpr='Discription'
              /> */}
            </Column>
            <Column dataField='ImpotentType' caption='Impotent Type' />
            <Column dataField='ApprovalStatus' caption='Approval Status' />
            <Column
              dataField='followUpDate'
              editorType='dxDateBox'
              caption='Follow UpDate'
              format='dd/MM/yyyy'
              customizeText={(cellInfo) => {
                let formattedDate = null;
                if (cellInfo.value != null) {
                  const date = new Date(cellInfo.value);
                  formattedDate = `${date.getDate()}/${
                    date.getMonth() + 1
                  }/${date.getFullYear()}`;
                }
                return formattedDate;
              }}
            ></Column>
          </DataGrid>
        </Card>

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
  return {
    data: state.loggedReducer,
  };
};

export default connect(mapStateToProps)(Dengue);
//export default Feedback;
