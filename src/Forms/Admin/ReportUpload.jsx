import React, { Component, Fragment } from "react";
import Modal from "react-bootstrap/Modal";
import FileUploader from "devextreme-react/file-uploader";
import { Button, Card, Navbar } from "react-bootstrap";
import Form, { Item, Label, RequiredRule } from "devextreme-react/form";
import DataGrid, {
  Column,
  Editing,
  Popup,
  Lookup,
  SearchPanel,
} from "devextreme-react/data-grid";
import axios from "axios";
import notify from "devextreme/ui/notify";
import uuid from "uuid";
import { LoadPanel } from "devextreme-react/load-panel";
import "devextreme-react/text-area";
import { connect } from "react-redux";

export class ReportUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      File: null,
      FileName: null,

      jlSubModule: [],
      jParameter: [],

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

    this.Type = [
      { ID: "dxTextBox", Name: "Text" },
      { ID: "dxDateBox", Name: "Date" },
      { ID: "dxNumberBox", Name: "Integer " },
      // { ID: 'dxDecimalBox', Name: "Decimal" },
      { ID: "dxSelectBox", Name: "List" },
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
    if (this.props.FileInfo.ParameterID) {
      this.props.FileInfo.ParameterID =
        "" + this.props.FileInfo.ParameterID + "";
    }

    axios
      .post("/api/report-layout", {
        LayoutID: this.props.FileInfo.AutoID ? this.props.FileInfo.AutoID : 0,
        LayoutName: FileName,
        Layout: JSON.stringify(this.props.FileInfo),
        Parameter: JSON.stringify(this.props.ParameterList),
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

  get FormLayout() {
    return this.FormRef.current.instance;
  }

  onSchoolValueChanged = (e) => {
    console.log(this.props.Category);
    this.setState({
      jlSubModule: this.props.Category.filter(
        (item) => item.SchoolID === e.value
      ),
    });
  };

  onGradeMoveClick = (e, t) => {
    this.props.onGradeMoveClick(e, t);
  };

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
                  dataField="CategoryID"
                  editorType="dxSelectBox"
                  editorOptions={{
                    searchEnabled: true,
                    items: this.state.jlSubModule,
                    displayExpr: "Name",
                    valueExpr: "AutoID",
                  }}
                >
                  <Label text="Category" />
                  <RequiredRule></RequiredRule>
                </Item>
                <Item
                  dataField="Name"
                  editorType="dxTextBox"
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
                  dataField="Description"
                  editorOptions={{
                    maxLength: 50,
                  }}
                />
                <Item
                  dataField="Query"
                  colSpan={2}
                  editorType="dxTextArea"
                  editorOptions={{
                    height: 90,
                  }}
                ></Item>
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

              <br></br>

              <DataGrid
                id="grid-parameter"
                keyExpr="AutoID"
                dataSource={this.props.ParameterList}
                showBorders={true}
                wordWrapEnabled={true}
                allowSearch={true}
                showColumnLines={true}
                showRowLines={false}
                rowAlternationEnabled={true}
              >
                <Editing
                  mode="row"
                  useIcons={true}
                  allowUpdating={true}
                  allowDeleting={true}
                  allowAdding={true}
                ></Editing>
                <SearchPanel visible={true} placeholder="Search..." />
                <Column dataField="Parameter">
                  <RequiredRule />
                </Column>
                <Column dataField="Type">
                  <Lookup
                    dataSource={this.Type}
                    valueExpr="ID"
                    displayExpr="Name"
                  />
                  <RequiredRule message="Field required" />
                </Column>
                <Column dataField="Query" />
                <Column
                  type="buttons"
                  buttons={[
                    "edit",
                    "delete",
                    {
                      hint: "Move Up",
                      icon: "upload",

                      onClick: (e) => this.onGradeMoveClick(e, "Up"),
                    },
                    {
                      hint: "Move Down",
                      icon: "download",

                      onClick: (e) => this.onGradeMoveClick(e, "Down"),
                    },
                  ]}
                />
              </DataGrid>
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

export default connect(mapStateToProps)(ReportUpload);
