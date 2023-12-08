import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ModalScreen from './screens/ModalScreen';
import ChatScreen from './screens/ChatScreen';
import MatchedScreen from './screens/MatchedScreen';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown : false,
      }}
    >
      <Stack.Group>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Group>
      <Stack.Group screenOptions={{presentation: "modal"}}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
      <Stack.Group screenOptions={{presentation: "TransparentModal"}}>
        <Stack.Screen name="Match" component={MatchedScreen} />
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default StackNavigator