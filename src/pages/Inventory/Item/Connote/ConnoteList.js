// @flow

import React from 'react';
import {connect} from 'react-redux';
import {
  Typography,
  Button,
  Table,
  TableCell,
  TableRow,
  Icon,
} from 'material-ui';
import {View} from 'react-native';

import {
  TableHead,
  TableBody,
  TableTitle,
  TableFooter,
} from '../../../../components/Table';
import { getConnoteData } from '../../../../constants/excelFilters';
import {columnList} from './constants';
import {DEFAULT_ROWS_PER_PAGE} from '../../../../components/Table/TableFooter';

import type {ConnoteItem} from '../../../../data/connote/Connote-type';
import type {RootState, Dispatch} from '../../../../storeTypes';

type Props = {
  data: Array<ConnoteItem>,
  total: number,
  nextPageUrl: ?string,
  prevPageUrl: ?string,
  isLoading: boolean,
  activeNode: number,
  searchTextInput: string,
  fetchData: (
    searchTextInput: string,
    rowsPerPage: number,
    activeSortColumn: string,
    activeSortType: SortType,
    activePage: number,
    nodeID: number,
  ) => void,
  bagConnoteRequested: (connoteNumber: string) => void,
  onSearchTextInputChanged: (searchTextInput: string) => void,
};

type State = {
  rowsPerPage: number,
  activePage: number,
  activeSortColumn: string,
  activeSortType: SortType,
};

export class ConnoteList extends React.Component<Props, State> {
  state = {
    rowsPerPage: DEFAULT_ROWS_PER_PAGE,
    activePage: 0,
    activeSortColumn: '',
    activeSortType: 'asc',
  };
  componentWillMount() {
    let {searchTextInput, data, fetchData, activeNode} = this.props;
    if (data.length === 0) {
      let {
        rowsPerPage,
        activeSortColumn,
        activeSortType,
        activePage,
      } = this.state;
      fetchData(
        searchTextInput,
        rowsPerPage,
        activeSortColumn,
        activeSortType,
        activePage + 1,
        activeNode,
      );
    }
  }

  componentWillReceiveProps(newProps: Props) {
    let oldProps = this.props;
    let {
      rowsPerPage,
      activeSortColumn,
      activeSortType,
      activePage,
    } = this.state;
    if (oldProps.activeNode !== newProps.activeNode) {
      newProps.fetchData(
        newProps.searchTextInput,
        rowsPerPage,
        activeSortColumn,
        activeSortType,
        activePage + 1,
        newProps.activeNode,
      );
    }
  }

  render() {
    let {
      data,
      total,
      fetchData,
      bagConnoteRequested,
      activeNode,
      searchTextInput,
      onSearchTextInputChanged,
    } = this.props;
    let {
      rowsPerPage,
      activeSortColumn,
      activeSortType,
      activePage,
    } = this.state;
    let {columns, excelData} = getConnoteData(columnList, data)
    return (
      <View style={{flex: 1}}>
        <TableTitle
          title="Connote List"
          searchTextInput={searchTextInput}
          onSearchTextChange={onSearchTextInputChanged}
          onSearchSubmit={(searchTextInput) => {
            fetchData(
              searchTextInput,
              rowsPerPage,
              activeSortColumn,
              activeSortType,
              activePage + 1,
              activeNode,
            );
          }}
          columns={columns}
          data={excelData}
          filename="connote.xlsx"
          orgName="JNE"
        />
        <Table>
          <TableHead
            columnList={columnList}
            onSortClick={(
              activeSortType: SortType,
              activeSortColumn: string,
            ) => {
              fetchData(
                searchTextInput,
                rowsPerPage,
                activeSortColumn,
                activeSortType,
                activePage + 1,
                activeNode,
              );
              this.setState({activeSortColumn, activeSortType});
            }}
          />
          <TableBody
            data={data}
            render={(datum) => {
              return (
                <TableRow>
                  <TableCell>{datum.connoteNumber}</TableCell>
                  <TableCell>{datum.createdOn}</TableCell>
                  <TableCell>{datum.toTariffCode}</TableCell>
                  <TableCell numeric>{datum.chargeableWeight}</TableCell>
                  <TableCell>{datum.serviceCode}</TableCell>
                  <TableCell>{datum.slaDate}</TableCell>
                  <TableCell>
                    {datum.isWoodPackage && (
                      <Icon style={{color: 'green', alignSelf: 'center'}}>
                        check_circle
                      </Icon>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="raised"
                      style={{backgroundColor: 'green', color: 'white'}}
                      onClick={() => {
                        console.log('masuk');
                        bagConnoteRequested(datum.connoteNumber);
                      }}
                    >
                      BAG
                    </Button>
                  </TableCell>
                </TableRow>
              );
            }}
          />
          <TableFooter
            rowsPerPage={rowsPerPage}
            activePage={activePage}
            dataLength={total}
            onChangePage={(activePage: number) => {
              fetchData(
                searchTextInput,
                rowsPerPage,
                activeSortColumn,
                activeSortType,
                activePage + 1,
                activeNode,
              );
              this.setState({activePage});
            }}
            onChangeRowsPerPage={(rowsPerPage) => {
              fetchData(
                searchTextInput,
                rowsPerPage,
                activeSortColumn,
                activeSortType,
                1,
                activeNode,
              );
              this.setState({rowsPerPage, activePage: 0});
            }}
          />
        </Table>
      </View>
    );
  }
}

function mapStateToProps(state: RootState) {
  let {
    list,
    nextPageUrl,
    prevPageUrl,
    total,
    isLoading,
    searchTextInput,
  } = state.connote;
  return {
    data: list,
    nextPageUrl,
    prevPageUrl,
    total,
    isLoading,
    searchTextInput,
    activeNode: state.node.activeNode,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onSearchTextInputChanged: (searchTextInput: string) => {
      dispatch({
        type: 'CONNOTE_SEARCH_TEXT_INPUT_CHANGED',
        searchTextInput,
      });
    },
    fetchData: (
      search: string,
      limit: number,
      sortByColumn: string,
      sortOrderType: SortType,
      page: number,
      nodeID: number,
    ) => {
      dispatch({
        type: 'GET_CONNOTE_LIST_REQUESTED',
        search,
        limit,
        sortByColumn,
        sortOrderType,
        page,
        nodeID,
      });
    },
    bagConnoteRequested: (connoteNumber: string) => {
      dispatch({
        type: 'BAG_CONNOTE_REQUESTED',
        connoteNumber,
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnoteList);
