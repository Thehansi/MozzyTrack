import React from "react";
import DEMO from "./../../../../../store/constant";
import Aux from "../../../../../hoc/_Aux";
import logo from "../../../../../assets/images/logo new01.png";

const navLogo = (props) => {
  let toggleClass = ["mobile-menu"];
  if (props.collapseMenu) {
    toggleClass = [...toggleClass, "on"];
  }

  return (
    <Aux>
      <div className='navbar-brand header-logo'>
        {/* <a href={DEMO.BLANK_LINK} className="b-brand"> */}
        <a className='b-brand'>
          <div className='b-bg'>
            <img
              src={logo}
              style={{
                width: "50px",
                height: "50px",
                objectFit: "contain",
                borderRadius: "12px",
              }}
              // style={{
              //   width: "40px",
              //   height: "40px",
              //   border: "1px solid #28a745", // green border
              //   borderRadius: "12px", // rounded corners
              //   boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)", // soft shadow
              //   padding: "10px",
              //   backgroundColor: "#ffffff", // optional background inside frame
              // }}
            />
          </div>
          <span
            className='b-title'
            style={{ color: "#A60303", fontSize: "24px", fontWeight: "bold" }}
          >
            MozziTrack
          </span>
        </a>
        <a
          // href={DEMO.BLANK_LINK}
          className={toggleClass.join(" ")}
          id='mobile-collapse'
          onClick={props.onToggleNavigation}
        >
          <span />
        </a>
      </div>
    </Aux>
  );
};

export default navLogo;
