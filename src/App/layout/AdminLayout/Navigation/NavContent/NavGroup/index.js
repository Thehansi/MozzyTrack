import React from "react";
import Aux from "../../../../../../hoc/_Aux";
import NavCollapse from "./../NavCollapse";
import NavItem from "./../NavItem";

const navGroup = (props) => {
  let navItems = "";

  if (props.group.children) {
    const groups = props.group.children;
    navItems = Object.keys(groups).map((item) => {
      item = groups[item];

      //   for (let i = 0; i < props.loginData.userWiseAuthorization.length; i++) {
      //     console.log("loop");
      //     if (
      //       item.DocumentName ===
      //         props.loginData.userWiseAuthorization[i].DocumentName &&
      //       props.loginData.userWiseAuthorization[i].Authorizations == 2
      //     )
      //       isCountHaveProp = true;
      //     console.log("insode loop" + i);
      //   }
      let isCountHaveProp = false;
      // console.log("userWiseAuthorization", props.loginData);
      // let isHaveData = props.loginData.userWiseAuthorization.filter(
      //   (e) => e.MenuID === item.id && e.Auth == 2
      // );
      if (true) {
        //isHaveData.length > 0
        isCountHaveProp = true;
      }

      if (true) {
        //isCountHaveProp === false
        switch (item.type) {
          case "collapse":
            return (
              <NavCollapse
                key={item.id}
                collapse={item}
                type="main"
                loginData={props.loginData}
              />
            );
          case "item":
            return <NavItem layout={props.layout} key={item.id} item={item} />;
          default:
            return false;
        }
      }
    });
  }

  return (
    <Aux>
      <li key={props.group.id} className="nav-item pcoded-menu-caption">
        <label>{props.group.title}</label>
      </li>
      {navItems}
    </Aux>
  );
};

export default navGroup;

//Edit By Lasitha
