import { View, Text, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import SwitchSelector from "react-native-switch-selector";
import Colors from '../utility/MasterTypes';

const CustomButtonSwitch = ({ label, data, iconName, error, onChange = () => { }, ...props }) => {

    const [isFocused, setIsFocused] = useState(false);
    //console.log('CustomButtonSwitch approved', data);
    const switchOptions = [
        { label: "No", value: 0 },
        { label: "Yes", value: 1 },
    ];
    return (
        <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.inputContainer, { borderColor: error && error != "" ? Colors.red : isFocused ? Colors.blue : Colors.light }]}>
                <Icon
                    name={iconName}
                    style={{ color: Colors.darkblue, fontSize: 22, marginRight: 10 }}
                />
                <View style={styles.switchContainer}>

                    <SwitchSelector
                        options={switchOptions}
                        initial={data}
                        selectedColor={Colors.white}
                        buttonColor={Colors.blue}
                        borderColor={Colors.blue}
                        textColor={Colors.grey}
                        backgroundColor={Colors.white}
                        hasPadding
                        onPress={value => { onChange(value); }}
                    />
                </View>
            </View>
        </View>
    )
}

export default CustomButtonSwitch

const styles = StyleSheet.create({

    label: {
        marginVertical: 5,
        fontSize: 14,
        color: Colors.grey,
    },
    inputContainer: {
        height: 55,
        backgroundColor: Colors.light,
        flexDirection: 'row',
        paddingHorizontal: 15,
        borderWidth: .8,
        alignItems: 'center'
    },
    switchContainer: {
        width: '90%'
    }
});