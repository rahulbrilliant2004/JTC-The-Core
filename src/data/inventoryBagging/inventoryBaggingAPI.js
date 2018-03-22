// @flow

import fetchJSON from '../../helpers/fetchJSON';

type GenerateBagParam = {
  bagNumber?: string,
};

type PutConnoteInActiveBagParams = {
  bagID: number, // or bag number?
  connoteNumber: string,
};

type CloseBagParams = {
  bagID: number,
};

export function createInventoryBaggingAPI(fetch: Fetch) {
  return {
    generateBag(params: GenerateBagParam = {}) {
      let {bagNumber} = params;

      let fetchParams = {};
      if (bagNumber) {
        fetchParams = {
          ...fetchParams,
          bag_no: bagNumber,
        };
      }
      return fetch
        .post('/bag', {
          ...fetchParams,
        })
        .then((response) => response.data);
    },
    putConnoteInActiveBag(params: PutConnoteInActiveBagParams) {
      let {bagID, connoteNumber} = params;
      return fetch
        .post(`/bag/detail`, {
          bag_id: bagID,
          value_id: connoteNumber,
        })
        .then((response) => response.data);
    },
    closeBag(params: CloseBagParams) {
      let {bagID} = params;
      return fetch
        .put(`/bag/status/${bagID}`, {})
        .then((response) => response.data);
    },
  };
}

export default createInventoryBaggingAPI(fetchJSON);
