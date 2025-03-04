import Card from "../../App/components/MainCard";
import axios from "axios";
import React, { useState, useEffect } from "react";
import DataGrid, {
  Column,
  Paging,
  Editing,
  SearchPanel,
} from "devextreme-react/data-grid";

const UOM = () => {
  const [uom, setUOM] = useState([]);

  useEffect(() => {
    setdetails();
  }, []);

  const setdetails = async () => {
    const authData = JSON.parse(localStorage.getItem("user"));
    const checkAuthentication = await axios.get(
      "/api/CheckUserAuthentication",
      {
        params: { UsersID: authData.UserName, MenuID: 1005 },
      }
    );
    if (checkAuthentication.data.length != 0) {
      if (checkAuthentication.data[0].UserView) {
        const uomDetails = await axios.get("/api/getAllUOM");
        setUOM(uomDetails.data);
      }
    }
  };

  const renderHeaderCell = (data) => {
    return (
      <div style={{ textAlign: "center", width: "100%" }}>
        {data.column.caption}
      </div>
    );
  };

  return (
    <div>
      <Card title="Unit of Measure">
        <DataGrid
          id="UOM"
          //keyExpr="ID"
          allowColumnReordering={true}
          showBorders={true}
          dataSource={uom}
        >
          <Paging enabled={true} />
          <SearchPanel visible={true} />
          <Editing
            mode="row"
            // allowUpdating={true}
            // allowDeleting={true}
            // allowAdding={true}
          />
          <Column dataField="cUnitCode" caption="UOM Code" />
          <Column dataField="cUnitDescription" caption="UOM Name" />
          {/* <Column dataField="Limit" />
          <Column dataField="Status" /> */}
        </DataGrid>
      </Card>
    </div>
  );
};

export default UOM;
