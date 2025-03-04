// import { useEffect, useRef } from "react";
// import { DxReportViewer } from "devexpress-reporting/dx-webdocumentviewer";
// import * as ko from "knockout";
// import React from "react";

// const ReportViewer = () => {
//   const reportUrl = ko.observable("TestReport");
//   const viewerRef = useRef();
//   const requestOptions = {
//     host: "https://localhost:3001/",
//     invokeAction: "DXXRDV",
//   };

//   useEffect(() => {
//     const viewer = new DxReportViewer(viewerRef.current, {
//       reportUrl,
//       requestOptions,
//     });
//     viewer.render();
//     return () => viewer.dispose();
//   });
//   return <div ref={viewerRef}></div>;
// };

// const Supplier = () => {
//   return (
//     <div style={{ width: "100%", height: "1000px" }}>
//       <ReportViewer />
//     </div>
//   );
// };

// export default Supplier;

import DataGrid, {
  Column,
  Editing,
  Paging,
  SearchPanel,
} from "devextreme-react/data-grid";
import React, { useState, useEffect } from "react";
import Card from "../../App/components/MainCard";
import axios from "axios";

const Supplier = () => {
  const [supplier, setSupplier] = useState([]);

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
        const supplierDetails = await axios.get("/api/getAllSupplier");
        setSupplier(supplierDetails.data);
      }
    }
  };
  return (
    <div>
      <Card title="Supplier">
        <DataGrid
          id="Supplier"
          allowColumnReordering={true}
          showBorders={true}
          allowSearch={true}
          dataSource={supplier}
        >
          <Paging enabled={true} />
          <SearchPanel visible={true} />
          <Editing mode="row" />
          <Column dataField="CustCode" caption="Supplier Code" />
          <Column dataField="CustName" caption="Supplier Name" />
        </DataGrid>
      </Card>
    </div>
  );
};
export default Supplier;
