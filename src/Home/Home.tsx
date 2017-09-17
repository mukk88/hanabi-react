import * as React from 'react';
import { Route, Switch } from 'react-router';
import { Games } from '../Game/Games';
import Game from '../Game/Game';

export const Home = () => {
  return (
    <Switch>
      <Route
        path="/game/:id"
        component={Game}
      />
      <Route
        path="/"
        component={Games}
      />
    </Switch>
  );
};