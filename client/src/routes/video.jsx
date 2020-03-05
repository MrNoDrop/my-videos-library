import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { useFitAvailableSpace } from '../components/effects';
import DisplayVideo from '../components/display/video';
import Bar from '../components/bar';

const mapStateToProps = ({
  state: {
    window: { inner }
  }
}) => ({ windowInnerDimensions: inner });

function HomeRoute({ windowInnerDimensions }) {
  return (
    <section
      {...{
        id: 'route',
        ref: useRef(),
        style: useFitAvailableSpace(windowInnerDimensions)
      }}
    >
      <Bar />
      <DisplayVideo />
    </section>
  );
}
export default connect(mapStateToProps)(HomeRoute);
