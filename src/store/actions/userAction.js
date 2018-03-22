import {getEntityList} from '../../actions/entity';

export default {
  mapDispatchToProps(dispatch) {
    return {
      setFocusToNextInput: (textfield) => {
        dispatch({
          type: 'SET_FOCUS_ON_INPUT',
          payload: textfield,
        });
      },
      setInputOrigin: (key, originFinalData) => {
        dispatch({
          type: 'SET_FOCUS_ON_INPUT',
          payload: '',
        });
        dispatch({
          type: 'SET_ORIGIN_INPUT',
          key,
          payload: originFinalData,
        });
      },
      setInputDestination: (key, destinationFinalData) => {
        dispatch({
          type: 'SET_FOCUS_ON_INPUT',
          payload: '',
        });
        dispatch({
          type: 'SET_DESTINATION_INPUT',
          key,
          payload: destinationFinalData,
        });
      },
      throwKodePosToForDestination: (kodePos, kodeTo) => {
        dispatch({
          type: 'THROW_KODEPOSTO_TO_DESTINATIONDATA',
          kodePos,
          kodeTo,
        });
      },
      fetchAlmtPenerima: (item) => {
        const originCode = sessionStorage.getItem('originCode');
        dispatch({
          type: 'SET_FOCUS_ON_INPUT',
          payload: item.tariff_code !== null ? 'deskripsiInput' : '',
        });
        dispatch({
          type: 'SET_ALMT_TO_FIELD',
          payload: item,
        });
        dispatch({
          type: 'THROW_KODEPOSTO_TO_DESTINATIONDATA',
          kodePos: item.zip_code,
          kodeTo: item.tariff_code,
        });
        item.tariff_code && originCode &&
          getEntityList('service', {
            origin: originCode,
            destination: item.tariff_code,
          }).then((response) => {
            const {data} = response.data;
            dispatch({
              type: 'SET_OTHERINFO_INPUT',
              key: 'serviceData',
              payload: data,
            });
          });
      },
      // checkAlmtPenerimaReducer: (almtPenerimaReducer, almtPenerima) => {
      //     dispatch({
      //         type: 'CHECK_ALMTRESULT_ISEXIST',
      //         almtR: almtPenerimaReducer,
      //         almtP: almtPenerima
      //     })
      // },
      setInputOtherInfo: (key, otherInfoFinalData) => {
        dispatch({
          type: 'SET_FOCUS_ON_INPUT',
          payload: '',
        });
        dispatch({
          type: 'SET_OTHERINFO_INPUT',
          key,
          payload: otherInfoFinalData,
        });
      },
      removeSurchargeItem: (item) => {
        dispatch({
          type: 'REMOVE_SURCHARGE_ITEMS',
          item,
        });
      },
      concatAllData: (
        originData,
        destinationData,
        otherInfoData,
        total = 0,
      ) => {
        dispatch({
          type: 'CONCAT_ALLDATA',
          OriginData: originData,
          DestinationData: destinationData,
          OtherInfoData: otherInfoData,
          Total: total,
        });
      },
      resetAllForm: (originData, destinationData, otherInfoData) => {
        dispatch({
          type: 'ALL_SUCCESS',
          originData,
          destinationData,
          otherInfoData,
        });
      },
      resetForm: () => {
        dispatch({
          type: 'RESET_FORM',
        });
      },
      setReadOnlyPackage: (consignment) => {
        dispatch({
          type: 'SET_VIEW_CONSIGNMENT',
          payload: consignment.package,
        });
      },
      transactionComplete: () => {
        dispatch({
          type: 'RESET_ALL_FORM',
        });
      },
      getUserList: (callback) => dispatch(callback),
    };
  },
  mapStateToProps(state) {
    return {
      additionalStore: state,
    };
  },
};
