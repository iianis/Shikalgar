
import ProfileScreen from '../screens/ProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import MembersScreen from '../screens/MembersScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NoticeScreen from '../screens/NoticeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

//screenOptions={{headerShown: false}}

const BottomTabs = () => {

    const [loggedInUser, setLoggedInUser] = useState();
    useEffect(() => {
        //console.log('Intro 1:');
        getLoggedInUser();
        //console.log('Intro 4:');
    }, []);

    const getLoggedInUser = async () => {
        //console.log('Intro 2:');
        let user = await AsyncStorage.getItem('user');
        await setLoggedInUser(JSON.parse(user));
        console.log('getLoggedInUser: ', JSON.parse(user));
    };

    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} initialParams={{ item: null, user: loggedInUser }}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="home" color={color} size={size} />
                    ),
                }} />
            <Tab.Screen name="Members" component={MembersScreen} initialParams={{ item: null, user: loggedInUser, filter: "Member" }}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Members',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="people-outline" color={color} size={size} />
                    ),
                }} />
            <Tab.Screen name="Notices" component={NoticeScreen} initialParams={{ item: null, user: loggedInUser }}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Notice',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="notifications-none" color={color} size={size} />
                    ),
                }} />
            <Tab.Screen name="Profile" component={ProfileScreen} initialParams={{ item: null, user: loggedInUser }}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="person-outline" color={color} size={size} />
                    ),
                }} />
        </Tab.Navigator>
    );
}

export default BottomTabs;

