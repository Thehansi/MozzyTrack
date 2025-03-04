import React, { useState, useRef, useEffect, useCallback } from "react";
import Aux from "../../hoc/_Aux";
import uuid from "uuid";
import Form, {
  Item,
  Label,
  RequiredRule,
  Tab,
  GroupItem,
  EmptyItem,
  EmailRule,
  CustomRule,
} from "devextreme-react/form";
// import Validator, { CustomRule } from "devextreme-react/validator";
import { dxDateBox } from "devextreme-react/date-box"; // Import dxDateBox
import { dxRadioGroup } from "devextreme-react/radio-group";
import Card from "../../App/components/MainCard";
import { Button, Navbar, Tabs } from "react-bootstrap";
import Swal from "sweetalert2";
import { useLocation, useHistory } from "react-router-dom";
import DataGrid, {
  Column,
  Editing,
  Lookup,
  Paging,
  SearchPanel,
} from "devextreme-react/data-grid";
import axios from "axios";
import notify from "devextreme/ui/notify";
import DateBox from "devextreme-react/date-box";
// import FileUploader, {
//   FileUploaderTypes,
// } from "devextreme-react/file-uploader";
// import { FileUploader } from "devextreme-react/file-uploader";

const PurchesRequest = () => {
  const FormRef = useRef(null);
  // const FormRef1 = useRef(null);
  const [radioValue, setRadioValue] = useState(0);
  const [PRType, setPRType] = useState([]);
  const [itemType, setItemType] = useState([]);
  const [UOM, setUOM] = useState([]);
  const [ApprovalLevel, setApprovalLevel] = useState([]);
  const [Warehouse, setWarehouse] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [massage, setMassage] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState([]);
  const [currencyRateCode, setcurrencyRate] = useState({
    currencyRate: null,
  });
  const [rowIndex, setRowIndex] = useState(0);
  const [prData, setPrData] = useState([]);
  const [previosQty, setPreviosQty] = useState(0);
  const [previosPrice, setPreviosPrice] = useState(0);
  const [previosCost, setPreviosCost] = useState(0);
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(100);
  const [yArray, setYArray] = useState([]);
  const [departmentDetails, setDepartmentDetails] = useState([]);
  const [branchDetails, setBranchDetails] = useState([]);
  const [pmOfficerDetails, setPMOfficerDetails] = useState([]);
  const [flgLoad, setflgLoad] = useState({ isLoad: false });
  const [tableIndex, setTableIndex] = useState({ index: null });
  const [defultQuantity, setDefultQuantity] = useState({});
  const [pRHeaderID, setPRHeaderID] = useState(0);
  const [approval, setApproval] = useState(false);
  const [fileName, setFileName] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const [isPDForm, setIsPDForm] = useState(true);
  const [isRowClick, setIsRowClick] = useState(true);
  const [attachment, setAttachment] = useState({
    File: {},
  });
  const [attachmentGrid, setAttachmentGrid] = useState({
    PurchaseRequisitionAttachmentsAddGrid: [],
  });
  const [itemObject, setItemObject] = useState({ GroupTable: {} });
  const [attachLoad, setAttachLoad] = useState({ AttachGroup: {} });

  const [isUpdate, setIsUpdate] = useState(false);
  const [isDashBoard, setIsDashBoard] = useState(false);
  const [isAdd, setISAdd] = useState(true);
  const [isEdit, setISEdit] = useState(true);
  const [isView, setIsView] = useState(true);
  const [isHold, setIsHold] = useState(true);
  const [isCancel, setIsCancel] = useState(true);
  const [numberSeries, setNumberSeries] = useState([]);
  const [userName, setUserName] = useState({});
  const [loginUserDetails, setLoginUser] = useState([]);

  const [requisitionItems, setrequisitionItems] = useState({
    PurchaseRequisitionItems: [],
  });
  let totalItemsAmount = 0;
  const productModule = [
    { ID: "Y", Name: "Inventry Item" },
    { ID: "N", Name: "Service Item" },
  ];

  const trueFalse = [
    { ID: true, Name: "Yes" },
    { ID: false, Name: "No" },
  ];

  const [selectedFiles, setSelectedFiles] = useState([]);
  let numberval = 0;
  const fileUploaderRef = useRef(null);
  const [state, setState] = useState({
    jUser: {},
    PurchaseRequisitionHeader: {},
    jApprovalTemplateHeader: {},
    DocumentID: 3000,
    UploadAttchment: false,
    Choose: [
      { ID: true, Name: "Replace" },
      { ID: false, Name: "New" },
    ],
    Status: [
      { ID: "0", Name: "Pending" },
      { ID: "1", Name: "Cancel" },
      { ID: "2", Name: "Approve" },
      { ID: "3", Name: "Reject" },
      { ID: "4", Name: "Hold" },
    ],
    sapPost: [
      { ID: true, Name: "Yes" },
      { ID: false, Name: "No" },
    ],
    validStatus: [
      { ID: 0, Name: "Expired" },
      { ID: 1, Name: "Valid" },
    ],
  });
  const [newApproveStatus, setNewApproveStatus] = useState({
    Status: [
      { ID: "0", Name: "Pending" },
      { ID: "1", Name: "Cancel" },
      { ID: "2", Name: "Approve" },
      { ID: "3", Name: "Reject" },
      { ID: "4", Name: "Hold" },
    ],
  });
  const [isSapPost, setIsSapPost] = useState({
    Status: [
      { ID: true, Name: "Yes" },
      { ID: false, Name: "No" },
    ],
  });
  const [newValidStatus, setNewValidStatus] = useState({
    validStatus: [
      { ID: 0, Name: "Expired" },
      { ID: 1, Name: "Valid" },
    ],
  });
  let location = useLocation();
  const history = useHistory();
  const [isLoaded, setIsLoaded] = useState(false);

  const mimeTypes = {
    txt: "text/plain",
    html: "text/html",
    css: "text/css",
    js: "application/javascript",
    json: "application/json",
    xml: "application/xml",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  };

  useEffect(() => {
    if (location.state && location.state.isPD && !isLoaded) {
      fetchGroupDetails();
      setIsLoaded(true);
    } else {
      fetchGroupDetails();
    }
  }, []);
  const FormLayout = FormRef.current && FormRef.current.instance;
  // const FormLayout1 = FormRef1.current && FormRef1.current.instance;

  const fetchGroupDetails = async () => {
    const authData = JSON.parse(localStorage.getItem("user"));
    const checkAuthentication = await axios.get(
      "/api/CheckUserAuthentication",
      {
        params: { UsersID: authData.UserName, MenuID: 1400 },
      }
    );
    setUserName(authData.UserName);
    if (checkAuthentication.data.length != 0) {
      const userGroup = await axios.get("/api/getUserGroup", {
        params: {
          UserName: authData.UserName,
        },
      });
      if (checkAuthentication.data[0].UserView) {
        setIsView(false);
        try {
          axios
            .all([
              axios.get("/api/getPRTypes"),
              axios.get("/api/getItemType"),
              axios.get("/api/getWarehouses"),
              axios.get("/api/getUOM"),
              axios.get("/api/getApprovalLevel"),
              axios.get("/api/getCurrency"),
              axios.get("/api/number-series-lookup-by-module", {
                params: { DocumentID: state.DocumentID },
              }),
              axios.get("/api/getValidityPeriod"),
              axios.get("/api/getBranch"),
              axios.get("/api/getDepartment"),
              axios.get("/api/getPMOfficer"),
              axios.get("/api/getAllPR", {
                params: { EnterUser: authData.UserName },
              }),
              // axios.get("/api/loadpendingPR", {
              //   params: { UserGroup: userGroup.data[0].UserGroup },
              // }),
              // axios.get("/api/LoadApproveRejectPR", {
              //   params: { ApproveUser: authData.UserName },
              // }),
              axios.get("/api/getLoginUserDetails", {
                params: { UserName: authData.UserName },
              }),
            ])
            .then(
              axios.spread(
                (
                  PRTypes,
                  ItemType,
                  warehouse,
                  UOM,
                  approvalLevel,
                  Currency,
                  NumberSeries,
                  ValidityPeriod,
                  Branch,
                  Department,
                  PMOfficer,
                  prDetails,
                  loginUser
                ) => {
                  if (true) {
                    setPRType(PRTypes.data);
                    setItemType(ItemType.data);
                    setWarehouse(warehouse.data);
                    setApprovalLevel(approvalLevel.data);
                    setCurrency(Currency.data);
                    setSelectedCurrency("LKR");
                    setDepartmentDetails(Department.data);
                    setBranchDetails(Branch.data);
                    setPMOfficerDetails(PMOfficer.data);
                    setflgLoad({ isLoad: false });
                    setLoginUser(loginUser.data);

                    let allPR = prDetails.data;

                    setPrData(allPR);
                    let date = new Date();
                    let validitiDate = date.setDate(
                      date.getDate() +
                        parseInt(ValidityPeriod.data.ValidityPeriod)
                    );
                    let dateFromTimestamp = new Date(validitiDate);
                    setState((prevState) => ({
                      PurchaseRequisitionHeader: {
                        ...prevState.PurchaseRequisitionHeader,
                        CreatedDate: new Date(),
                        ValidFrom: new Date(),
                        ValidityPeriod: ValidityPeriod.data.ValidityPeriod,
                        ValidTo: dateFromTimestamp,
                        CurrencyCode: "LKR",
                        Date: new Date(),
                        ApproveDate: new Date(),
                        PRUser: authData.UserName,
                        ApproveUser: authData.UserName,
                        TotalAmount: 0,
                        TotalCost: 0,
                        RequestorName: authData.UserName,
                        RequestorsDepartment: loginUser.data[0].Department,
                        RequestorsBranch: loginUser.data[0].Branch,
                        RequestorEmail: loginUser.data[0].Email,
                        Requestorcontanctno: loginUser.data[0].ContactNo,
                        ValidityStatus: 1,
                        ExpectedDate: new Date(),
                        ApproveStatus: "0",
                        // IsSapPost: false,
                      },
                    }));
                    setItemObject((prevState) => ({
                      GroupTable: {
                        ...prevState.GroupTable,
                        UnitCost: 0,
                        UnitPrice: 0,
                        RequiredDate: new Date(),
                        TotalAmountExclusive: 0,
                      },
                    }));
                  }
                  if (location.state.isPD) {
                    setPreviosData();
                  }
                }
              )
            )
            .catch((error) => console.error(error));
        } catch (error) {
          console.error("Error fetching details:", error);
        }
      }
      if (checkAuthentication.data[0].UserAdd) {
        setISAdd(false);
      }
      if (checkAuthentication.data[0].UserEdit) {
        setISEdit(false);
      }
      if (checkAuthentication.data[0].UserHold) {
        setIsHold(false);
      }
      if (checkAuthentication.data[0].UserCancel) {
        setIsCancel(false);
      }
    }
  };

  const setPreviosData = async (e) => {
    setIsPDForm(false);
    setIsDashBoard(true);
    const headerDetails = await axios.get("/api/getPRHeaders", {
      params: { PRNumber: location.state.data.PRNumber },
    });
    const ItemDetails = await axios.get("/api/getPRItems", {
      params: { PRHeaderID: location.state.data.PRHeaderID },
    });
    const AttachmentDetails = await axios.get("/api/getPRAttachment", {
      params: { PRHeaderID: location.state.data.PRHeaderID },
    });
    const officer = await axios.get("/api/getPMOfficer");

    let itemArray = ItemDetails.data;
    const updatedArray = itemArray.map((item) => {
      item.TotalAmountExclusive = item.Quantity * item.UnitPrice;
      item.TotalCostExclusive = item.Quantity * item.UnitCost;
      return item;
    });

    setPMOfficerDetails(officer.data);
    setRowIndex(location.state.rowIndex);
    setPRHeaderID(location.state.data.PRHeaderID);
    setAttachmentGrid({
      PurchaseRequisitionAttachmentsAddGrid: AttachmentDetails.data,
    });
    setState({ PurchaseRequisitionHeader: headerDetails.data[0] });
    setrequisitionItems({
      PurchaseRequisitionItems: ItemDetails.data,
    });
    if (
      location.state.data.ValidTo != undefined &&
      location.state.data.ApproveStatus != undefined
    ) {
      const formattedDate = formatDateMonth(
        new Date(location.state.data.ValidTo)
      );
      const gerCurrentDate = formatDateMonth(new Date());
      if (
        formattedDate < gerCurrentDate &&
        location.state.data.ApproveStatus == 0
      ) {
        setState((prevState) => ({
          PurchaseRequisitionHeader: {
            ...prevState.PurchaseRequisitionHeader,
            ValidityStatus: 0,
          },
        }));
      }
    }
    // if (
    //   location.state.data.ApproveStatus == 0 ||
    //   location.state.data.ApproveStatus == 4
    // ) {
    //   setISAdd(false);
    // } else {
    //   setISAdd(true);
    // }
    const authData = JSON.parse(localStorage.getItem("user"));
    const getUserGroup = await axios.get("/api/getUserGroup", {
      params: { UserName: authData.UserName },
    });

    if (
      location.state.data.ApproveStatus != undefined ||
      location.state.data.ApproveStatus == 2
    ) {
      let nextPriority;

      if (getUserGroup.data.length != 0) {
        nextPriority = await axios.get("/api/getNextPriority", {
          params: {
            PRHeaderID: location.state.data.PRNumber,
            UserGroup: getUserGroup.data[0].UserGroup,
          },
        });
      }

      if (nextPriority.data.length != 0) {
        setState((prevState) => ({
          PurchaseRequisitionHeader: {
            ...prevState.PurchaseRequisitionHeader,
            ApproveStatus: "2",
          },
        }));
        setApproval(true);
        setISAdd(true);
      } else {
        if (
          location.state.data.ApproveStatus != 4 &&
          location.state.data.ApproveStatus != 0 &&
          location.state.data.ApproveStatus != 2
        ) {
          setISAdd(true);
          setApproval(true);
          setState((prevState) => ({
            PurchaseRequisitionHeader: {
              ...prevState.PurchaseRequisitionHeader,
              ApproveStatus: location.state.data.ApproveStatus,
            },
          }));
        } else {
          setISAdd(false);
          setApproval(false);
          setState((prevState) => ({
            PurchaseRequisitionHeader: {
              ...prevState.PurchaseRequisitionHeader,
              ApproveStatus: location.state.data.ApproveStatus,
            },
          }));
        }
      }
    } else {
      setISAdd(false);
      setApproval(false);
      setState((prevState) => ({
        PurchaseRequisitionHeader: {
          ...prevState.PurchaseRequisitionHeader,
          ApproveStatus: location.state.data.ApproveStatus,
        },
      }));
    }

    setState((prevState) => ({
      PurchaseRequisitionHeader: {
        ...prevState.PurchaseRequisitionHeader,
        PRUser: authData.UserName,
        ApproveUser: authData.UserName,
      },
    }));
    // localStorage.clear();
    history.replace({
      state: null,
    });
    setIsDashBoard(false);
  };

  const OnClickClear = async () => {
    const ValidityPeriod = await axios.get("/api/getValidityPeriod");
    let date = new Date();
    let validitiDate = date.setDate(
      date.getDate() + parseInt(ValidityPeriod.data.ValidityPeriod)
    );
    let dateFromTimestamp = new Date(validitiDate);
    setItemObject(() => ({ GroupTable: {} }));
    // itemObject.GroupTable
    setAttachLoad(() => ({ AttachGroup: {} }));
    setAttachmentGrid(() => ({ PurchaseRequisitionAttachmentsAddGrid: [] }));

    setPRHeaderID(0);
    setRadioValue(0);
    setApproval(false);
    setrequisitionItems({ PurchaseRequisitionItems: [] });
    setIsRowClick(true);
    setState(() => ({
      jUser: {},
      GroupTable: {},
      PurchaseRequisitionHeader: {
        CreatedDate: new Date(),
        ValidFrom: new Date(),
        ValidityPeriod: ValidityPeriod.data.ValidityPeriod,
        ValidTo: dateFromTimestamp,
        CurrencyCode: "LKR",
        Date: new Date(),
        ApproveDate: new Date(),
        PRUser: userName,
        ApproveUser: userName,
        TotalAmount: 0,
        FileNo: null,
        TotalCost: 0,
        RequestorName: userName,
        RequestorsDepartment: loginUserDetails[0].Department,
        RequestorsBranch: loginUserDetails[0].Branch,
        RequestorEmail: loginUserDetails[0].Email,
        Requestorcontanctno: loginUserDetails[0].ContactNo,
        ValidityStatus: 1,
        ExpectedDate: new Date(),
        ApproveStatus: "0",
      },
      jApprovalTemplateHeader: {},
      PurchaseRequisitionItems: [],
      PurchaseRequisitionAttachments: [],
      AttachGroup: {},
    }));
    if (fileUploaderRef.current) {
      fileUploaderRef.current.instance.reset();
    }
    setISAdd(false);
    setNumberSeries([]);
  };

  const OnNotification = (message, type) => {
    notify({
      message: message,
      type: type,
      displayTime: 3000,
      position: { at: "top right", offset: "50" },
    });
  };

  const OnSaveValidation = async () => {
    if (
      state.PurchaseRequisitionHeader.PRType == "" ||
      state.PurchaseRequisitionHeader.PRType == NaN ||
      state.PurchaseRequisitionHeader.PRType == undefined
    ) {
      OnNotification("PR Type is Required", "error");
      return false;
    } else if (
      state.PurchaseRequisitionHeader.ItemCategory == "" ||
      state.PurchaseRequisitionHeader.ItemCategory == NaN ||
      state.PurchaseRequisitionHeader.ItemCategory == undefined
    ) {
      OnNotification("Item Type is Required", "error");
      return false;
    } else if (
      requisitionItems.PurchaseRequisitionItems.length == 0 ||
      requisitionItems.PurchaseRequisitionItems == NaN ||
      requisitionItems.PurchaseRequisitionItems == undefined
    ) {
      OnNotification("Unable to save without Item Details", "error");
      return false;
    } else if (
      state.PurchaseRequisitionHeader.RequestorsDepartment == "" ||
      state.PurchaseRequisitionHeader.RequestorsDepartment == NaN ||
      state.PurchaseRequisitionHeader.RequestorsDepartment == undefined
    ) {
      OnNotification("Requestors Department is Required", "error");
      return false;
    } else if (
      state.PurchaseRequisitionHeader.RequestorName == "" ||
      state.PurchaseRequisitionHeader.RequestorName == NaN ||
      state.PurchaseRequisitionHeader.RequestorName == undefined
    ) {
      OnNotification("Requestors Name is Required", "error");
      return false;
    } else if (
      state.PurchaseRequisitionHeader.RequestorsBranch == "" ||
      state.PurchaseRequisitionHeader.RequestorsBranch == NaN ||
      state.PurchaseRequisitionHeader.RequestorsBranch == undefined
    ) {
      OnNotification("Requestors Branch is Required", "error");
      return false;
    } else if (
      (state.PurchaseRequisitionHeader.ApproveLevel == "" ||
        state.PurchaseRequisitionHeader.ApproveLevel == NaN ||
        state.PurchaseRequisitionHeader.ApproveLevel == undefined) &&
      radioValue === "2"
    ) {
      OnNotification("Approval Level is Required", "error");
      return false;
    } else if (
      state.PurchaseRequisitionHeader.ExpectedDate == "" ||
      state.PurchaseRequisitionHeader.ExpectedDate == NaN ||
      state.PurchaseRequisitionHeader.ExpectedDate == undefined
    ) {
      OnNotification("Expected Delivery Date is Required", "error");
      return false;
    } else if (isCancel && state.PurchaseRequisitionHeader.ApproveStatus == 1) {
      OnNotification("You Don't have permission to Cancel Approval", "error");
      return false;
    } else if (isHold && state.PurchaseRequisitionHeader.ApproveStatus == 4) {
      OnNotification("You Don't have permission to Hold Approval", "error");
      return false;
    }

    if (state.PurchaseRequisitionHeader.ApproveStatus == 2) {
      // if (state.PurchaseRequisitionHeader.ApproveStatus != 3) {
      return await onSaveValidationDB();
      // }
      // else {
      //   return true;
      // }
    } else {
      return true;
    }
  };

  const onSaveValidationDB = async () => {
    let limitValues = -1;
    let ApprovalName = -1;

    const formattedDate = formatDateMonth(
      new Date(state.PurchaseRequisitionHeader.ExpectedDate)
    );
    const gerCurrentDate = formatDateMonth(new Date());
    let userID = 0;
    const userResponse = await axios.get("/api/getSelectedUserID", {
      params: {
        UserName: userName,
      },
    });

    if (
      userResponse != undefined ||
      userResponse != NaN ||
      userResponse != ""
    ) {
      userID = userResponse.data[0].UsersID;
    }
    if (state.PurchaseRequisitionHeader.ApproveLevel != undefined) {
      const ApprovalNameCheck = await axios.get("/api/checkApprovalName", {
        params: {
          UserName: userName,
          ApprovalLevel: state.PurchaseRequisitionHeader.ApproveLevel,
          PRType: state.PurchaseRequisitionHeader.PRType,
        },
      });
      ApprovalName = ApprovalNameCheck.data.length;
    }
    const ItemType = await axios.get("/api/checkItemCategory", {
      params: {
        PRType: state.PurchaseRequisitionHeader.PRType,
        ItemType: state.PurchaseRequisitionHeader.ItemCategory,
      },
    });
    const PRType = await axios.get("/api/checkPRType", {
      params: {
        PRType: state.PurchaseRequisitionHeader.PRType,
        UserName: userName,
      },
    });

    // const UserPermision = await axios.get("/api/checkUserPermision", {
    //   params: {
    //     UsersID: userID,
    //   },
    // });
    // if (state.PurchaseRequisitionHeader.ApproveLevel != undefined) {
    //   const checkApprovalLevel = await axios.get("/api/getAppLevel", {
    //     params: {
    //       UserGroup: userName,
    //       ApprovalLevel: state.PurchaseRequisitionHeader.ApproveLevel,
    //       ItemCategory: state.PurchaseRequisitionHeader.ItemCategory,
    //       PRType: state.PurchaseRequisitionHeader.PRType,
    //     },
    //   });
    //   const Limits = await axios.get("/api/checkLimite", {
    //     params: {
    //       UserName: userName,
    //       ApprovalLevel: state.PurchaseRequisitionHeader.ApproveLevel,
    //       PRType: state.PurchaseRequisitionHeader.PRType,
    //     },
    //   });
    //   limitValues = Limits.data.length;
    // }
    // if (
    //   state.PurchaseRequisitionHeader.ApproveStatus != 0 &&
    //   (UserPermision.data[0].UserAdd == null ||
    //     UserPermision.data[0].UserAdd == 0)
    // ) {
    //   OnNotification("You Don't have permission to Approval process", "error");
    //   return false;
    // } else

    // else if (
    //   state.PurchaseRequisitionHeader.ApproveStatus != 0 &&
    //   UserPermision.data.length == 0 &&
    //   (UserPermision.data[0].UserAdd == null ||
    //     UserPermision.data[0].UserAdd == 0)
    // ) {
    //   OnNotification("You Don't have permission to Approval", "error");
    //   return false;
    // }

    if (ApprovalName == 0) {
      OnNotification(
        "You Don't have permission to this Approval Level",
        "error"
      );
      return false;
    } else if (PRType.data.length == 0) {
      OnNotification("You Don't have permission to PR Type", "error");
      return false;
    } else if (ItemType.data.length == 0) {
      OnNotification("You Don't have permission to Item Type", "error");
      return false;
    } else if (limitValues == 0) {
      OnNotification("You Don't have permission to add total", "error");
      return false;
    } else if (formattedDate < gerCurrentDate) {
      OnNotification("Invalid Delivery Date", "error");
      return false;
    } else if (
      state.PurchaseRequisitionHeader.ApproveStatus == 2 &&
      state.PurchaseRequisitionHeader.ApproveLevel == undefined
    ) {
      OnNotification("Please Select the Approval Leval", "error");
      return false;
    }
    // else if (!sameQuntity) {
    //   OnNotification("Can't Increase Quantity", "error");
    //   return false;
    // } else if (
    //   !isDecrease &&
    //   previosQty > state.PurchaseRequisitionHeader.Quantity
    // ) {
    //   OnNotification("Can't Decrees Quantity", "error");
    //   return false;
    // }

    if (state.PurchaseRequisitionHeader.ApproveLevel != undefined) {
      return await onApprovalLevelCheck();
    } else {
      return true;
    }
    // }
  };

  const onApprovalLevelCheck = async () => {
    let limitValues = -1;
    let prevQTY = 0;
    let mismatchItemCode;
    let higherQuntity = false;
    let lowQuntity = false;
    let isDecrease = false;
    let isIncrease = false;

    if (state.PurchaseRequisitionHeader.ApproveStatus != 0) {
      const Limits = await axios.get("/api/checkLimite", {
        params: {
          UserName: userName,
          ApprovalLevel: state.PurchaseRequisitionHeader.ApproveLevel,
          PRType: state.PurchaseRequisitionHeader.PRType,
          ItemCategory: state.PurchaseRequisitionHeader.ItemCategory,
        },
      });
      limitValues = Limits.data.length;

      if (Limits.data[0].DecreaseQty != null) {
        isDecrease = Limits.data[0].DecreaseQty;
      }
      if (Limits.data[0].IncreaseQty != null) {
        isIncrease = Limits.data[0].IncreaseQty;
      }

      if (state.PurchaseRequisitionHeader.PRNumber != undefined) {
        const databaseDetails = await axios.get("/api/getAllQTY", {
          params: {
            PRNumber: state.PurchaseRequisitionHeader.PRNumber,
          },
        });
        if (databaseDetails.data.length != 0) {
          prevQTY = databaseDetails.data[0].TotalQty;

          databaseDetails.data.forEach((dataItem) => {
            const qty = parseFloat(dataItem.Quantity);
            const itemCode = dataItem.ItemCode;

            requisitionItems.PurchaseRequisitionItems.forEach((reqItem) => {
              const curQty = parseFloat(reqItem.Quantity);
              const curItemCode = reqItem.ItemCode;

              if (curItemCode === itemCode) {
                if (qty < curQty) {
                  higherQuntity = true;
                  mismatchItemCode = curItemCode;
                  return false;
                } else if (qty > curQty) {
                  lowQuntity = true;
                  mismatchItemCode = curItemCode;
                  return false;
                }
              }
            });
          });
        }
      }

      if (
        Limits.data[0].MaxValue < state.PurchaseRequisitionHeader.TotalAmount
      ) {
        OnNotification("Total amount is grater than maximum limits", "error");
        return false;
      } else if (
        Limits.data[0].MinValue > state.PurchaseRequisitionHeader.TotalAmount
      ) {
        OnNotification("Total amount is less than minimum limits ", "error");
        return false;
      } else if (!isIncrease && higherQuntity) {
        OnNotification(
          "Need Permision to Increase Quantity ", //+ mismatchItemCode,
          "error"
        );
        return false;
      } else if (!isDecrease && lowQuntity) {
        OnNotification("Need Permision to Decrees Quantity ", "error"); //+ mismatchItemCode
        return false;
      }
    }
    return true;
  };

  const handleSave = async (e) => {
    if (await OnSaveValidation()) {
      let UserGroupCode = "";
      let statusOfApproval = 0;
      let appovalLevel;
      let getfinalLevel;
      let Priority = 0;
      let isFinalLevel = false;
      let IsSapPost = false;
      setIsUpdate(false);
      let getUserGroup = await axios.get("/api/getUserGroup", {
        params: {
          UserName: userName,
        },
      });
      if (getUserGroup.data.length != 0) {
        UserGroupCode = getUserGroup.data[0].UserGroup;
      }
      //  else {
      //      console.log("UserGroup 2", getUserGroup.data[0].UserGroup);
      //     UserGroupCode = getUserGroup.data[0].UserGroup;
      //   }
      if (state.PurchaseRequisitionHeader.ApproveLevel != undefined) {
        let finalLevel = await axios.get("/api/getfinalLevel", {
          params: {
            ApprovalLevel: state.PurchaseRequisitionHeader.ApproveLevel,
            TransactionType: state.PurchaseRequisitionHeader.PRType,
          },
        });
        if (finalLevel.data.length != 0) {
          if (
            finalLevel.data[0].FinalLevel &&
            state.PurchaseRequisitionHeader.ApproveStatus == 2
          ) {
            statusOfApproval = 2;
          }
        }

        const userGroup = await axios.get("/api/getUserGroup", {
          params: {
            UserName: userName,
          },
        });
        if (userGroup.data.length != 0) {
          appovalLevel = await axios.get("/api/getApprovalLevelDetails", {
            params: {
              UserGroup: userGroup.data[0].UserGroup,
              ApprovalLevel: state.PurchaseRequisitionHeader.ApproveLevel,
            },
          });
        }
        if (appovalLevel.data.length != 0) {
          getfinalLevel = await axios.get("/api/getfinalLevel", {
            params: {
              ApprovalLevel: state.PurchaseRequisitionHeader.ApproveLevel,
              TransactionType: state.PurchaseRequisitionHeader.PRType,
            },
          });

          if (getfinalLevel.data.length != 0) {
            isFinalLevel = getfinalLevel.data[0].FinalLevel;
            Priority = getfinalLevel.data[0].Priority;
            if (
              getfinalLevel.data[0].FinalLevel &&
              state.PurchaseRequisitionHeader.ApproveStatus == 2
            ) {
              await setIsFinal(true);
              IsSapPost = true;

              if (state.PurchaseRequisitionHeader.PRNumber == undefined) {
                const NumberSeries = await axios.get(
                  "/api/number-series-lookup-by-module",
                  {
                    params: { DocumentID: 3000 },
                  }
                );
                numberval = NumberSeries.data[0].Series;
              }
            }
          }
        }
      }

      if (!isView) {
        axios
          .post("/api/addPurchesRequest", {
            PurchaseRequisitionHeader: JSON.stringify(
              state.PurchaseRequisitionHeader
            ),
            PurchaseRequisitionItems: JSON.stringify(
              requisitionItems.PurchaseRequisitionItems
            ),
            PurchaseRequisitionAttachments: JSON.stringify(
              attachmentGrid.PurchaseRequisitionAttachmentsAddGrid
            ),
            UserGroup: UserGroupCode,
            PRHeaderID: pRHeaderID,
            finalStatus: statusOfApproval,
            IsFinal: isFinalLevel,
            Priority: Priority,
            IsSapPost: IsSapPost,
            UserID: userName,
          })
          .then((response) => {
            console.log(response.data);
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Saved Successfully!",
            }).then(async (res) => {
              // const newPRType = response.data;
              const allPR = await axios.get("/api/getAllPR", {
                params: { EnterUser: userName },
              });
              setPrData(allPR.data);
              if (
                state.PurchaseRequisitionHeader.ApproveLevel != undefined &&
                state.PurchaseRequisitionHeader.ApproveLevel != 0 &&
                getfinalLevel != undefined
              ) {
                if (getfinalLevel.data.length != 0) {
                  let appLevel = getfinalLevel.data[0].FinalLevel;
                  let appStatus = state.PurchaseRequisitionHeader.ApproveStatus;

                  if (appLevel && appStatus == 2) {
                    sapPost();
                  } else {
                    OnClickClear();
                  }
                }
              } else {
                OnClickClear();
              }
            });
          })
          .catch((error) => {
            console.error("Error:", error);
            Swal.fire({
              icon: "error",
              title: '<span style="color: red;">Error!</span>',
              text: "Failed to save purchase request details",
              confirmButtonColor: "#d33",
              confirmButtonText: "OK",
            });
          });
      }
    }
  };

  const sapPost = async () => {
    let PRnumberSeries;
    if (state.PurchaseRequisitionHeader.PRNumber == undefined) {
      PRnumberSeries = numberval;
    } else {
      PRnumberSeries = state.PurchaseRequisitionHeader.PRNumber;
    }

    axios
      .post("/api/PurchesRequest-sync", {
        PurchaseRequisitionHeader: state.PurchaseRequisitionHeader,
        PurchaseRequisitionAttachments:
          attachmentGrid.PurchaseRequisitionAttachmentsAddGrid,
        PurchaseRequisitionItems: requisitionItems.PurchaseRequisitionItems,
        PR_Number: PRnumberSeries,
      })
      .then(async (res) => {
        if (!res.data.error) {
          const updateHeader = await axios.post("/api/updateIsSapPost", {
            params: {
              PRNumber: PRnumberSeries,
              IsSapPost: true,
            },
          });
          const updateStatus = await axios.post("/api/updateStatus", {
            params: {
              PRNumber: PRnumberSeries,
              Status: "2",
            },
          });
          // const NumberSeries = await axios.get(
          //   "/api/number-series-lookup-by-module",
          //   {
          //     params: { DocumentID: 3000 },
          //   }
          // );
          // const ValidityPeriod = await axios.get("/api/getValidityPeriod");
          // let date = new Date();
          // let validitiDate = date.setDate(
          //   date.getDate() + parseInt(ValidityPeriod.data.ValidityPeriod)
          // );
          // let dateFromTimestamp = new Date(validitiDate);
          setPRHeaderID(0);
          OnClickClear();
        } else {
          const updateHeader = await axios.post("/api/updateIsSapPost", {
            params: {
              PRNumber: PRnumberSeries,
              IsSapPost: false,
            },
          });
          const updateStatus = await axios.post("/api/updateStatus", {
            params: {
              PRNumber: PRnumberSeries,
              Status: "0",
            },
          });
          Swal.fire({
            icon: "error",
            title: '<span style="color: red;">SAP Error!</span>',
            text: res.data.message.error.message.value,
            confirmButtonColor: "#d33",
            confirmButtonText: "OK",
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: '<span style="color: red;">Error!</span>',
          text: "Failed to save purchase request details",
          confirmButtonColor: "#d33",
          confirmButtonText: "OK",
        });
        console.log(error);
        console.error("Error:", error);
      });
  };

  const ValidationItems = async () => {
    if (state.PurchaseRequisitionHeader.ApproveLevel != undefined) {
      const Limits = await axios.get("/api/checkLimite", {
        params: {
          UserName: userName,
          ApprovalLevel: state.PurchaseRequisitionHeader.ApproveLevel,
          PRType: state.PurchaseRequisitionHeader.PRType,
          ItemCategory: state.PurchaseRequisitionHeader.ItemCategory,
        },
      });
      // console.log("limitValues", Limits.data);
      // let isIncrease = false;
      // let isDecrease = false;
      // if (Limits.data[0].IncreaseQty != null) {
      //   isIncrease = Limits.data[0].IncreaseQty;
      // }
      // if (Limits.data[0].IncreaseQty != null) {
      //   isDecrease = Limits.data[0].DecreaseQty;
      // }
      // limitValues = Limits.data.length;
      // console.log("isIncrease", isIncrease);
      // console.log("isDecrease", isDecrease);
      // console.log("Quantity", state.PurchaseRequisitionHeader.Quantity);
      // console.log("previosQty", previosQty);
    }
    if (
      itemObject.GroupTable.Module == "" ||
      itemObject.GroupTable.Module == NaN ||
      itemObject.GroupTable.Module == undefined
    ) {
      OnNotification("Module is Required", "error");
      return false;
    } else if (
      itemObject.GroupTable.ItemCode == "" ||
      itemObject.GroupTable.ItemCode == NaN ||
      itemObject.GroupTable.ItemCode == undefined
    ) {
      OnNotification("Item/Service Code is Required", "error");
      return false;
    } else if (
      itemObject.GroupTable.UnitPrice == "" ||
      itemObject.GroupTable.UnitPrice == NaN ||
      itemObject.GroupTable.UnitPrice == undefined
    ) {
      OnNotification("UnitPrice is Required", "error");
      return false;
    } else if (
      itemObject.GroupTable.Quantity == "" ||
      itemObject.GroupTable.Quantity == NaN ||
      itemObject.GroupTable.Quantity == undefined
    ) {
      OnNotification("Quantity is Required", "error");
      return false;
    } else if (itemObject.GroupTable.Quantity <= 0) {
      OnNotification("Quantity is greater than 0", "error");
      return false;
    } else if (itemObject.GroupTable.UnitPrice <= 0) {
      OnNotification("UnitPrice is greater than 0", "error");
      return false;
    }

    return true;
  };

  // const onClickAddItem = async () => {
  //   if (!flgLoad.isLoad) {
  //     if (await ValidationItems()) {
  //       let arrayPurchas = [...requisitionItems.PurchaseRequisitionItems];
  //       console.log("Array", arrayPurchas);
  //       // arrayPurchas.push(itemObject.GroupTable);
  //       let itemCode = itemObject.GroupTable.ItemCode;
  //       console.log("itemCode", itemCode);
  //       let index = arrayPurchas.findIndex(
  //         (item) => item.ItemCode === itemCode
  //       );
  //       console.log("isUpdate", isUpdate);
  //       console.log("index ", index);
  //       if (index !== -1 && isUpdate != false) {
  //         console.log("AWA 1");
  //         OnNotification("Already Added Item Code", "error");
  //         return false;
  //         // arrayPurchas[index] = itemObject.GroupTable;
  //         // let price =
  //         //   itemObject.GroupTable.Quantity * itemObject.GroupTable.UnitPrice;
  //         // let cost =
  //         //   itemObject.GroupTable.Quantity * itemObject.GroupTable.UnitCost;
  //         // let prevQty = previosQty;
  //         // let prevPrice = previosPrice;
  //         // let prevCost = previosCost;
  //         // let prevTotal = previosQty * previosPrice;
  //         // let preevCostTotal = previosQty * prevCost;

  //         // setState((prevState) => ({
  //         //   PurchaseRequisitionHeader: {
  //         //     ...prevState.PurchaseRequisitionHeader,
  //         //     TotalAmount: parseFloat(
  //         //       prevTotal - prevState.PurchaseRequisitionHeader.TotalAmount
  //         //     ),
  //         //     //  +
  //         //     // price
  //         //     TotalCost:
  //         //       parseFloat(prevState.PurchaseRequisitionHeader.TotalCost) +
  //         //       cost -
  //         //       preevCostTotal,
  //         //   },
  //         // }));
  //         // setIsUpdate(false);

  //         // setrequisitionItems({ PurchaseRequisitionItems: arrayPurchas });

  //         // setItemObject({ GroupTable: {} });
  //       } else if (!isUpdate) {
  //         console.log("AWA 2");
  //         arrayPurchas.push(itemObject.GroupTable);
  //         let price =
  //           itemObject.GroupTable.Quantity * itemObject.GroupTable.UnitPrice;
  //         let cost =
  //           itemObject.GroupTable.Quantity * itemObject.GroupTable.UnitCost;
  //         setState((prevState) => ({
  //           PurchaseRequisitionHeader: {
  //             ...prevState.PurchaseRequisitionHeader,
  //             TotalAmount:
  //               parseFloat(prevState.PurchaseRequisitionHeader.TotalAmount) +
  //               price,
  //             TotalCost:
  //               parseFloat(prevState.PurchaseRequisitionHeader.TotalCost) +
  //               cost,
  //           },
  //         }));
  //         setIsUpdate(false);

  //         setrequisitionItems({ PurchaseRequisitionItems: arrayPurchas });

  //         setItemObject({ GroupTable: {} });
  //       } else {
  //         OnNotification("Already Added Item Code", "error");
  //         return false;
  //       }
  //     }
  //   } else {
  //     if (await ValidationItems()) {
  //       let arrayPurchas = [...requisitionItems.PurchaseRequisitionItems];
  //       arrayPurchas[tableIndex.index] = itemObject.GroupTable;
  //       setrequisitionItems({ PurchaseRequisitionItems: arrayPurchas });
  //       let price =
  //         itemObject.GroupTable.Quantity * itemObject.GroupTable.UnitPrice;
  //       let cost =
  //         itemObject.GroupTable.Quantity * itemObject.GroupTable.UnitCost;

  //       let prevCost = previosCost;
  //       let prevTotal = previosQty * previosPrice;

  //       setState((prevState) => ({
  //         PurchaseRequisitionHeader: {
  //           ...prevState.PurchaseRequisitionHeader,
  //           TotalAmount:
  //             parseFloat(prevState.PurchaseRequisitionHeader.TotalAmount) +
  //             price -
  //             prevTotal,
  //           TotalCost:
  //             parseFloat(prevState.PurchaseRequisitionHeader.TotalCost) +
  //             cost -
  //             prevCost,
  //         },
  //       }));
  //       setItemObject({ GroupTable: {} });
  //     }
  //     setIsUpdate(false);
  //   }
  // };

  const onClickAddItem = async () => {
    if (!flgLoad.isLoad) {
      if (await ValidationItems()) {
        let arrayPurchas = [...requisitionItems.PurchaseRequisitionItems];
        let itemCode = itemObject.GroupTable.ItemCode;
        let index = arrayPurchas.findIndex(
          (item) => item.ItemCode === itemCode
        );
        console.log(isUpdate);
        if (true) {
          //index !== -1
          console.log("ccc", index);
          if (isUpdate && index !== -1) {
            arrayPurchas[index] = itemObject.GroupTable;
            let price =
              itemObject.GroupTable.Quantity * itemObject.GroupTable.UnitPrice;
            let cost =
              itemObject.GroupTable.Quantity * itemObject.GroupTable.UnitCost;

            let prevQty = previosQty;
            let prevPrice = previosPrice;
            let prevTotal = prevQty * prevPrice;
            let prevCost = previosCost;
            let prevCostTotal = prevQty * prevCost;

            setState((prevState) => ({
              PurchaseRequisitionHeader: {
                ...prevState.PurchaseRequisitionHeader,
                TotalAmount:
                  parseFloat(prevState.PurchaseRequisitionHeader.TotalAmount) +
                  price -
                  prevTotal,
                TotalCost:
                  parseFloat(prevState.PurchaseRequisitionHeader.TotalCost) +
                  cost -
                  prevCostTotal,
              },
            }));

            setrequisitionItems({ PurchaseRequisitionItems: arrayPurchas });
            setItemObject({ GroupTable: {} });
            setIsUpdate(false);
          } else if (!isUpdate && index === -1) {
            arrayPurchas.push(itemObject.GroupTable);
            let price =
              itemObject.GroupTable.Quantity * itemObject.GroupTable.UnitPrice;
            let cost =
              itemObject.GroupTable.Quantity * itemObject.GroupTable.UnitCost;

            setState((prevState) => ({
              PurchaseRequisitionHeader: {
                ...prevState.PurchaseRequisitionHeader,
                TotalAmount:
                  parseFloat(prevState.PurchaseRequisitionHeader.TotalAmount) +
                  price,
                TotalCost:
                  parseFloat(prevState.PurchaseRequisitionHeader.TotalCost) +
                  cost,
              },
            }));

            setrequisitionItems({ PurchaseRequisitionItems: arrayPurchas });
            setItemObject({ GroupTable: {} });
          }
          // else if (!isUpdate && index) {
          //   OnNotification("Already Added Item Code", "error");
          // }
          else {
            OnNotification("Already Added Item Code", "error");
          }
        }
        //  else {
        //   arrayPurchas.push(itemObject.GroupTable);
        //   let price =
        //     itemObject.GroupTable.Quantity * itemObject.GroupTable.UnitPrice;
        //   let cost =
        //     itemObject.GroupTable.Quantity * itemObject.GroupTable.UnitCost;

        //   setState((prevState) => ({
        //     PurchaseRequisitionHeader: {
        //       ...prevState.PurchaseRequisitionHeader,
        //       TotalAmount:
        //         parseFloat(prevState.PurchaseRequisitionHeader.TotalAmount) +
        //         price,
        //       TotalCost:
        //         parseFloat(prevState.PurchaseRequisitionHeader.TotalCost) +
        //         cost,
        //     },
        //   }));

        //   setrequisitionItems({ PurchaseRequisitionItems: arrayPurchas });
        //   setItemObject({ GroupTable: {} });
        //   // setIsUpdate(false);
        // }
      }
    } else {
      console.log("AWA AA");
      if (await ValidationItems()) {
        let arrayPurchas = [...requisitionItems.PurchaseRequisitionItems];
        arrayPurchas[tableIndex.index] = itemObject.GroupTable;
        let price =
          itemObject.GroupTable.Quantity * itemObject.GroupTable.UnitPrice;
        let cost =
          itemObject.GroupTable.Quantity * itemObject.GroupTable.UnitCost;

        let prevQty = previosQty;
        let prevPrice = previosPrice;
        let prevTotal = prevQty * prevPrice;
        let prevCost = previosCost;
        let prevCostTotal = prevQty * prevCost;

        setState((prevState) => ({
          PurchaseRequisitionHeader: {
            ...prevState.PurchaseRequisitionHeader,
            TotalAmount:
              parseFloat(prevState.PurchaseRequisitionHeader.TotalAmount) +
              price -
              prevTotal,
            TotalCost:
              parseFloat(prevState.PurchaseRequisitionHeader.TotalCost) +
              cost -
              prevCostTotal,
          },
        }));

        setrequisitionItems({ PurchaseRequisitionItems: arrayPurchas });
        setItemObject({ GroupTable: {} });
        // setIsUpdate(false);
      }
    }
  };

  const onClickAddAttachments = () => {
    if (attachment.File) {
      let FileData = new FormData();
      FileData.append("file", attachment.File);
      var ext = /(?:\.([^.]+))?$/;
      let FileName = (
        "PR" +
        "_" +
        uuid.v4() +
        "." +
        ext.exec(attachment.File.name)[1]
      ).replaceAll(/\s/g, "");
      // debugger;
      axios
        .post("/api/upload/attachment", FileData, {
          params: {
            Folder: "PR",
            FileName: FileName,
          },
        })
        .then((response) => {
          let filePath = response.data.filePath;
          let currentDate = new Date();
          let formattedDate = currentDate.toLocaleDateString();
          let attachmentArray = {
            FileName: FileName,
            FilePath: filePath,
            FileUploadedUser: userName,
            FileUploadedDate: formattedDate,
            Remarks: attachLoad.AttachGroup.Remarks,
            Attach: attachLoad.AttachGroup.Attach,
          };

          let PurchaseRequisitionAttachmentsLst = [
            ...attachmentGrid.PurchaseRequisitionAttachmentsAddGrid,
          ];

          PurchaseRequisitionAttachmentsLst.push(attachmentArray);

          setAttachmentGrid({
            PurchaseRequisitionAttachmentsAddGrid:
              PurchaseRequisitionAttachmentsLst,
            attachmentArray: {},
          });
          setAttachLoad({ AttachGroup: {} });
          document.getElementById("fileInput").value = "";
          setAttachment({});
          // if (fileUploaderRef.current) {
          //   fileUploaderRef.current.instance.reset();
          // }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const FileSelect = (e) => {
    let File = {};
    File = e.target.files[0];

    setAttachment({
      File: File,
    });
  };

  // const onSelectedFilesChanged = useCallback(
  //   (e) => {
  //     console.log("file", e.value[0]);
  //     let File = {};
  //     File = e.value[0];

  //     setAttachment({
  //       File: File,
  //     });
  //   },
  //   [setSelectedFiles]
  // );

  // const fetchMoreItems = () => {
  //   const remainingItems = items.length - index;
  //   const nextItemsCount = Math.min(100, remainingItems);

  //   if (nextItemsCount > 0) {
  //     const nextItems = items.slice(index, index + nextItemsCount);
  //     setYArray((prevYArray) => [...prevYArray, ...nextItems]);
  //     setIndex((prevIndex) => prevIndex + nextItemsCount);
  //   } else {
  //     console.log("No more items to fetch.");
  //   }
  // };

  const whsChange = (e) => {
    try {
      if (!flgLoad.isLoad) {
        axios
          .all([
            axios.get("/api/getAVGPrice", {
              params: {
                WhsCode: e.value,
                ItemCode: itemObject.GroupTable.ItemCode,
              },
            }),
          ])
          .then(
            axios.spread(async (AVGPrice) => {
              let avgCost = 0;

              if (AVGPrice.data.length != 0) {
                avgCost = AVGPrice.data[0].AVGPrice;
              }
              setItemObject((prevState) => ({
                GroupTable: {
                  ...prevState.GroupTable,
                  UnitCost: avgCost, //Price.data[0].Price,
                },
              }));
              setState((prevState) => ({
                PurchaseRequisitionHeader: {
                  ...prevState.PurchaseRequisitionHeader,
                },
              }));
            })
          )
          .catch((error) => console.error(error));
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const handleChange = (value) => {
    if (!flgLoad.isLoad) {
      if (value.value === "see_more") {
        setItemObject({
          GroupTable: {
            ItemCode: null,
            ItemDescription: "",
            OnhandQty: null,
            WarehouseCode: null,
            UoMCode: null,
          },
        });
      } else {
        try {
          if (value.value != null) {
            let UOMGroup = null;
            axios
              .all([
                axios.get("/api/getItemDetails", {
                  params: { ItemCode: value.value },
                }),
                axios.get("/api/getItemPrice", {
                  params: { ItemCode: value.value },
                }),
                // axios.get("/api/getAVGPrice", {
                //   params: { WhsCode: e.value, ItemCode: value.value },
                // }),
                axios.get("/api/getUgpEntry", {
                  params: { ItemCode: value.value },
                }),
                axios.get("/api/getWHS", {
                  params: { ItemCode: value.value },
                }),
              ])
              .then(
                axios.spread(async (ItemDetails, Price, UgpEntry, whsCode) => {
                  let price = 0;
                  let avgCost = 0;
                  let whsCodeItem = "01";
                  let AVGPrice;

                  console.log("whsCode", whsCode);

                  if (whsCode.data.length != 0) {
                    whsCodeItem = whsCode.data[0].WhsCode;

                    AVGPrice = await axios.get("/api/getAVGPrice", {
                      params: {
                        WhsCode: whsCode.data[0].WhsCode,
                        ItemCode: value.value,
                      },
                    });
                    console.log("AVGPrice", AVGPrice);
                    if (AVGPrice.data.length != 0) {
                      avgCost = AVGPrice.data[0].AVGPrice;
                    }
                  }

                  if (UgpEntry.data.length != 0) {
                    UOMGroup = await axios.get("/api/getUomGroup", {
                      params: {
                        UgpEntry: UgpEntry.data[0].UgpEntry,
                      },
                    });

                    setUOM(UOMGroup.data);
                  }

                  if (Price.data.length != 0) {
                    price = Price.data[0].Price;
                  }

                  setItemObject((prevState) => ({
                    GroupTable: {
                      ...prevState.GroupTable,
                      ItemDescription: ItemDetails.data[0].ItemDesc,
                      OnhandQty: ItemDetails.data[0].QtyOnHand,
                      WarehouseCode: whsCodeItem,
                      UoMCode: UOMGroup.data[0].cUnitCode,
                      UnitCost: avgCost,
                      UnitPrice: 0,
                      Quantity: 1,
                      RequiredDate: new Date(),
                      TotalAmountExclusive: 0,
                    },
                  }));
                  setState((prevState) => ({
                    PurchaseRequisitionHeader: {
                      ...prevState.PurchaseRequisitionHeader,
                    },
                  }));
                  setDefultQuantity(1);
                })
              )
              .catch((error) => console.error(error));
          } else {
            setItemObject((prevState) => ({
              GroupTable: {
                ...prevState.GroupTable,
                ItemCode: null,
                ItemDescription: "",
                OnhandQty: null,
                WarehouseCode: null,
                UoMCode: null,
                UnitCost: 0,
                UnitPrice: 0,
              },
            }));
          }
        } catch (error) {
          console.error("Error fetching details:", error);
        }
      }
    }
  };

  const getItems = (e) => {
    if (!flgLoad.isLoad) {
      axios
        .get("/api/getItems", {
          params: {
            ItemType: state.PurchaseRequisitionHeader.ItemCategory,
            module: e.value,
          },
        })
        .then((Items) => {
          setItems(Items.data);
          setItemObject((prevState) => ({
            GroupTable: {
              ...prevState.GroupTable,
              ItemCode: null,
              ItemDescription: "",
              OnhandQty: null,
              WarehouseCode: null,
              UoMCode: null,
            },
          }));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const changeCurr = (e) => {
    if (e.value == "LKR") {
      setcurrencyRate({ currencyRate: 1 });
    } else {
      axios
        .get("/api/getCurrencyRate", {
          params: {
            currencyCode: e.value,
          },
        })
        .then((Items) => {
          console.log(Items.data[0].Rate);
          if (Items.data[0].Rate == undefined || Items.data[0].Rate == 0) {
            OnNotification(
              "Currency rate for today not found. Please create it in SAP.",
              "error"
            );
            return false;
          } else {
            setcurrencyRate({ currencyRate: Items.data[0].Rate });
            let price = itemObject.GroupTable.UnitPrice;
            if (price > 0) {
              setItemObject((prevState) => ({
                GroupTable: {
                  ...prevState.GroupTable,
                  UnitPriceWithForeignRate: price * Items.data[0].Rate,
                },
              }));
            }
          }
          //  setCurrency({ Code: e.value });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const changeFillNo = (e) => {
    if (!isDashBoard) {
      let fillNo = state.PurchaseRequisitionHeader.FileNo;
      let date = new Date();
      if (e.value != undefined) {
        setFileName(true);
        setState((prevState) => ({
          PurchaseRequisitionHeader: {
            ...prevState.PurchaseRequisitionHeader,
            LastFileName: "",
            FileNo: date.getFullYear() + "\\" + e.value + "\\",
          },
        }));
      }
    }
  };

  const changeFillName = (e) => {
    if (true) {
      let fillNo = state.PurchaseRequisitionHeader.FileNo;
      if (fillNo != null && e.value != undefined) {
        setFileName(true);
        setState((prevState) => ({
          PurchaseRequisitionHeader: {
            ...prevState.PurchaseRequisitionHeader,
            FileNo: fillNo.substring(0, 12) + e.value,
          },
        }));
      }
    }
  };

  const costChange = (e) => {
    if (true) {
      let Quantity = itemObject.GroupTable.Quantity;
      if (e.value > 0 && Quantity > 0) {
        setItemObject((prevState) => ({
          GroupTable: {
            ...prevState.GroupTable,
            TotalCostExclusive: e.value * Quantity,
          },
        }));
      } else {
        setItemObject((prevState) => ({
          GroupTable: {
            ...prevState.GroupTable,
            TotalCostExclusive: 0,
          },
        }));
      }
    }
  };

  const priceChange = (e) => {
    if (true) {
      let Quantity = itemObject.GroupTable.Quantity;
      if (e.value > 0 && Quantity > 0) {
        setItemObject((prevState) => ({
          GroupTable: {
            ...prevState.GroupTable,
            TotalAmountExclusive: e.value * Quantity,
            UnitPriceWithForeignRate:
              e.value * state.PurchaseRequisitionHeader.ExchangeRate,
          },
        }));
      } else {
        setItemObject((prevState) => ({
          GroupTable: {
            ...prevState.GroupTable,
            TotalAmountExclusive: 0,
            UnitPriceWithForeignRate: 0,
          },
        }));
      }
    }
  };

  const quantityChange = (e) => {
    if (!flgLoad.isLoad) {
      let price = itemObject.GroupTable.UnitPrice;
      let cost = itemObject.GroupTable.UnitCost;
      if (e.value >= 0 && (price > 0 || cost > 0)) {
        setItemObject((prevState) => ({
          GroupTable: {
            ...prevState.GroupTable,
            TotalAmountExclusive: e.value * price,
            TotalCostExclusive: e.value * cost,
          },
        }));
      } else {
        setItemObject((prevState) => ({
          GroupTable: {
            ...prevState.GroupTable,
            TotalAmountExclusive: 0,
            TotalCostExclusive: 0,
          },
        }));
      }
    }
  };

  const updatePRTable = async (e) => {
    if (!isEdit) {
      setIsRowClick(false);
      setIsUpdate(false);
      const headerDetails = await axios.get("/api/getPRHeaders", {
        params: { PRNumber: e.data.PRNumber },
      });
      const ItemDetails = await axios.get("/api/getPRItems", {
        params: { PRHeaderID: e.data.PRHeaderID },
      });

      const AttachmentDetails = await axios.get("/api/getPRAttachment", {
        params: { PRHeaderID: e.data.PRHeaderID },
      });
      const officer = await axios.get("/api/getPMOfficer");

      setPMOfficerDetails(officer.data);
      setRowIndex(e.data.rowIndex);
      setPRHeaderID(e.data.PRHeaderID);
      setAttachmentGrid({
        PurchaseRequisitionAttachmentsAddGrid: AttachmentDetails.data,
      });
      setState({ PurchaseRequisitionHeader: headerDetails.data[0] });

      if (e.data.ValidTo != undefined && e.data.ApproveStatus != undefined) {
        const formattedDate = formatDateMonth(new Date(e.data.ValidTo));
        const gerCurrentDate = formatDateMonth(new Date());
        if (formattedDate < gerCurrentDate && e.data.ApproveStatus == 0) {
          setState((prevState) => ({
            PurchaseRequisitionHeader: {
              ...prevState.PurchaseRequisitionHeader,
              ValidityStatus: 0,
            },
          }));
        }
      }

      let itemArray = ItemDetails.data;
      const updatedArray = itemArray.map((item) => {
        item.TotalAmountExclusive = item.Quantity * item.UnitPrice;
        item.TotalCostExclusive = item.Quantity * item.UnitCost;
        return item;
      });

      setrequisitionItems({ PurchaseRequisitionItems: updatedArray });
      if (e.data.ApproveStatus != undefined || e.data.ApproveStatus == 2) {
        const getUserGroup = await axios.get("/api/getUserGroup", {
          params: { UserName: userName },
        });
        let nextPriority;
        if (getUserGroup.data.length != 0) {
          nextPriority = await axios.get("/api/getNextPriority", {
            params: {
              PRHeaderID: e.data.PRNumber,
              UserGroup: getUserGroup.data[0].UserGroup,
            },
          });
        }

        if (nextPriority.data.length != 0) {
          setState((prevState) => ({
            PurchaseRequisitionHeader: {
              ...prevState.PurchaseRequisitionHeader,
              ApproveStatus: "2",
            },
          }));
          setApproval(true);
          setISAdd(true);
        } else {
          if (
            e.data.ApproveStatus != 4 &&
            e.data.ApproveStatus != 0 &&
            e.data.ApproveStatus != 2
          ) {
            setISAdd(true);
            setApproval(true);
            setState((prevState) => ({
              PurchaseRequisitionHeader: {
                ...prevState.PurchaseRequisitionHeader,
                ApproveStatus: e.data.ApproveStatus,
              },
            }));
          } else {
            setISAdd(false);
            setApproval(false);
            setState((prevState) => ({
              PurchaseRequisitionHeader: {
                ...prevState.PurchaseRequisitionHeader,
                ApproveStatus: e.data.ApproveStatus,
              },
            }));
          }
        }
      } else {
        setISAdd(false);
        setApproval(false);
        setState((prevState) => ({
          PurchaseRequisitionHeader: {
            ...prevState.PurchaseRequisitionHeader,
            ApproveStatus: e.data.ApproveStatus,
          },
        }));
      }

      setTimeout(() => {
        focusTextBox();
      }, 200);

      setState((prevState) => ({
        PurchaseRequisitionHeader: {
          ...prevState.PurchaseRequisitionHeader,
          FileNo: e.data.FileNo,
          LastFileName: e.data.LastFileName,
        },
      }));
    }
    setState((prevState) => ({
      PurchaseRequisitionHeader: {
        ...prevState.PurchaseRequisitionHeader,
        PRUser: userName,
        ApproveUser: userName,
      },
    }));
  };

  const focusTextBox = useCallback(() => {
    if (FormRef.current) {
      const formInstance = FormRef.current.instance;
      const editor = formInstance.getEditor("ExpectedDate");
      if (editor) {
        editor.focus();
      }
    }
  }, []);

  const updateTable = async (e) => {
    if (!isEdit) {
      let replacement = null;
      setflgLoad({ isLoad: true });
      setIsUpdate(true);
      const UgpEntry = await axios.get("/api/getUgpEntry", {
        params: { ItemCode: e.data.ItemCode },
      });

      if (UgpEntry.data.length != 0) {
        let UOMGroup = await axios.get("/api/getUomGroup", {
          params: {
            UgpEntry: UgpEntry.data[0].UgpEntry,
          },
        });

        setUOM(UOMGroup.data);
      }
      setTableIndex({ index: e.rowIndex });
      axios
        .get("/api/getItems", {
          params: {
            ItemType: state.PurchaseRequisitionHeader.ItemCategory,
            module: e.data.Module,
          },
        })
        .then((Items) => {
          setItems(Items.data);
        })
        .catch((error) => {
          console.log(error);
        });
      setPreviosQty(e.data.Quantity);
      setPreviosPrice(e.data.UnitPrice);
      setPreviosCost(e.data.UnitCost);
      setItemObject({
        GroupTable: {
          Module: e.data.Module,
          ItemCode: e.data.ItemCode,
          ItemDescription: e.data.ItemDescription,
          OnhandQty: e.data.OnhandQty,
          WarehouseCode: e.data.WarehouseCode,
          UoMCode: e.data.UoMCode,
          UnitCost: e.data.UnitCost,
          TotalCost: e.data.TotalCost,
          UnitPrice: e.data.UnitPrice,
          TotalAmountExclusive: e.data.TotalAmountExclusive,
          TotalCostExclusive: e.data.TotalCostExclusive,
          RequiredDate: e.data.RequiredDate,
          IsReplacement: e.data.IsReplacement,
          Remark: e.data.Remark,
          Quantity: e.data.Quantity,
        },
      });
      setflgLoad({ isLoad: false });
    }
  };

  const rowRemoving = async (e) => {
    console.log(e.data);
    if (
      e.data.UnitPrice != undefined &&
      e.data.UnitPrice != undefined &&
      e.data.UnitCost != undefined
    ) {
      let price = parseFloat(e.data.Quantity * e.data.UnitPrice);
      let cost = parseFloat(e.data.Quantity * e.data.UnitCost);
      setState((prevState) => ({
        PurchaseRequisitionHeader: {
          ...prevState.PurchaseRequisitionHeader,
          TotalAmount:
            parseFloat(prevState.PurchaseRequisitionHeader.TotalAmount) - price,
          TotalCost:
            parseFloat(prevState.PurchaseRequisitionHeader.TotalCost) - cost,
        },
      }));
    }
    if (e.data.PRHeaderID != undefined) {
      const deleteRow = await axios.delete("/api/deleteRow", {
        params: { ItemCode: e.data.ItemCode, PRHeaderID: e.data.PRHeaderID },
      });
    }
  };

  const formatDateMonth = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}/${day}/${year}`;
  };

  const setAprovalName = async (e) => {
    if (e.value != undefined) {
      const getApprovalName = await axios.get("/api/getApprovalLevelName", {
        //getApprovalLevelName getApprovalName
        params: {
          ApprovalLevel: e.value,
          TransactionType: state.PurchaseRequisitionHeader.PRType,
        },
      });

      if (getApprovalName.data.length != 0) {
        setState((prevState) => ({
          PurchaseRequisitionHeader: {
            ...prevState.PurchaseRequisitionHeader,
            ApprovalDescription: getApprovalName.data.ApprovalLevelName,
          },
        }));
      }
    }
  };

  const itemChange = (e) => {
    if (itemObject.GroupTable.Module != undefined) {
      axios
        .get("/api/getItems", {
          params: {
            ItemType: e.value,
            module: itemObject.GroupTable.Module,
          },
        })
        .then((Items) => {
          setItems(Items.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const getFileType = (fullPath) => {
    return mimeTypes[fullPath] || "application/octet-stream";
  };

  const viewAttachment = async (e) => {
    console.log(e.data.FileName);
    if (e.data.FileName) {
      const filePath = await axios.get("/api/viewFile", {
        responseType: "arraybuffer",
        params: { FilePath: e.data.FilePath },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      let filePathValue;
      let fileType = "";
      if (filePath.config.params.FilePath !== undefined) {
        filePathValue = filePath.config.params.FilePath;
        const parts = filePathValue.split("\\");
        const fileName = parts.pop();
        let fullPath = fileName.split(".").pop().toLowerCase();
        // const extension = fileName.split('.').pop().toLowerCase();
        fileType = getFileType(fullPath);
      }
      if (filePath.data !== null || filePath.data !== undefined) {
        const reqFile = new Blob([filePath.data], {
          type: fileType,
        }); //{ type: "application/pdf" } `application/${fileType}`

        const fileURL = URL.createObjectURL(reqFile);
        const newTab = window.open(fileURL, "_blank");
      }
      // let fileURL = filePath.data.fileURL;
      // console.log("fileURL", filePath.data.fileURL);
      // window.open(fileURL, "_blank");
    } else {
      console.log("No file path available");
    }
  };

  const setApprovalLevelDetails = async (level) => {
    setApprovalLevel([]);
    const approvalLevel = await axios.get("/api/filterApprovalLevelDetails", {
      params: { TransactionType: level.value },
    });
    setState((prevState) => ({
      PurchaseRequisitionHeader: {
        ...prevState.PurchaseRequisitionHeader,
        ApprovalDescription: null,
        ApproveLevel: null,
      },
    }));
    if (approvalLevel.data.length != 0) {
      setApprovalLevel(approvalLevel.data);
    }
  };

  return (
    <div>
      <Card title="Purchase Requisition Entry">
        <Tabs defaultActiveKey="Header" id="receipt-option">
          <Tab eventKey="Header" title="Header">
            <Form ref={FormRef} formData={state.PurchaseRequisitionHeader}>
              <GroupItem caption="Header Details" colCount={2}>
                <GroupItem>
                  <Item
                    dataField="PRType"
                    editorType="dxSelectBox"
                    editorOptions={{
                      searchEnabled: true,
                      showClearButton: true,
                      dataSource: PRType,
                      valueExpr: "PRTypeCode",
                      displayExpr: "Discription",
                      onValueChanged: setApprovalLevelDetails,
                    }}
                  >
                    <Label text="PR Type"></Label>
                    <RequiredRule message="Field required" />
                  </Item>

                  <Item
                    dataField="PRNumber"
                    // visible={false}
                    editorOptions={{
                      maxLength: 50,
                      readOnly: true,
                    }}
                  >
                    <Label text="PR Number"></Label>
                  </Item>

                  <Item dataField="ExpectedDate" editorType="dxDateBox">
                    <Label text="Expected Delivery Date"></Label>
                    {/* <CustomRule
                      validationCallback={(options) => {
                        console.log("isPDForm", isPDForm);
                        if (isPDForm) {
                          const currentDate = new Date();
                          const selectedDate = new Date(options.value);

                          const formattedDate = formatDateMonth(selectedDate);
                          const gerCurrentDate = formatDateMonth(currentDate);
                          console.log("formattedDate", formattedDate);
                          console.log("gerCurrentDate", gerCurrentDate);
                          if (formattedDate >= gerCurrentDate) {
                            console.log("true");
                            return true;
                          } else {
                            console.log("false");
                            return false;
                          }
                        } else {
                          setIsPDForm(true);
                          return true;
                        }
                      }}
                      message="Invalid Delivery Date"
                    /> */}
                  </Item>

                  <Item
                    dataField="FileNo"
                    // style={{ color: "rgb(185, 210, 214)" }}
                    editorOptions={{
                      maxLength: 50,
                      readOnly: true,
                    }}
                  >
                    <Label text="File No"></Label>
                  </Item>

                  <Item
                    dataField="ValidityPeriod"
                    editorType="dxNumberBox"
                    editorOptions={{
                      readOnly: true,
                    }}
                  >
                    <Label text="Validity Period (Days)"></Label>
                  </Item>

                  <Item
                    dataField="ValidTo"
                    editorType="dxDateBox"
                    editorOptions={{
                      readOnly: true,
                    }}
                  >
                    <Label text="Valid To"></Label>
                  </Item>

                  <Item
                    dataField="CurrencyCode"
                    editorType="dxSelectBox"
                    editorOptions={{
                      searchEnabled: true,
                      showClearButton: true,
                      dataSource: currency,
                      valueExpr: "CurrCode",
                      displayExpr: "DocCurrCod",
                      //value: currency.Code,
                      onValueChanged: changeCurr,
                    }}
                  >
                    <RequiredRule message="Field required" />
                    <Label text="Currency Code"></Label>
                  </Item>
                </GroupItem>

                <GroupItem>
                  <Item
                    dataField="ItemCategory"
                    editorType="dxSelectBox"
                    editorOptions={{
                      searchEnabled: true,
                      showClearButton: true,
                      dataSource: itemType,
                      valueExpr: "FldValue",
                      displayExpr: "FldValue",
                      onValueChanged: itemChange,
                    }}
                  >
                    <Label text="Item Type"></Label>
                    <RequiredRule message="Field required" />
                  </Item>

                  <Item
                    dataField="CreatedDate"
                    editorType="dxDateBox"
                    editorOptions={{
                      readOnly: true,
                    }}
                  >
                    <Label text="PR Created Date"></Label>
                  </Item>

                  <Item
                    dataField="ProcurementOfficer"
                    editorType="dxSelectBox"
                    editorOptions={{
                      searchEnabled: true,
                      showClearButton: true,
                      dataSource: pmOfficerDetails,
                      valueExpr: "OfficerID",
                      displayExpr: "OfficerID",
                      onValueChanged: changeFillNo,
                    }}
                  >
                    <Label text="Procurement Officer"></Label>
                  </Item>
                  <Item
                    dataField="LastFileName"
                    editorOptions={{
                      visible: fileName,
                      onValueChanged: changeFillName,
                    }}
                  >
                    <Label text="File Name"></Label>
                  </Item>
                  <Item
                    dataField="ValidFrom"
                    editorType="dxDateBox"
                    editorOptions={{
                      readOnly: true,
                    }}
                  >
                    <Label text="Valid From"></Label>
                  </Item>

                  <Item
                    dataField="ValidityStatus"
                    editorType="dxSelectBox"
                    editorOptions={{
                      searchEnabled: true,
                      showClearButton: true,
                      dataSource: state.validStatus,
                      valueExpr: "ID",
                      displayExpr: "Name",
                      readOnly: true,
                    }}
                  >
                    <Label text="Validity Status"></Label>
                  </Item>

                  <Item
                    dataField="ExchangeRate"
                    editorType="dxNumberBox"
                    editorOptions={{
                      value: currencyRateCode.currencyRate,
                      readOnly: true,
                      format: "#,##0.00",
                    }}
                  >
                    <Label text="Currency Rate"></Label>
                  </Item>
                </GroupItem>
              </GroupItem>

              <GroupItem>
                <Item dataField="Remarks2" editorType="dxTextArea">
                  <Label text="Purchase Justification"></Label>
                </Item>

                <Item dataField="Remarks1" editorType="dxTextArea">
                  <Label text="Remarks"></Label>
                </Item>
              </GroupItem>
            </Form>
          </Tab>
          <Tab eventKey="Items" title="Items">
            <Form formData={itemObject.GroupTable}>
              {/* ref={FormRef} */}
              <GroupItem caption="Item Details" colCount={2}>
                <GroupItem>
                  <Item
                    dataField="Module"
                    editorType="dxSelectBox"
                    editorOptions={{
                      searchEnabled: true,
                      showClearButton: true,
                      items: productModule,
                      valueExpr: "ID",
                      displayExpr: "Name",
                      onValueChanged: getItems,
                    }}
                  >
                    <Label text="Module"></Label>
                    <RequiredRule message="Field required" />
                  </Item>

                  <Item
                    dataField="ItemDescription"
                    editorOptions={{
                      maxLength: 50,
                    }}
                  >
                    <Label text="Inventry/Service Description"></Label>
                  </Item>

                  {/* <Item
                    dataField="WarehouseCode"
                    editorType="dxSelectBox"
                    style={{ backgroundColor: "red" }}
                    editorOptions={{
                      items: Warehouse,
                      valueExpr: "WhseCode",
                      displayExpr: (item) =>
                        `${item.WhseCode} - ${item.WhseName}`,
                      fieldTemplate: (selectedItem) => {
                        return selectedItem ? (
                          <div>{`${selectedItem.WhseCode} - ${selectedItem.WhseName}`}</div>
                        ) : null;
                      },
                    }}
                  >
                    <Label text="Warehouse"></Label>
                  </Item> */}
                  {/* <DropDownBox
                    value={gridBoxValue}
                    opened={isGridBoxOpened}
                    valueExpr="ID"
                    deferRendering={false}
                    inputAttr={ownerLabel}
                    displayExpr={gridBoxDisplayExpr}
                    placeholder="Select a value..."
                    showClearButton={true}
                    dataSource={gridDataSource}
                    onValueChanged={syncDataGridSelection}
                    onOptionChanged={onGridBoxOpened}
                    contentRender={dataGridRender}
                  /> */}

                  <Item
                    dataField="OnhandQty"
                    editorType="dxNumberBox"
                    editorOptions={{
                      readOnly: true,
                    }}
                  >
                    <Label text="Quantity On Hand"></Label>
                  </Item>
                  <Item
                    dataField="UnitPriceWithForeignRate"
                    editorType="dxNumberBox"
                    editorOptions={{
                      format: "#,##0.00",
                      readOnly: true,
                    }}
                  ></Item>
                  <Item
                    dataField="TotalAmountExclusive"
                    editorType="dxNumberBox"
                    editorOptions={{
                      format: "#,##0.00",
                      readOnly: true,
                    }}
                  >
                    <Label text="Total Amount Exclusive"></Label>
                  </Item>
                  <Item
                    dataField="TotalCostExclusive"
                    editorType="dxNumberBox"
                    editorOptions={{
                      format: "#,##0.00",
                      readOnly: true,
                    }}
                  >
                    <Label text="Total Cost Exclusive"></Label>
                  </Item>

                  <Item
                    dataField="RequiredDate"
                    editorType="dxDateBox"
                    editorOptions={{
                      readOnly: true,
                    }}
                  >
                    <Label text="Required Date"></Label>
                  </Item>
                </GroupItem>

                <GroupItem>
                  <Item
                    dataField="ItemCode"
                    editorType="dxSelectBox"
                    editorOptions={{
                      items: [
                        ...items.slice(0, index),
                        //{ ItemCode: "see_more", ItemDesc: "See More..." },
                      ],
                      valueExpr: "ItemCode",
                      displayExpr: "ItemDesc",
                      searchEnabled: true,
                      showClearButton: true,
                      //virtual: true,
                      onValueChanged: handleChange,
                    }}
                  >
                    <Label text="Inventry/Service Code"></Label>
                    <RequiredRule message="Field required" />
                  </Item>
                  <Item
                    dataField="WarehouseCode"
                    editorType="dxSelectBox"
                    style={{ backgroundColor: "red" }}
                    editorOptions={{
                      searchEnabled: true,
                      items: Warehouse,
                      valueExpr: "WhseCode",
                      displayExpr: "WhseName",
                      onValueChanged: whsChange,
                    }}
                  >
                    <Label text="Warehouse"></Label>
                  </Item>
                  <Item
                    dataField="UnitCost"
                    editorType="dxNumberBox"
                    editorOptions={{
                      format: "#,##0.00",
                      onValueChanged: costChange,
                    }}
                  >
                    <Label text="Unit Cost"></Label>
                  </Item>
                  <Item
                    dataField="UnitPrice"
                    editorType="dxNumberBox"
                    editorOptions={{
                      format: "#,##0.00",
                      onValueChanged: priceChange,
                    }}
                  >
                    <Label text="Unit Price"></Label>
                    <RequiredRule message="Field required" />
                  </Item>
                  <Item
                    dataField="Quantity"
                    editorType="dxNumberBox"
                    editorOptions={{
                      onValueChanged: quantityChange,
                    }}
                  >
                    <Label text="Quantity" editorType="dxNumberBox"></Label>
                    <RequiredRule message="Field required" />
                  </Item>

                  <Item
                    dataField="UoMCode"
                    editorType="dxSelectBox"
                    editorOptions={{
                      searchEnabled: true,
                      showClearButton: true,
                      items: UOM,
                      valueExpr: "cUnitCode",
                      displayExpr: "cUnitDescription",
                    }}
                  >
                    <Label text="Unit Of Measure"></Label>
                  </Item>

                  <Item
                    dataField="IsReplacement"
                    editorType="dxRadioGroup"
                    editorOptions={{
                      items: state.Choose,
                      valueExpr: "ID",
                      displayExpr: "Name",
                      layout: "horizontal",
                    }}
                  >
                    <Label visible={false} />
                  </Item>
                </GroupItem>
              </GroupItem>
              <GroupItem>
                <Item dataField="Remark" editorType="dxTextArea">
                  <Label text="Remark"></Label>
                </Item>
              </GroupItem>
            </Form>
            <br />
            <Navbar bg="light" variant="light">
              <Button
                variant="secondary"
                icon="feather icon-layers"
                onClick={onClickAddItem}
                disabled={isAdd}
              >
                Add
              </Button>
            </Navbar>
            <br />
            <DataGrid
              id="Items"
              allowColumnReordering={true}
              showBorders={true}
              dataSource={requisitionItems.PurchaseRequisitionItems}
              // columnAutoWidth={true}
              onCellDblClick={updateTable}
              onRowRemoving={rowRemoving}
              hoverStateEnabled={true}
              allowColumnResizing={true}
            >
              <Paging enabled={true} />
              <Editing mode="row" allowDeleting={true} />
              <Column dataField="Module">
                <Lookup
                  items={productModule}
                  valueExpr="ID"
                  displayExpr="Name"
                />
              </Column>
              <Column dataField="PRHeaderID" visible={false}></Column>
              <Column dataField="ItemCode" caption="Item Code"></Column>
              <Column dataField="ItemDescription" caption="Item Description" />
              <Column dataField="WarehouseCode" caption="Warehouse" />
              <Column dataField="UoMCode" caption="Unit Of Measure" />
              <Column
                dataField="Quantity"
                dataType="number"
                format="#,##0.00"
                caption="Quantity"
              />
              <Column
                dataField="UnitCost"
                dataType="number"
                format="#,##0.00"
              />

              <Column
                dataField="UnitPrice"
                dataType="number"
                format="#,##0.00"
              />
              <Column
                dataField="TotalAmountExclusive"
                dataType="number"
                format="#,##0.00"
              />
              <Column
                dataField="TotalCostExclusive"
                dataType="number"
                format="#,##0.00"
              />
              <Column dataField="RequiredDate" editorType="dxDateBox" />
              <Column dataField="IsReplacement">
                <Lookup items={trueFalse} valueExpr="ID" displayExpr="Name" />
              </Column>
              <Column dataField="Remark" />
            </DataGrid>
          </Tab>
          <Tab eventKey="Requestor" title="Requestor">
            <Form formData={state.PurchaseRequisitionHeader}>
              {/* ref={FormRef} */}
              <GroupItem caption="Requestor Details" colCount={2}>
                <Item
                  dataField="RequestorName"
                  editorOptions={{
                    readOnly: true,
                  }}
                >
                  {/* <RequiredRule message="Field required" /> */}
                  <Label text="Requestor Name"></Label>
                </Item>
                <Item
                  dataField="RequestorsDepartment"
                  editorType="dxSelectBox"
                  editorOptions={{
                    dataSource: departmentDetails,
                    valueExpr: "DepartmentCode",
                    displayExpr: "Discription",
                    readOnly: true,
                  }}
                >
                  {/* <RequiredRule message="Field required" /> */}
                  <Label text="Requestor's Department"></Label>
                </Item>
                <Item
                  dataField="RequestorsBranch"
                  editorType="dxSelectBox"
                  editorOptions={{
                    dataSource: branchDetails,
                    valueExpr: "BranchCode",
                    displayExpr: "Discription",
                    readOnly: true,
                  }}
                >
                  {/* <RequiredRule message="Field required" /> */}
                  <Label text="Requestor's Branch"></Label>
                </Item>
                <Item
                  dataField="RequestorEmail"
                  editorOptions={{
                    readOnly: true,
                  }}
                >
                  {/* <EmailRule message="Invalid email format" /> */}
                  <Label text="Requestor Email"></Label>
                </Item>
                <Item
                  dataField="Requestorcontanctno"
                  editorType="dxNumberBox"
                  editorOptions={{
                    readOnly: true,
                  }}
                >
                  <Label text="Requestor Contact No"></Label>
                </Item>
                <Item dataField="OtherDetails" editorType="dxTextArea">
                  <Label text="Other Details"></Label>
                </Item>
              </GroupItem>
            </Form>
          </Tab>
          <Tab eventKey="Attachments" title="Attachments">
            <Form formData={attachLoad.AttachGroup}>
              {/* ref={FormRef}  */}
              <GroupItem caption="Attachments">
                <Item
                  dataField="Attach"
                  editorType="dxCheckBox"
                  style={{ marginRight: "10px" }}
                >
                  <Label text="Attach" />
                </Item>

                <Item>
                  <br></br>
                  <div>
                    <input
                      type="file"
                      name="file"
                      id="fileInput"
                      //accept=".rpt"
                      onChange={(e) => FileSelect(e)}
                    />
                  </div>
                  <br></br>
                </Item>
                {/* <Item>
                  <FileUploader
                    ref={fileUploaderRef}
                    accept="*"
                    // uploadMode="instantly"
                    onValueChanged={onSelectedFilesChanged}
                  />
                </Item> */}
                <Item dataField="Remarks" editorType="dxTextArea">
                  <Label text="Remarks"></Label>
                </Item>
              </GroupItem>
            </Form>
            <Navbar bg="light" variant="light">
              <Button
                variant="secondary"
                icon="feather icon-layers"
                onClick={onClickAddAttachments}
                disabled={isAdd}
              >
                Add
              </Button>
            </Navbar>

            <br />
            <DataGrid
              id="Items"
              allowColumnReordering={true}
              showBorders={true}
              dataSource={attachmentGrid.PurchaseRequisitionAttachmentsAddGrid}
              columnAutoWidth={true}
              hoverStateEnabled={true}
              onCellDblClick={viewAttachment}
            >
              <Editing mode="row" allowDeleting={true} />
              <Column dataField="FileName" />
              <Column dataField="FilePath" />
              <Column dataField="FileUploadedUser" />
              <Column dataField="FileUploadedDate" dataType="date" />
              <Column dataField="Attach" editorType="dxCheckBox" />
              <Column dataField="Remarks" />
            </DataGrid>
          </Tab>
          <Tab eventKey="Notes" title="Notes">
            <Form formData={state.PurchaseRequisitionHeader}>
              {/* ref={FormRef} */}
              <GroupItem caption="Notes" colCount={2}>
                <Item dataField="Note1">
                  <Label text="Note 1"></Label>
                </Item>
                <Item dataField="Note2">
                  <Label text="Note 2"></Label>
                </Item>
                <Item dataField="Note3">
                  <Label text="Note 3"></Label>
                </Item>
                <Item dataField="Note4">
                  <Label text="Note 4"></Label>
                </Item>
                <Item dataField="Note5">
                  <Label text="Note 5"></Label>
                </Item>
              </GroupItem>
            </Form>
          </Tab>
          <Tab eventKey="Approval" title="Approve">
            <Form formData={state.PurchaseRequisitionHeader}>
              {/* ref={FormRef} */}
              <GroupItem caption="Approval Status">
                <Item
                  dataField="ApproveStatus"
                  editorType="dxRadioGroup"
                  editorOptions={{
                    items: state.Status,
                    valueExpr: "ID",
                    displayExpr: "Name",
                    layout: "horizontal",
                    value: radioValue,
                    onValueChanged: (e) => setRadioValue(e.value),
                    readOnly: approval,
                  }}
                >
                  <Label text="Status"></Label>
                </Item>
                <Item
                  dataField="IsSapPost"
                  editorType="dxRadioGroup"
                  editorOptions={{
                    items: state.sapPost,
                    valueExpr: "ID",
                    displayExpr: "Name",
                    layout: "horizontal",
                    readOnly: true,
                  }}
                >
                  <Label text="SAP Post"></Label>
                </Item>
              </GroupItem>
              <GroupItem caption="Details">
                <Item
                  dataField="ApproveLevel"
                  visible={radioValue === "2"}
                  editorType="dxSelectBox"
                  editorOptions={{
                    items: ApprovalLevel,
                    valueExpr: "ApprovalLevel",
                    displayExpr: "ApprovalLevel",
                    onValueChanged: setAprovalName,
                  }}
                >
                  <RequiredRule message="Field required" />
                  <Label text="Approval Level"></Label>
                </Item>

                <Item dataField="Remark" visible={radioValue !== "2"}>
                  <Label text="Remarks"></Label>
                </Item>
                <Item
                  dataField="Date"
                  editorType="dxDateBox"
                  visible={radioValue !== "2"}
                  editorOptions={{
                    readOnly: true,
                  }}
                >
                  <Label text="Date"></Label>
                </Item>
                <Item
                  dataField="PRUser"
                  visible={radioValue !== "2"}
                  editorOptions={{
                    readOnly: true,
                  }}
                >
                  <Label text="User"></Label>
                </Item>
                <Item
                  dataField="ApprovalDescription"
                  visible={radioValue === "2"}
                  editorOptions={{
                    readOnly: true,
                  }}
                >
                  <Label text="Approval Description"></Label>
                </Item>
                <Item dataField="ApproveRemarks" visible={radioValue === "2"}>
                  <Label text="Approval Remarks"></Label>
                </Item>
                <Item
                  dataField="ApproveDate"
                  editorType="dxDateBox"
                  visible={radioValue === "2"}
                  editorOptions={{
                    readOnly: true,
                  }}
                >
                  <Label text="Approval Date"></Label>
                </Item>
                <Item
                  dataField="ApproveUser"
                  visible={radioValue === "2"}
                  editorOptions={{
                    readOnly: true,
                  }}
                >
                  <Label text="Approval User"></Label>
                </Item>
              </GroupItem>
              {/* )} */}
            </Form>
          </Tab>
        </Tabs>
      </Card>
      <br />
      <Card title="Summary">
        <Form formData={state.PurchaseRequisitionHeader}>
          {/* ref={FormRef} */}
          <GroupItem caption="Summary" colCount={2}>
            <Item
              dataField="TotalAmount"
              editorType="dxNumberBox"
              editorOptions={{
                maxLength: 50,
                format: "#,##0.00",
                readOnly: true,
              }}
              format="#,##0.00"
            >
              <Label text="Total Amount"></Label>
            </Item>
            <Item
              dataField="TotalCost"
              editorType="dxNumberBox"
              editorOptions={{
                readOnly: true,
                format: "#,##0.00",
              }}
              format="#,##0.00"
            >
              <Label text="Total Cost"></Label>
            </Item>
          </GroupItem>
        </Form>
        <br />
        <Navbar bg="light" variant="light">
          <Button
            variant="secondary"
            icon="feather icon-layers"
            onClick={handleSave}
            disabled={isAdd}
          >
            Save
          </Button>
          {/* <Button variant="secondary" icon="feather icon-layers">
            Draft
          </Button> */}
          <Button
            variant="secondary"
            icon="feather icon-layers"
            onClick={OnClickClear}
            // disabled={isAdd}
          >
            Clear
          </Button>
        </Navbar>
      </Card>
      <Card title="PR List">
        <DataGrid
          dataSource={prData}
          showBorders={true}
          wordWrapEnabled={true}
          allowSearch={true}
          selection={{ mode: "single" }}
          hoverStateEnabled={true}
          onCellDblClick={updatePRTable}
          allowColumnResizing={true}
          columnAutoWidth={true}
        >
          <SearchPanel visible={true} />
          <Paging defaultPageSize={20} />
          <Column dataField="PRHeaderID" visible={false} />
          <Column dataField="PRType" caption="PR Type">
            <Lookup
              items={PRType}
              valueExpr="PRTypeCode"
              displayExpr="Discription"
            />
          </Column>
          <Column dataField="ItemCategory" caption="Item Type" />
          <Column dataField="PRNumber" caption="PR Number" />
          <Column
            dataField="CreatedDate"
            editorType="dxDateBox"
            caption="Created Date"
            format="dd/MM/yyyy"
            customizeText={(cellInfo) => {
              const date = new Date(cellInfo.value);
              const formattedDate = `${date.getDate()}/${
                date.getMonth() + 1
              }/${date.getFullYear()}`;
              return formattedDate;
            }}
          ></Column>
          <Column
            dataField="ExpectedDate"
            editorType="dxDateBox"
            caption="Created Date"
            format="dd/MM/yyyy"
            customizeText={(cellInfo) => {
              const date = new Date(cellInfo.value);
              const formattedDate = `${date.getDate()}/${
                date.getMonth() + 1
              }/${date.getFullYear()}`;
              return formattedDate;
            }}
          ></Column>
          <Column
            dataField="ProcurementOfficer"
            caption="Procurement Officer"
          />
          <Column dataField="FileNo" caption="File No" />
          <Column dataField="LastFileName" caption="File Name" />
          <Column dataField="ValidityStatus" caption="Validity Status">
            <Lookup
              items={newValidStatus.validStatus}
              valueExpr="ID"
              displayExpr="Name"
            ></Lookup>
          </Column>
          <Column
            dataField="ValidTo"
            editorType="dxDateBox"
            caption="Valid To"
            format="dd/MM/yyyy"
            customizeText={(cellInfo) => {
              const date = new Date(cellInfo.value);
              const formattedDate = `${date.getDate()}/${
                date.getMonth() + 1
              }/${date.getFullYear()}`;
              return formattedDate;
            }}
          />
          <Column dataField="RequestorName" caption="Requestor Name" />
          <Column dataField="RequestorsBranch" caption="Requestors Branch">
            <Lookup
              items={branchDetails}
              valueExpr="BranchCode"
              displayExpr="Discription"
            />
          </Column>
          <Column dataField="ApproveStatus" caption="Approve Status">
            <Lookup
              items={newApproveStatus.Status}
              valueExpr="ID"
              displayExpr="Name"
            ></Lookup>
          </Column>
          <Column dataField="IsSapPost" caption="SAP Post">
            <Lookup
              items={isSapPost.Status}
              valueExpr="ID"
              displayExpr="Name"
            ></Lookup>
          </Column>
          <Column dataField="ApproveLevel" caption="Approve Level" />
          <Column
            dataField="ApproveUser"
            caption="Approval status Change User"
          />
          <Column
            dataField="ApproveDate"
            editorType="dxDateBox"
            caption="Approve Date"
            format="dd/MM/yyyy"
            customizeText={(cellInfo) => {
              const date = new Date(cellInfo.value);
              const formattedDate = `${date.getDate()}/${
                date.getMonth() + 1
              }/${date.getFullYear()}`;
              return formattedDate;
            }}
          />
        </DataGrid>
      </Card>
    </div>
  );
};

export default PurchesRequest;
