// @flow

import React from 'react';
import {connect} from 'react-redux';
import {View, Text, Image} from 'react-native';
import {
  TextField,
  Typography,
  Paper,
  Table,
  TableRow,
  TableCell,
  Button,
} from 'material-ui';
import {Redirect} from 'react-router';

import Form from '../../../components/core-ui/Form';
import InventoryBaggingItemListTable from './components/InventoryBaggingItemListTable';
import Placeholder from './components/Placeholder';

import type {
  InventoryBaggingState,
  Bag,
} from '../../../data/inventoryBagging/InventoryBagging-type';
import type {RootState, Dispatch} from '../../../storeTypes';

type Props = InventoryBaggingState & {
  bagID: string,
  onBagConnote: (connoteNumber: string, activeBag: ?Bag) => void,
  onCloseNotification: (notificationID: number) => void,
  onNextPress: (activeBag: Bag) => void,
};

type State = {
  codeTextInput: string,
};

export class BaggingList extends React.Component<Props, State> {
  state = {
    codeTextInput: '',
  };

  render() {
    let {
      bagID,
      activeBag,
      baggingItemList,
      onCloseNotification,
      onNextPress,
      onBagConnote,
      service,
      destination,
    } = this.props;
    let {codeTextInput} = this.state;

    console.log('bagID', bagID);
    console.log('activeBag', activeBag);

    if (
      (bagID && !activeBag) ||
      (bagID && activeBag && activeBag.bagID !== Number(bagID))
    ) {
      return <Redirect to="/inventory/bagging" />;
    }

    return (
      <View style={{flex: 1, padding: 30}}>
        <View style={{width: '100%'}}>
          <Typography variant="title" style={{marginBottom: 10}}>
            {bagID && activeBag && activeBag.bagID === Number(bagID)
              ? activeBag.bagNumber
              : 'Bagging'}
          </Typography>
          <View style={{flexDirection: 'row'}}>
            <Form onSubmit={this._onFormSubmit}>
              <TextField
                id="search"
                value={codeTextInput}
                label="Masukan kode BAG / Connote"
                type="search"
                onChange={(event) => {
                  this._onCodeTextChange(event.target.value);
                }}
                style={{width: 300, marginRight: 20}}
              />
              <Button
                variant="raised"
                color="primary"
                onClick={this._onFormSubmit}
              >
                Add
              </Button>
            </Form>
          </View>
        </View>
        <View style={{flex: 1}}>
          {bagID && activeBag && activeBag.bagID === Number(bagID) ? (
            <InventoryBaggingItemListTable
              data={baggingItemList}
              service={service}
              destination={destination}
              onNextPress={() => {
                activeBag && onNextPress(activeBag);
              }}
            />
          ) : (
            <Placeholder />
          )}
        </View>
      </View>
    );
  }

  _onCodeTextChange = (codeTextInput: string) => {
    this.setState({codeTextInput});
  };

  _onFormSubmit = () => {
    let {codeTextInput} = this.state;
    let {activeBag, onBagConnote} = this.props;
    onBagConnote(codeTextInput, activeBag);
    this.setState({codeTextInput: ''});
  };
}

function mapStateToProps(state: RootState) {
  return {
    ...state.inventoryBagging,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onBagConnote: (connoteNumber: string, activeBag: ?Bag) => {
      dispatch({
        type: 'BAG_CONNOTE_REQUESTED',
        connoteNumber,
        activeBag,
      });
    },
    onNextPress: (activeBag: Bag) => {
      dispatch({
        type: 'CLOSE_BAG_REQUESTED',
        activeBag,
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BaggingList);
