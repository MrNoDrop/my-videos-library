import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import { useFitAvailableSpace } from "../../components/effects";
import Bar, { fitAvailableSpaceBarOffset } from "../../components/bar";
import ViewmodeButton from "../../components/button/viewmode";
import Filter from "../../components/filter";

const mapStateToProps = ({
  state: {
    window: { inner },
  },
}) => ({ windowInnerDimensions: inner });

function MoviesRoute({ windowInnerDimensions }) {
  const [filter, setFilter] = useState("");
  return (
    <section
      {...{
        id: "route",
        ref: useRef(),
        style: useFitAvailableSpace(
          windowInnerDimensions,
          fitAvailableSpaceBarOffset()
        ),
      }}
    >
      <Bar>
        <Filter
          {...{
            marginLeftPercentage: 8.5,
            widthPercentage: 80,
            marginRightPercentage: 11.5,
            filter,
            setFilter,
          }}
        />
        <ViewmodeButton
          style={{ marginLeft: "-1.5vmin" }}
          viewmodes={["list"]}
          alterSelected={{ list: ["list", "horizontal", "vertical"] }}
        />
      </Bar>
    </section>
  );
}
export default connect(mapStateToProps)(MoviesRoute);
