import { ActionSheet } from "devextreme-react";
import * as actionTypes from "./actions";
import axios from "axios";
import notify from "devextreme/ui/notify";
export const IsLogginReuqest = () => {
  return {
    type: actionTypes.USER_REQUEST_TO_LOGGIN,
    payLoad: [],
    message: "Error Loggin",
  };
};
export const getData = () => {
  return {
    type: actionTypes.GET_USER_LOGGIN_DATA,
    payLoad: [],
    message: "Error Loggin Attempt",
  };
};

const IsLoggedSuccess = (
  userData,
  schools,
  authorization
  // approvalDocument
) => {
  return {
    type: actionTypes.SET_USER,
    payLoad: userData,
    message: "Loggin Success",
    School: schools,
    Authorization: authorization,
    // ApprovalDocument: approvalDocument,
  };
};

export const IsRoundData = (userData, schools, authorization) => {
  return {
    type: actionTypes.SET_USER,
    payLoad: userData,
    message: "Loggin Success",
    School: schools,
    Authorization: authorization,
  };
};

const IsLogginError = (error) => {
  return {
    type: actionTypes.ERRROR_LOGGIN,
    payLoad: error,
    message: "Error Loggin",
  };
};

export const loggout = () => {
  localStorage.setItem("user", null);
  localStorage.setItem("School", null);
  localStorage.setItem("Authorization", null);
  // localStorage.setItem("ApprovalDocument", null);
  return (dispatch) => {
    dispatch(IsLogginError(""));
  };
};

const OnNotification = (message, type) => {
  notify({
    message: message,
    type: type,
    displayTime: 3000,
    position: { at: "top right", offset: "50" },
  });
};

export const fetchLoginData = (UserID, CurrentPassword) => {
  return (dispatch) => {
    if (UserID && CurrentPassword) {
      dispatch(IsLogginReuqest);

      // Mock User Data
      const mockUser = {
        UserID,
        Name: "Theshani",
        Role: "Admin",
        Active: 1,
      };

      // Mock Authorization Data
      const UserWiseAuthorization = [
        { MenuID: 1000, Auth: 1 },
        { MenuID: 1001, Auth: 1 },
        { MenuID: 1002, Auth: 1 },
        { MenuID: 1003, Auth: 1 },
        { MenuID: 1004, Auth: 1 },
      ];

      console.log("Mock User Login", mockUser);

      dispatch(IsLoggedSuccess(mockUser, UserWiseAuthorization));

      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem(
        "Authorization",
        JSON.stringify(UserWiseAuthorization)
      );

      OnNotification("Login Successful", "success");
    } else {
      OnNotification("Invalid UserName Or Password", "error");
      dispatch(IsLogginError("Invalid UserName Or Password"));
    }
  };
};

