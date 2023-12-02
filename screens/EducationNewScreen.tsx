import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Keyboard, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import Loader from '../components/Loader';
import { IScheme } from './EducationScreen';
import Colors, { dBTable } from '../utility/MasterTypes';
import InternetConnectivityCheck from '../components/InternetConnectivityCheck';

const EducationNewScreen = ({ navigation, route }) => {
    const item = route.params?.item;
    const loggedInUser = route.params.user;
    const [documentId, setDocumentId] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [uiDetails, setUIDetails] = useState({
        dbTable: "schemes", redirectComponent: 'EducationScreen'
    });
    const [inputs, setInputs] = useState<IScheme>({
        id: 0,
        name: '',
        description: '',
        deleted: false,
        createdOn: new Date().toString(),
        createdBy: 'Admin',
        updatedOn: '',
        updatedBy: '',
    });

    //console.log('data', inputs);
    useEffect(() => {
        if (item) {
            setInputs(item);
            setDocumentId(item.id);
        } else {
            setLoading(false);
        }
    }, []);

    const validate = () => {
        Keyboard.dismiss();
        //console.log('validation..', inputs);
        let valid = true;

        if (!inputs.name) {
            handleError('name', 'Please enter name');
            valid = false;
        }
        if (!inputs.description) {
            handleError('description', 'Please enter description');
            valid = false;
        }

        //console.log('saving record..valid', valid);
        if (valid) {
            //console.log('saving scheme..documentId', documentId);
            if (documentId) update(); else save();
        }
    }

    const save = () => {
        setLoading(true);
        //console.log('saving record..');
        setTimeout(async () => {
            setLoading(false);
            try {
                await firestore()
                    .collection(dBTable(uiDetails.dbTable))
                    .add(inputs)
                    .then(res => {
                        //console.log(res);
                    });
            } catch (error) {
                Alert.alert("Error", "Request Save - Something went wrong.");
                console.log(error);
            } finally {
                navigation.navigate(uiDetails.redirectComponent, { filter: null, user: loggedInUser });
            }
        }, 3000)
    };

    const update = async () => {
        //console.log('updating record..');
        try {
            inputs.updatedBy = '';
            inputs.updatedOn = new Date().toString();
            await firestore().collection(dBTable(uiDetails.dbTable)).doc(documentId).set(inputs);
        } catch (error) {
            Alert.alert("Error", "Scheme Update - Something went wrong.");
        } finally {
            navigation.navigate(uiDetails.redirectComponent, { filter: null, user: loggedInUser });
        }

    };

    const deleteRecord = async () => {
        setLoading(true);
        try {
            inputs.deleted = true;
            await firestore().collection(dBTable(uiDetails.dbTable)).doc(documentId).set(inputs);
        } catch (error) {
            Alert.alert("Error", "Request Update - Something went wrong.");
        } finally {
            navigation.navigate(uiDetails.redirectComponent, { filter: null, user: loggedInUser });
        }
    };

    const handleInputChange = (field: string, item: any) => {
        //console.log('field item:', field, item);
        setInputs(prevState => ({ ...prevState, [field]: item }));
    }

    const handleError = (field: string, errorMessage: string) => {
        setErrors(prevState => ({ ...prevState, [field]: errorMessage }))
    }

    const switchOptions = [
        { label: "In progress", value: "1" },
        { label: "Approved", value: "2" },
    ];

    return (
        <View style={{ backgroundColor: Colors.white, flex: 1 }}>
            <Loader visible={loading} />
            <InternetConnectivityCheck />
            <ScrollView contentContainerStyle={{ paddingTop: 50, paddingHorizontal: 20 }}>
                <Text style={{ color: Colors.black, fontSize: 40, fontWeight: 'bold' }}>Scholarships & Schemes</Text>
                <Text style={{ color: Colors.grey, fontSize: 18, marginVertical: 10 }}>Enter details.</Text>
                <View style={{ marginVertical: 20 }}>

                    <CustomTextInput
                        label="Name"
                        data={inputs.name}
                        iconName="person"
                        error={errors.name}
                        placeholder="Enter name"
                        onFocus={() => { handleError('name', null) }}
                        onChangeText={text => handleInputChange('name', text)}
                    />
                    <CustomTextInput
                        label="Description"
                        data={inputs.description}
                        iconName="person"
                        error={errors.description}
                        placeholder="Enter description"
                        multiline
                        multilines={4}
                        maxLength={250}
                        onFocus={() => { handleError('description', null) }}
                        onChangeText={text => handleInputChange('description', text)}
                    />

                    {loggedInUser.accessLevel > 1 &&
                        <CustomButton title="Save" onPress={() => validate()} />}
                    {documentId && loggedInUser.accessLevel > 2 &&
                        <CustomButton title="Delete" bgColor="lightgrey" color="black" onPress={() => deleteRecord()} />}
                </View>
            </ScrollView>
        </View>
    );
}

export default EducationNewScreen

const styles = StyleSheet.create({
})
