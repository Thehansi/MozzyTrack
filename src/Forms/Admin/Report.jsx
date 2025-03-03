import React, { Component, Fragment } from "react";
import Modal from "react-bootstrap/Modal";
import FileUploader from "devextreme-react/file-uploader";
import { Button, Card, Navbar } from "react-bootstrap";
import Form, { Item, Label, RequiredRule } from "devextreme-react/form";
import axios from "axios";
import notify from "devextreme/ui/notify";
import { connect } from "react-redux";

export class Report extends Component {
  constructor(props) {
    super(props);

    this.state = {
      File: null,
      FileName: null,

      jlSubModule: [],
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

  OnSaveValidation = () => {
    if (!this.FormLayout.validate().isValid) {
      this.OnNotification("Fields marked with * are required", "error");
      return false;
    } else return true;
  };

  OnClickEvent = (e) => {
    if (this.OnSaveValidation()) {
      if (this.state.File) {
        let FileData = new FormData();
        FileData.append("file", this.state.File);

        axios
          .post("/api/report-upload", FileData, {
            params: {
              Folder: "layout",
              FileName: this.props.FileInfo.File,
            },
          })
          .then((response) => {
            this.setState({ File: null });

            this.onSaveFileData(response.data.filename);

            this.props.OnHide(1);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.onSaveFileData(null);
        this.props.OnHide(1);
      }
    }
  };

  onSaveFileData = (file) => {
    axios
      .post("/api/layout", {
        LayoutID: this.props.FileInfo.AutoID ? this.props.FileInfo.AutoID : 0,
        LayoutName: file,
        Layout: JSON.stringify(this.props.FileInfo),
        UserID:
          this.props.data.user == undefined
            ? this.props.data.data.user.Id
            : this.props.data.user.Id,
      })
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  onCloseClick = (e) => {
    this.props.OnHide(0);
  };

  OnRemoveClickEvent = (e) => {
    if (this.state.FileName) {
      axios
        .get("/api/file-delete", {
          params: { File: this.state.FileName },
        })
        .then((response) => {
          this.state.FileName = null;
          this.props.OnHide(0);
        })
        .catch((error) => {
          console.log(error);
        });
    } else this.props.OnHide(0);
  };

  onValueChanged = (e) => {
    this.setState({ File: e.value[0] });
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
            <Modal.Title>Layout</Modal.Title>
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
            </Card>
            <form id="form">
              <div
                className="dx-field"
                style={{
                  border: "1px solid #d3d3d3",
                  margin: "20px 20px 0 20px",
                }}
              >
                <FileUploader
                  selectButtonText="Select File"
                  labelText=""
                  accept="application/x-rpt"
                  allowedFileExtensions={[".rpt"]}
                  uploadMode="useForm"
                  allowCanceling={true}
                  onValueChanged={this.onValueChanged}
                />
              </div>
              <br></br>
            </form>

            <Navbar bg="light" variant="light">
              <Button variant="secondary" onClick={this.OnClickEvent}>
                Upload
              </Button>
              <Button variant="secondary" onClick={this.onCloseClick}>
                Close
              </Button>
            </Navbar>
          </Modal.Body>
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.loggedReducer,
  };
};

export default connect(mapStateToProps)(Report);
