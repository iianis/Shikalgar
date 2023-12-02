import { View, Text, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

const InternetConnectivityCheck = () => {
    const [isConnected, setIsConnected] = useState(false);
    useEffect(() => {
        //console.log('Connection type 1');
        const unsubscribe = NetInfo.addEventListener(state => {
            //console.log('Connection type', state.type);
            //console.log('is Connected', state.isConnected);
            setIsConnected(state.isConnected);
        })

        return () => unsubscribe();
    }, []);

    return (
        (isConnected ? null : <View style={styles.container}>
            <Text style={styles.connectedText}>No Internet Connectivity</Text>
        </View>)
    )
}

export default InternetConnectivityCheck

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        //width: 200,
        height: 40,
        backgroundColor: 'orange',
        borderRadius: 10,
        alignSelf: 'center',
        padding: 5
    },
    connectedText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'red'
    }
})