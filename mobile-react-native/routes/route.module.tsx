import {createStackNavigator} from '@react-navigation/stack';
import LoginComponent from '../components/user/LoginComponent'; // Adjust the path as needed
import OverviewComponent from '../components/overview/OverviewComponent';
import TestComponent from '../components/test/TestComponent';
import TestDetailComponent from '../components/test/TestDetailComponent';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Home"
        component={OverviewComponent}
        options={{headerLeft: undefined}}
      />
      <Stack.Screen name="Login" component={LoginComponent} />
      <Stack.Screen name="Test" component={TestComponent} />
      <Stack.Screen name="TestDetail" component={TestDetailComponent} />
      {/* Add more screens as needed */}
    </Stack.Navigator>
  );
};
