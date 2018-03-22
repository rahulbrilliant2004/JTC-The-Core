import {initOriginData} from './initialStates';
const originData = (state = initOriginData, action) => {
  switch (action.type) {
    case 'SET_ORIGIN_INPUT':
      return {
        ...state,
        [action.key]: action.payload,
      };
    case 'SET_VIEW_CONSIGNMENT':
      return {
        ...state,
        ...action.payload.OriginData,
      };
    case 'RESET_ALL_FORM':
      return {
        ...initOriginData,
      };
    default:
      return state;
  }
};
export default originData;
