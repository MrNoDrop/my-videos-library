import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import { useFitAvailableSpace } from "../components/effects";
import Trailers from "../components/trailers";
import Bar, { fitAvailableSpaceBarOffset } from "../components/bar";
import ContinueWatching from "../components/continue/watching";

const mapStateToProps = ({
  state: {
    window: { inner },
  },
}) => ({ windowInnerDimensions: inner });

function HomeRoute({ windowInnerDimensions }) {
  const sectionRef = useRef();
  const [scrollEventCounter, setScrollEventCounter] = useState(0);
  return (
    <section
      {...{
        id: "route",
        ref: sectionRef,
        style: useFitAvailableSpace(
          windowInnerDimensions,
          fitAvailableSpaceBarOffset()
        ),
      }}
      onScroll={({ target: { scrollTop } }) => {
        if (
          scrollTop - scrollEventCounter > 30 ||
          scrollTop - scrollEventCounter < -30
        ) {
          setScrollEventCounter(scrollTop);
        }
      }}
    >
      <Bar />
      <ContinueWatching />
      <Trailers
        parentRef={sectionRef}
        parentScrollEventCounter={scrollEventCounter}
      />
    </section>
  );
}
export default connect(mapStateToProps)(HomeRoute);
