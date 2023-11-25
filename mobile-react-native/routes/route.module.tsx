import {createStackNavigator} from '@react-navigation/stack';
import LoginComponent from '../components/user/LoginComponent'; // Adjust the path as needed
import OverviewComponent from '../components/overview/OverviewComponent';
import TestComponent from '../components/test/TestComponent';
import TestDetailComponent from '../components/test/TestDetailComponent';
import ResultComponent from '../components/result/ResultComponent';
import ResultDetailComponent from '../components/result/ResultDetailComponent';
import BottomNavigationComponent from '../components/overview/BottomNavigation';
import MainNavigation from '../components/overview/MainNavigation';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="Home"
        component={MainNavigation}
        options={{headerLeft: undefined}}
      />
      <Stack.Screen name="Login" component={LoginComponent} />
    </Stack.Navigator>
  );
};
