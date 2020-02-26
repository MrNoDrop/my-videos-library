import React from 'react';
import { Switch, Route } from 'react-router-dom';

export default () => (
  <Switch>
    <Route path="/" exact strict component={() => 'Hello world'} />
  </Switch>
);
