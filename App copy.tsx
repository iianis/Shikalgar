import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import ApplicationTabs from "./components/BottomTabs";

import SplashScreen from 'react-native-splash-screen';
import firestore from '@react-native-firebase/firestore';

const App2 = () => {

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

export default App2;