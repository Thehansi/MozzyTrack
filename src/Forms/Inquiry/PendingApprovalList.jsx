import React, { useState, useEffect } from "react";
import DataGrid, {
  Column,
  Export,
  Selection,
  GroupPanel,
  Grouping,
  SearchPanel,
} from "devextreme-react/data-grid";
import { Workbook } from "exceljs";
import saveAs from "file-saver";
import { exportDataGrid } from "devextreme/excel_exporter";
import { Button } from "react-bootstrap";
import axios from "axios";
import { Prev } from "react-bootstrap/esm/PageItem";
import { useHistory } from "react-router-dom";

const PendingApprovalList = () => {
  const [pending, setPrTypePending] = useState([]);
  const [approve, setPrTypeApprove] = useState([]);
  const [reject, setPrTypeReject] = useState([]);
  const [allPR, setAllPR] = useState([]);
  const [isView, setIsView] = useState(true);
  const [userName, setUserName] = useState({});
  const history = useHistory();
  useEffect(() => {
    fetchGroupDetails();
  }, []);
  const fetchGroupDetails = async () => {
    const authData = JSON.parse(localStorage.getItem("user"));
    const checkAuthentication = await axios.get(
      "/api/CheckUserAuthentication",
      {
        params: { UsersID: authData.UserName, MenuID: 1106 },
      }
    );
    setUserName(authData.UserName);
    if (checkAuthentication.data.length != 0) {
      if (checkAuthentication.data[0].UserView) {
        setIsView(false);
        try {
          axios
            .all([
              axios.get("/api/getApprovalLevelDocuments", {
                params: { UserName: authData.UserName },
              }),
            ])
            .then(
              axios.spread(async (approvalLevel) => {
                let totalPendingCount = 0;
                let totalApproveCount = 0;
                let totalRejectCount = 0;
                let array = [];
                approvalLevel.data.forEach(async (element) => {
                  const getUserGroup = await axios.get("/api/getUserGroup", {
                    params: { UserName: authData.UserName },
                  });
                  if (getUserGroup.data.length != 0) {
                    const getPending = await axios.get(
                      "/api/getPendindPRPending",
                      {
                        params: {
                          UserGroup: getUserGroup.data[0].UserGroup,
                          ApproveStatus: 0,
                        },
                      }
                    );
                    totalPendingCount += getPending.data[0].Count;
                    setPrTypePending(totalPendingCount);
                    const getApprove = await axios.get(
                      "/api/getPendindPRApprove",
                      {
                        params: {
                          UserGroup: getUserGroup.data[0].UserGroup,
                          ApproveStatus: 2,
                        },
                      }
                    );
                    totalApproveCount += getApprove.data[0].Count;
                    setPrTypeApprove(totalApproveCount);
                    const getReject = await axios.get(
                      "/api/getPendindPRReject",
                      {
                        params: {
                          UserGroup: getUserGroup.data[0].UserGroup,
                          ApproveStatus: 3,
                        },
                      }
                    );
                    totalRejectCount += getReject.data[0].Count;
                    setPrTypeReject(totalRejectCount);
                  }
                  // const getApprovalLevelPR = await axios.get(
                  //   "/api/getApprovalLevelPR",
                  //   {
                  //     params: { ApprovalLevel: element.ApprovalLevel },
                  //   }
                  // );
                  // console.log("getApprovalLevelPR", getApprovalLevelPR.data.length);
                  // if (getApprovalLevelPR.data.length !== 0) {
                  //   // array = [...array]; getApprovalLevelPR.data.length !== 0
                  //   array.push(getApprovalLevelPR.data);
                  //   // array[0] = getApprovalLevelPR.data;
                  //   console.log("awa", getApprovalLevelPR.data);
                  // }
                  // console.log("array", array);
                  // setAllPR(array[0]);
                });
                const getApprovalLevelPR = await axios.get(
                  "/api/getRequisitionItemList",
                  {
                    params: { UserName: userName },
                  }
                );
                if (getApprovalLevelPR.data.length !== 0) {
                  setAllPR(getApprovalLevelPR.data);
                }

                // flattenArray(array)
              })
            )
            .catch((error) => console.error(error));
        } catch (error) {
          // console.error("Error fetching details:", error);
        }
      }
    }
  };

  const gridStyle = {
    backgroundColor: "lightblue",
    padding: "20px",
    marginBottom: "20px",
  };

  const containerStyle = {
    display: "flex",
    border: "2px solid black",
  };

  const boxStyle = {
    flex: 1,
    margin: "15px",
    padding: "40px",
    border: "2px solid #ccc",
    borderRadius: "10px",
    // backgroundColor: "yellow",
  };

  const boxColors = ["#00b300", "#cca300", "#F15854"];

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
          "Pending Approval List " + date + ".xlsx"
        );
      });
    });
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

  const updatePRTable = async (e) => {
    const dataToPass = e.data;
    history.push({
      pathname: "/forms/Purchase-Request/Purchase-Request",
      state: { data: dataToPass, isPD: true, rowIndex: e.data.rowIndex },
    });
  };
  const ApproveClick = async (e) => {
    if (!isView) {
      const authData = await JSON.parse(localStorage.getItem("user"));
      const getUserGroup = await axios.get("/api/getUserGroup", {
        params: { UserName: authData.UserName },
      });
      if (getUserGroup.data.length != 0) {
        const getApprovalLevelPR = await axios.get(
          "/api/getAllRequisitionItemList",
          {
            params: {
              UserGroup: getUserGroup.data[0].UserGroup,
              ApproveStatus: 2,
            },
          }
        );
        if (getApprovalLevelPR.data.length !== 0) {
          setAllPR(getApprovalLevelPR.data);
        } else {
          setAllPR(null);
        }
      }
    }
  };
  const RejectClick = async (e) => {
    if (!isView) {
      const authData = await JSON.parse(localStorage.getItem("user"));
      const getUserGroup = await axios.get("/api/getUserGroup", {
        params: { UserName: authData.UserName },
      });
      if (getUserGroup.data.length != 0) {
        const getApprovalLevelPR = await axios.get(
          "/api/getAllRequisitionItemList",
          {
            params: {
              UserGroup: getUserGroup.data[0].UserGroup,
              ApproveStatus: 3,
            },
          }
        );
        if (getApprovalLevelPR.data.length !== 0) {
          setAllPR(getApprovalLevelPR.data);
        } else {
          setAllPR(null);
        }
      }
    }
  };
  const pendingClick = async (e) => {
    if (!isView) {
      const authData = await JSON.parse(localStorage.getItem("user"));
      const getUserGroup = await axios.get("/api/getUserGroup", {
        params: { UserName: authData.UserName },
      });
      if (getUserGroup.data.length != 0) {
        const getApprovalLevelPR = await axios.get(
          "/api/getAllRequisitionItemList",
          {
            params: {
              UserGroup: getUserGroup.data[0].UserGroup,
              ApproveStatus: 0,
            },
          }
        );
        if (getApprovalLevelPR.data.length !== 0) {
          setAllPR(getApprovalLevelPR.data);
        } else {
          setAllPR(null);
        }
      }
    }
  };
  return (
    <div>
      <div style={containerStyle} className="container">
        {/* Box 1 */}
        <div
          style={{ ...boxStyle, backgroundColor: boxColors[0] }}
          className="box"
          onClick={ApproveClick}
        >
          <p style={{ color: "white", fontSize: "56px", fontWeight: "bold" }}>
            {approve}
          </p>
          <p style={{ color: "white", fontSize: "24px" }}>Already Approved</p>
        </div>

        {/* Box 2 */}
        <div
          style={{ ...boxStyle, backgroundColor: boxColors[1] }}
          className="box"
          onClick={pendingClick}
        >
          <p style={{ color: "white", fontSize: "56px", fontWeight: "bold" }}>
            {pending}
          </p>
          <p style={{ color: "white", fontSize: "24px" }}>To be Approved</p>
        </div>

        {/* Box 3 */}
        <div
          style={{ ...boxStyle, backgroundColor: boxColors[2] }}
          className="box"
          onClick={RejectClick}
        >
          <p style={{ color: "white", fontSize: "56px", fontWeight: "bold" }}>
            {reject}
          </p>
          <p style={{ color: "white", fontSize: "24px" }}>Rejected</p>
        </div>
      </div>
      <br />

      <div>
        <DataGrid
          width="100%"
          showBorders={true}
          hoverStateEnabled={true}
          dataSource={allPR}
          onExporting={onExporting}
          onCellDblClick={updatePRTable}
          columnAutoWidth={true}
          allowColumnResizing={true}
        >
          <Export enabled={true} />
          <SearchPanel visible={true} />
          <Export enabled={true} />
          <Column dataField="PR_Number" caption="PR Number" />
          <Column dataField="PR_Type" caption="PR Type" />
          <Column dataField="CreateDate" dataType="date" width={100} />
          <Column dataField="PR_ID" visible={false} />
          <Column dataField="Item_Type" caption="Item Type" />
          {/* <Column dataField="TotalAmount" /> */}
          <Column dataField="ApprovalLevel" />
          <Column dataField="UserGroup" />
          {/* <Column dataField="Select" /> */}

          {/* <Export enabled={true} allowExportSelectedData={true} /> */}
        </DataGrid>
      </div>
    </div>
  );
};

export default PendingApprovalList;
