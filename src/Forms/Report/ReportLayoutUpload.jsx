import React, { Component, Fragment } from "react";
import Modal from "react-bootstrap/Modal";
import FileUploader from "devextreme-react/file-uploader";
import { Button, Card, Navbar } from "react-bootstrap";
import Form, { Item, Label, RequiredRule } from "devextreme-react/form";
import axios from "axios";
import notify from "devextreme/ui/notify";
import uuid from "uuid";
import { LoadPanel } from "devextreme-react/load-panel";
import { connect } from "react-redux";

export class ReportLayoutUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      File: null,
      FileName: null,

      jlSubModule: [],

      LoadPanelVisible: false,
    };

    this.Status = [
      { ID: 1, Name: "Active" },
      { ID: 0, Name: "Inactive" },
    ];

    this.Option = [
      { ID: 1, Name: "Yes" },
      { ID: 0, Name: "No" },
    ];

    this.FormRef = React.createRef();
  }

  componentDidMount() {
    /*this.setState({
      jlSubModule: this.props.SubModule.filter(
        (item) => item.MainID === this.props.FileInfo.MainModule
      ),
    });*/
  }

  OnNotification = (message, type) => {
    notify({
      message: message,
      type: type,
      displayTime: 3000,
      position: { at: "top right", offset: "50" },
    });
  };

  onLoadPanelHiding = (message, type) => {
    this.setState({
      LoadPanelVisible: false,
    });

    this.OnNotification(message, type);
  };

  OnSaveValidation = () => {
    if (!this.FormLayout.validate().isValid) {
      this.OnNotification("Fields marked with * are required", "error");
      return false;
    } else if (!this.state.File && !this.props.FileInfo.AutoID) {
      this.OnNotification("File required", "error");
      return false;
    } else return true;
  };

  OnClickEvent = (e) => {
    if (this.OnSaveValidation()) {
      if (this.state.File) {
        this.setState({ LoadPanelVisible: true }, () => {
          let FileData = new FormData();
          FileData.append("file", this.state.File);

          var ext = /(?:\.([^.]+))?$/;
          let FileName = this.props.FileInfo.AutoID
            ? this.props.FileInfo.FileName
            : uuid.v4() + "." + ext.exec(this.state.File.name)[1];

          axios
            .post("/api/upload", FileData, {
              params: {
                Folder: "report",
                FileName: FileName,
              },
            })
            .then((response) => {
              this.setState({ File: null });

              this.onSaveFileData(FileName);
              this.props.OnHide(1);
            })
            .catch((error) => {
              console.log(error);
              this.onLoadPanelHiding("Something went wrong", "error");
            });
        });
      } else if (this.props.FileInfo.AutoID) {
        this.onSaveFileData(this.props.FileInfo.FileName);
        this.props.OnHide(1);
      } else {
        this.onLoadPanelHiding("File not found", "error");
        this.props.OnHide(0);
      }
    }
  };

  onSaveFileData = (FileName) => {
    axios
      .post("/api/report-layout", {
        LayoutID: this.props.FileInfo.AutoID ? this.props.FileInfo.AutoID : 0,
        LayoutName: FileName,
        Layout: JSON.stringify(this.props.FileInfo),
        UserID:
                this.props.data.user == undefined
                  ? this.props.data.data.user.Id
                  : this.props.data.user.Id,
      })
      .then((response) => {
        this.onLoadPanelHiding("Successfully Saved", "success");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onCloseClick = (e) => {
    this.props.OnHide(0);
  };

  FileSelect = (e) => {
    this.setState({ File: e.target.files[0] });
  };

  onModuleValueChanged = (e) => {
    console.log(e);
    this.setState({
      jlSubModule: this.props.SubModule.filter(
        (item) => item.MainID === e.value
      ),
    });
  };

  get FormLayout() {
    return this.FormRef.current.instance;
  }

  render() {
    return (
      <Fragment>
        <Modal
          size="xl"
          show={this.props.Show}
          onHide={this.onCloseClick}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Report Layout</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card body>
              <Form
                ref={this.FormRef}
                formData={this.props.FileInfo}
                colCount={2}
              >
                <Item
                  dataField="SchoolID"
                  editorType="dxSelectBox"
                  editorOptions={{
                    searchEnabled: true,
                    items: this.props.School,
                    displayExpr: "Name",
                    valueExpr: "AutoID",
                  }}
                >
                  <Label text="School"></Label>
                  <RequiredRule></RequiredRule>
                </Item>
                <Item
                  dataField="MainModule"
                  editorType="dxSelectBox"
                  editorOptions={{
                    searchEnabled: true,
                    items: this.props.MainModule,
                    displayExpr: "Name",
                    valueExpr: "ModuleID",
                    onValueChanged: this.onModuleValueChanged,
                  }}
                >
                  <RequiredRule></RequiredRule>
                </Item>
                <Item
                  dataField="SubModule"
                  editorType="dxSelectBox"
                  editorOptions={{
                    searchEnabled: true,
                    items: this.state.jlSubModule,
                    displayExpr: "Name",
                    valueExpr: "ModuleID",
                  }}
                >
                  <RequiredRule></RequiredRule>
                </Item>
                <Item
                  dataField="Name"
                  editorOptions={{
                    maxLength: 50,
                  }}
                >
                  <RequiredRule></RequiredRule>
                </Item>
                <Item
                  dataField="Status"
                  editorType="dxSelectBox"
                  editorOptions={{
                    searchEnabled: true,
                    items: this.Status,
                    displayExpr: "Name",
                    valueExpr: "ID",
                  }}
                >
                  <RequiredRule></RequiredRule>
                </Item>
                <Item
                  dataField="IsDefault"
                  editorType="dxSelectBox"
                  editorOptions={{
                    searchEnabled: true,
                    items: this.Option,
                    displayExpr: "Name",
                    valueExpr: "ID",
                  }}
                >
                  <Label text="Default"></Label>
                  <RequiredRule></RequiredRule>
                </Item>
                <Item
                  dataField="Remark"
                  editorOptions={{
                    maxLength: 50,
                  }}
                />
              </Form>
              <br></br>

              <div>
                <input
                  type="file"
                  name="file"
                  //accept=".rpt"
                  onChange={(e) => this.FileSelect(e)}
                />
              </div>
            </Card>

            <Navbar bg="light" variant="light">
              <Button
                variant="secondary"
                icon="feather icon-layers"
                onClick={this.OnClickEvent}
              >
                Upload
              </Button>
              <Button
                variant="secondary"
                icon="feather icon-layers"
                onClick={this.onCloseClick}
              >
                Close
              </Button>
            </Navbar>
          </Modal.Body>
        </Modal>

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
      </Fragment>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    data: state.loggedReducer,
  };
};

export default connect(mapStateToProps)(ReportLayoutUpload);
