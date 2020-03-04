import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { useFitAvailableSpace } from '../components/effects';

const mapStateToProps = ({
  state: {
    window: { inner }
  }
}) => ({ windowInnerDimensions: inner });

function SeriesRoute({ windowInnerDimensions }) {
  return (
    <section
      {...{
        id: 'route',
        ref: useRef(),
        style: useFitAvailableSpace(windowInnerDimensions)
      }}
    >
      movies
    </section>
  );
}
export default connect(mapStateToProps)(SeriesRoute);
