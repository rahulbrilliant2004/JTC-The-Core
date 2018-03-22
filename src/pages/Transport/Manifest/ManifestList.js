// @flow

import React from 'react';
import {View} from 'react-native';
import {Typography, Tabs, Tab, Grid, Paper, Button} from 'material-ui';
import AddIcon from 'material-ui-icons/Add';

import ManifestList from './ManifestTable/ManifestList';

export default class TransportManifestList extends React.Component<Props, State> {
  state = {};

  render() {
    return (
      <View style={{flex: 1, paddingHorizontal: 60}}>
        <View style={{marginVertical: 40}}>
          <Grid container spacing={24} justify={'space-between'}>
            <Grid item sm={3}>
              <Typography variant="title">Manifest List</Typography>
            </Grid>
            <Grid item sm={3} style={{textAlign: 'right'}}>
              <Button variant="raised" color="primary" style={{color: 'white'}} onClick={() => {}}><AddIcon />NEW</Button>
            </Grid>
          </Grid>
        </View>
        <Paper>
          <View style={{paddingHorizontal: 20, paddingTop: 30}}>
            <ManifestList />
          </View>
        </Paper>
      </View>
    );
  }
}
