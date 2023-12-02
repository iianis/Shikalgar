import { View, Text, StyleSheet, TextInput } from 'react-native'
import React, { useState } from 'react'
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../utility/MasterTypes';
import { SafeAreaView } from 'react-native-safe-area-context';

const CustomTextInput = ({
    label = "MyLabel",
    data,
    iconName = "person",
    error,
    password = false,
    isEditable = true,
    maxLength = 50,
    multiline = false,
    multilines = 5,
    onFocus = () => { }, ...props }) => {

    const [isFocused, setIsFocused] = useState(false);
    const [hidePassword, setHidePassword] = useState(password);
    //console.log('textinput ', label, hidePassword, error);
    //console.log('multiline = multilines = ', multiline, multilines);

    return (
        <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.inputContainer, { borderColor: error && error != "" ? Colors.red : isFocused ? Colors.blue : Colors.light }]}>
                <Icon
                    name={iconName}
                    style={{ color: Colors.darkblue, fontSize: 22, marginRight: 10 }}
                />
                <TextInput
                    value={data}
                    secureTextEntry={hidePassword}
                    autoCorrect={false}
                    editable={isEditable}
                    maxLength={maxLength ? maxLength : 50}
                    multiline={multiline || false}
                    numberOfLines={multilines}
                    onFocus={() => {
                        onFocus();
                        setIsFocused(true);
                    }}
                    onBlur={() => {
                        setIsFocused(false);
                    }}
                    style={{ color: Colors.darkblue, flex: 1 }}
                    {...props}
                />
                {password && (<Feather
                    name={hidePassword ? "eye-off" : "eye"}
                    style={{ color: Colors.darkblue, fontSize: 22 }}
                    onPress={() => setHidePassword(!hidePassword)}
                />)}
            </View>
            {error && error != "" &&
                <Text style={{ color: Colors.red, fontSize: 12, marginTop: 7 }}>{error}</Text>
            }
        </View>
    )
}

export default CustomTextInput

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
});

