/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import React from 'react';

import {AppNavigator} from './routes/route.module';
import {Text} from 'react-native';
import {UserProvider} from './utils/user.context';
import Sidebar from './components/common/sidebar';
import Toast from 'react-native-toast-message';
import {PaperProvider} from 'react-native-paper';
import BottomNavigationComponent from './components/overview/BottomNavigation';

function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <PaperProvider>
          <AppNavigator></AppNavigator>
        </PaperProvider>
        <Toast />
      </NavigationContainer>
    </UserProvider>
  );
}

export default App;
