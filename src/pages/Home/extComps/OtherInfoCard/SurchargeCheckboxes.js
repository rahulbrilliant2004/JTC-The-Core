import React from 'react';
import {Checkbox, FormControlLabel, Grid} from 'material-ui';
import withStyles from 'material-ui/styles/withStyles';
import Radio, {RadioGroup} from 'material-ui/Radio';
import {RadioButtonChecked, RadioButtonUnchecked} from 'material-ui-icons';
const Styles = (theme) => ({
  uniqueInputFill: {
    color: 'rgb(50, 57, 144)',
  },
  additionalSurchargeTile: {
    margin: 3,
  },
  root: {
    flexGrow: 1,
  },
});

const surchargeCheckboxes = (props) => {
  const {
    handleChange,
    adtReducer,
    removeSurchargeItem,
    classes,
    pk,
    surchargesArr,
    overWeight,
  } = props;
  return (
    <Grid container className={classes.root} spacing={0}>
      <Grid item xs={6}>
        <Grid container spacing={0}>
        {
          overWeight &&
          <Grid item>
              <div>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="adtSurcharge"
                      checked={true}
                      value={'overweight'}
                      onChange={handleChange}
                      classes={{checked: classes.uniqueInputFill}}
                      style={{clear: 'both'}}
                      disabled
                    />
                  }
                  label={'Overweight'}
                />
              </div>
            </Grid>
        }
          <Grid item>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    name="adtSurcharge"
                    checked={adtReducer && adtReducer.includes('insurance')}
                    value={'insurance'}
                    onChange={adtReducer && adtReducer.includes('insurance')
                    ? () => removeSurchargeItem('insurance')
                    : handleChange}
                    classes={{checked: classes.uniqueInputFill}}
                    style={{clear: 'both'}}
                  />
                }
                label={'Insurance'}
              />
            </div>
          </Grid>

          <Grid item>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    name="adtSurcharge"
                    checked={adtReducer && adtReducer.includes('Packing Kayu')}
                    value={'Packing Kayu'}
                    onChange={
                      adtReducer && adtReducer.includes('Packing Kayu')
                        ? () => removeSurchargeItem('Packing Kayu')
                        : handleChange
                    }
                    classes={{checked: classes.uniqueInputFill}}
                    style={{clear: 'both'}}
                  />
                }
                label={'Packing Kayu'}
              />
              <div style={{clear: 'both'}} />
              {
                adtReducer.includes('Packing Kayu') && (
                  <div>
                    <Radio checked={pk === '1'} onChange={handleChange} value={'1'} name="pk" aria-label="A" />
                    <label>PK1</label>
                    <div style={{clear: 'both'}} />
                    <Radio checked={pk === '2'} onChange={handleChange} value={'2'} name="pk" aria-label="B" />
                    <label>PK2</label>
                    <div style={{clear: 'both'}} />
                    <Radio checked={pk === '3'} onChange={handleChange} value={'3'} name="pk"aria-label="C" />
                    <label>PK3</label>
                    <div style={{clear: 'both'}} />
                  </div>
              )}
            </div>
          </Grid>
          <Grid>
            {surchargesArr.map((box, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    name="otherSurcharges"
                    checked={
                      adtReducer && adtReducer.includes(box.surcharge_name)
                    }
                    checkedIcon={<RadioButtonChecked />}
                    icon={<RadioButtonUnchecked />}
                    onChange={handleChange}
                    value={box.surcharge_name}
                    classes={{checked: classes.uniqueInputFill}}
                  />
                }
                label={box.surcharge_name}
              />
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default withStyles(Styles)(surchargeCheckboxes);
