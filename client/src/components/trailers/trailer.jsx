import React from "react";
import { connect } from "react-redux";

const mapStateToProps = null;

const mapDispatchToProps = null;

function Trailer({ href }) {
  return (
    <>
      {href}
      <br />
    </>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Trailer);
