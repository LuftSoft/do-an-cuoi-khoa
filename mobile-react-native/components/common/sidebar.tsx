import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import OverviewComponent from '../overview/OverviewComponent';
import LoginComponent from '../user/LoginComponent';

const Drawer = createDrawerNavigator();

const Sidebar = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={OverviewComponent} />
      <Drawer.Screen name="Login" component={LoginComponent} />
    </Drawer.Navigator>
  );
};

export default Sidebar;
