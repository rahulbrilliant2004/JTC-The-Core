import React, {Component} from 'react';
import moment from 'moment';
import {Link} from 'react-router-dom';
import {Paper, TextField, MenuItem, Button} from 'material-ui';
import Input, {InputLabel, InputAdornment} from 'material-ui/Input';
import withStyles from 'material-ui/styles/withStyles';
import Typography from 'material-ui/Typography/Typography';
import FormControl from 'material-ui/Form/FormControl';
import Grid from 'material-ui/Grid';
// import TarifTable from './extComps/tarifTable'
// // import ConfirmationDialog from './extComps/confirmationDialog'
// import SearchCustomer from './SearchCustomer';
// import SearchUsers from './SearchUsers';
import IconButton from 'material-ui/IconButton/IconButton';
import {Search} from 'material-ui-icons';
import {styles} from '../../../css';
import ConfirmationDialog from '../../../../components/confirmationDialog';
import ReactMaterialUiNotifications from '../../../../components/ReactMaterialUiNotifications';
import {getEntity, postEntity, putEntity} from '../../../../actions/entity';

class TransportBookingForm extends Component {
  constructor() {
    super();
    this.state = {
      openCustomerSearchDialog: false,
      openUserSearchDialog: false,
      courierFieldvalue: '',
      confirm: false,

      manifest_type_id: '',
      manifest_no: '',
      transport_name: '',
      transport_route: '',
      origin: '',
      destination: '',
      booking_transport_date: '',
      max_weight: 0,
      max_koli: 0,
      vehicle_types: [],
    };
  }
  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };
  componentDidMount() {
    const {id} = this.props.match.params;
    this.props.edit && getEntity(`transport_book/${id}`, null).then((response) => {
      const {data} = response.data;
      this.setState({
        ...data,
      });
    });

    getEntity('vehicletype').then((res) => {
      const {data} = res.data;
      this.setState({
        vehicle_types: data,
      });
    });
  }
  handleAddSubmit = () => {
    return this.setState({confirm: !this.state.confirm});
  };
  handleAction = (action) => {
    this.setState({confirm: false});
    action === 'yes' && !this.props.edit && this.saveEntity();
    action === 'yes' && this.props.edit && this.updateEntity();
  };
  updateEntity = () => {
    const {id} = this.props.match.params;
    putEntity(`transport_book/${id}`, {
      manifest_type_id: this.state.manifest_type_id,
      manifest_no: this.state.manifest_no,
      transport_name: this.state.transport_name,
      transport_route: this.state.transport_route,
      origin: this.state.origin,
      destination: this.state.destination,
      booking_transport_date: this.state.booking_transport_date,
      max_weight: this.state.max_weight,
      max_koli: this.state.max_koli,
    }).then((response) => this.entitySubmitSuccess());
  };
  saveEntity = () => {
    postEntity('transport_book', {
      manifest_type_id: this.state.manifest_type_id,
      manifest_no: this.state.manifest_no,
      transport_name: this.state.transport_name,
      transport_route: this.state.transport_route,
      origin: this.state.origin,
      destination: this.state.destination,
      booking_transport_date: this.state.booking_transport_date,
      max_weight: this.state.max_weight,
      max_koli: this.state.max_koli,
    }).then((response) => this.entitySubmitSuccess());
  };
  entitySubmitSuccess = () => {
    this.showNotification('booking');
    this.props.history.push(`/transport/booking`);
  };
  showNotification = (entity) => {
    ReactMaterialUiNotifications.showNotification({
      text: this.props.edit
        ? `Edit ${entity} success`
        : `Add ${entity} success`,
    });
  };

  render() {
    const {
      handleAddSubmit,
      handleAction,
    } = this;
    const {classes, edit, history, match} = this.props;
    const {
      manifest_type_id,
      manifest_no,
      transport_name,
      transport_route,
      origin,
      destination,
      booking_transport_date,
      max_weight,
      max_koli,
      confirm,
      openCustomerSearchDialog,
      openUserSearchDialog,
      vehicle_types,
    } = this.state;

    return (
      <div>
        <div className={classes.headerWrapper}>
          <div className={classes.pageTitle}>
            <div className={classes.breadCrumbs}>
              Transport /
              <span className={classes.transactionBreadcrumbs}> Booking /</span>
              <span className={classes.transactionBreadcrumbs}>
                {' '}
                {edit ? `Edit Booking` : `New Booking`}
              </span>
            </div>
            <br />
            <p className={classes.titleWrapper}>
              {edit ? `Edit Booking` : `New Booking`}
            </p>
          </div>
        </div>
        <div className={classes.root}>
          <Grid md={12} item>
            <Paper className={classes.formWrapper}>
              <Typography type="headline">
                {' '}
                {edit ? `Edit Booking` : `New Booking`}
              </Typography>
              <Grid container>
                <Grid item xs={6} sm={6}>
                  <div>
                    <TextField
                      id="manifest_type_id"
                      select
                      label="Type"
                      required
                      className={classes.textField}
                      value={manifest_type_id}
                      onChange={(e) => this.setState({
                        manifest_type_id: e.target.value,
                      })}
                      SelectProps={{
                        MenuProps: {
                          className: classes.menu,
                        },
                      }}
                    >
                      {vehicle_types.map((item) => (
                        <MenuItem key={item.vehicle_type_id} value={`${item.vehicle_type_id}`}>
                          {item.type_name}
                        </MenuItem>
                      ))}
                    </TextField>
                    <br />
                    <TextField
                      onChange={this.handleChange('manifest_no')}
                      id="manifest_no"
                      label="SMU#"
                      value={manifest_no}
                      required
                      className={classes.textField}
                    />
                    <br />
                    <TextField
                      onChange={this.handleChange('transport_name')}
                      id="transport_name"
                      value={transport_name}
                      label="Airline"
                      required
                      className={classes.textField}
                    />
                    <br />
                    <TextField
                      onChange={this.handleChange('transport_route')}
                      id="transport_route"
                      value={transport_route}
                      label="Flight Number"
                      required
                      className={classes.textField}
                    />
                    <br />
                    <TextField
                      onChange={this.handleChange('origin')}
                      id="origin"
                      value={origin}
                      label="Origin"
                      required
                      className={classes.textField}
                    />
                    <br />
                    <TextField
                      onChange={this.handleChange('destination')}
                      id="destination"
                      value={destination}
                      label="Destination"
                      required
                      className={classes.textField}
                    />
                    <br />
                  </div>
                </Grid>
                <Grid item xs={6} sm={6}>
                  <div>
                    <TextField
                      id="datetime-local"
                      label="Date and Time"
                      type="datetime-local"
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={booking_transport_date.replace(' ', 'T')}
                      onChange={this.handleChange('booking_transport_date')}
                    />
                    <br />
                    <TextField
                      onChange={this.handleChange('max_weight')}
                      id="max_weight"
                      value={max_weight}
                      label="Max Weight"
                      required
                      className={classes.textField}
                    />
                    <br />
                    <TextField
                      onChange={this.handleChange('max_koli')}
                      id="max_koli"
                      value={max_koli}
                      label="Max Koli"
                      required
                      className={classes.textField}
                    />
                    <br />
                  </div>
                </Grid>
              </Grid>
              <div>
                <div style={{marginLeft: '83%', marginTop: '2%'}}>
                  <Button
                    style={{marginRight: 12}}
                    onClick={() => history.goBack()}
                    component={Link}
                    to={`${match.url}`}
                  >
                    Cancel
                  </Button>
                  <Button raised color="primary" onClick={handleAddSubmit}>
                    {edit ? `Save` : `Add`}
                  </Button>
                </div>
              </div>

              <ConfirmationDialog
                yeslabel={edit ? 'Save' : 'Add'}
                title={edit ? `Edit booking` : `New booking`}
                description={
                  edit
                    ? `Are you sure you want to save this booking?`
                    : `Are you sure you want to add this booking?`
                }
                open={confirm}
                handleAction={handleAction}
              />
            </Paper>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(TransportBookingForm);
