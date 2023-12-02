import React, { useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { AuthContext } from './AuthContext';
import Loader from '../components/Loader';

const AppNav = () => {

    const { isLoading, userToken } = useContext(AuthContext);

    if (isLoading) {
        return (
            <Loader visible={isLoading} />

        );
    }

    return (
        <NavigationContainer>
            {userToken == null ? <AuthStack /> : <AppStack />}
        </NavigationContainer>
    )
}

export default AppNav