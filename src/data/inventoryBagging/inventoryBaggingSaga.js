// @flow

import {call, put, takeEvery, all, take, select} from 'redux-saga/effects';
import {push, goBack} from 'react-router-redux';

import inventoryBaggingAPI from './inventoryBaggingAPI';
import convertSnakeCasedToCamelCase from '../../helpers/convertSnakeCasedToCamelCase';

import type {InventoryBaggingAction} from './InventoryBagging-type';
import type {RootState} from '../../storeTypes';

function* inventoryBaggingSagaWatcher(): Generator<*, *, *> {
  yield takeEvery('BAG_CONNOTE_REQUESTED', bagConnoteSaga);
  yield takeEvery('CLOSE_BAG_REQUESTED', closeBagSaga);
}

function* bagConnoteSaga(action: InventoryBaggingAction): Generator<*, *, *> {
  if (action.type !== 'BAG_CONNOTE_REQUESTED') {
    return;
  }

  let {connoteNumber, activeBag} = action;
  try {
    if (activeBag == null) {
      let result = yield call(inventoryBaggingAPI.generateBag);
      if (result.status.code === 200) {
        let formatted = convertSnakeCasedToCamelCase(result.data);
        activeBag = {
          ...formatted,
          bagNumber: formatted.bagNo,
        };

        yield put({
          type: 'NEW_BAG_GENERATED',
          bag: activeBag,
        });
      } else {
        throw new Error('Failed in generating new bag');
      }
    }

    let raw = yield call(inventoryBaggingAPI.putConnoteInActiveBag, {
      bagID: activeBag.bagID,
      connoteNumber,
    });
    let result = convertSnakeCasedToCamelCase(raw);
    if (result.status.code === 200) {
      let state: RootState = yield select();
      let splittedPathname = state.router.location.pathname.split('/');

      let additionalBagInfo = {};
      if (result.type === 'CON') {
        additionalBagInfo = {
          ...additionalBagInfo,
          service: result.dataValue.serviceCode,
          destination: `${result.dataValue.fromTlc}${connoteNumber}`,
        };
      }

      yield put({
        type: 'BAG_CONNOTE_SUCCEED',
        item: {
          id: result.valueNumber,
          type: result.type,
        },
        additionalBagInfo,
      });
      yield put({
        type: 'SHOW_NOTIFICATION_REQUESTED',
        notification: {
          id: connoteNumber,
          text: `Success in adding connote ${connoteNumber}`,
        },
      });

      if (
        splittedPathname[splittedPathname.length - 1] !==
        String(activeBag.bagID)
      ) {
        yield put(push(`/inventory/bagging/${activeBag.bagID}`));
      }
    } else {
      throw new Error(
        `Failed in adding connote number ${connoteNumber} to ${
          activeBag.bagNumber
        }. ${result.status.description}`,
      );
    }
  } catch (error) {
    yield put({
      type: 'ERROR_OCCURRED',
      error,
    });
    yield put({
      type: 'SHOW_NOTIFICATION_REQUESTED',
      notification: {
        id: connoteNumber,
        text: error.message,
      },
    });
    yield put({
      type: 'BAG_CONNOTE_FAILED',
      error,
    });
  }
}

function* closeBagSaga(action: InventoryBaggingAction): Generator<*, *, *> {
  if (action.type !== 'CLOSE_BAG_REQUESTED') {
    return;
  }

  let {activeBag} = action;
  try {
    let raw = yield call(inventoryBaggingAPI.closeBag, {
      bagID: activeBag.bagID,
    });
    let result = convertSnakeCasedToCamelCase(raw);

    if (result.status.code === 200) {
      yield put({
        type: 'RESET_BAG_LIST_DATA',
      });
      yield put({
        type: 'RESET_CONNOTE_LIST_DATA',
      });

      yield put({
        type: 'CLOSE_BAG_SUCCEED',
      });
      yield put({
        type: 'SHOW_NOTIFICATION_REQUESTED',
        notification: {
          id: activeBag.bagID,
          text: `Success in closing ${activeBag.bagNumber}`,
        },
      });

      yield put(push('/inventory/item/list?tab=bag'));
    } else {
      throw new Error(result.status.description);
    }
  } catch (error) {
    yield put({
      type: 'ERROR_OCCURRED',
      error,
    });

    yield put({
      type: 'SHOW_NOTIFICATION_REQUESTED',
      notification: {
        id: activeBag.bagID,
        text: `Failed to close bag ${activeBag.bagNumber}. ${error.message}`,
      },
    });

    yield put({
      type: 'CLOSE_BAG_FAILED',
      error,
    });
  }
}

export {inventoryBaggingSagaWatcher, bagConnoteSaga, closeBagSaga};
