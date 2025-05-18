export default {
  items: [
    {
      id: "group-home",
      title: "Home",
      type: "group",
      icon: "feather icon-home",
      DocumentName: "Home",
      children: [
        {
          id: 1,
          title: "Dashboard",
          type: "item",
          icon: "feather icon-home",
          url: "/forms/home/dashboard",
          DocumentName: "Dashboard",
        },
      ],
    },
    {
      id: "group-phi",
      title: "PHI",
      type: "group",
      icon: "icon-navigation",
      DocumentName: "PHI",
      children: [
        {
          id: 2,
          title: "PHI",
          type: "item",
          icon: "feather icon-home",
          url: "/forms/inspection/phi",
          DocumentName: "PHI",
        },
      ],
    },
    {
      id: "group-dgu",
      title: "NDCU",
      type: "group",
      icon: "feather icon-home",
      DocumentName: "DGU",
      children: [
        {
          id: 10,
          title: "National Dengue Control Unit",
          type: "item",
          icon: "feather icon-copy",
          url: "/forms/dgu/form-list",
          DocumentName: "DGU",
        },
      ],
    },
    {
      id: "group-dgu",
      title: "household",
      type: "group",
      icon: "feather icon-home",
      DocumentName: "household",
      children: [
        {
          id: 20,
          title: "Household Owner",
          type: "item",
          icon: "feather icon-grid",
          url: "/forms/user/user-form",
          DocumentName: "household",
        },
      ],
    },
    {
      id: "group-dgu",
      title: "Chat Box",
      type: "group",
      icon: "feather icon-home",
      DocumentName: "chatBox",
      children: [
        {
          id: 30,
          title: "24/7 Community Room",
          type: "item",
          icon: "feather icon-grid",
          url: "/forms/chatBox/chat",
          DocumentName: "chatBox",
        },
      ],
    },
    // {
    //   id: "group-reports",
    //   title: "Report Details",
    //   type: "group",
    //   icon: "feather icon-layout",
    //   DocumentName: "ReportDetails",
    //   children: [
    //     {
    //       id: 1200,
    //       title: "Reports",
    //       type: "collapse",
    //       icon: "feather icon-layout",
    //       DocumentName: "Reports",
    //       children: [
    //         {
    //           id: 1201,
    //           title: "Report",
    //           type: "item",
    //           url: "/forms/Reports/Report",
    //           DocumentName: "Report",
    //         },
    //       ],
    //     },
    //   ],
    // },
    {
      id: "group-admin",
      title: "Administration",
      type: "group",
      icon: "feather icon-settings",
      DocumentName: "Dashboard",
      children: [
        {
          id: 9000,
          title: "Administration",
          type: "collapse",
          icon: "feather icon-settings",
          DocumentName: "Administration",
          children: [
            {
              id: 9001,
              title: "Users",
              type: "item",
              url: "/forms/admin/users",
              DocumentName: "Users",
            },
            {
              id: 9006,
              title: "Password Reset",
              type: "item",
              url: "/forms/admin/password-reset",
              DocumentName: "password-reset",
            },
            {
              id: 9007,
              title: "About",
              type: "item",
              url: "/forms/system/about",
              DocumentName: "About",
            },
          ],
        },
      ],
    },
  ],
};
