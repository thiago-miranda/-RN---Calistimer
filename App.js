import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import EMOMScreen from './src/screens/EMOMScreen';
import AMRAPScreen from './src/screens/AMRAPScreen';
import IsometriaScreen from './src/screens/IsometriaScreen';
import AboutScreen from './src/screens/AboutScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EMOM"
          component={EMOMScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AMRAP"
          component={AMRAPScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Isometria"
          component={IsometriaScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
