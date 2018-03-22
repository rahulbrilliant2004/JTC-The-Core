import React, {Component} from 'react';
import {FormControl, FormLabel, GridList, GridListTile} from 'material-ui';
import InputLabel from 'material-ui/Input/InputLabel';
import Input from 'material-ui/Input/Input';
import InputAdornment from 'material-ui/Input/InputAdornment';

class BlptBtn extends Component {
  handleChg = (n, e) => {
    this.props.handleChange(e, n);
  };

  render() {
    const {
      gridListBlpt,
      blpt,
      koli,
      inputLabelFocused,
      inputInkbarFocused,
      num,
      idx,
      key,
      readOnly,
    } = this.props;
    return (
      <GridList cols={4} className={gridListBlpt} cellHeight="auto">
        <GridListTile cols={1}>
          <FormControl className={blpt}>
            <FormLabel classes={{focused: inputLabelFocused}}>
              <strong style={{marginRight: 0}}>
                {num >= 0 && `${num + 1}.`}
              </strong>{' '}
              Berat *
            </FormLabel>
            <Input
              onChange={this.handleChg.bind(this, idx)}
              type="number"
              name="berat"
              inputProps={{
                readOnly: readOnly,
                disabled: readOnly,
              }}
              step="0.00001"
              value={koli.berat}
              endAdornment={<InputAdornment position="end">Kg</InputAdornment>}
              classes={{inkbar: inputInkbarFocused}}
            />
          </FormControl>
        </GridListTile>
        <GridListTile cols={1}>
          <FormControl className={blpt}>
            <FormLabel classes={{focused: inputLabelFocused}}>
              Lebar *
            </FormLabel>
            <Input
              onChange={this.handleChg.bind(this, idx)}
              type="number"
              name="lebar"
              inputProps={{
                readOnly: readOnly,
                disabled: readOnly,
              }}
              defaultValue={10}
              value={koli.lebar}
              endAdornment={<InputAdornment position="end">Cm</InputAdornment>}
              classes={{inkbar: inputInkbarFocused}}
            />
          </FormControl>
        </GridListTile>
        <GridListTile cols={1}>
          <FormControl className={blpt}>
            <FormLabel classes={{focused: inputLabelFocused}}>
              Panjang *
            </FormLabel>
            <Input
              onChange={this.handleChg.bind(this, idx)}
              type="number"
              name="panjang"
              inputProps={{
                readOnly: readOnly,
                disabled: readOnly,
              }}
              value={koli.panjang}
              defaultValue={10}
              endAdornment={<InputAdornment position="end">Cm</InputAdornment>}
              classes={{inkbar: inputInkbarFocused}}
            />
          </FormControl>
        </GridListTile>
        <GridListTile cols={1}>
          <FormControl className={blpt}>
            <FormLabel classes={{focused: inputLabelFocused}}>
              Tinggi *
            </FormLabel>
            <Input
              onChange={this.handleChg.bind(this, idx)}
              type="number"
              name="tinggi"
              inputProps={{
                readOnly: readOnly,
                disabled: readOnly,
              }}
              defaultValue={10}
              value={koli.tinggi}
              endAdornment={<InputAdornment position="end">Cm</InputAdornment>}
              classes={{inkbar: inputInkbarFocused}}
            />
          </FormControl>
        </GridListTile>
      </GridList>
    );
  }
}
export default BlptBtn;
