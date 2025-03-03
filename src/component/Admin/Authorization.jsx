import React, { Component } from "react";
import {
  TreeList,
  Editing,
  Column,
  RequiredRule,
  Lookup,
} from "devextreme-react/tree-list";

class Authorization extends Component {
  constructor(props) {
    super(props);
    this.Authorization = getUsers(props.data.key);

    this.Auth = [
      { ID: "0", Name: "Full Authorization" },
      { ID: "1", Name: "Read-Only" },
      { ID: "2", Name: "No Authorization" },
    ];
  }

  render() {
    return (
      <React.Fragment>
        <TreeList
          id="user-authorization"
          dataSource={this.Authorization}
          defaultExpandedRowKeys={1}
          showRowLines={true}
          showBorders={true}
          columnAutoWidth={true}
          itemsExpr="items"
          dataStructure="tree"
        >
          <Editing allowUpdating={true} mode="row" />

          <Column dataField="Module" />
          <Column dataField="Authorization">
            <Lookup dataSource={this.Auth} displayExpr="Name" valueExpr="ID" />
          </Column>
        </TreeList>
      </React.Fragment>
    );
  }
}

export default Authorization;
