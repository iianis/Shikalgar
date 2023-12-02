import { Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../utility/MasterTypes'

const CustomButton = ({ title = "Give me name", bgColor = Colors.blue, color = Colors.white, onPress = () => { } }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            style={{
                height: 55,
                width: '100%',
                borderRadius: 10,
                backgroundColor: bgColor,
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 10
            }}>
            <Text style={{ color: (color ? color : Colors.white), fontWeight: 'bold', fontSize: 18 }}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}

export default CustomButton