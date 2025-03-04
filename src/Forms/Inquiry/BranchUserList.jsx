import React, { Component, useState, useRef } from "react";
import Aux from "../../hoc/_Aux";
import Form, {
  Item,
  Label,
  RequiredRule,
  Tab,
  GroupItem,
} from "devextreme-react/form";
import Card from "../../App/components/MainCard";
import { Button, Navbar, Tabs } from "react-bootstrap";
import Swal from "sweetalert2";
import DataGrid, {
  Column,
  Editing,
  Popup,
  Lookup,
  Paging,
} from "devextreme-react/data-grid";
import axios from "axios";
import notify from "devextreme/ui/notify";
import { LoadPanel } from "devextreme-react/load-panel";
import { connect } from "react-redux";

const BranchUserList = () => {
  const [state, setState] = useState({
    GroupTable: {},
  });
  return (
    <div>
      <Card title="BranchUser List">
        <DataGrid
          id="BranchList"
          keyExpr="BID"
          allowColumnReordering={true}
          showBorders={true}
          dataSource={state.GroupTable}
          columnAutoWidth={true}
        >
          <Paging enabled={true} />
          <Editing
            mode="row"
            allowUpdating={true}
            allowDeleting={true}
            allowAdding={true}
          />
          <Column dataField="ID" />
          <Column dataField="Branch" />
          <Column dataField="UserName" />
          <Column dataField="Email" />
          <Column dataField="UserGroup" />
          <Column dataField="Active" editotType="dxCheckBox" />
        </DataGrid>
      </Card>
    </div>
  );
};

export default BranchUserList;
