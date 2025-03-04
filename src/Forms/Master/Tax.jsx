import Card from "../../App/components/MainCard";
import React from "react";
import DataGrid, { Column, Paging, Editing } from "devextreme-react/data-grid";

const Tax = () => {
  return (
    <div>
      <Card title="Tax">
        <DataGrid
          id="Tax"
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

export default Tax;
