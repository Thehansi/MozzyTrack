import React, { Component } from "react";
import Aux from "../../hoc/_Aux";
import List from "./CommunicationList";
import Form, {
  Item,
  RequiredRule,
  GroupItem,
  Label,
  EmailRule,
  EmptyItem,
} from "devextreme-react/form";
import Card from "../../App/components/MainCard";
import axios from "axios";
import { LoadPanel } from "devextreme-react/load-panel";
import notify from "devextreme/ui/notify";
import Swal from "sweetalert2";
import { Button, Navbar } from "react-bootstrap";
import { connect } from "react-redux";

export class CommunicationSMS extends Component {
  constructor(props) {
    super(props);

    this.state = {
      SMSID: 0,
      jSMS: {},

      jlSchool: [],
      jlModule: [],
      jlField: [],

      jList: [],

      FormMode: 0,
      ListViewing: false,
      DataLoading: false,
      LoadPanelVisible: false,
      DocReadOnly: false,
    };

    this.Status = [
      { ID: 1, Name: "Active" },
      { ID: 0, Name: "Inactive" },
    ];

    this.FormRef = React.createRef();
  }

  componentDidMount() {
    let auth = false;

    axios
      .all([
        axios.get("/api/school-lookup"),
        axios.get("/api/module-sub-communication"),
      ])
      .then(
        axios.spread((School, Module) => {
          this.setState({
            jlSchool: School.data,
            jlModule: Module.data,
            DocReadOnly: auth,
          });
        })
      )
      .catch((error) => console.log(error));
  }

  onModuleValueChanged = (e) => {
    if (e.value && !this.state.DataLoading) {
      axios
        .get("/api/module-field", {
          params: { ModuleID: e.value },
        })
        .then((res) => {
          this.setState({ jlField: JSON.parse(res.data[0].Fields) });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  onFieldValueChanged = (e) => {
    if (e.value) {
      this.setState((prevState) => ({
        jSMS: {
          ...prevState.jSMS,
          Message: this.state.jSMS.Message + " #@" + e.value + "# ",
        },
      }));
    }
  };

  OnSaveValidation = () => {
    if (!this.FormLayout.validate().isValid) {
      this.OnNotification("Fields marked with * are required", "error");
      return false;
    } else return true;
  };

  OnClickEvent = (e) => {
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
          this.setState({ LoadPanelVisible: true }, () => {
            this.serverRequest = axios
              .post("/api/sms", {
                SMSID: this.state.SMSID,
                SMS: JSON.stringify(this.state.jSMS),
              })
              .then((response) => {
                console.log("response ", response);
                this.onLoadPanelHiding("Successfully Saved", "success");
                this.OnClearForm();
              })
              .catch((error) => {
                this.onLoadPanelHiding("Something went wrong", "error");
                console.log(error);
              });
          });
        } else if (res.dismiss == "cancel") {
          //console.log("cancel");
        } else if (res.dismiss == "esc") {
          //console.log("cancle");
        }
      });
    }
  };

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

  OnListClickEvent = (SelectID) => {
    this.setState({ ListViewing: !this.state.ListViewing }, () => {
      if (this.state.ListViewing) {
        //Open
        this.serverRequest = axios
          .get("/api/sms-list")
          .then((res) => {
            this.setState({ jList: JSON.parse(res.data[0].List) });
          })
          .catch((error) => {
            console.log(error);
          });
      }
      if (!this.state.ListViewing && SelectID != 0) {
        //Close
        this.setState({ SMSID: SelectID, DataLoading: true }, () =>
          this.OnLoadData()
        );
      }
    });
  };

  OnLoadData = () => {
    console.log("X", this.state.SMSID);
    axios
      .all([
        axios.get("/api/sms", {
          params: { SMSID: this.state.SMSID },
        }),
      ])
      .then(
        axios.spread((SMS) => {
          console.log("SMS", SMS);
          this.setState(
            {
              jSMS: SMS.data[0],
            },
            () => {
              axios
                .get("/api/module-field", {
                  params: { ModuleID: this.state.jSMS.ModuleID },
                })
                .then((res) => {
                  this.setState({ jlField: JSON.parse(res.data[0].Fields) });
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          );
        })
      )
      .catch((error) => console.log(error));
  };

  OnClearClickEvent = (e) => {
    Swal.fire({
      type: "info",
      showCancelButton: true,
      text: "Do you want to clear ?",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((res) => {
      if (res.value) {
        this.OnClearForm();
      }
    });
  };

  OnClearForm = () => {
    this.setState({
      SMSID: 0,
      jSMS: {},

      //jlSchool: [],
      //jlModule: [],
      jlField: [],

      jList: [],

      FormMode: 0,
      ListViewing: false,
      DataLoading: false,
      //LoadPanelVisible: false,
    });
  };

  get FormLayout() {
    return this.FormRef.current.instance;
  }

  render() {
    return (
      <Aux>
        <Card title="SMS Tempalate">
          <Form ref={this.FormRef} formData={this.state.jSMS}>
            <GroupItem caption="Infomation" colCount={2}>
              <Item
                dataField="Name"
                editorOptions={{
                  maxLength: 50,
                }}
              >
                <RequiredRule message="Field required" />
              </Item>
              
              <Item
                dataField="ModuleID"
                editorType="dxSelectBox"
                editorOptions={{
                  items: this.state.jlModule,
                  searchEnabled: true,
                  displayExpr: "Name",
                  valueExpr: "ModuleID",
                  onValueChanged: this.onModuleValueChanged,
                }}
              >
                <Label text="Module"></Label>
                <RequiredRule message="Field required" />
              </Item>

              <Item
                dataField="Status"
                editorType="dxSelectBox"
                editorOptions={{
                  items: this.Status,
                  searchEnabled: true,
                  displayExpr: "Name",
                  valueExpr: "ID",
                }}
              >
                <RequiredRule message="Field required" />
              </Item>
              <Item
                dataField="Remark"
                editorOptions={{
                  maxLength: 50,
                }}
              ></Item>
            </GroupItem>
            <GroupItem caption="Message" colCount={2}>
              <Item
                dataField="Field"
                editorType="dxSelectBox"
                editorOptions={{
                  items: this.state.jlField,
                  searchEnabled: true,
                  displayExpr: "Value",
                  valueExpr: "Value",
                  onValueChanged: this.onFieldValueChanged,
                }}
              ></Item>
              <EmptyItem></EmptyItem>
              <Item
                dataField="Message"
                editorType="dxTextArea"
                colSpan={2}
                editorOptions={{
                  maxLength: 500,
                  height: 150,
                }}
              >
                <RequiredRule message="Field required" />
              </Item>
            </GroupItem>
          </Form>
        </Card>

        <Navbar bg="light" variant="light">
          <Button
            variant="secondary"
            onClick={this.OnClickEvent}
            disabled={this.state.DocReadOnly}
          >
            Save
          </Button>
          <Button
            variant="secondary"
            onClick={this.OnClearClickEvent}
            icon="feather icon-layers"
          >
            Clear
          </Button>
          <Button variant="secondary" onClick={this.OnListClickEvent}>
            View List
          </Button>
        </Navbar>

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

        <List
          Show={this.state.ListViewing}
          OnHide={this.OnListClickEvent}
          ItemList={this.state.jList}
          Name=" SMS"
        ></List>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state.loggedReducer);
  return {
    data: state.loggedReducer,
  };
};

export default connect(mapStateToProps)(CommunicationSMS);
