import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import CustomButton from '../components/CustomButton';
import Loader from '../components/Loader';
import Search from '../components/Search';

import firestore from '@react-native-firebase/firestore';
import CustomFlatList from '../components/CustomFlatList';
import { dBTable } from '../utility/MasterTypes';
import InternetConnectivityCheck from '../components/InternetConnectivityCheck';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NoticeScreen = ({ navigation, route }) => {
    //const loggedInUser = route.params.user;

    //console.log('getLoggedInUser: ', route.params);

    const [selectedId, setSelectedId] = useState(null);
    const [searchResult, setSearchResult] = useState([]);
    const [itemsData, setItemsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uiDetails, setUIDetails] = useState({
        dbTable: "events", redirectComponent: 'NoticeNewScreen'
    });
    const [loggedInUser, setLoggedInUser] = useState();

    useEffect(() => {
        console.log('Intro 1 noticescreen:');
        getLoggedInUser();
        const unsubscribe = navigation.addListener('focus', async () => {
            setSearchResult([]);
            setItemsData([]);
            getItems();
        });
        return unsubscribe;
    }, [navigation]);

    const getLoggedInUser = async () => {
        console.log('Intro 2 noticescreen:');
        let user = await AsyncStorage.getItem('user');
        await setLoggedInUser(JSON.parse(user));
        console.log('getLoggedInUser noticescreen: ', user);
    };

    const getItems = async () => {
        setLoading(true);
        setItemsData([]);

        await firestore()
            .collection(dBTable(uiDetails.dbTable))
            .where('deleted', '==', false)
            .where('eventDate', '>=', new Date())
            .orderBy('eventDate', 'desc')
            .limit(50)
            .get()
            .then(eventSnapshot => {
                eventSnapshot.forEach(doc => {
                    if (doc?.exists) {
                        let itemDoc = doc.data();
                        itemDoc.id = doc.id;
                        setItemsData(events => [...events, itemDoc]);
                        setSearchResult(events => [...events, itemDoc]);

                    } else {
                        console.log("Error getEvents: Invalid Document");
                    }
                });
                setLoading(false);
            });
    };

    const handleListSelection = (item) => {
        navigation.navigate(uiDetails.redirectComponent, { item: item, user: loggedInUser });
    };

    const filterBySearch = (input: string) => {
        let searchResult = itemsData.filter(item => {

            return item.name.toLowerCase().includes(input.toLocaleLowerCase()) ||
                item.description.toLowerCase().includes(input.toLocaleLowerCase()) ||
                item.location.toLowerCase().includes(input.toLocaleLowerCase());
        });
        //console.log('searchResult', searchResult.length);
        setSearchResult(searchResult);
    };

    return (
        <View style={styles.container}>
            <Loader visible={loading} />
            <InternetConnectivityCheck />
            <View>
                <Search
                    PlaceHolder='Search by Details'
                    FilterBySearch={(search: string) => { filterBySearch(search) }}
                />
            </View>
            {loggedInUser && loggedInUser.accessLevel && loggedInUser.accessLevel > 1 && <CustomButton title="Add New" onPress={() => navigation.navigate(uiDetails.redirectComponent, { item: null, user: loggedInUser })} />}
            <CustomFlatList data={searchResult} selectedId={selectedId} onSelect={(item) => { handleListSelection(item); }} />
        </View>
    );
};

export default NoticeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        marginBottom: 5,
    },
});