// export const fetchLoginData = (UserID, CurrentPassword) => {
//   return (dispatch) => {
//     if (UserID != undefined && CurrentPassword != undefined) {
//       dispatch(IsLogginReuqest);
//       axios
//         .get(`/api/authontication-login`, {
//           params: { GroupID: UserID, CurrentPassword: CurrentPassword },
//         })
//         .then((respones) => {
//           console.log("User Permision", respones);
//           const user = JSON.parse(respones.data[0].Users);
//           console.log("User Permision user", user);
//           const UserWiseAuthorization = [
//             { MenuID: 1000, Auth: 0 },
//             { MenuID: 1001, Auth: 0 },
//             { MenuID: 1002, Auth: 0 },
//             { MenuID: 1003, Auth: 0 },
//             { MenuID: 1004, Auth: 0 },
//             { MenuID: 1500, Auth: 0 },
//             { MenuID: 9010, Auth: 0 },
//             { MenuID: 9011, Auth: 0 },
//             { MenuID: 9012, Auth: 0 },
//             { MenuID: 9013, Auth: 0 },
//             { MenuID: 9014, Auth: 0 },
//             { MenuID: 9004, Auth: 0 },
//             { MenuID: 9005, Auth: 0 },
//             { MenuID: 9006, Auth: 0 },
//             { MenuID: 9007, Auth: 0 },
//             { MenuID: 9008, Auth: 0 },
//             { MenuID: 9009, Auth: 0 },
//             { MenuID: 7502, Auth: 0 },
//             { MenuID: 7503, Auth: 0 },
//             { MenuID: 9000, Auth: 0 },
//             { MenuID: 9001, Auth: 0 },
//             { MenuID: 9002, Auth: 0 },
//             { MenuID: 9003, Auth: 0 },
//             { MenuID: 7001, Auth: 0 },
//             { MenuID: 7002, Auth: 0 },
//             { MenuID: 7003, Auth: 0 },
//             { MenuID: 7004, Auth: 0 },
//             { MenuID: 7500, Auth: 0 },
//             { MenuID: 7501, Auth: 0 },
//             { MenuID: 6002, Auth: 0 },
//             { MenuID: 6003, Auth: 0 },
//             { MenuID: 6004, Auth: 0 },
//             { MenuID: 6500, Auth: 0 },
//             { MenuID: 6501, Auth: 0 },
//             { MenuID: 7000, Auth: 0 },
//             { MenuID: 5001, Auth: 0 },
//             { MenuID: 5002, Auth: 0 },
//             { MenuID: 5003, Auth: 0 },
//             { MenuID: 5004, Auth: 0 },
//             { MenuID: 6000, Auth: 0 },
//             { MenuID: 6001, Auth: 0 },
//             { MenuID: 4011, Auth: 0 },
//             { MenuID: 4012, Auth: 0 },
//             { MenuID: 4013, Auth: 0 },
//             { MenuID: 4014, Auth: 0 },
//             { MenuID: 4015, Auth: 0 },
//             { MenuID: 5000, Auth: 0 },
//             { MenuID: 4005, Auth: 0 },
//             { MenuID: 4006, Auth: 0 },
//             { MenuID: 4007, Auth: 0 },
//             { MenuID: 4008, Auth: 0 },
//             { MenuID: 4009, Auth: 0 },
//             { MenuID: 4010, Auth: 0 },
//             { MenuID: 3012, Auth: 0 },
//             { MenuID: 4000, Auth: 0 },
//             { MenuID: 4001, Auth: 0 },
//             { MenuID: 4002, Auth: 0 },
//             { MenuID: 4003, Auth: 0 },
//             { MenuID: 4004, Auth: 0 },
//             { MenuID: 3006, Auth: 0 },
//             { MenuID: 3007, Auth: 0 },
//             { MenuID: 3008, Auth: 0 },
//             { MenuID: 3009, Auth: 0 },
//             { MenuID: 3010, Auth: 0 },
//             { MenuID: 3011, Auth: 0 },
//             { MenuID: 3000, Auth: 0 },
//             { MenuID: 3001, Auth: 0 },
//             { MenuID: 3002, Auth: 0 },
//             { MenuID: 3003, Auth: 0 },
//             { MenuID: 3004, Auth: 0 },
//             { MenuID: 3005, Auth: 0 },
//             { MenuID: 2004, Auth: 0 },
//             { MenuID: 2005, Auth: 0 },
//             { MenuID: 2006, Auth: 0 },
//             { MenuID: 2007, Auth: 0 },
//             { MenuID: 2008, Auth: 0 },
//             { MenuID: 2009, Auth: 0 },
//             { MenuID: 1907, Auth: 0 },
//             { MenuID: 1908, Auth: 0 },
//             { MenuID: 2000, Auth: 0 },
//             { MenuID: 2001, Auth: 0 },
//             { MenuID: 2002, Auth: 0 },
//             { MenuID: 2003, Auth: 0 },
//             { MenuID: 1901, Auth: 0 },
//             { MenuID: 1902, Auth: 0 },
//             { MenuID: 1903, Auth: 0 },
//             { MenuID: 1904, Auth: 0 },
//             { MenuID: 1905, Auth: 0 },
//             { MenuID: 1906, Auth: 0 },
//             { MenuID: 1800, Auth: 0 },
//             { MenuID: 1801, Auth: 0 },
//             { MenuID: 1850, Auth: 0 },
//             { MenuID: 1851, Auth: 0 },
//             { MenuID: 1852, Auth: 0 },
//             { MenuID: 1900, Auth: 0 },
//             { MenuID: 1651, Auth: 0 },
//             { MenuID: 1652, Auth: 0 },
//             { MenuID: 1700, Auth: 0 },
//             { MenuID: 1701, Auth: 0 },
//             { MenuID: 1750, Auth: 0 },
//             { MenuID: 1751, Auth: 0 },
//             { MenuID: 1507, Auth: 0 },
//             { MenuID: 1550, Auth: 0 },
//             { MenuID: 1551, Auth: 0 },
//             { MenuID: 1600, Auth: 0 },
//             { MenuID: 1601, Auth: 0 },
//             { MenuID: 1650, Auth: 0 },
//             { MenuID: 1501, Auth: 0 },
//             { MenuID: 1502, Auth: 0 },
//             { MenuID: 1503, Auth: 0 },
//             { MenuID: 1504, Auth: 0 },
//             { MenuID: 1505, Auth: 0 },
//             { MenuID: 1506, Auth: 0 },
//             { MenuID: 1018, Auth: 0 },
//             { MenuID: 1012, Auth: 0 },
//             { MenuID: 1015, Auth: 0 },
//             { MenuID: 1016, Auth: 0 },
//             { MenuID: 1010, Auth: 0 },
//             { MenuID: 1019, Auth: 0 },
//             { MenuID: 1013, Auth: 0 },
//             { MenuID: 1007, Auth: 0 },
//             { MenuID: 1014, Auth: 0 },
//             { MenuID: 1008, Auth: 0 },
//             { MenuID: 9999, Auth: 0 },
//             { MenuID: 1011, Auth: 0 },
//             { MenuID: 1005, Auth: 0 },
//             { MenuID: 9015, Auth: 0 },
//             { MenuID: 1006, Auth: 0 },
//             { MenuID: 1017, Auth: 0 },
//             { MenuID: 1009, Auth: 0 },
//           ];

