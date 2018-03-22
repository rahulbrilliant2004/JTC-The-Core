import React, {Component} from 'react';
import {connect} from 'react-redux';
import {ScrollView, TouchableOpacity} from 'react-native';
import {NavLink, withRouter} from 'react-router-dom';
import {
  AppBar,
  Drawer,
  Toolbar,
  IconButton,
  List,
  Select,
  MenuItem,
  Badge,
  Avatar,
  FormControl,
  ListItem,
  ListItemText,
  Icon,
} from 'material-ui';
import {Collapse} from 'material-ui/transitions';
import {withStyles} from 'material-ui/styles';
import {grey} from 'material-ui/colors';
import {
  Dehaze,
  Search,
  NotificationsNone,
  ExpandLess,
  ExpandMore,
} from 'material-ui-icons';
import Tools from './components/Tools';
import NotificationButton from '../../components/NotificationButton';
import {jneLogo} from '../../CusIcons/CustomIcons';
import {drawerMenuList} from './DrawerList';
import axios from 'axios';
import {BASE_API} from '../../api';

import {headerConnector} from '../../store/redux-connect';
import ReactMaterialUiNotifications from '../../components/ReactMaterialUiNotifications';
import fetchJSON from '../../helpers/fetchJSON';
import getDrawerMenu from '../../helpers/getDrawerMenu';

