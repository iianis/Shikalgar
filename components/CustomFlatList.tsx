import React from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'

const CustomFlatList = ({ data, selectedId, onSelect }) => {

    const dateFormat = { year: "numeric", month: "numeric", day: "numeric", };
    const dateTimeFormat = { year: "numeric", month: "numeric", day: "numeric", hour: '2-digit', minute: '2-digit' };

    const Item = ({ item, onPress, backgroundColor, textColor }) => (
        <TouchableOpacity onPress={onPress} style={[styles.cardRow, backgroundColor]}>
            {
                item.donationType && <View style={styles.cardRow2}>
                    <Text style={[styles.title, textColor]}>{item?.donationType}</Text>
                </View>
            }
            {
                item.eventType && <View style={styles.cardRow2}>
                    <Text style={[styles.title, textColor]}>{item?.eventType}</Text>
                </View>
            }
            {
                item.requestType && <View style={styles.cardRow2}>
                    <Text style={[styles.title, textColor]}>{item?.requestType}</Text>
                </View>
            }
            {
                !item.donationType && !item.requestType && item.name && <View style={styles.cardRow2}>
                    <Text style={[styles.title, textColor]}>{item.name}</Text>
                </View>
            }
            {
                item.description && <View style={styles.cardRow2}>
                    <Text style={[styles.title2, textColor]}>{item.description}</Text>
                </View>
            }
            {
                item.donationType && item.phone && <View style={styles.cardRow2}>
                    <Text style={[styles.title2, textColor]}>Doner: ******{item.phone.toString().substring(6)}</Text>
                </View>
            }
            {
                item.requestType && item.phone && <View style={styles.cardRow2}>
                    <Text style={[styles.title2, textColor]}>Reuested By: ******{item.phone.toString().substring(6)}</Text>
                </View>
            }
            {
                item.requestType && item.amount && <View style={styles.cardRow2}>
                    <Text style={[styles.title2, textColor]}>Amount: {item.amount}</Text>
                </View>
            }
            {
                item.requestType && item.approved == false && <View style={styles.cardRow2}>
                    <Text style={[styles.title2, textColor]}>Status: 'In progress'</Text>
                </View>
            }
            {
                item.requestType && item.approved && item.approvedDate && <View style={styles.cardRow2}>
                    <Text style={[styles.title2, textColor]}>
                        Approved Date: {new Date(item.approvedDate.toString()).toLocaleString("en", dateFormat)}, Amount: {item.approvedAmount}
                    </Text>
                </View>
            }
            {
                item.receiptNumber && <View style={styles.cardRow2}>
                    <Text style={[styles.title2, textColor]}>
                        Receipt#: {item.receiptNumber == '' ? 'In progress' : item.receiptNumber}, Amount: {item.amount}
                    </Text>
                </View>
            }
            {
                item.receivedOn && <View style={styles.cardRow3}>
                    <Text style={[styles.title2, textColor]}>Date: {new Date(item.receivedOn).toLocaleDateString()}, Place: {item.village}</Text>
                </View>
            }
            {
                item.eventDate && <View style={styles.cardRow3}>
                    <Text style={[styles.title2, textColor]}>Date: {new Date(item.eventDate.toDate().toString()).toLocaleString()}, Place: {item.location}</Text>
                </View>
            }
        </TouchableOpacity>
    );

    const renderItem = ({ item, selectedId }) => {
        const backgroundColor = item.id === selectedId ? '#F9D162' : '#009387';
        const color = item.id === selectedId ? 'white' : 'black';

        return (
            <Item
                item={item}
                onPress={() => {
                    onSelect ? onSelect(item) : null;
                }}

                key={item.id}
                backgroundColor={{ backgroundColor }}
                textColor={{ color }}
            />
        );
    };

    return (
        <View style={styles.cardContainer}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                extraData={selectedId}
            />
        </View>
    )
}

export default CustomFlatList

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
    },
    title2: {
        fontSize: 16,
    },
    cardContainer: {
        flex: 1,
        width: '100%', height: '100%'
    },
    cardRow: {
        padding: 10,
        marginTop: 5,
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