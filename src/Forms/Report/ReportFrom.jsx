import React, { Component, Fragment } from "react";
import Modal from "react-bootstrap/Modal";
import FileUploader from "devextreme-react/file-uploader";
import { Button, Card, Navbar } from "react-bootstrap";
import Form, { Item, Label, RequiredRule } from "devextreme-react/form";
import axios from "axios";
import notify from "devextreme/ui/notify";
import { LoadPanel } from "devextreme-react/load-panel";
import "devextreme-react/text-area";
import SelectBox from 'devextreme-react/select-box';

export class ReportForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            LoadPanelVisible: false,
            Type : "P",
            jForm: {}
        };

        this.Type = [
            { ID: "P", Name: "PDF" },
            { ID: "E", Name: "Excel" },
            { ID: "X", Name: "Excel (Data Only)" },
          ];

        console.log("props", this.props)
        this.FormRef = React.createRef();
    }


    componentDidMount() {
        console.log("componentDidMount", this.props)
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

        console.log("this.selectType", this.state.Type)
        if (this.OnSaveValidation()) {

            let ViewUrl = JSON.stringify(this.props.jForm).replace(/"/g, '').replace(/}/g, '').replace(/{/g, '').replace(/:/g, '=').replace(/,/g, '&').replace(/' '/g, '')

            window.open(
                `${window.location.protocol}//${window.location.hostname}${window["Config"].ReportURL}?f=${this.props.FileName}&t=${this.state.Type}&${ViewUrl}`,
                "_blank"
            );

            this.setState({
                jForm: {}
            })
        }
    };

    onCloseClick = (e) => {
        this.setState({
            jForm: {}
        }, () => {
            console.log("this.state", this.state)
            this.props.OnHide(0);
        })
    };

    get FormLayout() {
        return this.FormRef.current.instance;
    }

    onValueChanged = (e) => {
        this.setState({Type : e.value})
    }

    onSchoolChanged = (e, item) => {
        console.log("onSchoolChanged onSchoolChanged", e.value);
        console.log("onSchoolChanged onSchoolChanged", item);
        if (e.value != null) {
            axios
                .get("/api/course-lookup", {
                    params: { SchoolID: e.value },
                })
                .then((res) => {
                    this.setState((prevState) => ({
                        jExam: {
                            ...prevState.jExam,
                            SchoolID: e.value,
                            CourseID: 0,
                            BatchID: [],
                            SemesterID: [],
                        },
                        jlCourse: res.data,
                    }));
                })
                .catch((error) => {
                    console.log(error);
                });
        }
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
                        <Modal.Title>Report Form</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Card body>
                            <Form
                                id="form"
                                formData={this.props.jForm}
                                customizeItem={this.customizeItem}
                                ref={this.FormRef}
                            >
                                {this.props.Parameter.map((item, index) =>
                                    < Item
                                        dataField={item[0].Name}
                                        editorType={item[0].Type}
                                        editorOptions={{
                                            searchEnabled: true,
                                            items: JSON.parse(item[0].Query),
                                            displayExpr: "Name",
                                            valueExpr: "AutoID",
                                            dateSerializationFormat: "yyyy-MM-dd",
                                        }}
                                    >
                                        <RequiredRule message="Field required" />
                                    </Item>
                                )}
                            </Form>
                        </Card>

                        <Navbar bg="light" variant="light">
                        <SelectBox items={this.Type} 
                                onValueChanged={this.onValueChanged}
                                displayExpr="Name"
                                valueExpr="ID"
                                defaultValue={"P"} className="mr-2"/>
                            <Button
                                variant="secondary"
                                icon="feather icon-layers"
                                onClick={this.OnClickEvent}
                            >
                                View Report
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

export default ReportForm;
