import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MemberNewScreen from './MemberNewScreen';
import IntroScreen from './IntroScreen';
import Requests from './RequestScreen';
import RequestsNew from './RequestNewScreen';
import RequestScreen from './RequestScreen';
import RequestNewScreen from './RequestNewScreen';
import MembersScreen from './MembersScreen';
import NoticeScreen from './NoticeScreen';
import NoticeNewScreen from './NoticeNewScreen';
import EducationScreen from './EducationScreen';
import EducationNewScreen from './EducationNewScreen';
import DonationScreen from './DonationScreen';
import DonationNewScreen from './DonationNewScreen';
import JobScreen from './JobScreen';
import MatrimonialScreen from './MatrimonialScreen';
import WorkInprogressScreen from './WorkInprogressScreen';

const HomeScreen = ({ navigation, route }: { navigation: any }) => {

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Intro"
                component={IntroScreen}
                options={{
                    headerShown: false,
                    headerBackTitleVisible: true,
                    headerBackTitle: '',
                }}
            />
            <Stack.Screen
                name="MembersScreen"
                component={MembersScreen}
                options={{
                    headerShown: false,
                    headerBackTitleVisible: true,
                    title: 'Members',
                    headerBackTitle: '',
                }}
            />
            <Stack.Screen
                name="MemberNewScreen"
                component={MemberNewScreen}
                options={{
                    headerShown: false,
                    headerBackTitleVisible: true,
                    title: 'Member New',
                    headerBackTitle: '',
                }}
            />
            <Stack.Screen
                name="NoticeScreen"
                component={NoticeScreen}
                options={{
                    headerShown: true,
                    headerBackTitleVisible: true,
                    title: 'Notice Board',
                    headerBackTitle: '',
                }}
            />
            <Stack.Screen
                name="NoticeNewScreen"
                component={NoticeNewScreen}
                options={{
                    headerShown: true,
                    headerBackTitleVisible: true,
                    title: 'New Notice',
                    headerBackTitle: '',
                }}
            />
            <Stack.Screen
                name="RequestScreen"
                component={RequestScreen}
                options={{
                    headerShown: true,
                    title: 'Requests',
                    headerBackTitleVisible: true,
                }}
            />
            <Stack.Screen
                name="RequestNewScreen"
                component={RequestNewScreen}
                options={{
                    headerShown: false,
                    title: 'Add Requests',
                    headerBackTitleVisible: true,
                }}
            />

            <Stack.Screen
                name="DonationScreen"
                component={DonationScreen}
                options={{
                    headerShown: true,
                    title: 'Donations',
                    headerBackTitleVisible: true,
                }}
            />
            <Stack.Screen
                name="DonationNewScreen"
                component={DonationNewScreen}
                options={{
                    headerShown: false,
                    title: 'Add Donation',
                    headerBackTitleVisible: true,
                }}
            />

            <Stack.Screen
                name="EducationScreen"
                component={EducationScreen}
                options={{
                    headerShown: true,
                    title: 'Scholarships & More',
                    headerBackTitleVisible: true,
                }}
            />
            <Stack.Screen
                name="EducationNewScreen"
                component={EducationNewScreen}
                options={{
                    headerShown: false,
                    title: 'Add Scholarship',
                    headerBackTitleVisible: true,
                }}
            />
            <Stack.Screen
                name="JobScreen"
                component={JobScreen}
                options={{
                    headerShown: false,
                    title: 'Jobs',
                    headerBackTitleVisible: true,
                }}
            />
            <Stack.Screen
                name="WorkInprogressScreen"
                component={WorkInprogressScreen}
                options={{
                    headerShown: false,
                    title: 'Matrimonial',
                    headerBackTitleVisible: true,
                }}
            />
        </Stack.Navigator>
    )
};

export default HomeScreen;

