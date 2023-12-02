import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import CustomButton from '../components/CustomButton';
import Loader from '../components/Loader';
import Search from '../components/Search';

import firestore from '@react-native-firebase/firestore';
import CustomFlatList from '../components/CustomFlatList';
import { dBTable } from '../utility/MasterTypes';
import InternetConnectivityCheck from '../components/InternetConnectivityCheck';

const RequestScreen = ({ navigation, route }) => {
    const loggedInUser = route.params.user;
    const [selectedId, setSelectedId] = useState(null);
    const [searchResult, setSearchResult] = useState([]);
    const [itemsData, setItemsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uiDetails, setUIDetails] = useState({
        dbTable: "requests", redirectComponent: 'RequestNewScreen'
    });

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            //console.log('loading...0');
            setItemsData([]);
            setSearchResult([]);
            getItems();
        });
        return unsubscribe;
    }, [navigation]);

    const getItems = async () => {
        //console.log('loading...');
        setLoading(true);
        setItemsData([]);

        await firestore()
            .collection(dBTable(uiDetails.dbTable))
            .where('deleted', '==', false)
            .orderBy('createdOn', 'desc')
            .limit(50)
            .get()
            .then(itemsSnapshot => {
                itemsSnapshot.forEach(doc => {
                    //console.log('loading...2');
                    if (doc?.exists) {
                        //console.log('loading...3');
                        let itemDoc = doc.data();
                        itemDoc.id = doc.id;
                        //console.log('loading...31', itemDoc.approvedDate);
                        if (itemDoc.approvedDate) {
                            //console.log('loading...311');
                            itemDoc.approvedDate = itemDoc.approvedDate.toString();
                            //console.log('loading...3111');
                        }
                        //console.log('loading...32', itemDoc.approvedDate);
                        setItemsData(items => [...items, itemDoc]);
                        setSearchResult(items => [...items, itemDoc]);
                        //console.log('loading...32');

                    } else {
                        console.log("Error getRequests: Invalid Document");
                    }
                });
                setLoading(false);
            });
    };

    const handleListSelection = (item: any) => {
        //console.log('loading..', item)
        if (!loggedInUser || !loggedInUser.accessLevel || loggedInUser.accessLevel <= 1) return;
        navigation.navigate(uiDetails.redirectComponent, { item: item, user: loggedInUser });
    };

    const filterBySearch = (input: string) => {
        let searchResult = itemsData.filter(item => {
            return item.requestType.toLowerCase().includes(input.toLocaleLowerCase()) ||
                item.description.toLowerCase().includes(input.toLocaleLowerCase()) ||
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
            <CustomButton title="Add New"
                onPress={() => navigation.navigate(uiDetails.redirectComponent, { item: null, user: loggedInUser })} />
            <CustomFlatList data={searchResult} selectedId={selectedId} onSelect={(item) => { handleListSelection(item); }} />
        </View>
    );
};

export default RequestScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        marginBottom: 5,
    },
});

