import React from 'react';
import {Route, Link} from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Toolbar from 'material-ui/Toolbar';
import ToolTip from 'material-ui/Tooltip';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid/Grid';
import {makeBreadcrumbs} from '../../reusableFunc';
import { PieChart, Pie, ResponsiveContainer, Sector, Label, BarChart, Bar, Brush, Cell, CartesianGrid, ReferenceLine, ReferenceDot,
  XAxis, YAxis, Tooltip, Legend, ErrorBar, LabelList } from 'recharts';

import {styles} from '../../css';

const userdata = [
  { name: 'Intracity', OKE: 2000, YES: 2013, REG: 4500, time: 1 },
  { name: 'Domestic', OKE: 3300, YES: 2000, REG: 6500, time: 2 },
];

const outbounddata = [
  { name: 'Intracity', OKE: 2000, YES: 2013, REG: 4500, time: 1 },
  { name: 'Domestic', OKE: 3300, YES: 2000, REG: 6500, time: 2 },
];

const data01 = [
  { name: 'YES', colorf: '#EC5555', value: 1398 },
  { name: 'OKE', colorf: '#499E4C', value: 2400 },
  { name: 'REG', colorf: '#FCD64A', value: 4567 },
];

const data02 = [
  { name: 'Jogja', colorf: '#EC5555', value: 100 },
  { name: 'Medan', colorf: '#FCD64A', value: 200 },
  { name: 'Bandung', colorf: '#499E4C', value: 300 },
  { name: 'Surabaya', colorf: '#2695F3', value: 400 },
  { name: 'Malang', colorf: '#FFB64E', value: 500 },
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

let EnhancedTableToolbar = (props) => {
  const {numSelected, classes} = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        <Typography type="title">Sales</Typography>
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

class SalesOverview extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.mouseOverHandler = this.mouseOverHandler.bind(this);
    this.mouseOutHandler = this.mouseOutHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);

    this.state = {
      showToolTip: false,
      componentWidth: 300,
      selected: [],
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

    this.defaultData = [
      {
        x: '',
        y: ''
      },
      {
        x: 'MES',
        y: 2200,
        color: '#f17676'
      },
      {
        x: 'CGK',
        y: 3500,
        color: '#6cb26f'
      },
      {
        x: 'BDO',
        y: 2900,
        color: '#fddf6d'
      },
      {
        x: 'SBY',
        y: 1800,
        color: '#68b7bf'
      }
    ];

  }

  mouseOverHandler(d, e) {
    this.setState({
      showToolTip: true,
      top: e.y,
      left: e.x,
      value: d.value,
      key: d.data.key});
    {this.createTooltip()}
  }

  mouseMoveHandler(e) {
    if (this.state.showToolTip) {
      this.setState({top: e.y, left: e.x});
    }
  }

  mouseOutHandler() {
    this.setState({showToolTip: false});
  }

  createTooltip() {
    if (this.state.showToolTip) {
      return (
        <ToolTip
          top={this.state.top}
          left={this.state.left}
        >
          The value of {this.state.key} is {this.state.value}
        </ToolTip>
      );
    }
    return false;
  }

  render() {
    const {classes, match, location} = this.props;
    const {selected} = this.state;
    const breadCrumbs = makeBreadcrumbs(location);

    return (
      <div>
        <div className={classes.headerWrapper}>
          <div className={classes.pageTitle}>
            <div className={classes.breadCrumbs}>
              Sales /
              <span className={classes.transactionBreadcrumbs}> Overview</span>
            </div>
            <br />
            <p className={classes.titleWrapper}>Overview</p>
          </div>
        </div>
        
        <div className={classes.root}>

          <Grid container spacing={24}>

            <Grid md={4} item xs={4}>
              <Paper className={classes.formWrapper}>
                <Typography type="title"><strong>Sales</strong></Typography>
                <br/>
                <div style={rpStylewrap}><span>Rp</span><br/><Typography style={rpStyle} variant="headline"><strong>42.000.000</strong></Typography></div>
                <div style={paketStylewrap}><span>Paket</span><br/><Typography style={paketStyle} variant="headline" gutterBottom><strong>380</strong></Typography></div>
              </Paper>
            </Grid>

            <Grid md={4} item xs={4}>
              <Paper className={classes.formWrapper}>
              <Typography type="title"><strong>Sales By Services</strong></Typography>
                  <div style={leftgrahside}>
                    <PieChart width={400} height={220}>
                      <Pie
                        data={data01}
                        dataKey="value"
                        cx={200}
                        cy={120}
                        startAngle={90}
                        endAngle={-270}
                        innerRadius={50}
                        outerRadius={90}
                        label={renderLabelContent}
                        paddingAngle={0}
                        isAnimationActive={this.state.animation}
                      >
                        {
                          data01.map((entry, index) => (
                            <Cell key={`slice-${index}`} fill={entry.colorf}/>
                          ))
                        }
                        <Label width={50} position="center">
                          477/
                          28620
                        </Label>
                      </Pie>
                    </PieChart>
                  </div>
              </Paper>
            </Grid>

            <Grid md={4} item xs={4}>
              <Paper className={classes.formWrapper}>
              <Typography type="title"><strong>Sales By User</strong></Typography>
                  <div style={leftgrahside}>
                    <BarChart width={400} height={225} data={userdata} margin={{ top: 50, right: 20, bottom: 0, left: 20 }}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend layout="horizontal" />
                      <CartesianGrid horizontal={true}/>
                      <CartesianGrid vertical={true}/>
                      <Bar dataKey="OKE" fill="#499E4C" />
                      <Bar dataKey="YES" fill="#EC5555" />
                      <Bar dataKey="REG" fill="#FCD64A" />
                    </BarChart>
                  </div>
              </Paper>
            </Grid>

          </Grid>

        </div>

        <div className={classes.root}>

          <Grid container spacing={24}>

            <Grid md={6} item xs={6}>
              <Paper className={classes.formWrapper}>
                <Typography type="title"><strong>Outbound By Services</strong></Typography>
                  <div style={leftgrahside}>                    
                    <BarChart width={600} height={280} data={outbounddata} margin={{ top: 50, right: 20, bottom: 0, left: 20 }}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend margin={15, 0, 0, 0} layout="horizontal" />
                      <CartesianGrid horizontal={true}/>
                      <CartesianGrid vertical={true}/>
                      <Bar dataKey="OKE" fill="#499E4C" />
                      <Bar dataKey="YES" fill="#EC5555" />
                      <Bar dataKey="REG" fill="#FCD64A" />
                    </BarChart>
                  </div>
              </Paper>
            </Grid>

            <Grid md={6} item xs={6}>
              <Paper className={classes.formWrapper}>
                <Typography type="title"><strong>Domestic</strong></Typography>
                <br/>
                <div style={leftgrahside}>
                  <PieChart width={600} height={260}>
                    <Pie
                      data={data02}
                      dataKey="value"
                      cx={300}
                      cy={130}
                      startAngle={90}
                      endAngle={-270}
                      innerRadius={50}
                      outerRadius={90}
                      label={renderLabelContent}
                      paddingAngle={0}
                      isAnimationActive={this.state.animation}
                    >
                      {
                        data02.map((entry, index) => (
                          <Cell key={`slice-${index}`} fill={entry.colorf}/>
                        ))
                      }
                      <Label width={50} position="center">
                        1398/
                        22098
                      </Label>
                    </Pie>
                  </PieChart>
                </div>
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

const rpStylewrap = {
  display: 'block',
  'margin-bottom': 40,
  textAlign: 'right'
};

const rpStyle = {
  fontSize: 40,
  color: '#323990',
  display: 'inline-block'
};

const paketStylewrap = {
  display: 'block',
  textAlign: 'right'
};

const paketStyle = {
  fontSize: 40,
  color: '#323990',
  display: 'inline-block'
};

const leftgrahside = {
  textAlign: 'center'
};

const listcss = {
  listStyleType: 'none'
};

const firstbox = {
  width: 15,
  height: 15,
  backgroundColor: '#ed5454',
  display: 'inline-block'
};

const secbox = {
  width: 15,
  height: 15,
  backgroundColor: '#479f4b',
  display: 'inline-block'
};

const thirdbox = {
  width: 15,
  height: 15,
  backgroundColor: '#fcd748',
  display: 'inline-block'
};

const firstboxc = {
  width: 60,
  display: 'inline-block',
  'margin-left': 42
};

const secboxc = {
  width: 60,
  display: 'inline-block',
  'margin-left': 65
};

const thirdboxc = {
  width: 60,
  display: 'inline-block',
  'margin-left': 15
};

const listone = {
  'margin-bottom': 15
};

const listtwo = {
  'margin-bottom': 15
};

const listthree = {
  'margin-bottom': 15
};

const legnednewstyle = {
  position: 'relative',
  'margin-top': 20
};

SalesOverview.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SalesOverview);
