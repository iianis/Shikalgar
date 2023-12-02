
/*import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import ApplicationTabs from "./components/tabs";

import SplashScreen from 'react-native-splash-screen';
import firestore from '@react-native-firebase/firestore';

const App = () => {

  useEffect(() => {
    SplashScreen.hide();
    getMember();
  }, []);

  const getMember = async () => {
    const member = await firestore().collection("dev-members").doc("2k2FMGWQM3RBXVg25T1O").get();
    console.log("member: ", member);
  }

  return (
    <NavigationContainer>
      <ApplicationTabs />
    </NavigationContainer>
  )
}

export default App;*/

import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './screens/AuthContext';
import AppNav from './screens/AppNav';
import SplashScreen from 'react-native-splash-screen';

const App = () => {

  const Stack = createNativeStackNavigator();

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <AuthProvider>
      <AppNav />
    </AuthProvider>
  );
};

export default App;
