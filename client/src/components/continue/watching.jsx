import React from "react";
import { connect } from "react-redux";

const mapStateToProps = ({
  state: {
    watched,
    user: { language },
  },
}) => ({ watched, language });

const mapDispatchToProps = null;

function ContinueWatching({ watched }) {
  return <>{JSON.stringify(watched)}</>;
}

export default connect(mapStateToProps, mapDispatchToProps)(ContinueWatching);
