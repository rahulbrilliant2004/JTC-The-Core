// @flow

import {cloneableGenerator} from 'redux-saga/utils';
import {call, put, takeEvery, all, take, select} from 'redux-saga/effects';
import {push, goBack} from 'react-router-redux';
import {createStore} from 'redux';

import inventoryBaggingAPI from '../inventoryBaggingAPI';
import convertSnakeCasedToCamelCase from '../../../helpers/convertSnakeCasedToCamelCase';
import rootReducer from '../../../store/reducers';

import {
  inventoryBaggingSagaWatcher,
  bagConnoteSaga,
  closeBagSaga,
} from '../inventoryBaggingSaga';

describe('inventorySaga', () => {
  it('should run the watcher correctly', () => {
    let generator = inventoryBaggingSagaWatcher();
    expect(generator.next().value).toEqual(
      takeEvery('BAG_CONNOTE_REQUESTED', bagConnoteSaga),
    );
    expect(generator.next().value).toEqual(
      takeEvery('CLOSE_BAG_REQUESTED', closeBagSaga),
    );
  });

  it('should generate bag before bagging connote', () => {
    let action = {
      type: 'BAG_CONNOTE_REQUESTED',
      connoteNumber: 'connoteNumber',
    };
    let generator = cloneableGenerator(bagConnoteSaga)(action);
    generator = generator.clone();

    let newBagResponse = {
      status: {
        code: 200,
      },
      data: {
        bagID: 123,
        bagNo: 'BAG 123001',
      },
    };
    let activeBag = {
      ...newBagResponse.data,
      bagNumber: newBagResponse.data.bagNo,
    };
    expect(generator.next().value).toEqual(
      call(inventoryBaggingAPI.generateBag),
    );
    expect(generator.next(newBagResponse).value).toEqual(
      put({
        type: 'NEW_BAG_GENERATED',
        bag: activeBag,
      }),
    );
    expect(generator.next(newBagResponse).value).toEqual(
      call(inventoryBaggingAPI.putConnoteInActiveBag, {
        bagID: activeBag.bagID,
        connoteNumber: action.connoteNumber,
      }),
    );

    let response = {
      status: {
        code: 200,
      },
      valueNumber: 'CON 000123',
      type: 'CON',
      dataValue: {
        fromTlc: 'destination',
        serviceCode: 'service',
      },
    };

    expect(generator.next(response).value).toEqual(select());

    let store = createStore(rootReducer);
    let state = {
      ...store.getState(),
      router: {
        location: {
          pathname: '',
        },
      },
    };

    expect(generator.next(state).value).toEqual(
      put({
        type: 'BAG_CONNOTE_SUCCEED',
        item: {
          id: response.valueNumber,
          type: response.type,
        },
        additionalBagInfo: {
          service: response.dataValue.serviceCode,
          destination: `${response.dataValue.fromTlc}${action.connoteNumber}`,
        },
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'SHOW_NOTIFICATION_REQUESTED',
        notification: {
          id: action.connoteNumber,
          text: `Success in adding connote ${action.connoteNumber}`,
        },
      }),
    );
    expect(generator.next().value).toEqual(
      put(push(`/inventory/bagging/${activeBag.bagID}`)),
    );
  });

  it('should not generate new bag and should not redirect user to the bagging/<activeBagID> if they are already there', () => {
    let existedActiveBag = {
      bagID: 123,
      bagNumber: 'BAG 123xxx',
    };
    let action = {
      type: 'BAG_CONNOTE_REQUESTED',
      connoteNumber: 'connoteNumber',
      activeBag: existedActiveBag,
    };
    let generator = cloneableGenerator(bagConnoteSaga)(action);
    generator = generator.clone();

    expect(generator.next().value).toEqual(
      call(inventoryBaggingAPI.putConnoteInActiveBag, {
        bagID: existedActiveBag.bagID,
        connoteNumber: action.connoteNumber,
      }),
    );

    let response = {
      status: {
        code: 200,
      },
      valueNumber: 'CON 000123',
      type: 'CON',
      dataValue: {
        fromTlc: 'destination',
        serviceCode: 'service',
      },
    };

    expect(generator.next(response).value).toEqual(select());

    let store = createStore(rootReducer);
    let state = {
      ...store.getState(),
      router: {
        location: {
          pathname: `/inventory/bagging/${existedActiveBag.bagID}`,
        },
      },
    };

    expect(generator.next(state).value).toEqual(
      put({
        type: 'BAG_CONNOTE_SUCCEED',
        item: {
          id: response.valueNumber,
          type: response.type,
        },
        additionalBagInfo: {
          service: response.dataValue.serviceCode,
          destination: `${response.dataValue.fromTlc}${action.connoteNumber}`,
        },
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'SHOW_NOTIFICATION_REQUESTED',
        notification: {
          id: action.connoteNumber,
          text: `Success in adding connote ${action.connoteNumber}`,
        },
      }),
    );
    expect(generator.next().value).toBeUndefined();
  });

  it('should close the bag correctly', () => {
    let activeBag = {
      bagID: 123,
      bagNumber: 'BAG 123xxx',
    };

    let action = {
      type: 'CLOSE_BAG_REQUESTED',
      activeBag,
    };

    let generator = closeBagSaga(action);

    expect(generator.next().value).toEqual(
      call(inventoryBaggingAPI.closeBag, {
        bagID: activeBag.bagID,
      }),
    );

    let response = {
      status: {
        code: 200,
      },
    };

    expect(generator.next(response).value).toEqual(
      put({
        type: 'RESET_BAG_LIST_DATA',
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'RESET_CONNOTE_LIST_DATA',
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'CLOSE_BAG_SUCCEED',
      }),
    );
    expect(generator.next().value).toEqual(
      put({
        type: 'SHOW_NOTIFICATION_REQUESTED',
        notification: {
          id: activeBag.bagID,
          text: `Success in closing ${activeBag.bagNumber}`,
        },
      }),
    );
    expect(generator.next().value).toEqual(
      put(push('/inventory/item/list?tab=bag')),
    );
  });

  it('should not send additional bag info if the type is not CON', () => {
    let existedActiveBag = {
      bagID: 123,
      bagNumber: 'BAG 123xxx',
    };
    let action = {
      type: 'BAG_CONNOTE_REQUESTED',
      connoteNumber: 'connoteNumber',
      activeBag: existedActiveBag,
    };
    let generator = cloneableGenerator(bagConnoteSaga)(action);
    generator = generator.clone();

    expect(generator.next().value).toEqual(
      call(inventoryBaggingAPI.putConnoteInActiveBag, {
        bagID: existedActiveBag.bagID,
        connoteNumber: action.connoteNumber,
      }),
    );

    let response = {
      status: {
        code: 200,
      },
      valueNumber: 'CON 000123',
      type: 'BAG',
      dataValue: {
        fromTlc: 'destination',
        serviceCode: 'service',
      },
    };

    expect(generator.next(response).value).toEqual(select());

    let store = createStore(rootReducer);
    let state = {
      ...store.getState(),
      router: {
        location: {
          pathname: `/inventory/bagging/${existedActiveBag.bagID}`,
        },
      },
    };

    expect(generator.next(state).value).toEqual(
      put({
        type: 'BAG_CONNOTE_SUCCEED',
        item: {
          id: response.valueNumber,
          type: response.type,
        },
        additionalBagInfo: {},
      }),
    );
  });
});
