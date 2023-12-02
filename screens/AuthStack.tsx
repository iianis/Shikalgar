import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
//import { Text, View } from 'react-native';

const Stack = createNativeStackNavigator();
const AuthStack = () => {


    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Login"
                component={LoginScreen}
            />
        </Stack.Navigator>
    )
}

export default AuthStack