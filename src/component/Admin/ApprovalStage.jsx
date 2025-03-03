import React, { Component } from "react";
import DataGrid, { Column, Editing, Popup } from "devextreme-react/data-grid";

class ApprovalStage extends Component {
  constructor(props) {
    super(props);
    //this.ApprovalStage = getApprovalStage(props.data.key);
  }

  render() {
    return (
      <React.Fragment>
        <DataGrid
          dataSource={this.Exemption}
          keyExpr="AutoID"
          showBorders={true}
          columnAutoWidth={true}
          onRowInserting={this.onRowInserted}
          onInitNewRow={this.onInitNewRow}
        >
          <Editing
            mode="form"
            allowUpdating={true}
            allowDeleting={true}
            allowAdding={true}
          >
            <Popup title="Approval Stage" showTitle={true}></Popup>
          </Editing>

          <Column dataField="Authorizer" />
          <Column dataField="Remarks" />
        </DataGrid>
      </React.Fragment>
    );
  }
}

export default ApprovalStage;
