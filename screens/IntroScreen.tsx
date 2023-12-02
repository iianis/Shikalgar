import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import InternetConnectivityCheck from '../components/InternetConnectivityCheck';
import { AuthContext } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { dBTable } from '../utility/MasterTypes';

const IntroScreen = ({ navigation, route }: { navigation: any }) => {
    const user = route.params?.item;
    const [isLoading, setIsLoading] = useState(false);
    const [memberCount, setMemberCount] = useState(0);
    const [beneficiaryCount, setBeneficiaryCount] = useState(0);
    const [donationAmount, setDonationAmount] = useState(0);
    const { logout } = useContext(AuthContext);
    const [phone, setPhone] = useState('');
    const [loggedInUser, setLoggedInUser] = useState();

    useEffect(() => {
        //console.log('Intro 1:');
        getLoggedInUser();
        //console.log('Intro 4:');
        navigation.addListener('focus', async () => {
            getSummary();
        });
    }, []);

    const getLoggedInUser = async () => {
        //console.log('Intro 2:');
        let user = await AsyncStorage.getItem('user');
        await setLoggedInUser(JSON.parse(user));
        //console.log('Intro 3:');
    };

    const getSummary = async () => {
        //console.log("get summary in progress");
        setIsLoading(true);

        try {
            await firestore()
                .collection(dBTable("members"))
                .get()
                .then(querySnapshot => {
                    //setIsLoading(false);
                    if (querySnapshot.size > 0) {
                        //console.log("members", querySnapshot.size);
                        setMemberCount(querySnapshot.size);
                    }

                });
            await firestore()
                .collection(dBTable("requests"))
                .get()
                .then(querySnapshot => {
                    //setIsLoading(false);
                    if (querySnapshot.size > 0) {
                        //console.log("requests", querySnapshot.size);
                        setBeneficiaryCount(querySnapshot.size);
                    }
                });
            await firestore()
                .collection(dBTable("donations"))
                .get()
                .then(querySnapshot => {
                    let donation = 0;
                    querySnapshot.forEach(async (item) => {
                        donation += parseInt(item.data().amount);
                    })
                    setDonationAmount(donation);
                });
        } catch (e) {
            console.log("Error fetching App Summary", e);
        } finally {
            setIsLoading(false);
        }
    };
    const cardSelected = (cardName: string) => {
        switch (cardName) {
            case "members": navigation.navigate("MembersScreen", { item: null, user: loggedInUser, filter: "Member" }); break;
            case "events": navigation.navigate("NoticeScreen", { item: null, user: loggedInUser }); break;
            case "feesdonations": navigation.navigate("DonationScreen", { item: null, user: loggedInUser }); break;
            case "schemes": navigation.navigate("EducationScreen", { item: null, user: loggedInUser }); break;
            case "requests": navigation.navigate("RequestScreen", { item: null, user: loggedInUser }); break;
            case "profile": navigation.navigate("ProfileScreen", { item: null, user: loggedInUser }); break;
            case "education": navigation.navigate("EducationScreen", { item: null, user: loggedInUser }); break;
            case "jobs": navigation.navigate("WorkInprogressScreen", {
                item: {
                    title: 'Jobs',
                    description: "Our team is working on this idea. Please let us know if you have any suggestions. Our team would be more than happy to work on them."
                }, user: loggedInUser
            }); break;
            case "matrimonial": navigation.navigate("WorkInprogressScreen", {
                item: {
                    title: 'Matrimonial',
                    description: "Our team is working on this idea. Please let us know if you have any suggestions. Our team would be more than happy to work on them."
                }, user: loggedInUser
            });
                break;
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.sectionMain}>
                    <Image
                        source={require('../utility/images/logo.jpg')}
                        style={styles.logoImage}
                    />
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>THE SHIKALGAR's</Text>
                </View>
                <View style={styles.sectionMain}>
                    <Text style={styles.sectionText}>
                        This organization was formed on 22nd March 1996 to help our community to get benefits from different Government Schemes and spread message of how important education is to our society.
                    </Text>
                    <Text style={styles.sectionText}>
                        Our main focus is on Education, HealthCare, and Other needs of our
                        community. We try to reachout to our members who are blessed and doing
                        well by the grace of Allah, to come forward and contribute for different
                        causes/occasions like Education, Zaqat, Sadaqa, and other
                        voluntary reasons.
                    </Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>FOUNDER</Text>
                </View>
                <View style={styles.sectionMain}>
                    <Image
                        source={require('../utility/images/members/founder.jpg')}
                        style={styles.cardImage}
                    />
                    <Text style={styles.sectionText}>
                        Late Mr. Nijamuddin Shikalgar
                    </Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Be part of our Journey</Text>
                </View>
                <View style={styles.sectionMain}>
                    <Text style={styles.sectionText}>
                        Please join us on this journey to help our families and relatives to fulfill their dreams. This would definitely give you a feel of satisfaction in the cause of Almighty.
                    </Text>
                </View>
                <TouchableOpacity onPress={() => { cardSelected("members"); }} style={[styles.item, { backgroundColor: '#009387' }]}>
                    <Text style={[styles.title, { color: 'white' }]}>Members - {memberCount}</Text>
                    <Image source={require('../utility/images/members.jpg')} style={{ height: 200, width: '100%' }} />
                    <View style={styles.cardRow2}>
                        <Text style={[styles.title2, { backgroundColor: '#009387', color: 'white' }]}>
                            Please come and join us to help and at the same time get benefits by being part of our community.
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { cardSelected("events"); }} style={[styles.item, { backgroundColor: '#F9D162' }]}>
                    <Text style={[styles.title, { color: 'white' }]}>Meetings & Events</Text>
                    <Image source={require('../utility/images/alerts.png')} style={{ height: 200, width: '100%' }} />
                    <View style={styles.cardRow2}>
                        <Text style={[styles.title2, { backgroundColor: '#F9D162', color: 'white' }]}>Alerts and Notifications for Meetings, Activities, & other Events.</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { cardSelected("requests"); }} style={[styles.item, { backgroundColor: '#009387' }]}>
                    <Text style={[styles.title, { color: 'white' }]}>Requests - {beneficiaryCount}</Text>
                    <Image source={require('../utility/images/requests.png')} style={{ height: 200, width: '100%' }} />
                    <View style={styles.cardRow2}>
                        <Text style={[styles.title2, { backgroundColor: '#009387', color: 'white' }]}>
                            If you are looking for a help, please reach out to us by posting a request with due details.
                            Our team would review and let you know the help that we can extend.</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { cardSelected("feesdonations"); }} style={[styles.item, { backgroundColor: '#F9D162' }]}>
                    <Text style={[styles.title, { color: 'white' }]}>Contributions - Rs.{donationAmount}/-</Text>
                    <Image source={require('../utility/images/donations.jpg')} style={{ height: 200, width: '100%' }} />
                    <View style={styles.cardRow2}>
                        <Text style={[styles.title2, { backgroundColor: '#F9D162', color: 'white' }]}>Your small contributions would bring a big difference to our community members in a need.</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { cardSelected("education"); }} style={[styles.item, { backgroundColor: '#009387' }]}>
                    <Text style={[styles.title, { color: 'white' }]}>Education & Other Facilties</Text>
                    <Image source={require('../utility/images/scholarships.jpg')} style={{ height: 200, width: '100%' }} />
                    <View style={styles.cardRow2}>
                        <Text style={[styles.title2, { backgroundColor: '#009387', color: 'white' }]}>
                            Please be informed about government and other private organization schemes for Education, Businesses, and People in need.
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { cardSelected("jobs"); }} style={[styles.item, { backgroundColor: '#F9D162' }]}>
                    <Text style={[styles.title, { color: 'white' }]}>Jobs</Text>
                    <Image source={require('../utility/images/jobs.jpg')} style={{ height: 200, width: '100%' }} />
                    <View style={styles.cardRow2}>
                        <Text style={[styles.title2, { backgroundColor: '#F9D162', color: 'white' }]}>Are you looking for a Job? Then this is the right place to get more information.</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { cardSelected("matrimonial"); }} style={[styles.item, { backgroundColor: '#009387' }]}>
                    <Text style={[styles.title, { color: 'white' }]}>Matrimonial</Text>
                    <Image source={require('../utility/images/matrimonial.jpg')} style={{ height: 200, width: '100%' }} />
                    <View style={styles.cardRow2}>
                        <Text style={[styles.title2, { backgroundColor: '#009387', color: 'white' }]}>Let us take our community bonds to the next level.</Text>
                    </View>
                </TouchableOpacity>
                {/* <View style={{ margin: 10, flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => { cardSelected("profile"); }}>
                        <Icon name="person" size={30} color="green" />
                    </TouchableOpacity>
                    <Text style={{ color: 'royalblue', fontSize: 20, fontWeight: 'bold' }}>User# {loggedInUser?.phone}</Text>
                    <TouchableOpacity
                        onPress={() => { logout(); }}>
                        <Icon name="logout" size={30} color="orange" />
                    </TouchableOpacity>
                </View> */}
            </ScrollView>
            <InternetConnectivityCheck />
        </View >
    );
};

export default IntroScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: { width: 250, height: 250, borderRadius: 120, marginVertical: 20 },
    cardImage: { width: 200, height: 200, borderRadius: 120, marginBottom: 10 },
    sectionMain: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
        backgroundColor: 'white',
        borderRadius: 20,
    },
    section: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
        marginHorizontal: 5,
        backgroundColor: '#009387',
        borderRadius: 5,
        borderWidth: 1, borderColor: 'grey', height: 50,
    },
    sectionHeader: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    sectionText: {
        fontSize: 20,
        marginHorizontal: 5,
        textAlign: 'justify',
    },
    cardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap', padding: 5, width: '100%'

    }, cardMain: {
        width: '48.5%', height: 120, margin: 3, backgroundColor: 'pink',

    }, cardBody: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }, cardText: {
        fontSize: 20,
    },
    item: {
        padding: 10,
        marginVertical: 5,
        marginHorizontal: 5,
        borderRadius: 10,
    },
    title: {
        fontSize: 28,
        //fontWeight: 'bold'
    },
    title2: {
        fontSize: 16,
    },
    cardRow2: {
        flex: 1,
        flexDirection: 'row',
        color: 'lightgrey',
    },
});
