import React from 'react';
import {Switch, Route} from 'react-router-dom';
import {View} from 'react-native';
import {ConnectedRouter} from 'react-router-redux';
import LayoutWrapper from './LayoutWrapper';
import {routes} from './routes';

import AuthChecker from '../components/AuthChecker';
import {history} from '../store';

const Main = (props) => {
  return (
    <ConnectedRouter history={history}>
      <View>
        <Route render={ ({location}) => { return <AuthChecker location={location} />;}} />
        {routes.map((page, i) => (
          <LayoutWrapper
            key={page.pathName}
            exact={page.exact ? true : false}
            path={page.pathName}
            layout={page.headerComponent}
            component={page.Component}
          />
        ))}
      </View>
    </ConnectedRouter>
  );
};
export default Main;
