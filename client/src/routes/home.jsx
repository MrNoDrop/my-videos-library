import React, { useRef } from "react";
import { connect } from "react-redux";
import { useFitAvailableSpace } from "../components/effects";
import Trailers from "../components/trailers";
import Bar from "../components/bar";
import { vmin } from "../components/tools/vscale";

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
        style: useFitAvailableSpace(windowInnerDimensions, -vmin(3.5)),
      }}
    >
      <Bar />
      <Trailers />
    </section>
  );
}
export default connect(mapStateToProps)(HomeRoute);
