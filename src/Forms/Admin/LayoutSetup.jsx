import React, { Component, Fragment } from "react";
import DataGrid, {
  Column,
  Editing,
  Popup,
  Lookup,
  GroupPanel,
  SearchPanel,
  Grouping,
  Paging,
} from "devextreme-react/data-grid";
import Card from "../../App/components/MainCard";
import List from "./LayoutUpload";
import axios from "axios";
import { connect } from "react-redux";

export class LayoutSetup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jLayoutList: [],
      jlSchool: [],
      jlMainModule: [],
      jlSubModule: [],

      jLayout: {},
      jLayoutUpdate: false,
      DocReadOnly: false,
    };

    this.Status = [
      { ID: 1, Name: "Yes" },
      { ID: 0, Name: "No" },
    ];

    this.LayoutRef = React.createRef();
  }

  componentDidMount() {
    let auth = false;

    Promise.all([
      axios.get("/api/school-lookup"),
      axios.get("/api/module-main"),
      axios.get("/api/module-sub"),
      axios.get("/api/layout-list"),
    ])
      .then(([School, MainModule, SubModule, LayoutList]) => {
        this.setState({
          jlSchool: School.data,
          jlMainModule: MainModule.data,
          jlSubModule: SubModule.data,
          jLayoutList: JSON.parse(LayoutList.data[0].List),
          DocReadOnly: auth,
        });
      })
      .catch((error) => console.log(error));
  }

  onUploadVisible = (e) => {
    return !e.row.isEditing;
  };

  onUploadClick = (e) => {
    if (!this.state.jLayoutUpdate) {
      this.setState(
        {
          jLayout: e.row.data,
        },
        () => {
          this.LayoutRef.current.onModuleValueChanged({
            value: e.row.data.MainModule,
          });
          this.setState({ jLayoutUpdate: true });
        }
      );
    } else {
      this.setState({ jLayout: {}, jLayoutUpdate: false }, () => {
        if (e === 1) {
          axios
            .get("/api/layout-list")
            .then((res) => {
              this.setState({ jLayoutList: JSON.parse(res.data[0].List) });
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    }
  };

  OnToolbarPreparing = (e) => {
    let toolbarItems = e.toolbarOptions.items;

    toolbarItems.push({
      location: "after",
      widget: "dxButton",
      options: {
        icon: "add",
        onClick: (e) => {
          this.setState({ jLayoutUpdate: !this.state.jLayoutUpdate });
        },
      },
    });
  };

  onRowRemoved(e) {
    axios
      .delete(`/api/layout/${e.data.AutoID}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get("/api/file-delete", {
        params: { Folder: "layout", FileName: e.data.FileName },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <Fragment>
        <Card title="Layout Setup">
          <DataGrid
            id="grid-layout"
            keyExpr="AutoID"
            showBorders={true}
            dataSource={this.state.jLayoutList}
            onToolbarPreparing={this.OnToolbarPreparing}
            onRowRemoved={this.onRowRemoved}
          >
            <GroupPanel visible={true} />
            <SearchPanel visible={true} />
            <Grouping autoExpandAll={true} />
            <Paging defaultPageSize={100} />
            <Editing
              mode="popup"
              allowDeleting={!this.state.DocReadOnly}
              useIcons={true}
            >
              <Popup title="Layout" showTitle={true}></Popup>
            </Editing>

            <Column dataField="MainModule" groupIndex={1}>
              <Lookup
                dataSource={this.state.jlMainModule}
                displayExpr="Name"
                valueExpr="ModuleID"
              />
            </Column>
            <Column dataField="SubModule">
              <Lookup
                dataSource={this.state.jlSubModule}
                displayExpr="Name"
                valueExpr="ModuleID"
              />
            </Column>
            <Column dataField="Name" />
            <Column dataField="Status">
              <Lookup
                dataSource={this.Status}
                displayExpr="Name"
                valueExpr="ID"
              />
            </Column>
            <Column dataField="Remark" />
            <Column
              type="buttons"
              buttons={[
                "edit",
                {
                  hint: "Upload",
                  icon: "upload",
                  visible: this.onUploadVisible || this.state.DocReadOnly,
                  onClick: this.onUploadClick,
                },
                "delete",
              ]}
            />
          </DataGrid>
        </Card>

        <List
          ref={this.LayoutRef}
          Show={this.state.jLayoutUpdate}
          OnHide={this.onUploadClick}
          FileInfo={this.state.jLayout}
          MainModule={this.state.jlMainModule}
          SubModule={this.state.jlSubModule}
          School={this.state.jlSchool}
        ></List>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.loggedReducer,
  };
};
export default connect(mapStateToProps)(LayoutSetup);
