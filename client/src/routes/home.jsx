import React, { useRef } from "react";
import { connect } from "react-redux";
import { useFitAvailableSpace } from "../components/effects";
import Trailers from "../components/trailers";

const mapStateToProps = ({
  state: {
    window: { inner },
  },
}) => ({ windowInnerDimensions: inner });

function HomeRoute({ windowInnerDimensions }) {
  return (
    <section
      {...{
        id: "route",
        ref: useRef(),
        style: useFitAvailableSpace(windowInnerDimensions),
      }}
    >
      <Trailers />
    </section>
  );
}
export default connect(mapStateToProps)(HomeRoute);
