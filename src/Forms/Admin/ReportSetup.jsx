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
import List from "./ReportUpload";
import axios from "axios";
import { connect } from "react-redux";

export class ReportSetup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jLayoutList: [],
      jlSchool: [],
      jlMainModule: [],
      jlSubModule: [],
      jlCategory: [],
      jlParameter: [],
      jLayout: {},
      jParameter: [],
      jParameterList: [],

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
      axios.get("/api/school-lookup-byLoginUser", {
        params: {
          UserID: this.props.data.user.Id,
        },
      }),
      axios.get("/api/module-main"),
      axios.get("/api/module-sub"),
      axios.get("/api/report-layout-list", {
        params: {
          UserID: this.props.data.user.Id,
        },
      }),
      axios.get("/api/report-category-list"),
      axios.get("/api/report-parameter-lookup"),
    ])
      .then(
        ([School, MainModule, SubModule, LayoutList, Category, Parameter]) => {
          this.setState({
            jlSchool: School.data,
            jlMainModule: MainModule.data,
            jlCategory: Category.data,
            jLayoutList: JSON.parse(LayoutList.data[0].List),
            jlParameter: Parameter.data,
            jParameterList: JSON.parse(LayoutList.data[0].ListParameter),
            DocReadOnly: auth,
          });
        }
      )
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
          let jParameterListTemp = [...this.state.jParameterList];
          jParameterListTemp = jParameterListTemp
            .filter((o) => o.ReportID == e.row.data.AutoID)
            .map((a) => {
              return a;
            });

          this.setState(
            {
              jParameter: jParameterListTemp,
            },
            () => {
              // this.LayoutRef.current.onModuleValueChanged({
              //   value: e.row.data.MainModule,
              // });
              this.setState({ jLayoutUpdate: true });
            }
          );
        }
      );
    } else {
      this.setState({ jLayout: {}, jLayoutUpdate: false }, () => {
        if (e === 1) {
          axios
            .get("/api/report-layout-list", {
              params: {
                UserID: this.props.data.user.Id,
              },
            })
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
      .delete(`/api/report/${e.data.AutoID}`)
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

  onGradeMoveClick = (e, t) => {
    let list = this.state.jlParameter.filter(
      (item) => item.IndexNo !== e.row.rowIndex + 1
    );

    let add = this.state.jlParameter.filter(
      (item) => item.IndexNo === e.row.rowIndex + 1
    );

    list.splice(
      t === "Up"
        ? e.row.rowIndex === 0
          ? 0
          : e.row.rowIndex - 1
        : e.row.rowIndex + 1,
      0,
      add[0]
    );

    list.map((value, index, array) => {
      list[index].IndexNo = index + 1;
    });

    this.setState({ jlParameter: list });
  };

  render() {
    return (
      <Fragment>
        <Card title="Report Layout Setup">
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

            <Column dataField="CategoryID" caption="Category">
              <Lookup
                dataSource={this.state.jlCategory}
                displayExpr="Name"
                valueExpr="AutoID"
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

            <Column
              type="buttons"
              buttons={[
                "edit",
                {
                  hint: "Upload",
                  icon: "upload",
                  visible: this.onUploadVisible,
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
          ParameterList={this.state.jParameter}
          MainModule={this.state.jlMainModule}
          SubModule={this.state.jlSubModule}
          School={this.state.jlSchool}
          Category={this.state.jlCategory}
          Parameter={this.state.jlParameter}
          onGradeMoveClick={this.onGradeMoveClick}
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
export default connect(mapStateToProps)(ReportSetup);
