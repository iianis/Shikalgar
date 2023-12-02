//Member, Registration, Education, Widow Empowerment, Qurbani, Jakat,
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, LogBox } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import CustomFlatList from '../components/CustomFlatList';
import CustomButton from '../components/CustomButton';
import Loader from '../components/Loader';
import Search from '../components/Search';
import { dBTable } from '../utility/MasterTypes';
import InternetConnectivityCheck from '../components/InternetConnectivityCheck';

const DonationScreen = ({ navigation, route }) => {
    const loggedInUser = route.params.user;
    const [selectedId, setSelectedId] = useState(1);
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [itemsData, setItemsData] = useState([]);
    const [uiDetails, setUIDetails] = useState({
        dbTable: "donations", redirectComponent: 'DonationNewScreen'
    });

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        const unsubscribe = navigation.addListener('focus', async () => {
            setItemsData([]);
            setSearchResult([]);
            getDonations();
        });
        return unsubscribe;
    }, [navigation]);

    const getDonations = async () => {
        //console.log('get donations like.. ', searchText);
        setLoading(true);
        await firestore()
            .collection(dBTable(uiDetails.dbTable))
            .where('deleted', '==', false)
            .orderBy('receivedOn', 'desc')
            //.where('donationType', '>=', searchText)
            //.where('donationType', '<=', searchText + '\uf8ff')
            .limit(50)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    if (doc?.exists) {
                        let donationDoc = doc.data();
                        donationDoc.id = doc.id;
                        setItemsData(donations => [...donations, donationDoc]);
                        setSearchResult(donations => [...donations, donationDoc]);
                    } else {
                        console.log('No records found!');
                    }
                    setLoading(false);
                });
                setLoading(false);
            });
    };

    const handleListSelection = (item) => {
        //console.log("list item selected ", item);
        if (!loggedInUser || !loggedInUser.accessLevel || loggedInUser.accessLevel <= 1) return;
        navigation.navigate(uiDetails.redirectComponent, { item: item, user: loggedInUser });
    };

    const filterBySearch = (input: string) => {
        let searchResult = itemsData.filter(item => {
            return item.name.toLowerCase().includes(input.toLocaleLowerCase()) ||
                item.donationType.toLowerCase().includes(input.toLocaleLowerCase()) ||
                item.amount.toLowerCase().includes(input.toLocaleLowerCase()) ||
                item.phone.toLowerCase().includes(input.toLocaleLowerCase());
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
            {loggedInUser.accessLevel > 1 && <CustomButton title="Add New" onPress={() => navigation.navigate(uiDetails.redirectComponent, { item: null, user: loggedInUser })} />}
            <CustomFlatList data={searchResult} selectedId={selectedId} onSelect={(item) => { handleListSelection(item); }} />
        </View>
    );
};

export default DonationScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    }
});
