import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { useFitAvailableSpace } from '../../components/effects';
import AppendLocationButton from '../../components/button/append/location';
import ViewmodeButton from '../../components/button/viewmode';
import Bar from '../../components/bar';

const mapStateToProps = ({
  state: {
    user: { language },
    window: { inner },
    navigator: { online }
  }
}) => ({ windowInnerDimensions: inner, language, online });

function SeriesRoute({ windowInnerDimensions, language, online }) {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    if (online) {
      (async () => {
        const availableCategories = await (
          await fetch(`/series/${language}`)
        ).json();
        if (
          JSON.stringify(categories) !== JSON.stringify(availableCategories)
        ) {
          setCategories(availableCategories);
        }
      })();
    }
  }, [categories, language, online]);
  return (
    <section
      {...{
        id: 'route',
        ref: useRef(),
        style: useFitAvailableSpace(windowInnerDimensions)
      }}
    >
      <Bar>
        <ViewmodeButton viewmodes={['list']} />
      </Bar>
      {categories.map(category => (
        <AppendLocationButton location={category} />
      ))}
    </section>
  );
}
export default connect(mapStateToProps)(SeriesRoute);
