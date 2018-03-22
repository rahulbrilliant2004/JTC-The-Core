import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import {Paper} from 'material-ui';
import SwipeableViews from 'react-swipeable-views';
import Grid from 'material-ui/Grid';
import Tabs, {Tab} from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import entities from './entities';
import {styles} from '../../css';

const config = {
  tabs: [
    {title: 'Base Tariff', label: 'Base Tariff List', name: 'tarif'},
    {
      title: 'Special Tariff',
      label: 'Special Tariff List',
      name: 'special_tariff',
    },
    {title: 'Surcharge', label: 'Surcharge List', name: 'surcharges'},
  ],
};

class TabSelector extends React.Component {
  state = {value: 0};
  handleChange = (event, value) => {
    this.setState({value});
  };
  handleChangeIndex = (index) => {
    this.setState({value: index});
  };

  render() {
    const {classes, theme, location, match, history} = this.props;
    const {value} = this.state;
    const {label} = config.tabs[value];
    const entity = config.tabs[value];
    const componentData = entities[entity.name];
    const Component = componentData.listForm;
    return (
      <div>
        <div className={classes.headerWrapper}>
          <div className={classes.pageTitle}>
            <div className={classes.breadCrumbs}>
              Settings /
              <span className={classes.transactionBreadcrumbs}> Tariff</span>
            </div>
            <br />
            <p className={classes.titleWrapper}>Tariff</p>
          </div>
        </div>
        <div className={classes.root}>
          <Grid md={12} item>
            <Paper className={classes.formWrapper}>
              <Typography type="headline">{label}</Typography>
              <Tabs
                value={value}
                onChange={this.handleChange}
                indicatorColor="primary"
                textColor="primary"
                style={{marginLeft: 15}}
              >
                {config.tabs.map((item) => (
                  <Tab label={item.title} key={item.title} />
                ))}
              </Tabs>
              <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={this.state.value}
                onChangeIndex={this.handleChangeIndex}
              >
                {value === 0 && (
                  <Component
                    entity={entity.name}
                    componentData={componentData}
                    history={history}
                    location={location}
                    match={match}
                  />
                )}
                {value === 1 && (
                  <Component
                    entity={entity.name}
                    componentData={componentData}
                    history={history}
                    location={location}
                    match={match}
                  />
                )}
                {value === 2 && (
                  <Component
                    entity={entity.name}
                    componentData={componentData}
                    history={history}
                    location={location}
                    match={match}
                  />
                )}
              </SwipeableViews>
            </Paper>
          </Grid>
        </div>
      </div>
    );
  }
}

TabSelector.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(TabSelector);
