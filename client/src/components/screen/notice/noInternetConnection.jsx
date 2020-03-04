import React from 'react';
import './noInternetConnection.scss';

const onlineDescriptor = {
  en: "Dear[name], you're offline.",
  pl: 'Drogi[name], jesteś offline.',
  fr: 'Cher[name], vous êtes hors ligne',
  nl: 'Geachte[name], u bent offline'
};
function NoInternetConnectionNotice({ language, userName, isOnLine }) {
  return (
    <div
      className={`no-internet-connection-notice${isOnLine ? ' hidden' : ''}`}
    >
      {onlineDescriptor[language].replace(
        '[name]',
        userName ? ` ${userName}` : ''
      )}
    </div>
  );
}

export default NoInternetConnectionNotice;
