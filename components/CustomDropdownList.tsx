import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../utility/MasterTypes';

const CustomDropdownList = ({ data, label, error, selectedId, placeholder = "", onChange }) => {
    const [value, setValue] = useState(0);
    //console.log("selectedId: ", selectedId);
    const [isFocus, setIsFocus] = useState(false);

    const renderLabel = () => {
        if (value || isFocus) {
            return (
                <Text style={[styles.label2, isFocus && { color: 'blue' }]}>
                    Dropdown label
                </Text>
            );
        }
        return null;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <Dropdown
                style={[styles.dropdown]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                search
                maxHeight={300}
                labelField="name"
                valueField="id"
                placeholder={'Select ' + label}
                searchPlaceholder="Search..."
                value={selectedId}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    setValue(item.id);
                    onChange ? onChange(item) : null;
                }}
                renderLeftIcon={() => (
                    <Icon
                        name="playlist-add-check"
                        style={{ color: Colors.darkblue, fontSize: 22, marginHorizontal: 10 }}
                    />
                )}
            />
            {error && error != "" &&
                <Text style={{ color: Colors.red, fontSize: 12, marginTop: 7 }}>{error}</Text>
            }
        </View>
    )
}

export default CustomDropdownList

const styles = StyleSheet.create({
    label: {
        marginVertical: 5,
        fontSize: 14,
        color: Colors.grey,
    },
    container: {
        backgroundColor: 'white',
        marginBottom: 10,
    },
    dropdown: {
        height: 55,
        backgroundColor: Colors.light,
        width: '100%',
        borderRadius: 0,
        paddingHorizontal: 8,
        marginTop: 0,
    },
    icon: {
        marginRight: 5,
    },
    label2: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 14,
        color: Colors.grey
    },
    selectedTextStyle: {
        fontSize: 14,
        color: Colors.darkblue
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 14,
    },
});