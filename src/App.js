import React from 'react';
import {withRouter} from 'react-router-dom';

import {userStoreConnector} from './store/redux-connect';
import Main from './layout/Main';

const App = (props) => <Main UserStore={props} />;
export default withRouter(userStoreConnector(App));
