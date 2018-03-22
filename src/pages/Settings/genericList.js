import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import {withStyles} from 'material-ui/styles';
import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow,
} from 'material-ui/Table';
import Grid from 'material-ui/Grid/Grid';
import {Button, Chip} from 'material-ui';
import UserLinearprogress from '../UserLinearprogress';
//import EnhancedTableHead from "./extComps/tableHead"
import EnhancedTableToolbar from './tableToolbar';
import EnhancedTableHead from './tableHead';
import {getEntityList} from '../../actions/entity';
import {styles} from '../css';

const WAIT_INTERVAL = 1000;

class EnhancedUserTable extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      order: 'asc',
      orderBy: 'city',
      selected: [],
      data: [],
      page: 0,
      searchKey: '',
      rowsPerPage: 5,
      per_page: 20,
      columnData: this.props.columnData,
      loading: true,
    };
    this.timer = null;
  }
  componentWillMount() {
    this.timer = null;
  }
  componentDidMount() {
    this.state.data.length === 0 && this.getList(this.props.entity, {n: sessionStorage.getItem('userNodeId')});
  }
  getList = (entity, data) => {
    this.setState({loading: true});
    return getEntityList(entity, data).then((response) => {
      const {data, total, per_page} = response.data;
      return this.setState({page: 0, data, loading: false, total, per_page});
    });
  };
  handleChange = (event) => {
    const searchVal = event.target.value;
    this.setState({searchKey: searchVal});
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.search(searchVal), WAIT_INTERVAL);
  };
  search = (key) => {
    this.getList(this.props.entity, {s: this.state.searchKey, n: sessionStorage.getItem('userNodeId')});
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';
    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const data =
      order === 'desc'
        ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({data, order, orderBy});
  };

  handleSelectAllClick = (event, checked) => {
    const {data} = this.state;
    if (checked) {
      this.setState({selected: data.length > 0 && data.map((n) => n.user_id)});
      return;
    }
    this.setState({selected: []});
  };

  handleClick = (event, id) => {
    const {selected} = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({selected: newSelected});
  };

  handleChangePage = (event, page) => {
    const next = page * this.state.rowsPerPage + this.state.rowsPerPage;
    if (next > this.state.data.length) {
      this.setState({loading: true});
      getEntityList(this.props.entity, {
        page: Math.floor(next / this.state.per_page) + 1,
        s: this.state.searchKey,
        n: sessionStorage.getItem('userNodeId'),
      }).then((response) => {
        const {data, total, per_page} = response.data;
        return this.setState({
          data: this.state.data.concat(data),
          loading: false,
          total,
          per_page,
        });
      });
    }

    this.setState({page});
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({page: 0, rowsPerPage: event.target.value});
  };

  isSelected = (id) => this.state.selected.indexOf(id) !== -1;

  normaliseStatus = (props, statusfield) => {
    let status = statusfield ? props[statusfield] : props['status'];
    if (status === '1' || status === 1) {
      return 'Active';
    } else if (status === '0' || status === 0) {
      return 'Inactive';
    }
    return status;
  }

  render() {
    const {classes, match, entity} = this.props;
    const {
      data,
      total,
      order,
      orderBy,
      selected,
      rowsPerPage,
      page,
      loading,
    } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    const {columnData, idfield,statusfield} = this.props.componentData;
    return (
      <div>
        <Grid md={12} item>
          <EnhancedTableToolbar
            handleChange={this.handleChange}
            entity={entity}
            {...match}
            numSelected={selected.length}
          />
          <div className={classes.tableWrapper}>
            {loading && <UserLinearprogress />}
            <Table className={classes.table}>
              <EnhancedTableHead
                columnData={columnData}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={data.length}
              />

              <TableBody>
                {data.length > 0 &&
                  data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((n, index) => {
                      const isSelected = this.isSelected(n.Origin);
                      return (
                        <TableRow
                          hover
                          aria-checked={isSelected}
                          tabIndex={-1}
                          key={index}
                          selected={isSelected}
                        >
                          {columnData.map((column, index) => {
                            var h = '';
                            try {
                              column.key2
                                ? (h = n[column.id][column.key][column.key2])
                                : column.key
                                  ? (h = n[column.id][column.key])
                                  : (h = n[column.id]);
                            } catch (e) {}
                            h = (column.type === 'date' && h) ? h = moment(h).format('DD MMM YYYY') : h;
                            return <TableCell key={index}>
                            {
                              column.template ?
                                <column.template data={h} rowData={n} />
                              :
                              <span>{h} { column.suffix || ''}</span>
                            }
                            </TableCell>;
                          })}
                          <TableCell numeric>
                            <Chip
                              label={this.normaliseStatus(n, statusfield)}
                              classes={{root: classes.chips}}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              raised
                              dense="true"
                              color="primary"
                              component={Link}
                              to={`${match.url}/${entity}/edit/${n[idfield]}`}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                {emptyRows > 0 && (
                  <TableRow style={{height: 49 * emptyRows}}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    count={total ? total : data.length}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[5, 10, 20]}
                    page={page}
                    backIconButtonProps={{
                      'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                      'aria-label': 'Next Page',
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </Grid>
      </div>
    );
  }
}

EnhancedUserTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedUserTable);
