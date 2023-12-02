//Marriages, Remarriges
//Widow, Widower, Divorcee,
//Member, Registration, Education, Widow Empowerment, Qurbani, Jakat,
import React, { useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Text } from 'react-native';
import Search from '../components/Search';

const MatrimonialScreen = ({ navigation }) => {
    const [selectedId, setSelectedId] = useState(null);

    const Item = ({ item, onPress, backgroundColor, textColor }) => (
        <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
            <Text style={[styles.title, textColor]}>{item.title}</Text>
            <View style={styles.cardRow2}>
                <Text style={[styles.title2, textColor]}>Description: {item.desc}</Text>
                <Text style={[styles.title2, textColor]}>, {item.active}</Text>
            </View>
            <View style={styles.cardRow3}>
                <Text style={[styles.title2, textColor]}>Dates: {item.date}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderItem = ({ item }) => {
        const backgroundColor = item.id === selectedId ? '#F9D162' : '#FF7DA7';
        const color = item.id === selectedId ? 'white' : 'black';

        return (
            <Item
                item={item}
                onPress={() => {
                    setSelectedId(item.id);
                    //navigation.navigate('MemberDetails', {item: item});
                }}
                backgroundColor={{ backgroundColor }}
                textColor={{ color }}
            />
        );
    };

    return (
        <View style={styles.container}>
            <View>
                <Search item={{ placeHolder: 'Search by any Detail' }} />
            </View>
            <View>
                <FlatList
                    data={candidates}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    extraData={selectedId}
                />
            </View>
        </View>
    );
};

export default MatrimonialScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
    },
    tile1: {
        backgroundColor: 'red',
        height: 150,
        width: '50%',
        padding: 5,
    },
    item: {
        padding: 10,
        marginVertical: 10,
        marginHorizontal: 10,
    },
    title: {
        fontSize: 30,
    },
    title2: {
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
    textInput: {
        borderBottomColor: 'grey',
        borderWidth: 1,
        borderRadius: 10,
    },
});

export interface candidate {
    id: number;
    title: string;
    desc: string;
    active: boolean;
    date: string;
}

export const candidates: candidate[] = [
    {
        id: 1,
        title: 'Looking for a Boy',
        desc: 'Our daughter Ms Jaheen M Shikalgar is graduate, Age 22 and looking for a suitable Boy',
        active: true,
        date: '13/11/2022',
    },
    {
        id: 2,
        title: 'Looking for a Girl',
        desc: 'Our son Ma Muneer M Shikalgar is Post Graduate in Computers, Age 25 and looking for a suitable Girl',
        active: true,
        date: '30/11/2022',
    },
    {
        id: 3,
        title: 'Looking for a Boy for Second Marriage',
        desc: 'Our daughter Ms Shaheen Shikalgar is Civil Engineer, Age 36 and looking for a suitable Boy for a second marriage.',
        active: true,
        date: '2/12/2022',
    },
    {
        id: 4,
        title: 'Looking for a Boy',
        desc: 'Our daughter Ms Salma M Shikalgar is Mech. Engineer, Age 24 and looking for a suitable Boy',
        active: true,
        date: '2/12/2022',
    },
];