//           const ApprovalDocument = null;
//           console.log("length", Object.keys(user).length);
//           if (Object.keys(user).length !== 0 && user.Active == 1) {
//             dispatch(
//               IsLoggedSuccess(
//                 user,
//                 UserWiseAuthorization
//               )
//             );
//             localStorage.setItem("user", JSON.stringify(user));
//             localStorage.setItem(
//               "Authorization",
//               JSON.stringify(UserWiseAuthorization)
//             );
//           } else {
//             OnNotification("Invalid User Name or Passrwod", "error");
//             dispatch(IsLogginError("Error Loggin Attempt"));
//           }
//         })
//         .catch((error) => {
//           OnNotification("Invalid UserName Or Passwrod", "error");
//           const errorMsg = error.message;
//           dispatch(IsLogginError(errorMsg));
//         });
//     } else {
//       OnNotification("Invalid UserName Or Passwrod", "error");
//       const errorMsg = "Invalid UserName Or Passwrod";
//       dispatch(IsLogginError(errorMsg));
//     }
//   };
// };

// export const fetchLoginData = (email, password) => {
//   return (dispatch) => {
//     const user = {
//       Id: 5097,
//       UserName: "AdminPBSS",
//       FullName: "AdminPBSS",
//       Status: 1,
//       GroupID: 3,
//     };
//     //const UserWiseSchool = "";
//     const UserWiseAuthorization = [
//       { MenuID: 1000, Auth: 0 },
//       { MenuID: 1001, Auth: 0 },
//       { MenuID: 1002, Auth: 0 },
//       { MenuID: 1003, Auth: 0 },
//       { MenuID: 1004, Auth: 0 },
//       { MenuID: 1500, Auth: 0 },
//       { MenuID: 9010, Auth: 0 },
//       { MenuID: 9011, Auth: 0 },
//       { MenuID: 9012, Auth: 0 },
//       { MenuID: 9013, Auth: 0 },
//       { MenuID: 9014, Auth: 0 },
//       { MenuID: 9004, Auth: 0 },
//       { MenuID: 9005, Auth: 0 },
//       { MenuID: 9006, Auth: 0 },
//       { MenuID: 9007, Auth: 0 },
//       { MenuID: 9008, Auth: 0 },
//       { MenuID: 9009, Auth: 0 },
//       { MenuID: 7502, Auth: 0 },
//       { MenuID: 7503, Auth: 0 },
//       { MenuID: 9000, Auth: 0 },
//       { MenuID: 9001, Auth: 0 },
//       { MenuID: 9002, Auth: 0 },
//       { MenuID: 9003, Auth: 0 },
//       { MenuID: 7001, Auth: 0 },
//       { MenuID: 7002, Auth: 0 },
//       { MenuID: 7003, Auth: 0 },
//       { MenuID: 7004, Auth: 0 },
//       { MenuID: 7500, Auth: 0 },
//       { MenuID: 7501, Auth: 0 },
//       { MenuID: 6002, Auth: 0 },
//       { MenuID: 6003, Auth: 0 },
//       { MenuID: 6004, Auth: 0 },
//       { MenuID: 6500, Auth: 0 },
//       { MenuID: 6501, Auth: 0 },
//       { MenuID: 7000, Auth: 0 },
//       { MenuID: 5001, Auth: 0 },
//       { MenuID: 5002, Auth: 0 },
//       { MenuID: 5003, Auth: 0 },
//       { MenuID: 5004, Auth: 0 },
//       { MenuID: 6000, Auth: 0 },
//       { MenuID: 6001, Auth: 0 },
//       { MenuID: 4011, Auth: 0 },
//       { MenuID: 4012, Auth: 0 },
//       { MenuID: 4013, Auth: 0 },
//       { MenuID: 4014, Auth: 0 },
//       { MenuID: 4015, Auth: 0 },
//       { MenuID: 5000, Auth: 0 },
//       { MenuID: 4005, Auth: 0 },
//       { MenuID: 4006, Auth: 0 },
//       { MenuID: 4007, Auth: 0 },
//       { MenuID: 4008, Auth: 0 },
//       { MenuID: 4009, Auth: 0 },
//       { MenuID: 4010, Auth: 0 },
//       { MenuID: 3012, Auth: 0 },
//       { MenuID: 4000, Auth: 0 },
//       { MenuID: 4001, Auth: 0 },
//       { MenuID: 4002, Auth: 0 },
//       { MenuID: 4003, Auth: 0 },
//       { MenuID: 4004, Auth: 0 },
//       { MenuID: 3006, Auth: 0 },
//       { MenuID: 3007, Auth: 0 },
//       { MenuID: 3008, Auth: 0 },
//       { MenuID: 3009, Auth: 0 },
//       { MenuID: 3010, Auth: 0 },
//       { MenuID: 3011, Auth: 0 },
//       { MenuID: 3000, Auth: 0 },
//       { MenuID: 3001, Auth: 0 },
//       { MenuID: 3002, Auth: 0 },
//       { MenuID: 3003, Auth: 0 },
//       { MenuID: 3004, Auth: 0 },
//       { MenuID: 3005, Auth: 0 },
//       { MenuID: 2004, Auth: 0 },
//       { MenuID: 2005, Auth: 0 },
//       { MenuID: 2006, Auth: 0 },
//       { MenuID: 2007, Auth: 0 },
//       { MenuID: 2008, Auth: 0 },
//       { MenuID: 2009, Auth: 0 },
//       { MenuID: 1907, Auth: 0 },
//       { MenuID: 1908, Auth: 0 },
//       { MenuID: 2000, Auth: 0 },
//       { MenuID: 2001, Auth: 0 },
//       { MenuID: 2002, Auth: 0 },
//       { MenuID: 2003, Auth: 0 },
//       { MenuID: 1901, Auth: 0 },
//       { MenuID: 1902, Auth: 0 },
//       { MenuID: 1903, Auth: 0 },
//       { MenuID: 1904, Auth: 0 },
//       { MenuID: 1905, Auth: 0 },
//       { MenuID: 1906, Auth: 0 },
//       { MenuID: 1800, Auth: 0 },
//       { MenuID: 1801, Auth: 0 },
//       { MenuID: 1850, Auth: 0 },
//       { MenuID: 1851, Auth: 0 },
//       { MenuID: 1852, Auth: 0 },
//       { MenuID: 1900, Auth: 0 },
//       { MenuID: 1651, Auth: 0 },
//       { MenuID: 1652, Auth: 0 },
//       { MenuID: 1700, Auth: 0 },
//       { MenuID: 1701, Auth: 0 },
//       { MenuID: 1750, Auth: 0 },
//       { MenuID: 1751, Auth: 0 },
//       { MenuID: 1507, Auth: 0 },
//       { MenuID: 1550, Auth: 0 },
//       { MenuID: 1551, Auth: 0 },
//       { MenuID: 1600, Auth: 0 },
//       { MenuID: 1601, Auth: 0 },
//       { MenuID: 1650, Auth: 0 },
//       { MenuID: 1501, Auth: 0 },
//       { MenuID: 1502, Auth: 0 },
//       { MenuID: 1503, Auth: 0 },
//       { MenuID: 1504, Auth: 0 },
//       { MenuID: 1505, Auth: 0 },
//       { MenuID: 1506, Auth: 0 },
//       { MenuID: 1018, Auth: 0 },
//       { MenuID: 1012, Auth: 0 },
//       { MenuID: 1015, Auth: 0 },
//       { MenuID: 1016, Auth: 0 },
//       { MenuID: 1010, Auth: 0 },
//       { MenuID: 1019, Auth: 0 },
//       { MenuID: 1013, Auth: 0 },
//       { MenuID: 1007, Auth: 0 },
//       { MenuID: 1014, Auth: 0 },
//       { MenuID: 1008, Auth: 0 },
//       { MenuID: 9999, Auth: 0 },
//       { MenuID: 1011, Auth: 0 },
//       { MenuID: 1005, Auth: 0 },
//       { MenuID: 9015, Auth: 0 },
//       { MenuID: 1006, Auth: 0 },
//       { MenuID: 1017, Auth: 0 },
//       { MenuID: 1009, Auth: 0 },
//     ];
//     // const ApprovalDocument = JSON.parse();

