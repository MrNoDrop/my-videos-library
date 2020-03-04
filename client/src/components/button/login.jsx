import React from "react";
import "./login.scss";

import { connect } from "react-redux";

const mapStateToProps = ({
  state: {
    user: { language }
  }
}) => ({ language });

function LoginButton({ language, className, ...other }) {
  delete other.dispatch;
  return (
    <div
      {...{
        className: `login-button${
          typeof className === "string" ? ` ${className}` : ""
        }`,
        ...other
      }}
    >
      {(() => {
        switch (language) {
          default:
          case "en":
            return "Login";
          case "pl":
            return "Zaloguj";
          case "fr":
            return "S'identifier";
          case "nl":
            return "Log in";
        }
      })()}
    </div>
  );
}

export default connect(mapStateToProps)(LoginButton);
