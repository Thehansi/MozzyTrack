import React, { useState, useEffect } from "react";
import DataGrid, {
  Column,
  Export,
  Selection,
  GroupPanel,
  Grouping,
  Lookup,
  SearchPanel,
} from "devextreme-react/data-grid";
import { saveAs } from "file-saver-es";
import { exportDataGrid } from "devextreme/excel_exporter";
import { Button } from "react-bootstrap";
import axios from "axios";
import { Prev } from "react-bootstrap/esm/PageItem";
import { useHistory } from "react-router-dom";

const Dashboard = () => {
  const [pending, setPrTypePending] = useState([]);
  const [approve, setPrTypeApprove] = useState([]);
  const [reject, setPrTypeReject] = useState([]);
  const [myRequest, setPRTypemyRequest] = useState([]);
  const [myList, setPRTypemyList] = useState([]);
  const [allPR, setAllPR] = useState([]);
  const [isAdd, setISAdd] = useState(true);
  const [isEdit, setISEdit] = useState(true);
  const [isView, setIsView] = useState(true);
  const [userName, setUserName] = useState({});

  const history = useHistory();

  const [newApproveStatus, setNewApproveStatus] = useState({
    Status: [
      { ID: "0", Name: "Pending" },
      { ID: "1", Name: "Cancel" },
      { ID: "2", Name: "Approve" },
      { ID: "3", Name: "Reject" },
      { ID: "4", Name: "Hold" },
    ],
  });

  useEffect(() => {
    // fetchGroupDetails();
  }, []);
  // const fetchGroupDetails = async () => {
  //   const authData = await JSON.parse(localStorage.getItem("user"));
  //   if (authData == undefined) {
  //     window.location.reload();
  //   }
  //   // const checkAuthentication = await axios.get(
  //   //   "/api/CheckUserAuthentication",
  //   //   {
  //   //     params: { UsersID: authData.UserName, MenuID: 1 },
  //   //   }
  //   // );
  //   setUserName(authData.UserName);
  //   if (checkAuthentication.data.length != 0) {
  //     if (checkAuthentication.data[0].UserView) {
  //       let totalPendingCount = 0;
  //       let totalApproveCount = 0;
  //       let totalRejectCount = 0;
  //       let array = [];
  //       setIsView(false);
  //       const getUserGroup = await axios.get("/api/getUserGroup", {
  //         params: { UserName: authData.UserName },
  //       });
  //       console.log(getUserGroup.data[0].UserGroup);

  //       if (getUserGroup.data.length != 0) {
  //         const myRequest = await axios.get("/api/getPendindPRmyRequest", {
  //           params: {
  //             RequestorName: authData.UserName,
  //           },
  //         });

  //         if (myRequest.data.length > 0) {
  //           console.log("request", myRequest);
  //           totalPendingCount = myRequest.data[0].Count;
  //           setPRTypemyRequest(totalPendingCount);
  //         } else setPRTypemyRequest(0);

  //         const getPending = await axios.get("/api/getPendindPRPending", {
  //           params: {
  //             EnterUser: authData.UserName,
  //             UserGroup: getUserGroup.data[0].UserGroup,
  //           },
  //         });

  //         if (getPending.data.length > 0) {
  //           console.log("Pending", getPending);
  //           totalPendingCount = getPending.data[0].Count;
  //           setPrTypePending(totalPendingCount);
  //         } else setPrTypePending(0);

  //         const getMyList = await axios.get("/api/getPendindPRmyList", {
  //           params: {
  //             EnterUser: authData.UserName,
  //           },
  //         });

  //         if (getMyList.data.length > 0) {
  //           console.log("getMyList", getPending);
  //           totalPendingCount = getMyList.data[0].Count;
  //           setPRTypemyList(totalPendingCount);
  //         } else setPRTypemyList(0);

  //         const getApprove = await axios.get("/api/getPendindPRApprove", {
  //           params: {
  //             EnterUser: authData.UserName,
  //             // ApproveStatus: 2,
  //           },
  //         });

  //         if (getApprove.data.length > 0) {
  //           totalApproveCount = getApprove.data[0].Count;
  //           setPrTypeApprove(totalApproveCount);
  //         } else setPrTypeApprove(0);

  //         const getReject = await axios.get("/api/getPendindPRReject", {
  //           params: {
  //             EnterUser: authData.UserName,
  //             // ApproveStatus: 3,
  //           },
  //         });

  //         if (getReject.data.length > 0) {
  //           totalRejectCount = getReject.data[0].Count;
  //           setPrTypeReject(totalRejectCount);
  //         } else setPrTypeReject(0);
  //       }

  //     }
  //     if (checkAuthentication.data[0].UserAdd) {
  //       setISAdd(false);
  //     }
  //     if (checkAuthentication.data[0].UserEdit) {
  //       setISEdit(false);
  //     }
  //   }
  // };

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
    margin: "10px",
    padding: "40px",
    border: "2px solid #ccc",
    borderRadius: "10px",
    // backgroundColor: "yellow",
  };

  // const boxColors = ["#cca300", "#00b300", "#800000"];
  const boxColors = ["#00b300", "#cca300", "#F15854", "#3399ff", "#702963"];

  const updatePRTable = async (e) => {
    const dataToPass = e.data;
    history.push({
      pathname: "/forms/Purchase-Request/Purchase-Request",
      state: { data: dataToPass, isPD: true, rowIndex: e.data.rowIndex },
    });
  };

  const myRequestClick = async (e) => {
    if (!isView) {
      const authData = await JSON.parse(localStorage.getItem("user"));
      // const getUserGroup = await axios.get("/api/getUserGroup", {
      //   params: { UserName: authData.UserName },
      // });
      // console.log(getUserGroup);
      // if (getUserGroup.data.length != 0) {
      const getMyRequestList = await axios.get("/api/getAllRequestPR", {
        params: {
          RequestorName: authData.UserName,
          // ApproveStatus: 0,
        },
      });
      console.log(getMyRequestList.data.length);
      if (getMyRequestList.data.length !== 0) {
        setAllPR(getMyRequestList.data);
      } else {
        setAllPR(null);
      }
      // }
    }
  };

  const pendingClick = async (e) => {
    if (!isView) {
      const authData = await JSON.parse(localStorage.getItem("user"));
      const getUserGroup = await axios.get("/api/getUserGroup", {
        params: { UserName: authData.UserName },
      });
      console.log(getUserGroup);
      if (getUserGroup.data.length != 0) {
        const getApprovalLevelPR = await axios.get(
          "/api/getAllRequisitionItemList",
          {
            params: {
              EnterUser: authData.UserName,
              UserGroup: getUserGroup.data[0].UserGroup,
            },
          }
        );
        console.log(getApprovalLevelPR.data.length);
        if (getApprovalLevelPR.data.length !== 0) {
          setAllPR(getApprovalLevelPR.data);
        } else {
          setAllPR(null);
        }
      }
    }
  };

  const ApproveClick = async (e) => {
    if (!isView) {
      const authData = await JSON.parse(localStorage.getItem("user"));
      // const getUserGroup = await axios.get("/api/getUserGroup", {
      //   params: { UserName: authData.UserName },
      // });
      //getUserGroup.data.length != 0
      const getApprovalLevelPR = await axios.get("/api/getApprovePendindPR", {
        params: {
          EnterUser: authData.UserName,
          // ApproveStatus: 2,
        },
      });
      console.log(getApprovalLevelPR.data.length);
      if (getApprovalLevelPR.data.length !== 0) {
        setAllPR(getApprovalLevelPR.data);
      } else {
        setAllPR(null);
      }
    }
  };

  const RejectClick = async (e) => {
    if (!isView) {
      const authData = await JSON.parse(localStorage.getItem("user"));
      const getApprovalLevelPR = await axios.get(
        "/api/getApproveRejectCanselHoldPR",
        {
          params: {
            EnterUser: authData.UserName,
            // ApproveStatus: 3,
          },
        }
      );
      console.log(getApprovalLevelPR.data.length);
      if (getApprovalLevelPR.data.length !== 0) {
        setAllPR(getApprovalLevelPR.data);
      } else {
        setAllPR(null);
      }
    }
  };

  const myListClick = async () => {
    if (!isView) {
      const authData = await JSON.parse(localStorage.getItem("user"));
      const getUserGroup = await axios.get("/api/getUserGroup", {
        params: { UserName: authData.UserName },
      });
      console.log(getUserGroup);
      if (getUserGroup.data.length != 0) {
        const getApprovalLevelPR = await axios.get(
          "/api/getPendindPRmyListDetails",
          {
            params: {
              EnterUser: authData.UserName,
            },
          }
        );
        console.log(getApprovalLevelPR.data.length);
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
      <div style={containerStyle} className='container'>
        {/* Box 1 */}
        <div
          style={{ ...boxStyle, backgroundColor: boxColors[4] }}
          className='box'
          onClick={myListClick}
        >
          <p style={{ color: "white", fontSize: "56px", fontWeight: "bold" }}>
            {myList}
          </p>
          <p style={{ color: "white", fontSize: "24px" }}>Dashboard</p>
        </div>{" "}
        <div
          style={{ ...boxStyle, backgroundColor: boxColors[3] }}
          className='box'
          onClick={myRequestClick}
        >
          <p style={{ color: "white", fontSize: "56px", fontWeight: "bold" }}>
            {myRequest}
          </p>
          <p style={{ color: "white", fontSize: "24px" }}>Dashboard</p>
        </div>
        {/* <div
          style={{ ...boxStyle, backgroundColor: boxColors[0] }}
          className='box'
          onClick={ApproveClick}
        >
          <p style={{ color: "white", fontSize: "56px", fontWeight: "bold" }}>
            {approve}
          </p>
          <p style={{ color: "white", fontSize: "24px" }}>Already Approved</p>
        </div>

        {/* <div
          style={{ ...boxStyle, backgroundColor: boxColors[1] }}
          className='box'
          onClick={pendingClick}
        >
          <p style={{ color: "white", fontSize: "56px", fontWeight: "bold" }}>
            {pending}
          </p>
          <p style={{ color: "white", fontSize: "24px" }}>To be Approved</p>
        </div> */}
        {/* Box 3 */}
        {/* <div
          style={{ ...boxStyle, backgroundColor: boxColors[2] }}
          className='box'
          onClick={RejectClick}
        >
          <p style={{ color: "white", fontSize: "56px", fontWeight: "bold" }}>
            {reject}
          </p>
          <p style={{ color: "white", fontSize: "24px" }}>Rejected</p>
        </div> */}
      </div>
      <br />

      {/* <div>
        <DataGrid
          width='100%'
          showBorders={true}
          hoverStateEnabled={true}
          dataSource={allPR}
          onCellDblClick={updatePRTable}
          allowColumnResizing={true}
          // onExporting={onExporting}
        >
          <SearchPanel visible={true} />
          <Column dataField='PRNumber' caption='PR Number' />
          <Column dataField='PRType' caption='PR Type' />
          <Column dataField='CreatedDate' dataType='date' width={100} />
          <Column dataField='PRHeaderID' visible={false} />
          <Column dataField='ItemCategory' caption='Item Type' />
          <Column dataField='ApproveStatus'>
            <Lookup
              items={newApproveStatus.Status}
              valueExpr='ID'
              displayExpr='Name'
            ></Lookup>
          </Column>
          <Column dataField='ApproveLevel' />
          <Column dataField='ApproveUser' caption='System User' />
        </DataGrid>
      </div> */}
    </div>
  );
};

export default Dashboard;
