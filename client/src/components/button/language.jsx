import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './language.scss';

import { connect } from 'react-redux';
import LanguageButtonEntry from './language.entry';

const mapStateToProps = ({ state, router }) => ({
  language: state.user.language,
  languageDescriptors: router.routes['language-descriptors']
});
function LanguageButton({ language, languageDescriptors }) {
  const ref = useRef();
  const [updateInterval, setUpdateInterval] = useState(undefined);
  const [isSelected, setIsSelected] = useState(false);
  const [languageSelectionStyle, setLanguageSelectionStyle] = useState(
    undefined
  );
  useEffect(() => {
    if (ref && ref.current && !updateInterval) {
      setUpdateInterval(
        setInterval(() => {
          const domNode = ReactDOM.findDOMNode(ref.current);
          if (!domNode) {
            clearInterval(updateInterval);
            return;
          }
          const { width } = domNode.getBoundingClientRect();
          if (
            !languageSelectionStyle ||
            languageSelectionStyle.width !== width
          ) {
            setLanguageSelectionStyle({ width });
          }
        }, 100)
      );
    }
  }, [
    ref,
    languageSelectionStyle,
    setLanguageSelectionStyle,
    language,
    updateInterval,
    setUpdateInterval
  ]);
  return [
    <div
      {...{
        ref,
        id: 'language-button',
        className: isSelected ? 'selected' : undefined,
        key: 'language-button',
        onClick: () => setIsSelected(!isSelected)
      }}
    >
      {language.toUpperCase()}
    </div>,
    <div
      {...{
        id: 'language-selection',
        key: 'language-selection',
        className: isSelected ? undefined : 'hidden',
        style: languageSelectionStyle
      }}
    >
      {Object.keys(languageDescriptors).map(entry => (
        <LanguageButtonEntry
          key={entry}
          title={entry}
          isCurrent={entry === language}
          onClick={() => setIsSelected(false)}
        />
      ))}
    </div>
  ];
}

export default connect(mapStateToProps)(LanguageButton);
