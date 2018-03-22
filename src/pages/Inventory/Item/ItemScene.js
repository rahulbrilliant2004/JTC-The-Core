// @flow

import React from 'react';
import {View} from 'react-native';
import {Typography, Tabs, Tab, Paper} from 'material-ui';

import ConnoteList from './Connote/ConnoteList';
import BagList from './Bag/BagList';
import {DEFAULT_ROWS_PER_PAGE} from '../../../components/Table/TableFooter';

type ActiveTab = 'connote' | 'bag';

type FetchData = (
  nodeID: string,
  limit: number,
  sortByColumn: string,
  sortOrderType: SortType,
  page: number,
) => void;

type TabValue = 'inventory' | 'employee' | 'vehicle';

type TableState = {
  rowsPerPage: number,
  activePage: number,
  activeSortColumn: string,
  activeSortType: SortType,
};

type Props = {
  tab?: ActiveTab,
};

type State = {
  activeTab: ActiveTab,
  connoteTable: TableState,
  bagTable: TableState,
};

let getTableInitialState = () => ({
  rowsPerPage: DEFAULT_ROWS_PER_PAGE,
  activePage: 0,
  activeSortColumn: '',
  activeSortType: 'asc',
});

export default class ItemScene extends React.Component<Props, State> {
  state = {
    activeTab: this.props.tab || 'connote',
    connoteTable: getTableInitialState(),
    bagTable: getTableInitialState(),
  };

  render() {
    let {activeTab} = this.state;
    return (
      <View style={{flex: 1, paddingHorizontal: 60}}>
        <View style={{marginVertical: 40}}>
          <Typography variant="title">Item</Typography>
        </View>
        <Paper>
          <View style={{paddingHorizontal: 20, paddingTop: 30}}>
            <Tabs
              value={activeTab}
              indicatorColor="primary"
              textColor="primary"
              onChange={this._onTabPress}
            >
              <Tab label="Connote" value="connote" />
              <Tab label="Bag" value="bag" />
            </Tabs>
            <View>{this._renderContent(activeTab)}</View>
          </View>
        </Paper>
      </View>
    );
  }
  _onTabPress = (event: Event, activeTab: ActiveTab) =>
    this.setState({activeTab});

  _renderContent = (activeTab: ActiveTab) => {
    let {
      rowsPerPage,
      activeSortColumn,
      activeSortType,
      activePage,
    } = this.state.connoteTable;
    let connoteComponent = (
      <ConnoteList
        onTableSettingChanged={(changedSettings) =>
          this._onTableSettingChanged('connoteTable', changedSettings)
        }
        rowsPerPage={rowsPerPage}
        activePage={activePage}
        activeSortColumn={activeSortColumn}
        activeSortType={activeSortType}
      />
    );
    switch (activeTab) {
      case 'connote': {
        return connoteComponent;
      }
      case 'bag': {
        let {
          rowsPerPage,
          activeSortColumn,
          activeSortType,
          activePage,
        } = this.state.bagTable;
        return (
          <BagList
            onTableSettingChanged={(changedSettings) =>
              this._onTableSettingChanged('bagTable', changedSettings)
            }
            rowsPerPage={rowsPerPage}
            activePage={activePage}
            activeSortColumn={activeSortColumn}
            activeSortType={activeSortType}
          />
        );
      }

      default:
        return connoteComponent;
    }
  };

  _onTableSettingChanged = (
    type: 'connoteTable' | 'bagTable',
    changedSettings: {[key: string]: any},
  ) => {
    this.setState({
      [type]: {
        ...this.state[type],
        ...changedSettings,
      },
    });
  };
}
