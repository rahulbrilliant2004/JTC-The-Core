import React from 'react';
import {GridList, GridListTile} from 'material-ui';
import _ from 'lodash';
import {getTotalSurchargePrice} from './totalResult';
var FormulaParser = require('hot-formula-parser').Parser;
var parser = new FormulaParser();

let basePriceBase = 0;

export const getBasePrice = (e) => {
  basePriceBase = e;
};

const SurchargeResult = (props) => {
  const {allReducer, classes, otherInfoReducer, surcharges} = props;
  let scharge = {price: 0, name: ''};
  let sgArr = [];
  const adtSurcharge = otherInfoReducer.adtSurcharge;

  surcharges.map((item, index) => {
    adtSurcharge.map((x, idx) => {
      // eslint-disable-next-line eqeqeq
      if (x == item.surcharge_name) {
        const formula = item.formula;
        const newF = formula.replace('%BASE_TARIFF', 'baseTariff');
        parser.setVariable('baseTariff', basePriceBase);
        const result = parser.parse(newF);
        const sg = {
          name: item.surcharge_name,
          price: result.result,
        };
        sgArr.push(sg);
      }
    });
  });

  if (sgArr.length > 0) {
    scharge = _.maxBy(sgArr, 'price');
  }

  let cmp = null;
  if (scharge.price > 0) {
    cmp = (
      <label className={classes.tariffSummary}>
        Biaya Lain-lain{' '}
        <span style={{marginLeft: '10px'}}>{`<<${scharge.name}>>`}</span>
      </label>
    );
  } else {
    cmp = <label className={classes.tariffSummary}>No Surcharge</label>;
  }
  getTotalSurchargePrice(scharge.price);
  sessionStorage.setItem('surcharge', scharge.price);
  return (
    <GridList cols={2} cellHeight="auto">
      <GridListTile cols={2}>
        <GridList cols={2} cellHeight="auto">
          <GridListTile>{cmp}</GridListTile>
          <GridListTile>
            <label
              className={classes.tariffSummary}
              style={{float: 'right', marginRight: 10}}
            >
              {scharge.price > 0 ? (
                <span style={{color: '#000'}}>Rp {scharge.price}</span>
              ) : (
                `Rp ` + 0
              )}
            </label>
          </GridListTile>
        </GridList>
      </GridListTile>
    </GridList>
  );
};
export default SurchargeResult;
