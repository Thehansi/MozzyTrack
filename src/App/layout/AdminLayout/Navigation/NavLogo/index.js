import React from "react";
import DEMO from "./../../../../../store/constant";
import Aux from "../../../../../hoc/_Aux";

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
          {/* <div className="b-bg">
            <i className="feather icon-award" />
          </div> */}
          <span className='b-title'>MozziTrack</span>
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
