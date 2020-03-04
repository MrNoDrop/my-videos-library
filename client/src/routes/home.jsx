import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { useFitAvailableSpace } from '../components/effects';

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
      home
    </section>
  );
}
export default connect(mapStateToProps)(HomeRoute);
