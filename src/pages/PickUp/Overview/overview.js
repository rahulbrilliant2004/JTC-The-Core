import React from 'react';
import {Route, Link} from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Toolbar from 'material-ui/Toolbar';
import ToolTip from 'material-ui/Tooltip';
import Typography from 'material-ui/Typography';
import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid/Grid';
import IconButton from 'material-ui/IconButton';
import EnhancedInboundTableHead from './extComps/tableHead';
import {Button, Chip} from 'material-ui';
import {makeBreadcrumbs} from '../../reusableFunc';
import {Train,Traffic,FlightTakeoff,Toys} from 'material-ui-icons';
import UserLinearProgress from '../../UserLinearprogress';
import { PieChart, Pie, ResponsiveContainer, Sector, Label, BarChart, Bar, Brush, Cell, CartesianGrid, ReferenceLine, ReferenceDot,
  XAxis, YAxis, Tooltip, Legend, ErrorBar, LabelList } from 'recharts';
import GoogleMapReact from 'google-map-react';

import {styles} from '../../css';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const pickupdata = [
  { name: 'YES', colorf: '#F17676', value: 20 },
  { name: 'OKE', colorf: '#6cb26f', value: 30 },
  { name: 'REG', colorf: '#fddf6d', value: 50 },
];

const renderLabelContent = (props) => {
  const { value, percent, x, y, midAngle, name } = props;

  return (
    <g transform={`translate(${x}, ${y})`} textAnchor={ (midAngle < -90 || midAngle >= 90) ? 'end' : 'start'}>
      <text x={0} y={0}>{`${name}`}</text>
      {/*<text x={0} y={20}>{`(Percent: ${(percent * 100).toFixed(2)}%)`}</text>*/}
    </g>
  );
};

