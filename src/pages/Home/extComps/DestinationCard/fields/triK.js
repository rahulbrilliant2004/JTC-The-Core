import React, { Component } from 'react';
import {Grid, FormControl, InputLabel, Input} from 'material-ui';

class TriK extends Component {
  state={
    input: null
  }
  focusUsernameInputField = (input) => {
    if (input) {
      this.setState({input});
    }
  };
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.autoFocus && this.state.input) {
      setTimeout(() => {this.state.input.focus();}, 100);
    }
  }
  render() {
    const {classes, item, handleChange, handleFocusSearch, handleBlurSearch, showFocus} = this.props;
    const {focusUsernameInputField} = this;
    return (
      <Grid container spacing={0}>
        <Grid item>
          <FormControl className={classes.textField}>
            <InputLabel
              FormControlClasses={{focused: classes.inputLabelFocused}}
              htmlFor="focusedInput"
              className={classes.inputLabel}
            >
              {item.label}
            </InputLabel>
            <Input
              inputRef={focusUsernameInputField}
              type="text"
              name={item.name}
              value={item.value}
              onChange={handleChange}
              onFocus={handleFocusSearch}
              onBlur={handleBlurSearch}
              classes={{inkbar: classes.inputInkbarFocused}}
              id="focusedInput"
              inputProps={{
                readOnly: this.props.readOnly,
                disabled: this.props.readOnly,
              }}
            />
          </FormControl>
        </Grid>
      </Grid>
    );
  }
};
export default TriK;
