import React from "react";
import "./../../../assets/scss/style.scss";
import Aux from "../../../hoc/_Aux";
import Card from "../../../App/components/MainCard";
import Form, {
  Item,
  GroupItem,
  RequiredRule,
  Label,
  EmptyItem,
} from "devextreme-react/form";
import DataGrid, {
  Column,
  SearchPanel,
  GroupPanel,
  Paging,
  Editing,
  Popup,
  Form as GForm,
  Lookup,
} from "devextreme-react/data-grid";
import UploadNIC from "../../../Forms/UploadAttachmentTemplate/UploadNIC";
import UploadStoreLocation from "../../../Forms/UploadAttachmentTemplate/UploadStoreLocation";
import UploadAttchment from "../../../Forms/UploadAttachmentTemplate/UploadAttchment";
import FileUploader from "devextreme-react/file-uploader";
import { LoadPanel } from "devextreme-react";
import notify from "devextreme/ui/notify";
import Swal from "sweetalert2";
import axios from "axios";
var { v4: uuidv4 } = require("uuid");

class SignUp1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ApplicationID: 0,
      Application: {},
      ApplicantNames: [],

      ApplicationStoreLocation: [],
      ApplicationProductSold: [],
      ApplicationTransportInfomation: [],
      ApplicationAttachment: [
        {
          AttachmentID: 1,
          Name: "Access To Location Attachment",
          AttachmentFilePath: "",
          AttachmentName: "",
        },
        {
          AttachmentID: 2,
          Name: "Business Registration Attachment",
          AttachmentFilePath: "",
          AttachmentName: "",
        },
        {
          AttachmentID: 3,
          Name: "Office Facility Attachment",
          AttachmentFilePath: "",
          AttachmentName: "",
        },
        {
          AttachmentID: 4,
          Name: "Main Applicant Signature",
          AttachmentFilePath: "",
          AttachmentName: "",
        },
        {
          AttachmentID: 5,
          Name: "Applicant NIC",
          AttachmentFilePath: "",
          AttachmentName: "",
        },
      ],
      ApplicationRecomendationInformation: [],

      LoadPanelVisible: false,

      UploadNIC: false,
      UploadStoreLocation: false,
      UploadAttchment: false,
      FileInfo: {},
      Area: [],
    };
    this.FormRef = React.createRef();
    this.FormRef2 = React.createRef();

    this.LeaseOrOwn = [
      { ID: 1, Name: "Lease" },
      { ID: 2, Name: "Own" },
    ];
  }

  get FormLayout() {
    return this.FormRef.current.instance;
  }
  get FormLayout2() {
    return this.FormRef2.current.instance;
  }

  onSelectedFilesChanged = (e) => {
    let Temp = this.state.ApplicationAttachment;
    console.log("Temp 01", Temp);
    e.value.forEach(
      (element) => {
        console.log("element 02", element);

        let TempFileName = uuidv4() + "_" + element.name;

        console.log("TempFileName", TempFileName);

        Temp.push({
          AttcahmentName: TempFileName,
        });

        // axios
        //     .post("/api/application-attachment-upload", element, {
        //         params: {
        //             Folder: "layout",
        //             FileName: TempFileName,
        //         }
        //     },
        //     )
        //     .then((response) => {

        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     });
      },
      () => {
        this.setState({
          ApplicationAttachment: Temp,
        });
      }
    );

    console.log("e", e);
  };

  onLoadPanelHiding = (message, type) => {
    this.setState({
      LoadPanelVisible: false,
    });

    this.OnNotification(message, type);
  };

  OnNotification = (message, type) => {
    notify({
      message: message,
      type: type,
      displayTime: 3000,
      position: { at: "top right", offset: "50" },
    });
  };

  OnSaveValidation = () => {
    if (
      !this.FormLayout.validate().isValid &&
      !this.FormLayout2.validate().isValid
    ) {
      this.OnNotification("Fields marked with * are required", "error");
      return false;
    } else return true;
  };

  OnClearApplication = (e) => {
    this.setState(
      {
        ApplicationID: 0,
        Application: {},
        ApplicantNames: [],

        ApplicationStoreLocation: [],
        ApplicationProductSold: [],
        ApplicationTransportInfomation: [],
        ApplicationAttachment: [
          {
            AttachmentID: 1,
            Name: "Access To Location Attachment",
            AttachmentFilePath: "",
            AttachmentName: "",
          },
          {
            AttachmentID: 2,
            Name: "Business Registration Attachment",
            AttachmentFilePath: "",
            AttachmentName: "",
          },
          {
            AttachmentID: 3,
            Name: "Office Facility Attachment",
            AttachmentFilePath: "",
            AttachmentName: "",
          },
          {
            AttachmentID: 4,
            Name: "Main Applicant Signature",
            AttachmentFilePath: "",
            AttachmentName: "",
          },
          {
            AttachmentID: 5,
            Name: "Applicant NIC",
            AttachmentFilePath: "",
            AttachmentName: "",
          },
        ],
        ApplicationRecomendationInformation: [],

        LoadPanelVisible: false,

        UploadNIC: false,
        UploadStoreLocation: false,
        UploadAttchment: false,
        FileInfo: {},
        Area: [],
      },
      () => {
        this.componentDidMount();
      }
    );
  };

  // NOTE When page load bind the initial data
  componentDidMount = () => {
    this.setState({ LoadPanelVisible: true }, () => {
      axios
        .all([axios.get("/api/area-lookup")])
        .then(
          axios.spread((req) => {
            console.log("res area l168", req);
            this.setState(
              (prevState) => ({
                Area: req.data,
              }),
              () => this.setState({ LoadPanelVisible: false })
            );
          })
        )
        .catch((error) => console.log(error));
    });
  };

  /* NOTE This function call to save the application data */

  OnClickRegistration = (e) => {
    if (this.OnSaveValidation()) {
      Swal.fire({
        type: "info",
        showCancelButton: true,
        text: "Do you want to save ?",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((res) => {
        if (res.value) {
          this.setState({ LoadPanelVisible: true });
          this.serverRequest = axios
            .post("/api/application", {
              ApplicationID: this.state.ApplicationID,
              Application: JSON.stringify(this.state.Application),
              ApplicantNames: JSON.stringify(this.state.ApplicantNames),
              ApplicationStoreLocation: JSON.stringify(
                this.state.ApplicationStoreLocation
              ),
              ApplicationProductSold: JSON.stringify(
                this.state.ApplicationProductSold
              ),
              ApplicationTransportInfomation: JSON.stringify(
                this.state.ApplicationTransportInfomation
              ),
              ApplicationRecomendationInformation: JSON.stringify(
                this.state.ApplicationRecomendationInformation
              ),
              ApplicationAttachment: JSON.stringify(
                this.state.ApplicationAttachment
              ),
            })
            .then((response) => {
              this.onLoadPanelHiding("Successfully Saved", "success");
              //  this.OnClearApplication();
              this.setState({
                ApplicationID: response.data[0].ApplicationID,
              });
            })
            .catch((error) => {
              console.log(error);
            });
        } else if (res.dismiss == "cancel") {
        } else if (res.dismiss == "esc") {
        }
      });
    }
  };

  OnClickPrint = (e) => {
    console.log("print");
    let printContents = document.getElementById("card-sign-in").innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };

  OnClickBackToLogin = (e) => {
    window.open(`/`, "_self");
  };
  onUploadNICClick = (e, FileName, FilePath) => {
    let Id = 0;
    this.setState({ UploadNIC: !this.state.UploadNIC }, () => {
      if (this.state.UploadNIC) {
        Id = e.row.data.AutoID;
      }
      let FileName_ = FileName + "";
      let Count = 0;
      if (!this.state.ListViewing) {
        console.log(FileName_);
        for (var i = 0; i < this.state.ApplicantNames.length; i++) {
          if (this.state.ApplicantNames[i].AutoID == Id) {
            Count = i;
          }
        }

        this.state.ApplicantNames[Count].AttachmentFilePath = FilePath + "";
        this.state.ApplicantNames[Count].AttachmentName = FileName_;
        this.setState((prevState) => ({
          ApplicantNames: this.state.ApplicantNames,
        }));
      }
    });
  };

  onUploadStoreLocationClick = (e, FileName, FilePath) => {
    let Id = 0;
    this.setState(
      { UploadStoreLocation: !this.state.UploadStoreLocation },
      () => {
        if (this.state.UploadStoreLocation) {
          Id = e.row.data.AutoID;
        }
        let FileName_ = FileName + "";
        let Count = 0;
        if (!this.state.ListViewing) {
          console.log(FileName_);
          for (var i = 0; i < this.state.ApplicationStoreLocation.length; i++) {
            if (this.state.ApplicationStoreLocation[i].AutoID == Id) {
              Count = i;
            }
          }

          this.state.ApplicationStoreLocation[Count].AttachmentFilePath =
            FilePath + "";
          this.state.ApplicationStoreLocation[Count].AttachmentName = FileName_;
          this.setState((prevState) => ({
            ApplicationStoreLocation: this.state.ApplicationStoreLocation,
          }));
        }
      }
    );
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
        console.log(FileName_);
        for (var i = 0; i < this.state.ApplicationAttachment.length; i++) {
          if (
            this.state.ApplicationAttachment[i].AttachmentID == AttachmentID
          ) {
            Count = i;
          }
        }

        this.state.ApplicationAttachment[Count].AttachmentFilePath =
          FilePath + "";
        this.state.ApplicationAttachment[Count].AttachmentName = FileName_;
        this.setState((prevState) => ({
          ApplicationAttachment: this.state.ApplicationAttachment,
        }));
      }
    });
  };

  render() {
    return (
      <Aux>
        <div className="card-sign-in">
          <Card title="Submit You Application">
            <Form ref={this.FormRef} formData={this.state.Application}>
              <GroupItem caption="Applicant Information" colCount={2}>
                <Item
                  dataField="FullName"
                  editorOptions={{
                    maxLength: 50,
                  }}
                >
                  <RequiredRule message="Field is required to fill" />
                </Item>
                <Item
                  dataField="Email"
                  editorOptions={{
                    maxLength: 50,
                  }}
                >
                  <RequiredRule message="Field is required to fill" />
                </Item>
                <Item
                  dataField="NIC"
                  editorOptions={{
                    maxLength: 50,
                  }}
                >
                  <RequiredRule message="Field is required to fill" />
                </Item>
              </GroupItem>
              <GroupItem caption="Communication Information" colCount={2}>
                <Item
                  dataField="TelephoneNo1"
                  editorOptions={{
                    maxLength: 50,
                  }}
                >
                  <Label text="Telephone No 1"></Label>
                  <RequiredRule message="Field is required to fill" />
                </Item>
                <Item
                  dataField="TelephoneNo2"
                  editorOptions={{
                    maxLength: 50,
                  }}
                >
                  <Label text="Telephone No 2"></Label>
                </Item>
                <Item
                  dataField="FaxNo"
                  editorOptions={{
                    maxLength: 50,
                  }}
                ></Item>
                <Item
                  dataField="CommunicationEmail"
                  editorOptions={{
                    maxLength: 50,
                  }}
                >
                  <RequiredRule message="Field is required to fill" />
                </Item>
              </GroupItem>
              <GroupItem caption="Business Information" colCount={2}>
                <Item
                  dataField="PSA"
                  editorOptions={{
                    maxLength: 50,
                  }}
                >
                  <RequiredRule message="Field is required to fill" />
                </Item>

                <Item
                  dataField="AreaID"
                  editorType="dxSelectBox"
                  editorOptions={{
                    items: this.state.Area,
                    valueExpr: "AreaID",
                    displayExpr: "Name",
                  }}
                >
                  <RequiredRule message="Field is required to fill" />
                  <Label text="Area" />
                </Item>

                <Item
                  dataField="BusinessName"
                  editorOptions={{
                    maxLength: 50,
                  }}
                >
                  <RequiredRule message="Field is required to fill" />
                  <Label text="Name of the Business" />
                </Item>
                <Item
                  dataField="RegisteredAddress"
                  editorType="dxTextArea"
                  editorOptions={{
                    maxLength: 250,
                  }}
                >
                  <RequiredRule message="Field is required to fill" />
                </Item>

                <Item
                  dataField="AddressForCorrespondence"
                  editorType="dxTextArea"
                  editorOptions={{
                    maxLength: 250,
                  }}
                >
                  <RequiredRule message="Field is required to fill" />
                </Item>

                <Item
                  dataField="NatureOfBusiness"
                  editorType="dxTextArea"
                  editorOptions={{
                    maxLength: 250,
                  }}
                >
                  <RequiredRule message="Field is required to fill" />
                </Item>

                <Item
                  dataField="AccessToLocation"
                  editorType="dxTextArea"
                  editorOptions={{
                    maxLength: 250,
                  }}
                ></Item>

                <Item
                  dataField="SolePropritorship"
                  editorType="dxCheckBox"
                  editorOptions={{
                    maxLength: 50,
                  }}
                ></Item>

                <Item
                  dataField="Partnership"
                  editorType="dxCheckBox"
                  editorOptions={{
                    maxLength: 50,
                  }}
                ></Item>

                <Item
                  dataField="LimitedLiabilityCompany"
                  editorType="dxCheckBox"
                  editorOptions={{
                    maxLength: 50,
                  }}
                ></Item>
                <Item
                  dataField="OfficeFacility"
                  editorType="dxCheckBox"
                  editorOptions={{
                    maxLength: 50,
                  }}
                ></Item>
                <Item
                  dataField="BusinessRegistrationNo"
                  editorOptions={{
                    maxLength: 50,
                  }}
                >
                  <RequiredRule message="Field is required to fill" />
                  <Label text="Business Registration No" />
                </Item>
              </GroupItem>
            </Form>
            <Form>
              <GroupItem
                caption="Names of Proprietor/Partner/Direcotrs"
                colCount={2}
              ></GroupItem>
            </Form>
            <br />
            <DataGrid
              id="grid-list"
              keyExpr="ApplicantNameID"
              showBorders={true}
              wordWrapEnabled={true}
              allowSearch={true}
              selection={{ mode: "single" }}
              hoverStateEnabled={true}
              dataSource={this.state.ApplicantNames}
            >
              <Editing
                mode="popup"
                allowDeleting={true}
                allowAdding={true}
                allowUpdating={true}
                useIcons={true}
              ></Editing>
              <SearchPanel visible={true} />
              <GroupPanel visible={true} />
              <Paging defaultPageSize={20} />
              <Column dataField="Name" />
              <Column dataField="Address" />
              <Column dataField="NIC" />

              <Column type="buttons" buttons={["edit", "delete"]} />
            </DataGrid>
            <br />
            <Form ref={this.FormRef2} formData={this.state.Application}>
              <GroupItem caption="Bank Information" colCount={2}>
                <Item
                  dataField="NameOfBankAndBranch"
                  editorOptions={{
                    maxLength: 50,
                  }}
                >
                  <RequiredRule message="Field is required to fill" />
                </Item>

                <Item
                  dataField="AccountNo"
                  editorOptions={{
                    maxLength: 50,
                  }}
                >
                  <RequiredRule message="Field is required to fill" />
                </Item>
                <Item
                  dataField="CashDeposit"
                  editorOptions={{
                    maxLength: 50,
                  }}
                >
                  <RequiredRule message="Field is required to fill" />
                </Item>
                <EmptyItem />
                <Item
                  dataField="BankGuarantee"
                  editorOptions={{
                    maxLength: 50,
                  }}
                >
                  <RequiredRule message="Field is required to fill" />
                </Item>
              </GroupItem>
            </Form>
            <Form>
              <GroupItem
                caption="Store Location Information"
                colCount={2}
              ></GroupItem>
            </Form>
            <DataGrid
              id="grid-list"
              keyExpr="StoreLocationID"
              showBorders={true}
              wordWrapEnabled={true}
              allowSearch={true}
              selection={{ mode: "single" }}
              hoverStateEnabled={true}
              dataSource={this.state.ApplicationStoreLocation}
            >
              <Editing
                mode="popup"
                allowDeleting={true}
                allowAdding={true}
                allowUpdating={true}
                useIcons={true}
              ></Editing>
              <SearchPanel visible={true} />
              <GroupPanel visible={true} />
              <Paging defaultPageSize={20} />
              <Column dataField="StoreLocation" />
              <Column dataField="StoreCapacity" />
              <Column type="buttons" buttons={["edit", "delete"]} />
            </DataGrid>
            <br />
            <Form>
              <GroupItem
                caption="Products Sold Information"
                colCount={2}
              ></GroupItem>
            </Form>
            <DataGrid
              id="grid-list"
              keyExpr="ProductionSoldInformationID"
              showBorders={true}
              wordWrapEnabled={true}
              allowSearch={true}
              selection={{ mode: "single" }}
              hoverStateEnabled={true}
              dataSource={this.state.ApplicationProductSold}
            >
              <Editing
                mode="popup"
                allowDeleting={true}
                allowAdding={true}
                allowUpdating={true}
                useIcons={true}
              >
                <Popup
                  title="Add Your Competitor Products Sold Information"
                  showTitle={true}
                ></Popup>
              </Editing>
              <SearchPanel visible={true} />
              <GroupPanel visible={true} />
              <Paging defaultPageSize={20} />
              <Column dataField="CompetitorName" />
              <Column dataField="ProductsSold" />
              <Column dataField="Remark" />
            </DataGrid>
            <br />
            <Form>
              <GroupItem
                caption="Transport Information"
                colCount={2}
              ></GroupItem>
            </Form>
            <DataGrid
              id="grid-list"
              keyExpr="ApplicationTransportID"
              showBorders={true}
              wordWrapEnabled={true}
              allowSearch={true}
              selection={{ mode: "single" }}
              hoverStateEnabled={true}
              dataSource={this.state.ApplicationTransportInfomation}
            >
              <Editing
                mode="popup"
                allowDeleting={true}
                allowAdding={true}
                allowUpdating={true}
                useIcons={true}
              >
                <Popup
                  title="Add Your Transport Infomation"
                  showTitle={true}
                ></Popup>
              </Editing>
              <SearchPanel visible={true} />
              <GroupPanel visible={true} />
              <Paging defaultPageSize={20} />
              <Column dataField="TypeOfVehicle" />
              <Column dataField="RegNo" />
              <Column dataField="Capacity" />
              <Column dataField="LeaseOrOwn" caption="Lease/Own">
                <Lookup
                  dataSource={this.LeaseOrOwn}
                  displayExpr="Name"
                  valueExpr="ID"
                />
              </Column>
            </DataGrid>
            <br />
            <Form>
              <GroupItem caption="Attachment" colCount={2}></GroupItem>
            </Form>
            <DataGrid
              id="grid-list"
              keyExpr="AttachmentID"
              showBorders={true}
              wordWrapEnabled={true}
              allowSearch={true}
              selection={{ mode: "single" }}
              hoverStateEnabled={true}
              dataSource={this.state.ApplicationAttachment}
            >
              <Editing
                mode="popup"
                allowDeleting={true}
                allowAdding={true}
                allowUpdating={true}
                useIcons={true}
              >
                <Popup
                  title="Add Your Attachment Infomation"
                  showTitle={true}
                ></Popup>
              </Editing>
              <SearchPanel visible={true} />
              <GroupPanel visible={true} />
              <Paging defaultPageSize={20} />
              <Column dataField="Name" />
              <Column
                type="buttons"
                buttons={[
                  "edit",
                  {
                    hint: "Upload",
                    icon: "upload",
                    visible: true,
                    onClick: this.onUploadUploadAttchmentClick,
                  },
                  {
                    hint: "View",
                    icon: "download",
                  },
                  "delete",
                ]}
              />
            </DataGrid>

            <br />
            <hr />

            <button
              className="btn btn-primary shadow-2 mb-4"
              onClick={this.OnClickRegistration}
              disabled={this.state.ApplicationID != 0}
            >
              Registration
            </button>
            <button
              className="btn btn-primary shadow-2 mb-4"
              onClick={this.OnClickBackToLogin}
            >
              Back To Login
            </button>

            <button
              className="btn btn-primary shadow-2 mb-4"
              onClick={this.OnClickPrint}
              disabled={this.state.ApplicationID > 0}
            >
              Print Application
            </button>
          </Card>
        </div>

        <LoadPanel
          message="Processing.... Please, wait..."
          shadingColor="rgba(0,0,0,0.4)"
          onHiding={this.onLoadPanelHiding}
          visible={this.state.LoadPanelVisible}
          showIndicator={true}
          shading={true}
          showPane={true}
          closeOnOutsideClick={false}
          width={500}
        />

        <UploadNIC
          ref={this.ReportRef}
          Show={this.state.UploadNIC}
          OnHide={this.onUploadNICClick}
          FileInfo={this.state.jUploadData}
          InternshipLine={this.state.InternshipLine}
        ></UploadNIC>

        <UploadStoreLocation
          ref={this.ReportRef}
          Show={this.state.UploadStoreLocation}
          OnHide={this.onUploadStoreLocationClick}
          FileInfo={this.state.jUploadData}
          InternshipLine={this.state.InternshipLine}
        ></UploadStoreLocation>

        <UploadAttchment
          ref={this.ReportRef}
          Show={this.state.UploadAttchment}
          OnHide={this.onUploadUploadAttchmentClick}
          FileInfo={this.state.FileInfo}
          AttachmentID={this.state.AttachmentID}
        ></UploadAttchment>
      </Aux>
    );
  }
}

export default SignUp1;
