import React, { Component, useState, useRef, useEffect } from "react";
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
  SearchPanel,
  Export,
} from "devextreme-react/data-grid";
import axios from "axios";
import notify from "devextreme/ui/notify";
import { LoadPanel } from "devextreme-react/load-panel";
import { connect } from "react-redux";

import { Workbook } from "exceljs";
import saveAs from "file-saver";
import { exportDataGrid } from "devextreme/excel_exporter";

const RequisitionList = () => {
  const [state, setState] = useState({
    GroupTable: [],
  });
  const validStatus = [
    { ID: 0, Name: "Expired" },
    { ID: 1, Name: "Valid" },
  ];
  const [isView, setIsView] = useState(true);
  useEffect(() => {
    fetchGroupDetails();
  }, []);
  const fetchGroupDetails = async () => {
    const authData = JSON.parse(localStorage.getItem("user"));
    const checkAuthentication = await axios.get(
      "/api/CheckUserAuthentication",
      {
        params: { UsersID: authData.UserName, MenuID: 1101 },
      }
    );
    if (checkAuthentication.data.length != 0) {
      if (checkAuthentication.data[0].UserView) {
        setIsView(false);
        try {
          axios
            .all([
              axios.get(
                "/api/getRequisitionList"
                // , {
                //   params: { UserName: authData.UserName },
                // }
              ),
            ])
            .then(
              axios.spread(async (UserGroup) => {
                if (UserGroup.data.length != 0) {
                  console.log(UserGroup);
                  setState({ GroupTable: UserGroup.data });
                }
              })
            )
            .catch((error) => console.error(error));
        } catch (error) {
          console.log(error);
        }
      }
    }
  };
  const CreateDateTime = (dateTime) => {
    const year = dateTime.getFullYear();
    const month = (dateTime.getMonth() + 1).toString().padStart(2, "0");
    const date = dateTime.getDate().toString().padStart(2, "0");
    const hours = dateTime.getHours().toString().padStart(2, "0");
    const minutes = dateTime.getMinutes().toString().padStart(2, "0");
    const formattedDateTime = `${year}.${month}.${date}.${hours}:${minutes}`;
    console.log(formattedDateTime);
    return formattedDateTime;
  };
  const onExporting = async (e) => {
    let date = await CreateDateTime(new Date());
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Main sheet");
    exportDataGrid({
      component: e.component,
      worksheet: worksheet,
      customizeCell: function (options) {
        options.excelCell.font = { name: "Arial", size: 12 };
        options.excelCell.alignment = { horizontal: "left" };
      },
    }).then(function () {
      workbook.xlsx.writeBuffer().then(function (buffer) {
        saveAs(
          new Blob([buffer], { type: "application/octet-stream" }),
          "Requisition List " + date + ".xlsx"
        );
      });
    });
  };

  return (
    <div>
      <Card title="Requisition List">
        <DataGrid
          allowColumnReordering={true}
          showBorders={true}
          dataSource={state.GroupTable}
          hoverStateEnabled={true}
          onExporting={onExporting}
          columnAutoWidth={true}
        >
          <Paging enabled={true} />
          <Export enabled={true} />
          <Editing mode="row" />
          <SearchPanel visible={true} />
          <Column dataField="PRType" caption="PR Type" />
          <Column dataField="PRNumber" caption="PR Number" width={"180"} />
          <Column
            dataField="CreatedDate"
            editorType="dxDateBox"
            caption="Created Date"
            dataType="date"
          ></Column>

          <Column
            dataField="Date"
            editorType="dxDateBox"
            caption="Requested Date"
            dataType="date"
          ></Column>
          <Column
            dataField="ValidFrom"
            editorType="dxDateBox"
            caption="Valid From"
            dataType="date"
          ></Column>

          <Column
            dataField="ValidTo"
            editorType="dxDateBox"
            caption="Valid To"
            dataType="date"
          ></Column>
          <Column dataField="ValidityStatus">
            <Lookup items={validStatus} valueExpr="ID" displayExpr="Name" />
          </Column>
          <Column dataField="RequestorName" />
          <Column dataField="ApproveLevel" />

          <Column
            dataField="ApproveDate"
            editorType="dxDateBox"
            caption="Approve Date"
            dataType="date"
          ></Column>
          <Column dataField="ApproveUser" />
        </DataGrid>
      </Card>
    </div>
  );
};

export default RequisitionList;