const toolbarStyles = (theme) => ({
  root: {
    paddingRight: 2,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.dark,
          //   backgroundColor: lighten(theme.palette.secondary.light, 0.4),
        }
      : {
          //   color: lighten(theme.palette.secondary.light, 0.4),
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
  table: {
    maxWidth: 200,
  },
});

class PickUpOverview extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showToolTip: false,
      componentWidth: 300,
      order: 'asc',
      orderBy: 'PickUpTime',
      selected: [],
      page: 0,
      rowsPerPage: 5,
      "data":[
        {
           "pickup_id": 12,
           "agent_name":"Agent A",
           "address":"Jalan Meruya llir No. 88",
           "connote":"108",
           "bag":"7",
           "weight_kg":"80"
        },
        {
           "pickup_id": 13,
           "agent_name":"Agent B",
           "address":"Jalan Lapangan Bola Kebon Jeruk No. 12",
           "connote":"294",
           "bag":"24",
           "weight_kg":"150"
        },
        {
           "pickup_id": 14,
           "agent_name":"Agent C",
           "address":"Jalan Cipete Raya No. 10",
           "connote":"307",
           "bag":"22",
           "weight_kg":"147"
        },
        {
           "pickup_id": 15,
           "agent_name":"Agent D",
           "address":"Jalan Setia Budi No. 99",
           "connote":"102",
           "bag":"9",
           "weight_kg":"88"
        },
        {
           "pickup_id": 16,
           "agent_name":"Agent E",
           "address":"Jalan Rawamangun No. 1",
           "connote":"244",
           "bag":"18",
           "weight_kg":"122"
        },
        {
           "pickup_id": 17,
           "agent_name":"Agent B",
           "address":"Jalan Lapangan Bola Kebon Jeruk No. 12",
           "connote":"294",
           "bag":"24",
           "weight_kg":"150"
        },
        {
           "pickup_id": 18,
           "agent_name":"Agent E",
           "address":"Jalan Rawamangun No. 1",
           "connote":"244",
           "bag":"18",
           "weight_kg":"122"
        },
        {
           "pickup_id": 19,
           "agent_name":"Agent C",
           "address":"Jalan Cipete Raya No. 10",
           "connote":"307",
           "bag":"22",
           "weight_kg":"147"
        },
        {
           "pickup_id": 20,
           "agent_name":"Agent D",
           "address":"Jalan Setia Budi No. 99",
           "connote":"102",
           "bag":"9",
           "weight_kg":"88"
        },
        {
           "pickup_id": 21,
           "agent_name":"Agent A",
           "address":"Jalan Meruya llir No. 88",
           "connote":"108",
           "bag":"7",
           "weight_kg":"80"
        },
        {
           "pickup_id": 22,
           "agent_name":"Agent C",
           "address":"Jalan Cipete Raya No. 10",
           "connote":"307",
           "bag":"22",
           "weight_kg":"147"
        }
      ]

    };
    this.styles = {
      '.pie-chart-lines': {
        stroke: 'rgba(0, 0, 0, 1)',
        strokeWidth: 1
      },
      '.pie-chart-text': {
        fontSize: '10px',
        fill: 'white'
      }
    };

  }

  handleChangePage = (event, page) => {
    this.setState({page});
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({rowsPerPage: event.target.value});
  };

  render() {

    const {classes, match, location} = this.props;
    const {data, irregularitydata, order, orderBy, selected, rowsPerPage, page} = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    const breadCrumbs = makeBreadcrumbs(location);

    var connoteSum = 0;
    var bagSum = 0;
    var weight_kgSum = 0;
    
    if(data.length >0) {
        for (let i = 0; i < data.length; i++) {
          connoteSum += parseInt(data[i].connote);
          bagSum += parseInt(data[i].bag);
          weight_kgSum += parseInt(data[i].weight_kg);
        }
    }

    return (
      <div>

        <div className={classes.headerWrapper}>
          <div className={classes.pageTitle}>
            <div className={classes.breadCrumbs}>
              Pick Up /
              <span className={classes.transactionBreadcrumbs}> Overview</span>
            </div>
            <br />
            <p className={classes.titleWrapper}>Overview</p>
          </div>
        </div>
        
        <div className={classes.root}>
          <Grid container>
            <Grid md={9} item xs={9}>
              <Paper className={classes.formWrapper}>
                <Typography type="headline"><strong>Pick Up Overview</strong></Typography>
                <br/>
                <div className={classes.tableWrapper}>
                  {data.length === 0 && <UserLinearProgress />}
                  <Table className={classes.table}>
                    <EnhancedInboundTableHead
                      numSelected={selected.length}
                      order={order}
                      orderBy={orderBy}
                      onSelectAllClick={this.handleSelectAllClick}
                      onSort={this.handleSort}
                      rowCount={data.length}
                    />
                    <TableBody>
                      {data
                        .sort(
                          (a, b) =>
                            a.pickup_id < b.pickup_id ? -1 : 1,
                        )
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage,
                        )
                        .map((n) => {
                          return (
                            <TableRow
                              hover
                              tabIndex={-1}
                              key={n.pickup_id}
                            >
                              <TableCell>{n.agent_name}</TableCell>
                              <TableCell>{n.address}</TableCell>
                              <TableCell>{n.connote}</TableCell>
                              <TableCell>{n.bag}</TableCell>
                              <TableCell>{n.weight_kg}</TableCell>
                            </TableRow>
                          );
                        })}
                      {emptyRows > 0 && (
                        <TableRow>
                          <TableCell><strong>SUM</strong></TableCell>
                          <TableCell></TableCell>
                          <TableCell><strong>{connoteSum}</strong></TableCell>
                          <TableCell><strong>{bagSum}</strong></TableCell>
                          <TableCell><strong>{weight_kgSum}</strong></TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          count={data.length}
                          rowsPerPage={rowsPerPage}
                          rowsPerPageOptions={
                            data.length < 25 ? [5, 10] : [5, 10, 25]
                          }
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
              </Paper>
            </Grid>                
            <Grid md={3} item xs={3}>
              <Paper className={classes.formWrapper}>
                <Typography type="title"><strong>Services</strong></Typography>
                <br/>
                <div style={leftgrahside}>
                  <PieChart width={250} height={260}>
                      <Pie
                        data={pickupdata}
                        dataKey="value"
                        cx={140}
                        cy={120}
                        startAngle={90}
                        endAngle={-270}
                        innerRadius={40}
                        outerRadius={70}
                        label={renderLabelContent}
                        paddingAngle={0}
                        isAnimationActive={this.state.animation}
                      >
                        {
                          pickupdata.map((entry, index) => (
                            <Cell key={`slice-${index}`} fill={entry.colorf}/>
                          ))
                        }
                      </Pie>
                    </PieChart>
                </div>
                <div style={leftserviceside}>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography type="subheading">Connotes</Typography>
                      <Typography style={servicesparam} type="title"><strong>1055</strong></Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography type="subheading">Bags</Typography>
                      <Typography style={servicesparam} type="title"><strong>80</strong></Typography>
                    </Grid>
                  </Grid>
                </div>
              </Paper>
            </Grid>
          </Grid>
        </div>

        <div className={classes.root}>
          <Grid container>
            <Grid md={12} item xs={12}>
              <Paper className={classes.formWrapper}>
                <Typography type="headline"><strong>Nearest Agent</strong></Typography>
                <br/>
                <GoogleMapReact
                  bootstrapURLKeys={{ key: 'AIzaSyAShxWSRr-uFk2t10MoXbZLqry8Lb_8Qek' }}
                  heatmapLibrary={true}
                  heatmap={{
                    positions: [
                      {
                        lat: 60.714305,
                        lng: 47.051773,
                      },
                      {
                        lat: 60.734305,
                        lng: 47.061773,
                      },
                      {
                        lat: 60.754305,
                        lng: 47.081773,
                      },
                    ],
                    options: {
                      radius: 20,
                      opacity: 0.7,
                      gradient: [
                        'rgba(0, 255, 255, 0)',
                        'rgba(0, 255, 255, 1)',
                        'rgba(0, 191, 255, 1)',
                        'rgba(0, 127, 255, 1)',
                        'rgba(0, 63, 255, 1)',
                        'rgba(0, 0, 255, 1)',
                        'rgba(0, 0, 223, 1)',
                        'rgba(0, 0, 191, 1)',
                        'rgba(0, 0, 159, 1)',
                        'rgba(0, 0, 127, 1)',
                        'rgba(63, 0, 91, 1)',
                        'rgba(127, 0, 63, 1)',
                        'rgba(191, 0, 31, 1)',
                        'rgba(255, 0, 0, 1)'
                      ]
                    },
                  }}
                >
                </GoogleMapReact>
              </Paper>
            </Grid>
          </Grid>
        </div>

      </div>
    );
  }
}

const divStyle = {
  textAlign: 'right',
  fontSize: 30,
  color: '#323990'
};

const bagStylewrap = {
  display: 'block',
  'margin-bottom': 40
};

const bagStyle = {
  fontSize: 40,
  color: '#323990',
  display: 'inline-block',
  'margin-right': 15
};

const connoteStylewrap = {
  display: 'block'
};

const connoteStyle = {
  fontSize: 40,
  color: '#323990',
  display: 'inline-block',
  'margin-right': 15
};

const leftgrahside = {
  textAlign: 'center'
};
const leftserviceside = {
  textAlign: 'center',
  'margin-top': 30
};

const laggicon = {
  display: 'inline-block',
  backgroundColor: '#d8d8d8',
  width: 20,
  height: 20,
  textAlign: 'center',
  'border-radius': '100%',
  'vertical-align': 'middle'
};

const laggiconsize = {
  fontSize: 15,
  'vertical-align': 'middle'
};

const servicesparam = {
  fontSize: 30,
};

PickUpOverview.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PickUpOverview);
