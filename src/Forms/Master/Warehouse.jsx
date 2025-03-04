import Card from "../../App/components/MainCard";
import React, { useState, useEffect } from "react";
import DataGrid, {
  Column,
  Paging,
  Editing,
  SearchPanel,
} from "devextreme-react/data-grid";
import axios from "axios";

const Warehouse = () => {
  const [warehouse, setWarehouse] = useState([]);

  useEffect(() => {
    setdetails();
  }, []);

  const setdetails = async () => {
    const authData = JSON.parse(localStorage.getItem("user"));
    const checkAuthentication = await axios.get(
      "/api/CheckUserAuthentication",
      {
        params: { UsersID: authData.UserName, MenuID: 1006 },
      }
    );
    if (checkAuthentication.data.length != 0) {
      if (checkAuthentication.data[0].UserView) {
        const warehouseDetails = await axios.get("/api/getAllWarehouse");
        setWarehouse(warehouseDetails.data);
      }
    }
  };
  const boldBorderStyle = {
    border: "2px solid #000", // 2px bold black border
  };

  return (
    <div>
      <Card title="Warehouse">
        <DataGrid
          id="Warehouse"
          // keyExpr="ID"
          allowColumnReordering={true}
          showBorders={true}
          dataSource={warehouse}
          allowSearch={true}
        >
          <Paging enabled={true} />
          <SearchPanel visible={true} />
          <Editing mode="row" allowSearch={true} />
          <Column dataField="WhseCode" caption="Warehouse Code" />
          <Column dataField="WhseName" caption="Warehouse Name" />
        </DataGrid>
      </Card>
    </div>
  );
};

export default Warehouse;
