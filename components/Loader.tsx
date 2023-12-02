import { View, Text, useWindowDimensions, StyleSheet, ActivityIndicator } from 'react-native'
import React from 'react'
import Colors from '../utility/MasterTypes';

const Loader = ({ visible = false }) => {
    const { height, width } = useWindowDimensions();
    //console.log('loading..', visible);
    return (
        visible && (
            <View style={[styles.container, { height, width }]}>
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color={Colors.blue} />
                    <Text style={styles.loaderText}>Please wait...</Text>
                </View>
            </View>)
    )
}

export default Loader

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 10,
        backgroundColor: '{rgba(0,0,0,0.5)}',
        justifyContent: 'center'
    },
    loader: {
        height: 70,
        backgroundColor: Colors.white,
        marginHorizontal: 50,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    loaderText: {
        marginLeft: 10,
        fontSize: 16
    }
});