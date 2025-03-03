import React, { Component, Fragment } from "react";
import Modal from "react-bootstrap/Modal";
import FileUploader from "devextreme-react/file-uploader";
import { Button, Card, Navbar } from "react-bootstrap";
import Form, { Item, Label, RequiredRule } from "devextreme-react/form";
import axios from "axios";
import notify from "devextreme/ui/notify";
import uuid from "uuid";
import { LoadPanel } from "devextreme-react/load-panel";

export class UploadAttchment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      File: null,
      FileName: null,

      jlCategory: [],

      LoadPanelVisible: false,
      jFiles: {},
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

  componentDidMount() {}

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
    } else if (!this.state.File && !this.props.FileInfo.AttachmentID) {
      this.OnNotification("File required", "error");
      return false;
    } else return true;
  };

  onUploadClickEvent = (e) => {
    //  console.log("this.props.FileInfo.AttachmentID", this.props.FileInfo.AttachmentID);
    if (this.OnSaveValidation()) {
      if (this.state.File) {
        this.setState({ LoadPanelVisible: true }, () => {
          let FileData = new FormData();
          FileData.append("file", this.state.File);

          var ext = /(?:\.([^.]+))?$/;
          let FileName = (
            "PR" +
            "_" +
            uuid.v4() +
            "." +
            ext.exec(this.state.File.name)[1]
          ).replaceAll(/\s/g, "");
          // debugger;
          axios
            .post("/api/upload/attachment", FileData, {
              params: {
                Folder: "PR",
                FileName: FileName,
              },
            })
            .then((response) => {
              this.setState({ File: null });
              console.log("response", response);
              //  console.log("response", this.props.AttachmentID);
              let filePath = response.data.filePath;
              //  let filePath = response.data.filePath;
              //this.onLoadPanelHiding("upload successfully saved", "success");
              this.props.OnHide(FileName, filePath);
              //console.log("FileName", FileName);
            })
            .catch((error) => {
              console.log(error);
              this.onLoadPanelHiding("Something went wrong", "error");
            });
        });
      } else if (this.props.AttachmentID) {
        this.props.OnHide(1);
      } else {
        this.onLoadPanelHiding("File not found", "error");
        this.props.OnHide(0);
      }
    }
  };

  onCloseClick = (e) => {
    this.props.OnHide(0);
  };

  FileSelect = (e) => {
    this.setState({ File: e.target.files[0] });
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
            <Modal.Title>Attachment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card body>
              <Form
                ref={this.FormRef}
                formData={this.state.jFiles}
                colCount={2}
              ></Form>
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
                variant="dark"
                icon="feather icon-layers"
                onClick={this.onUploadClickEvent}
              >
                Upload
              </Button>
              <Button
                variant="dark"
                icon="feather icon-layers"
                onClick={this.onCloseClick}
              >
                Close
              </Button>
            </Navbar>
          </Modal.Body>
        </Modal>

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
      </Fragment>
    );
  }
}

export default UploadAttchment;
