import React from "react";
import Card from "../../App/components/MainCard";
import DataGrid, { Column, Editing, Paging } from "devextreme-react/data-grid";

const GL = () => {
  return (
    <div>
      <Card title="General Ledger">
        <DataGrid
          id="GL"
          keyExpr="ID"
          allowColumnReordering={true}
          showBorders={true}
        >
          <Paging enabled={true} />
          <Editing
            mode="row"
            allowUpdating={true}
            allowDeleting={true}
            allowAdding={true}
          />
          <Column dataField="Code" />
          <Column dataField="Name" />
          {/* <Column dataField="Limit" />
          <Column dataField="Status" /> */}
        </DataGrid>
      </Card>
    </div>
  );
};

export default GL;
