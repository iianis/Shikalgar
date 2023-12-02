import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    TouchableOpacity,
    Text,
    Image, Dimensions
} from 'react-native';
import Search from '../components/Search';
import firestore from '@react-native-firebase/firestore';
import CustomButton from '../components/CustomButton';
import Loader from '../components/Loader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors, { dBTable } from '../utility/MasterTypes';
import InternetConnectivityCheck from '../components/InternetConnectivityCheck';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MembersScreen = ({ navigation, route }) => {
    const { height, width } = Dimensions.get('window');
    //const filter = route.params.filter;
    //const loggedInUser = route.params.user;
    //console.log('route.params', route.params);
    const [selectedId, setSelectedId] = useState(null);
    const [membersData, setMembersData] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uiDetails, setUIDetails] = useState({
        dbTable: "members", redirectComponent: 'Intro'
    });
    const [loggedInUser, setLoggedInUser] = useState();

    useEffect(() => {
        getLoggedInUser();
        const unsubscribe = navigation.addListener('focus', async () => {
            //console.log('route.params: loggedInUser.accessLevel', loggedInUser.accessLevel);
            setMembersData([]);
            setSearchResult([]);
            setTimeout(() => {
                //console.log('date cleared?', membersData.length);
                getMembers();
            }, 1000);
        });
        return unsubscribe;
    }, [navigation]);

    const getLoggedInUser = async () => {
        //console.log('Intro 2:');
        let user = await AsyncStorage.getItem('user');
        await setLoggedInUser(JSON.parse(user));
        //console.log('Intro 3:');
    };

    const getMembers = async () => {
        setLoading(true);
        setMembersData([]);

        await firestore()
            .collection(dBTable(uiDetails.dbTable))
            .orderBy('name')
            .limit(500)
            .get()
            .then(memberSnapshot => {
                //console.log(' total members: ' + memberSnapshot.size);
                memberSnapshot.forEach(doc => {
                    if (doc?.exists) {
                        let memberDoc = doc.data();
                        memberDoc.id = doc.id;

                        //console.log(' member name: ', memberDoc.name);
                        //if (memberDoc.memberType == filter) {
                        //console.log('memberDoc type: ' + memberDoc.memberType + ", filter: " + filter);
                        setMembersData(members => [...members, memberDoc]);
                        setSearchResult(members => [...members, memberDoc]);
                        // } else if (filter && filter == "Member") {
                        //     setMembersData(members => [...members, memberDoc]);
                        //     setSearchResult(members => [...members, memberDoc]);
                        // } else if (filter && filter == "Director"
                        //     && (memberDoc.memberType == "Director" ||
                        //         memberDoc.memberType == "Secretary" ||
                        //         memberDoc.memberType == "Treasurer" ||
                        //         memberDoc.memberType == "President" ||
                        //         memberDoc.memberType == "Vice-president")) {
                        //     setMembersData(members => [...members, memberDoc]);
                        //     setSearchResult(members => [...members, memberDoc]);
                        // }
                        // else {
                        //     console.log('Else memberDoc type: ' + memberDoc.memberType + ", filter: " + filter);
                        // }
                        //setDocumentId(doc.id);
                    } else {
                        console.log("Error getMembers: Invalid Document");
                    }
                });
                setLoading(false);
            });
    };

    const Item = ({ item, onPress, backgroundColor, textColor }) => (
        <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
            <View>
                <Image
                    source={require('../utility/images/members/profile.jpg')}
                    style={styles.itemImage}
                />
            </View>
            <View>
                <Text style={[styles.title, textColor]}>{item.name}</Text>
                {item.memberType == "Member" && <View style={styles.cardRow2}>
                    <Text style={[styles.title2, textColor]}>
                        {
                            item.isDirector ? "Director " + (item.designation ? "- " + item.designation : "") : item.isFounder
                                ? "Founder Member " : item.memberType
                        }
                        {item.isDirector && <Icon
                            name="star"
                            style={{ color: Colors.orange, fontSize: 20, marginLeft: 10 }}
                        />}
                        {item.isFounder && <Icon
                            name="star"
                            style={{ color: Colors.white, fontSize: 20, marginLeft: 10 }}
                        />}
                        {item.isTalukaTeamMember && <Icon
                            name="star"
                            style={{ color: Colors.yellow, fontSize: 20, marginLeft: 10 }}
                        />}
                    </Text>
                </View>}
                {item.memberType == "Family" && <View style={styles.cardRow2}>
                    <Text style={[styles.title2, textColor]}>{item.relation} of {item.familyHeadName}</Text>
                </View>}
                <View style={styles.cardRow2}>
                    <Text style={[styles.title2, textColor]}>Taluka: {item.taluka}</Text>
                </View>
                <View style={styles.cardRow3}>
                    <Text style={[styles.title3, textColor]}>Phone: {item.phone}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderItem = ({ item }) => {
        const backgroundColor = item.id === selectedId ? '#F9D162' : '#009387';
        const color = item.id === selectedId ? 'white' : 'black';

        return (
            <Item
                item={item}
                onPress={() => {
                    if (!loggedInUser || !loggedInUser.accessLevel || (loggedInUser.accessLevel <= 1 && item.phone != loggedInUser.phone)) return;
                    //if (!loggedInUser || !loggedInUser.accessLevel || loggedInUser.accessLevel <= 1) return;
                    setSelectedId(item.id);
                    navigation.navigate('MemberNewScreen', { item: item, user: loggedInUser });
                }}
                key={Math.random().toString(36).toString(7)}
                backgroundColor={{ backgroundColor }}
                textColor={{ color }}
            />
        );
    };

    const filterBySearch = (input: string) => {
        let searchResult = membersData.filter(item => {
            //console.log('member', input.toLocaleLowerCase());
            return item.name.toLowerCase().includes(input.toLocaleLowerCase()) ||
                item.taluka.toLowerCase().includes(input.toLocaleLowerCase()) ||
                item.phone.toLowerCase().includes(input.toLocaleLowerCase());
        });
        //console.log('searchResult', searchResult.length);
        setSearchResult(searchResult);
    };

    return (
        <View style={styles.container}>
            <Loader visible={loading} />
            <InternetConnectivityCheck />
            <View style={styles.containerChild1}>
                <Search PlaceHolder='Search by Name, Taluka, Phone' FilterBySearch={(search: string) => { filterBySearch(search) }} />
            </View>
            {loggedInUser?.accessLevel > 1 && <CustomButton title="Add New" onPress={() => navigation.navigate('MemberNewScreen', { item: null, user: loggedInUser })} />}
            <View style={styles.containerChild2}>
                <FlatList
                    data={searchResult}
                    renderItem={renderItem}
                    //keyExtractor={item => item.id}
                    keyExtractor={item => item.id}
                    extraData={selectedId}
                />
            </View>
        </View>
    );
};

export default MembersScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        marginBottom: 5,
    },
    containerChild1: {
    },
    containerChild2: {
        flex: 1,
        height: '100%',
        width: '100%',
    },
    tile1: {
        backgroundColor: 'red',
        height: 150,
        width: '50%',
        padding: 5,
    },
    item: {
        padding: 10,
        marginBottom: 5,
        marginHorizontal: 0,
        flexDirection: 'row',
    },
    itemImage: {
        width: 70,
        height: 70,
        borderRadius: 50,
        marginRight: 8,
        marginTop: 8,
    },
    title: {
        fontSize: 28,
    },
    title2: {
        fontSize: 18,
    },
    title3: {
        fontSize: 16,
    },
    cardRow2: {
        flex: 1,
        flexDirection: 'row',
        color: 'lightgrey',
    },
    cardRow3: {
        flex: 1,
        flexDirection: 'row',
        color: 'lightgrey',
    },
});
