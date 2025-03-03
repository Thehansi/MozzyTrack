import React, { Component } from "react";
import { TabPanel, Item } from "devextreme-react/tab-panel";
import { Card } from "react-bootstrap";
import { DataGrid } from "devextreme-react";
import { Editing } from "devextreme-react/diagram";
import {
  Column,
  Lookup,
  MasterDetail,
  Popup,
  RequiredRule,
} from "devextreme-react/data-grid";
import Aux from "../../hoc/_Aux/index.js";
import DataSource from "devextreme/data/data_source";
import ArrayStore from "devextreme/data/array_store";
import axios from "axios";

export class SystemTransactionSubType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jlSystemTransSubList: this.GetSubDetail(),
    };

    this.Status = [
      { ID: 1, Name: "Active" },
      { ID: 0, Name: "Inactive" },
    ];
  }

  componentDidMount() {
    console.log("componentDidMount", this.props.SystemTrasactionSub);
  }

  GetSubDetail() {
    return new DataSource({
      store: new ArrayStore({
        data: this.props.SystemTrasactionSub,
        key: "AutoID",
      }),
      filter: ["TransID", "=", this.props.TransID],
    });
  }
  onRowInserted = () => {};

  onInitNewRow = (e) => {
    e.data.TransID = this.props.TransID;

    axios
      .post("/api/system-trasaction-sub-type", e.data)
      .then((response) => {
        let item = [];
        item = this.state.jlSystemTransSubList._items;

        let index = item.findIndex((el) => el.AutoID === e.data.AutoID);

        console.log("e.data", e.data);
        console.log("item", item);
        console.log("this.state.jlSystemTransSubList", response.data[0].AutoID);
        console.log("index", index);

        item[index].AutoID = response.data[0].AutoID;
        this.setState({
          jlSystemTransSubList: this.state.jlSystemTransSubList,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onRowUpdated(e) {
    axios
      .put("/api/system-trasaction-sub-type", e.data)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onRowRemoved(e) {
    axios
      .delete(`/api/system-trasaction-sub-type/${e.data.AutoID}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <TabPanel>
        <Item title="Sub Transaction" render={this.renderTransactionsSubTab} />
      </TabPanel>
    );
  }

  renderTransactionsSubTab = () => {
    return (
      <Aux>
        <Card title="Sub Transaction Type">
          <DataGrid
            id="grid-subject"
            keyExpr="AutoID"
            showBorders={true}
            wordWrapEnabled={true}
            allowSearch={true}
            dataSource={this.state.jlSystemTransSubList}
            onRowInserting={this.onInitNewRow}
            onRowUpdated={this.onRowUpdated}
            onRowRemoved={this.onRowRemoved}
          >
            <Editing
              mode="popup"
              useIcons={true}
              allowUpdating={true}
              allowDeleting={true}
              allowAdding={true}
            >
              <Popup title="Sub Transaction" showTitle={true}></Popup>
            </Editing>

            <Column
              dataField="Name"
              editorOptions={{ maxLength: 100 }}
              caption="Name"
            >
              <RequiredRule />
            </Column>
            <Column dataField="Status">
              <Lookup
                dataSource={this.Status}
                valueExpr="ID"
                displayExpr="Name"
              />
              <RequiredRule />
            </Column>
          </DataGrid>
        </Card>
      </Aux>
    );
  };
}

export default SystemTransactionSubType;
