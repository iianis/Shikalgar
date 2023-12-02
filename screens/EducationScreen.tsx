import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    TouchableOpacity,
    Text,
    TextInput, LogBox
} from 'react-native';
import CustomButton from '../components/CustomButton';
import CustomFlatList from '../components/CustomFlatList';
import Loader from '../components/Loader';
import Search from '../components/Search';
import firestore from '@react-native-firebase/firestore';
import { dBTable } from '../utility/MasterTypes';
import InternetConnectivityCheck from '../components/InternetConnectivityCheck';

const EducationScreen = ({ navigation, route }) => {
    const loggedInUser = route.params.user;
    const [selectedId, setSelectedId] = useState(null);
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [itemsData, setItemsData] = useState([]);
    const [uiDetails, setUIDetails] = useState({
        dbTable: "schemes", redirectComponent: 'EducationNewScreen'
    });

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        const unsubscribe = navigation.addListener('focus', async () => {
            setItemsData([]);
            setSearchResult([]);
            getItems();
        });
        return unsubscribe;
    }, [navigation]);

    const getItems = async () => {
        setLoading(true);
        await firestore()
            .collection(dBTable(uiDetails.dbTable))
            .where('deleted', '==', false)
            //.where('donationType', '>=', searchText)
            //.where('donationType', '<=', searchText + '\uf8ff')
            .limit(50)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    if (doc?.exists) {
                        let itemDoc = doc.data();
                        itemDoc.id = doc.id;
                        setItemsData(items => [...items, itemDoc]);
                        setSearchResult(items => [...items, itemDoc]);
                    } else {
                        console.log('No records found!');
                    }
                    setLoading(false);
                });
                setLoading(false);
            });
    };

    const handleListSelection = (item: any) => {
        //console.log("list item selected ", item);
        navigation.navigate(uiDetails.redirectComponent, { item: item, user: loggedInUser });
    };

    const filterBySearch = (input: string) => {
        let searchResult = itemsData.filter(item => {
            return item.name.toLowerCase().includes(input.toLocaleLowerCase()) ||
                item.description.toLowerCase().includes(input.toLocaleLowerCase());
        });
        //console.log('searchResult', searchResult.length);
        setSearchResult(searchResult);
    };

    return (
        <View style={styles.container}>
            <View>
                <Search
                    PlaceHolder='Search by Details'
                    FilterBySearch={(search: string) => { filterBySearch(search) }}
                />
            </View>
            <Loader visible={loading} />
            <InternetConnectivityCheck />
            {loggedInUser.accessLevel > 1 && <CustomButton title="Add New" onPress={() => navigation.navigate(uiDetails.redirectComponent, { item: null, user: loggedInUser })} />}
            <CustomFlatList data={searchResult} selectedId={selectedId} onSelect={(item: IScheme) => { handleListSelection(item); }} />
        </View>
    );
};

export default EducationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    }
});

export interface IScheme {
    id: number;
    title?: string;
    name?: string;
    description: string;
    deleted: boolean;
    applicationOpenDate?: string;
    applicationCloseDate?: string;
    createdOn?: string;
    createdBy?: string;
    updatedOn?: string;
    updatedBy?: string;
}

export const schemes: IScheme[] = [
    {
        id: 1,
        name: 'Maulana Azad Minorities financial development corporation',
        description: '29, Shahid Bhagat Singh Marg, Kala Ghoda, Fort, Mumbai. Contact: 022 2267 2293',
        deleted: true,
        applicationOpenDate: '1/12/2022',
        applicationCloseDate: '31/12/2022',
    },
    {
        id: 2,
        name: 'Nationalized Bank Loan',
        description: 'MH',
        deleted: true,
        applicationOpenDate: '1/12/2022',
        applicationCloseDate: '31/12/2022',
    },
    {
        id: 3,
        name: 'Savitribai Phule Scholaship',
        description: 'Pune',
        deleted: true,
        applicationOpenDate: '1/12/2022',
        applicationCloseDate: '31/12/2022',
    },
];
