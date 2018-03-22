import React from 'react';
import _ from 'lodash';
import {
  FormControl,
  InputLabel,
  Input,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  GridList,
  GridListTile,
} from 'material-ui';

import Table, {
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow,
} from 'material-ui/Table';
import InputAdornment from 'material-ui/Input/InputAdornment';

import ReactPaginate from 'react-paginate';

class PcsField extends React.Component {
  state = {
    arrPcs: [],
    arrPcs2: [],
    rangePage: 10,
    pageCount: 0,
    page: 0,
    isOpen: false,
    aturBtnDialog: false,
    localkoli: [],
  };

  handlePageClick = (e) => {
    const page = isNaN(e.selected) ? 0 : e.selected;
    this.setState({page});
  };
  handleModal = (key) => {
    let {page, pageCount, rangePage, localkoli} = this.state;
    page = 0;
    pageCount = Math.ceil(this.props.koli.length / rangePage);
    //localkoli = _.cloneDeep(this.props.koli);
    this.setState({[key]: !this.state[key], page, pageCount, localkoli});
  };
  handleChg = (n, e) => {
    this.props.handleChange(e, n.id);
    /*let {localkoli} = this.state;
    localkoli[n.id][e.currentTarget.name] = e.currentTarget.value;
    this.setState({localkoli});*/
  };
  render() {
    const {
      readOnly,
      classes,
      handleModal,
      handleChange,
      handleBlur,
      aturBtnCounter,
      text,
      remarksLabel,
      actionsModal,
      dataPcs,
      weightIcon,
      aturBtnDialog,
      handleSubmit, koli,
    } = this.props;
    const {rangePage, page, pageCount, localkoli} = this.state;

    return (
      <GridList cols={2}>
        <GridListTile>
          <br />
          <FormControl>
            {/*pcsField*/}
            <InputLabel
              FormControlClasses={{focused: classes.inputLabelFocused}}
              htmlFor="focusedInput"
              className={classes.inputLabel}
            >
              {text.label}
            </InputLabel>
            <Input
              classes={{inkbar: classes.inputInkbarFocused}}
              id="focusedInput"
              onChange={handleChange}
              onBlur={handleBlur}
              defaultValue={1}
              type="number"
              maxLength="1000"
              className={classes.textField}
              name={text.name}
              value={text.value}
              inputProps={{
                readOnly: readOnly,
                disabled: readOnly,
              }}
            />
          </FormControl>
        </GridListTile>
        <GridListTile>
          <Button
            classes={{root: classes.remarksBtn, label: classes.remarksLabel}}
            disabled={aturBtnCounter || readOnly}
            onClick={() => this.handleModal('aturBtnDialog')}
            dense="true"
          >
            <img
              src={weightIcon}
              alt="weight"
              className={
                !aturBtnCounter
                  ? classes.remarksImgEnabled
                  : classes.remarksImgDisabled
              }
            />
            {remarksLabel}
          </Button>
          <Dialog
            open={this.state.aturBtnDialog}
            aria-labelledby="aturBtn-title"
            aria-describedby="aturBtn-content"
            classes={{paperWidthSm: classes.aturDialogWrapper}}
          >
            <DialogContent id="aturBtn-content">
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell>Berat</TableCell>
                    <TableCell>Lebar</TableCell>
                    <TableCell>Panjang</TableCell>
                    <TableCell>Tinggi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    koli.slice(page * rangePage, page * rangePage + rangePage)
                    .map((item, index) =>
                      <TableRow key={index}>
                        <TableCell>{ page * rangePage + index + 1}</TableCell>
                        <TableCell>
                          <Input
                            onChange={this.handleChg.bind(this, item)}
                            type="number" name="berat"
                            inputProps={{
                              readOnly: readOnly,
                              disabled: readOnly,
                            }}
                            step="0.00001"
                            value={item.berat}
                            endAdornment={<InputAdornment position="end">Kg</InputAdornment>} classes={{inkbar: classes.inputInkbarFocused}}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            onChange={this.handleChg.bind(this, item)}
                            type="number"
                            name="lebar"
                            inputProps={{
                              readOnly: readOnly,
                              disabled: readOnly,
                            }}
                            defaultValue={10}
                            value={item.lebar}
                            endAdornment={<InputAdornment position="end">Cm</InputAdornment>}
                            classes={{inkbar: classes.inputInkbarFocused}}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            onChange={this.handleChg.bind(this, item)}
                            type="number"
                            name="panjang"
                            inputProps={{
                              readOnly: readOnly,
                              disabled: readOnly,
                            }}
                            value={item.panjang}
                            defaultValue={10}
                            endAdornment={<InputAdornment position="end">Cm</InputAdornment>}
                            classes={{inkbar: classes.inputInkbarFocused}}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            onChange={this.handleChg.bind(this, item)}
                            type="number"
                            name="tinggi"
                            inputProps={{
                              readOnly: readOnly,
                              disabled: readOnly,
                            }}
                            defaultValue={10}
                            value={item.tinggi}
                            endAdornment={<InputAdornment position="end">Cm</InputAdornment>}
                            classes={{inkbar: classes.inputInkbarFocused}}
                          />
                        </TableCell>
                      </TableRow>,
                  )}
                </TableBody>
              </Table>
            </DialogContent>
            <DialogActions>
              <Button variant="raised" color="accent" className={classes.addMoreRaisedBtn}
                onClick={() => {
                  /*handleSaveKoli(localkoli);*/
                  this.handleModal('aturBtnDialog');
                }}
              >Save</Button>
              <Button variant="raised" color="accent" className={classes.addMoreRaisedBtn}
                onClick={() => {
                  this.handleModal('aturBtnDialog');
                }}
              >Cancel</Button>
              <div id="react-paginate">
                <ReactPaginate
                  previousLabel={'<'}
                  nextLabel={'>'}
                  breakLabel={<a href="">...</a>}
                  breakClassName={'break-me'}
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={10}
                  onPageChange={this.handlePageClick}
                  containerClassName={'pagination'}
                  subContainerClassName={'pages pagination'}
                  activeClassName={'active'}
                />
              </div>
            </DialogActions>
          </Dialog>
        </GridListTile>
      </GridList>
    );
  }
}
export default PcsField;
