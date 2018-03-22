import _ from 'lodash/fp';

const initialState = {
  readyStatus: 'USER_INVALID',
  err: null,
  data: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'USER_LIST_REQUESTING':
      return _.assign(state, {
        readyStatus: 'USER_LIST_REQUESTING',
      });
    case 'USER_LIST_FAILURE':
      return _.assign(state, {
        readyStatus: 'USER_LIST_FAILURE',
        err: action.err,
      });
    case 'USER_LIST_SUCCESS':
      return _.assign(state, {
        readyStatus: 'USER_LIST_SUCCESS',
        data: action.data.data,
      });

    case 'USER_SAVE_REQUESTING':
      return _.assign(state, {
        readyStatus: 'USER_SAVE_REQUESTING',
      });
    case 'USER_SAVE_FAILURE':
      return _.assign(state, {
        readyStatus: 'USER_SAVE_FAILURE',
        err: action.err,
      });
    case 'USER_SAVE_SUCCESS':
      return _.assign(state, {
        readyStatus: 'USER_SAVE_SUCCESS',
        data: action.data,
      });

    case 'USER_INFO_REQUESTING':
      return _.assign(state, {
        readyStatus: 'USER_INFO_REQUESTING',
      });
    case 'USER_INFO_FAILURE':
      return _.assign(state, {
        readyStatus: 'USER_INFO_FAILURE',
        err: action.err,
      });
    case 'USER_INFO_SUCCESS':
      return _.assign(state, {
        readyStatus: 'USER_INFO_SUCCESS',
        data: action.data,
      });
    default:
      return state;
  }
};
