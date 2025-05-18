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
      jFeedback: {},
      DocReadOnly: false,
      jPhi: [],
      jPhiDetails: [],
      DocumentID: 10,
      jFeedbackAction: [],
      messages: [], // Ensure messages is an array
      newMessage: "",
      isEdit: true,
    };

    this.FormRef = React.createRef();
    this.FormRef2 = React.createRef();
    this.AnswerResult = [
      { ID: "1", Name: "Yes" },
      { ID: "2", Name: "No" },
    ];
    this.jStatusList = [
      { ID: "1", Name: "Active" },
      { ID: "2", Name: "Inactive" },
      { ID: "3", Name: "Completed" },
    ];
    this.jSituationType = [
      { ID: "1", Name: "No Complaint" },
      { ID: "2", Name: "Complaint Issued" },
    ];

    this.ApprovalStatus = [
      { ID: "Pending", Name: "Pending" },
      { ID: "Approve", Name: "Approve" },
      { ID: "Hold", Name: "Hold" },
      { ID: "Cancel", Name: "Cancel" },
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

  handlePHI = async (e) => {
    const divSector = e.value;
    const getPHI = await axios.get("/api/getRelatedPHI", {
      params: {
        DivisionalSecreter: divSector,
      },
    });

    this.setState({
      DivisionalSecreter: divSector,
      jPhi: getPHI.data,
    });
  };

  loadPhiDetails = async (e) => {
    const phiID = e.value;
    const getPHIdetails = await axios.get("/api/getPhiDetails", {
      params: {
        id: phiID,
      },
    });

    this.setState({
      jPhiDetails: getPHIdetails.data,
    });
  };

  onUpdateDengueForm = (e) => {
    console.log(e.row.data.ApprovalStatus);

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
              .post("/api/addNDCU", {
                params: {
                  FormID: e.row.data.FormID,
                  ApprovalStatus: e.row.data.ApprovalStatus,
                },
              })
              .then((response) => {
                Swal.fire({
                  icon: "success",
                  title: "Success",
                  text: "User details saved successfully!",
                }).then(async (res) => {});
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
  };

  componentDidMount = async () => {
    const authData = JSON.parse(localStorage.getItem("user"));

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
        isEdit: false,
      });
    }
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
                  disabled={this.state.isEdit}
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
                  onValueChanged={this.handlePHI}
                />
              </Item>
              <Item
                dataField='phi'
              >
                <SelectBox
                  searchEnabled={true}
                  items={this.state.jPhi}
                  valueExpr='UserName'
                  displayExpr='UserName'
                  disabled={!this.state.DivisionalSecreter}
                  onValueChanged={this.loadPhiDetails}
                />
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
            //  keyExpr='ConcernsID'
            showBorders={true}
            wordWrapEnabled={true}
            allowSearch={true}
            selection={{ mode: "single" }}
            hoverStateEnabled={true}
            dataSource={this.state.jPhiDetails}
            //onCellDblClick={updatePRTable}
            allowColumnResizing={true}
            columnAutoWidth={true}
            // onCellClick={getIndex}
            // onSaved={onClickSave}
          >
            <Editing
              mode='popup'
              allowDeleting={true}
              allowAdding={!this.state.isEdit}
              allowUpdating={true}
              useIcons={true}
            >
              <Popup title='Complaint List' showTitle={true}></Popup>
            </Editing>
            <SearchPanel visible={true} />
            <GroupPanel visible={true} />
            <Paging defaultPageSize={6} />
            <Column dataField='FormID' editorOptions={{ readOnly: true }} />
            <Column
              dataField='CusIdentificationNo'
              caption='NICNO'
              editorOptions={{ readOnly: true }}
            />
            <Column
              dataField='ImpotentType'
              caption='Situation Type'
              editorOptions={{
                readOnly: true,
              }}
            >
              <Lookup
                dataSource={this.jSituationType}
                valueExpr='ID'
                displayExpr='Name'
              />
            </Column>
            <Column
              dataField='HouseOwnerName'
              caption='Household Owner'
              editorOptions={{ readOnly: true }}
            />
            <Column
              dataField='FillDate'
              dataType='date'
              caption='Fill Date'
              editorOptions={{ readOnly: true }}
            />
            <Column
              dataField='Question13'
              caption='Immediate Action Taken'
              editorOptions={{ readOnly: true }}
            >
              <Lookup
                dataSource={this.AnswerResult}
                valueExpr='ID'
                displayExpr='Name'
              />
            </Column>
            <Column
              dataField='followUpDate'
              caption='Next Follow UpDate'
              editorOptions={{ readOnly: true }}
            />
            <Column
              dataField='followUpDate'
              caption='Next Follow UpDate'
              editorOptions={{ readOnly: true }}
            />
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
                  onClick: this.onUpdateDengueForm,
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
