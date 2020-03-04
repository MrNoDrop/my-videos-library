import React, { useRef } from "react";
import { connect } from "react-redux";
import { push } from "redux-first-routing";

const mapDispatchToProps = dispatch => ({
  changePath: path => dispatch(push(path))
});
function MenuFooterEntry({
  image: { src, alt } = { src: "#", alt: "" },
  title,
  enabled,
  changePath,
  href
}) {
  return (
    <div className="entry" ref={useRef()} onClick={() => changePath(href)}>
      <div className="image-container">
        {typeof src === "string" ? (
          <img {...{ src, className: "image" }} alt={alt} />
        ) : typeof src === "object" &&
          typeof src.$$typeof === "symbol" &&
          src.$$typeof.toString() === "Symbol(react.element)" ? (
          React.cloneElement(src, {
            className: `image${
              src.props.className ? ` ${src.props.className}` : ""
            }`,
            enabled
          })
        ) : (
          ""
        )}
      </div>
      <p className={`title${enabled ? " enabled" : ""}`}>{title}</p>
    </div>
  );
}

export default connect(
  null,
  mapDispatchToProps
)(MenuFooterEntry);
