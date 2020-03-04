import React, { useState, useEffect } from "react";
import { push } from "redux-first-routing";
import { connect } from "react-redux";
import "./splash.scss";

import images from "../../resources/images";
const mapStateToProps = ({
  state: {
    greeting,
    user: { name, language },
    routes
  }
}) => ({ greeting, name, language, routes });

const mapDispatchToProps = dispatch => ({
  changePath: path => dispatch(push(path)) || true
});

function SplashScreen({ greeting, name, language, routes, changePath }) {
  useSplashTimeout(language, routes, changePath);
  return [
    <img
      src={images.animated.packman}
      alt="packman"
      className="packman"
      key="packman"
    />,
    <section
      {...{
        id: "splash-screen",
        key: "splash-screen"
      }}
    >
      <div className="greeting">
        {greeting[language]}
        {typeof name === "string" ? `, ${name}` : ""}
      </div>
      <img src={images.animated.loading} alt="loading" className="loading" />
    </section>
  ];
}

function useSplashTimeout(language, routes, changePath) {
  const [splashTimeout, setSplashTimeout] = useState(undefined);
  useEffect(() => {
    if (!splashTimeout) {
      setSplashTimeout(
        setTimeout(
          () =>
            changePath(`/${language}/${routes[language].list}`) &&
            setSplashTimeout(clearTimeout(splashTimeout)),
          1300
        )
      );
    }
    return () => clearTimeout(splashTimeout);
  }, [splashTimeout, setSplashTimeout, language, routes, changePath]);
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SplashScreen);
