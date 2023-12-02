import React, { createContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { dBTable } from '../utility/MasterTypes';

export const AuthContext = createContext("MyAppContext");

export const AuthProvider = ({ children }: any) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userDetails, setUserDetails] = useState({
        name: '', phone: '', accessLevel: 1, isDirector: false,
        taluka: 'Satara', talukaId: 1, village: 'Satara', villageId: 1, securityToken: ""
    });
    const [uiDetails, setUIDetails] = useState({
        dbTable: "members", redirectComponent: 'Members'
    });

    const login = async (phone: string, password: string) => {
        //console.log("login in progress",);
        setIsLoading(true);
        setUserToken(null);
        let response = "";

        try {
            await firestore()
                .collection(dBTable(uiDetails.dbTable))
                .where('phone', '==', phone)
                .where('password', '==', password)
                .get()
                .then(memberSnapshot => {
                    //setIsLoading(false);
                    if (!memberSnapshot || memberSnapshot.size <= 0) {
                        response = "failed";
                    }
                    memberSnapshot.forEach(async (item) => {
                        setUserToken("thisisahighlysecurejwtoken");
                        //await AsyncStorage.setItem('userToken', "thisisahighlysecurejwtoken");
                        let itemDoc = item._data;
                        response = "success";
                        await AsyncStorage.multiSet([['userToken', "thisisahighlysecurejwtoken"], ['phone', phone]]);
                        let user = {
                            id: item.id,
                            name: itemDoc.name,
                            phone: itemDoc.phone,
                            accessLevel: itemDoc.accessLevel ? itemDoc.accessLevel : 1,
                            taluka: itemDoc.taluka,
                            talukaId: itemDoc.talukaId,
                            village: itemDoc.village,
                            villageId: itemDoc.villageId,
                            securityToken: "thisisahighlysecurejwtoken"
                        };
                        setUserDetails(user);
                        console.log("login success.", user);
                        await AsyncStorage.setItem('user', JSON.stringify(user));
                    })
                });

            return response;
        } catch (e) {
            console.log("Error Login API", e);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setUserToken(null);
        setIsLoading(false);
        //console.log('logout in progress');
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.multiRemove(['userToken', 'phone']);
    };

    useEffect(() => {
        const isLoggedin = async () => {
            try {
                let userToken = await AsyncStorage.getItem('userToken');
                //console.log('userToken 13', userToken);
                setUserToken(userToken);
            } catch (ex) {
                console.log('Error while reading AsyncStorage.getItem(userToken)', ex);
            }
        };

        isLoggedin();
    }, []);

    return (
        <AuthContext.Provider value={{ login, logout, isLoading, userToken }}>
            {children}
        </AuthContext.Provider>
    );
}