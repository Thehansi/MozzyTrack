import axios from "axios";
import DataGrid, {
  Column,
  Editing,
  Paging,
  SearchPanel,
} from "devextreme-react/data-grid";
import React, { useState, useEffect } from "react";
import Card from "../../App/components/MainCard";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    setdetails();
  }, []);

  const setdetails = async () => {
    const authData = JSON.parse(localStorage.getItem("user"));
    const checkAuthentication = await axios.get(
      "/api/CheckUserAuthentication",
      {
        params: { UsersID: authData.UserName, MenuID: 1001 },
      }
    );
    if (checkAuthentication.data.length != 0) {
      if (checkAuthentication.data[0].UserView) {
        const itemDetails = await axios.get("/api/getAllItems");
        setInventory(itemDetails.data);
      }
    }
  };
  return (
    <div>
      <Card title="Inventory">
        <DataGrid
          id="Inventory"
          // keyExpr="ID"
          allowColumnReordering={true}
          showBorders={true}
          dataSource={inventory}
          allowSearch={true}
        >
          <Paging enabled={true} />
          <SearchPanel visible={true} />
          <Editing mode="row" />
          <Column dataField="ItemCode" />
          <Column dataField="ItemDesc" caption="Item Description" />
          <Column dataField="QtyOnHand" caption="Quantity on Hand" />
          <Column dataField="U_ItemType" caption="Item Type" />
        </DataGrid>
      </Card>
    </div>
  );
};

export default Inventory;
