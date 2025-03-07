import React from "react";

const dashBoardDefault = React.lazy(() => import("./Demo/Dashboard/Default"));
const notification = React.lazy(() => import("./Forms/Dashboard/Notification"));

// Admin
const Users = React.lazy(() => import("./Forms/Admin/Users"));
const CommunicationSMS = React.lazy(() =>
  import("./Forms/Admin/CommunicationSMS")
);
const CommunicationEmail = React.lazy(() =>
  import("./Forms/Admin/CommunicationEmail")
);
const Approval = React.lazy(() => import("./Forms/Admin/Approval"));
const CompanyDetails = React.lazy(() => import("./Forms/Admin/CompanyDetails"));
const ApprovalLevelMapping = React.lazy(() =>
  import("./Forms/Admin/ApprovalLevelMapping")
);
const ReportSetup = React.lazy(() => import("./Forms/Admin/ReportSetup"));
const About = React.lazy(() => import("./Forms/System/About"));
const UserPermission = React.lazy(() => import("./Forms/Admin/UserPermission"));
const PasswordReset = React.lazy(() => import("./Forms/Admin/PasswordReset"));
const UsersGroup = React.lazy(() => import("./Forms/Admin/UserGroup"));

//PHI
const phi = React.lazy(() => import("./Forms/Inspection/Dengue"));
//DGU
const dgu = React.lazy(() => import("./Forms/NDCU/NDCU"));
//Household
const houseHold = React.lazy(() => import("./Forms/UserForm/UserForm"));
//Chat Box
const chatBox = React.lazy(() => import("./Forms/ChatBox/ChatBox"));
//report
const reports = React.lazy(() => import("./Forms/Report/Report"));
const routs = [
  {
    path: "/forms/home/dashboard",
    exact: true,
    name: "Default",
    component: dashBoardDefault,
  },
  {
    path: "/forms/home/notification",
    exact: true,
    name: "Notification",
    component: notification,
  },
  //phi
  {
    path: "/forms/inspection/phi",
    exact: true,
    name: "PHI",
    component: phi,
  },
  //dgu
  {
    path: "/forms/dgu/form-list",
    exact: true,
    name: "DGU",
    component: dgu,
  },
  //household
  {
    path: "/forms/user/user-form",
    exact: true,
    name: "household",
    component: houseHold,
  },
  //household
  {
    path: "/forms/chatBox/chat",
    exact: true,
    name: "chatBox",
    component: chatBox,
  },
  //Admin
  {
    path: "/forms/admin/users",
    exact: true,
    name: "Users",
    component: Users,
  },
  {
    path: "/forms/admin/approval",
    exact: true,
    name: "Approval",
    component: Approval,
  },
  {
    path: "/forms/admin/company-settings",
    exact: true,
    name: "CompanyDetails",
    component: CompanyDetails,
  },

  {
    path: "/forms/admin/Approval-Level-Mapping",
    exact: true,
    name: "ApprovalLevelMapping",
    component: ApprovalLevelMapping,
  },
  {
    path: "/forms/admin/report-setup",
    exact: true,
    name: "ReportSetup",
    component: ReportSetup,
  },
  {
    path: "/forms/system/about",
    exact: true,
    name: "About",
    component: About,
  },
  {
    path: "/forms/admin/UserPermission",
    exact: true,
    name: "User Permission",
    component: UserPermission,
  },
  {
    path: "/forms/admin/sms",
    exact: true,
    name: "CommunicationSMS",
    component: CommunicationSMS,
  },
  {
    path: "/forms/admin/email",
    exact: true,
    name: "CommunicationEmail",
    component: CommunicationEmail,
  },
  {
    path: "/forms/admin/password-reset",
    exact: true,
    name: "password-reset",
    component: PasswordReset,
  },
  {
    path: "/forms/admin/users-group",
    exact: true,
    name: "users-group",
    component: UsersGroup,
  },
];

export default routs;