const Styles = (theme) => ({
  spaceLogo: {
    flex: 1,
  },
  MenuIcon: {
    color: theme.palette.primary[900],
    marginLeft: -12,
    marginRight: 20,
  },
  icon: {
    color: theme.palette.primary[900],
    marginRight: 20,
  },
  appBar: {
    backgroundColor: '#ffffff',
  },
  list: {
    width: 270,
    color: '#fafafa',
  },
  listColor: {
    color: '#fafafa',
  },
  name: {
    color: '#fafafa',
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
    color: '#fafafa',
  },
  badge: {
    color: theme.palette.primary[900],
    marginRight: 20,
  },
  avatar: {
    backgroundColor: grey[300],
    margin: 10,
    width: 27,
    height: 27,
  },
  formControl: {
    marginRight: 20,
    minWidth: 120,
    color: theme.palette.primary[900],
  },
  linkMatched: {
    backgroundColor: '#ac2d17',
  },
});
class Header extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      locationValue: 0,
      packageValue: 1,
      openNestedList: '',
      searchBarCout: false,
      matched: false,
      nodeArr: [],
      initNode: true,
    };
    this.drawerHandler = this.drawerHandler.bind(this);
    // this.DDpkgitem = this.DDpkgitem.bind(this)
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.handleSearchBar = this.handleSearchBar.bind(this);
    this.handleMatched = this.handleMatched.bind(this);
  }
  drawerHandler = () => this.setState({open: !this.state.open});
  handlelLocationChange = (e) => {
//<<<<<<< HEAD
    let id = e.target.value;
//=======
    ReactMaterialUiNotifications.showNotification({text: `All form data will reset now`});
//>>>>>>> origin/sameer_dev
    this.setState({
      locationValue: id,
    });
    this.props.onActiveNodeChanged(id);
    const idx = this.state.nodeArr.findIndex((item) => {
      // eslint-disable-next-line eqeqeq
      return item.node_id == e.target.value;
    });
    sessionStorage.setItem('originCode', this.state.nodeArr[idx].tariff_code);
    sessionStorage.setItem('userNodeId', this.state.nodeArr[idx].node_id);
    const {locationChange} = this.props;
    return new Promise((resolve, reject) => {
        resolve(locationChange());
    });
  };
  toggleDrawer = () => {
    this.setState({
      open: !this.state.open,
    });
  };
  handleExpandList = (item) => {
    const {openNestedList} = this.state;
    this.setState({
      openNestedList:
        openNestedList.moduleName === item.moduleName ? false : item,
    });
  };
  handleSearchBar = () =>
    this.setState({searchBarCout: !this.state.searchBarCout});
  handleMatched = () => {
    const {match, location} = this.props.children.props;
    return match.path === location.pathName
      ? this.setState({matched: true})
      : this.setState({matched: false});
  };
  // componentWillReceiveProps(np){
  //     const self = this;
  //     const node = JSON.parse(sessionStorage.getItem('userNode'))
  //     console.log('NODEEEE', node)
  //     if (node !== null) {
  //        if (this.state.initNode) {
  //             console.log('NODE', node)
  //             node.node.map((item) => {
  //                 self.handleCallNode(item.node.node_id)
  //             })
  //             this.setState({initNode:false})
  //         }
  //     }
  // }
  componentDidMount() {
    const self = this;
    if (sessionStorage.getItem('userData') !== null) {
      const session = JSON.parse(sessionStorage.getItem('userData'));
      const userId = session.data.user_id;
      fetchJSON
        .get(`/users/${userId}`)
        .then((response) => {
          console.log('user', response);
          const node = response.data.data;
          sessionStorage.setItem(
            'userNode',
            JSON.stringify(response.data.data),
          );
          sessionStorage.setItem(
            'userNodeId',
            response.data.data.node[0].node.node_id,
          );
          node.node.map((item, index) => {
            self.handleCallNode(item.node.node_id, index);
          });
          //self.handleCallNode(response.data.data.node[0].node.node_id)
        })
        .catch((error) => {
          console.log('>>>', error);
        });
    }
  }
  handleCallNode = (id, index) => {
    const self = this;
    const arr = this.state.nodeArr;
    axios
      .get(`${BASE_API}nodes/${id}`)
      .then((response) => {
        arr.push(response.data.data);
        self.setState({
          nodeArr: arr,
        });
        if (index === 0) {
          sessionStorage.setItem('originCode', response.data.data.tariff_code);
          self.setState({
            locationValue: id,
          });
          this.props.onActiveNodeChanged(id);
        }
        //sessionStorage.setItem('originCode', response.data.data.tariff_code);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  render() {
    const {classes, user, permissionList} = this.props;
    console.log(permissionList, user)
    const {
      open,
      searchBarCout,
      locationValue,
      openNestedList,
      matched,
    } = this.state;
    const dropdownItems = [
      'JNE Jakarta',
      'JNE Depok',
      'JNE Bogor',
      'JNE Bandung',
    ];

    if (!user) {
      return null;
    }
    let {permission} = user;
    let orderedMenus = getDrawerMenu(
      drawerMenuList,
      permission.map((menu) => {
        return permissionList.get(menu);
      }),
    );

    const sideList = orderedMenus.map((item, index) => (
      <List key={index}>
        {!item.nested && (
          <ListItem
            className={classes.list}
            component={NavLink}
            to={item.route || ''}
            button
          >
            <ListItemText
              primary={item.moduleName}
              classes={{primary: classes.listColor}}
            />
          </ListItem>
        )}
        {item.nested && (
          <ListItem
            className={classes.list}
            onClick={() => this.handleExpandList(item)}
            button
          >
            <ListItemText
              primary={item.moduleName}
              classes={{
                textDense: classes.listColor,
                primary: classes.listColor,
              }}
            />

            {openNestedList.moduleName === item.moduleName ? (
              <ExpandLess />
            ) : (
              <ExpandMore />
            )}
          </ListItem>
        )}

        <Collapse
          component="li"
          in={openNestedList.moduleName === item.moduleName ? true : false}
          timeout="auto"
          unmountOnExit
        >
          {item.nested &&
            item.nested.map((item, index) => (
              <List disablePadding key={index}>
                <ListItem
                  className={classes.nested}
                  component={NavLink}
                  to={item.route}
                  button
                >
                  <ListItemText
                    inset
                    primary={item.moduleName}
                    classes={{
                      textDense: classes.listColor,
                      primary: classes.listColor,
                    }}
                  />
                </ListItem>
              </List>
            ))}
        </Collapse>
      </List>
    ));
    return (
      <div>
        {
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <IconButton
                onClick={this.drawerHandler}
                className={classes.MenuIcon}
              >
                <Dehaze />
              </IconButton>
              <div className={classes.spaceLogo}>
                <NavLink to="/">
                  <img src={jneLogo} alt="Logo" />
                </NavLink>
              </div>
              <FormControl
                className={classes.formControl}
                // color={Styles.icon.color}
              >
                <Select
                  value={locationValue}
                  onChange={this.handlelLocationChange}
                >
                  {this.state.nodeArr.map((location, index) => (
                    <MenuItem key={index} value={location.node_id}>
                      {location.node_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Tools user={user} />
            </Toolbar>
            <Drawer open={open} onClose={this.drawerHandler}>
              <div tabIndex={0} role="button">
                {sideList}
              </div>
            </Drawer>
          </AppBar>
        }
        <div
          style={{
            width: '100%',
            height: '100%',
            marginTop: 75,
          }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}


// function mapStateToProps(state) {
//   return {
//     user: state.user,
//     permissionList: state.permission.list,
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     onActiveNodeChanged: (nodeID) => {
//       dispatch({
//         type: 'ACTIVE_NODE_CHANGED',
//         nodeID,
//       });
//     },
//   };
// }

// export default withRouter(
//   connect(mapStateToProps, mapDispatchToProps)(withStyles(Styles)(Header)),
// );

export default withRouter(headerConnector(withStyles(Styles)(Header)));

