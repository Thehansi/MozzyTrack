// import DataGrid, { Column, Editing, Paging } from "devextreme-react/data-grid";
import React from "react";
// import Card from "../../App/components/MainCard";
import { Navbar, Button } from "react-bootstrap";

const Master = () => {
  return (
    <div>
      <br />
      <br />
      <table style={{ marginLeft: "70px", width: "100%" }}>
        <tr>
          <td>
            <Button
              className="btn1"
              variant="secondary"
              icon="feather icon-layers"
              //onClick={onClickSave}
              style={{
                width: "250px",
                height: "100px",
                borderRadius: "12px",
                fontSize: "20px",
                border: "4px solid #ccc",
                marginLeft: "60px",
              }}
            >
              Customer
            </Button>
          </td>
          <td>
            <Button
              className="btn1"
              variant="secondary"
              icon="feather icon-layers"
              //onClick={onClickSave}
              style={{
                width: "250px",
                height: "100px",
                borderRadius: "12px",
                fontSize: "20px",
                border: "4px solid #ccc",
                marginLeft: "60px",
              }}
            >
              Vendor
            </Button>
          </td>
        </tr>
        <tr>
          <td>
            <Button
              className="btn1"
              variant="secondary"
              icon="feather icon-layers"
              //onClick={onClickSave}
              style={{
                width: "250px",
                height: "100px",
                borderRadius: "12px",
                fontSize: "20px",
                border: "4px solid #ccc",
                marginLeft: "60px",
                marginTop: "42px",
              }}
            >
              Chart of accounts
            </Button>
          </td>
          <td>
            <Button
              className="btn1"
              variant="secondary"
              icon="feather icon-layers"
              //onClick={onClickSave}
              style={{
                width: "250px",
                height: "100px",
                borderRadius: "12px",
                fontSize: "20px",
                border: "4px solid #ccc",
                marginLeft: "60px",
                marginTop: "42px",
              }}
            >
              Inventory
            </Button>
          </td>
        </tr>
        <tr>
          <td>
            <Button
              className="btn1"
              variant="secondary"
              icon="feather icon-layers"
              //onClick={onClickSave}
              style={{
                width: "250px",
                height: "100px",
                borderRadius: "12px",
                fontSize: "20px",
                border: "4px solid #ccc",
                marginLeft: "60px",
                marginTop: "42px",
              }}
            >
              Tax Codes
            </Button>
          </td>
          <td>
            <Button
              className="btn1"
              variant="secondary"
              icon="feather icon-layers"
              //onClick={onClickSave}
              style={{
                width: "250px",
                height: "100px",
                borderRadius: "12px",
                fontSize: "20px",
                border: "4px solid #ccc",
                marginLeft: "60px",
                marginTop: "42px",
              }}
            >
              Warehouse
            </Button>
          </td>
        </tr>
        <tr>
          <td>
          <Button
              className="btn1"
              variant="secondary"
              icon="feather icon-layers"
              //onClick={onClickSave}
              style={{
                width: "250px",
                height: "100px",
                borderRadius: "12px",
                fontSize: "20px",
                border: "4px solid #ccc",
                marginLeft: "60px",
                marginTop: "42px",
              }}
            >
              UOM
            </Button>

          </td>
        </tr>
      </table>
      {/* <Navbar bg="light" variant="light">
        <Button
          variant="secondary"
          icon="feather icon-layers"
          //onClick={onClickSave}
        >
          Business partner master
        </Button>
        <Button
          variant="secondary"
          icon="feather icon-layers"
          //onClick={OnClickClear}
        >
          BOM
        </Button>
        <Button
          variant="secondary"
          icon="feather icon-layers"
          //onClick={onClickSave}
        >
          Chart of accounts
        </Button>
        <Button
          variant="secondary"
          icon="feather icon-layers"
          //onClick={onClickSave}
        >
          Inventory
        </Button>
      </Navbar> */}
    </div>
  );
};
export default Master;