//     dispatch(IsLogginReuqest);
//     localStorage.setItem("user", JSON.stringify(user));
//     //localStorage.setItem("School", JSON.stringify(UserWiseSchool));
//     localStorage.setItem(
//       "Authorization",
//       JSON.stringify(UserWiseAuthorization)
//     );
//     // localStorage.setItem("ApprovalDocument", JSON.stringify(ApprovalDocument));

//     // axios
//     //   .get(`/api/authontication-login?email=${email}&passowrd=${password}`)
//     //   .then((respones) => {
//     //     const user = JSON.parse(respones.data[0].Users);
//     //     const UserWiseSchool = "";
//     //     const UserWiseAuthorization = JSON.parse(
//     //       respones.data[0].UserWiseAuthorization
//     //     );
//     //     const ApprovalDocument = JSON.parse(respones.data[0].ApprovalDocument);

//     //     console.log("user", user);

//     //     if (user.statue != "fasle") {
//     //       dispatch(
//     //         IsLoggedSuccess(
//     //           user,
//     //           UserWiseSchool,
//     //           UserWiseAuthorization,
//     //           ApprovalDocument
//     //         )
//     //       );
//     //       localStorage.setItem("user", JSON.stringify(user));
//     //       localStorage.setItem("School", JSON.stringify(UserWiseSchool));
//     //       localStorage.setItem(
//     //         "Authorization",
//     //         JSON.stringify(UserWiseAuthorization)
//     //       );
//     //       localStorage.setItem(
//     //         "ApprovalDocument",
//     //         JSON.stringify(ApprovalDocument)
//     //       );
//     //     } else {
//     //       OnNotification("Invalid User Name or Passwod", "error");
//     //       dispatch(IsLogginError("Error Loggin Attempt"));
//     //     }
//     //   })
//     //   .catch((error) => {
//     //     OnNotification("Invalid UserName Or Passwod", "error");
//     //     const errorMsg = error.message;
//     //     dispatch(IsLogginError(errorMsg));
//     //   });
//   };
// };
