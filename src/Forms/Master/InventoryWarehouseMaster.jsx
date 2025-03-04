import Card from "../../App/components/MainCard";
import React, { useState, useEffect } from "react";
import DataGrid, {
  Column,
  Paging,
  Editing,
  Label,
  SearchPanel,
} from "devextreme-react/data-grid";
import axios from "axios";
import Form, { Item, GroupItem, RequiredRule } from "devextreme-react/form";

const InventoryWarehouse = () => {
  const [inventorywarehouse, setInventorywarehouseDetails] = useState([]);
  const [state, setState] = useState({
    jForm: {},
  });
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
        const InventorywarehouseDetails = await axios.get(
          "/api/getAllInventoryWarehouse"
        );
        console.log("InventorywarehouseDetails", InventorywarehouseDetails);
        setInventorywarehouseDetails(InventorywarehouseDetails.data);
      }
    }
  };
  const boldBorderStyle = {
    border: "2px solid #000",
  };

  const itemChange = (e) => {
    console.log(e.value);
  };

  return (
    <div>
      <Card title="Inventory Warehouse">
        <DataGrid
          id="InventoryWarehouse"
          allowColumnReordering={true}
          showBorders={true}
          dataSource={inventorywarehouse}
          allowSearch={true}
        >
          <Paging enabled={true} />
          <SearchPanel visible={true} />
          <Editing mode="row" allowSearch={true} />
          <Column dataField="ItemCode" caption="Item Code" />
          <Column dataField="WhsCode" caption="Warehouse Code" />
          <Column dataField="TotalOnHand" caption="On Hand Quantity" />
        </DataGrid>
      </Card>
    </div>
  );
};

export default InventoryWarehouse;
