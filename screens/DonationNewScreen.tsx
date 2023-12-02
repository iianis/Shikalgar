//Member, Registration, Education, Widow Empowerment, Qurbani, Jakat,
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Keyboard, Alert } from 'react-native';
import CustomDropdownList from '../components/CustomDropdownList';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import Loader from '../components/Loader';
import firestore from '@react-native-firebase/firestore';
import Colors, { IDonation, dBTable, donationTypes, talukas, villages } from '../utility/MasterTypes';
import InternetConnectivityCheck from '../components/InternetConnectivityCheck';

const DonationNewScreen = ({ navigation, route }) => {
    //const [selectedId, setSelectedId] = useState(1);
    const item = route.params?.item;
    const loggedInUser = route.params.user;
    const [documentId, setDocumentId] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    //const [selectedDOB, setSelectedDOB] = useState(new Date());
    //const [selectedDOBText, setSelectedDOBText] = useState("");
    const [villagesByTaluka, setVillagesByTaluka] = useState([]);
    const [inputs, setInputs] = useState<IDonation>({
        id: '',
        name: '',
        phone: '',
        amount: 0,
        donationType: 'Education',
        donationTypeId: 1,
        taluka: '',
        village: '',
        talukaId: 0,
        villageId: 0,
        receiptNumber: '',
        desc: '',
        deleted: false,
        receivedBy: loggedInUser ? loggedInUser.name : 'Admin',
        receivedOn: new Date().toString(),
        updatedBy: '',
        updatedOn: ''
    });
    const [uiDetails, setUIDetails] = useState({
        dbTable: "donations", redirectComponent: 'DonationScreen'
    });

    useEffect(() => {
        if (item) {
            setInputs(item);
            handleDDLChange("taluka", { id: item.talukaId, name: item.taluka });
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
            handleError('name', 'Please enter Name');
            valid = false;
        }
        if (!inputs.phone) {
            handleError('phone', 'Please enter Phone');
            valid = false;
        }
        if (!inputs.amount) {
            handleError('amount', 'Please enter Amount');
            valid = false;
        }

        //console.log('saving donation..valid', valid);
        if (valid) {
            //console.log('saving donation..documentId', documentId);
            if (documentId) update(); else save();
        }
    }

    const save = () => {
        setLoading(true);
        //console.log('saving donation..');
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
                Alert.alert("Error", "Donation Save - Something went wrong.");
            } finally {
                navigation.navigate('Donations', { filter: null, user: loggedInUser });
            }
        }, 3000)
    };

    const update = async () => {
        //console.log('updating donation..');
        try {
            inputs.updatedBy = loggedInUser ? loggedInUser.name : 'Admin';
            inputs.updatedOn = new Date().toString();
            await firestore().collection(dBTable(uiDetails.dbTable)).doc(documentId).set(inputs);
        } catch (error) {
            Alert.alert("Error", "Donation Update - Something went wrong.");
        } finally {
            navigation.navigate('Donations', { filter: null, user: loggedInUser });
        }
    };

    const deleteRecord = async () => {
        setLoading(true);
        try {
            inputs.deleted = true;
            await firestore().collection(dBTable(uiDetails.dbTable)).doc(documentId).set(inputs);
        } catch (error) {
            Alert.alert("Error", "Donation Update - Something went wrong.");
        } finally {
            navigation.navigate('Donations', { filter: null, user: loggedInUser });
        }
    };

    const clearFormFields = () => {
        //console.log('clear donation');
        setInputs({
            name: '',
            phone: '',
            amount: 0,
            donationType: 'Education',
            donationTypeId: 1,
            receivedBy: 'Admin',
            receivedOn: new Date().toString(),
            taluka: '',
            village: '',
            talukaId: 0,
            villageId: 0,
            receiptNumber: '',
            desc: ''
        });
    }

    const loadMemberDetails = (data) => {
        setInputs(prevState => ({ ...prevState, ['taluka']: data.taluka }));
        setInputs(prevState => ({ ...prevState, ['talukaId']: data.talukaId }));
        setInputs(prevState => ({ ...prevState, ['village']: data.village }));
        setInputs(prevState => ({ ...prevState, ['villageId']: data.villageId }));
        setInputs(prevState => ({ ...prevState, ['name']: data.name }));
        //handleDOBSet(data.dob.toDate());
        //setSelectedDOB(data.dob.toDate());
        handleDDLChange("taluka", { id: data.talukaId, name: data.taluka });
    };

    const loadMemberByPhone = async (phone: string) => {
        setLoading(true);
        //console.log('getMember > by phone: ', phone);
        await firestore()
            .collection(dBTable('members'))
            .where('phone', '==', phone)
            .get()
            .then(memberSnapshot => {
                memberSnapshot.forEach(item => {
                    Alert.alert("Registered Member!", item.data().name + ", " + item.data().village + ", Phone - " + item.data().phone,
                        [
                            {
                                text: 'Ok', onPress: () => {
                                    //console.log('Go ahead and load this Member Information');
                                    let data = item.data();
                                    loadMemberDetails(data);
                                }
                            },
                            { text: 'Cancel', onPress: () => console.log('Cancel and try different Phone Number') },
                        ],
                        {
                            cancelable: false
                        });
                })
                setLoading(false);
            });
    };

    const handleInputChange = (field: string, item: any) => {
        setInputs(prevState => ({ ...prevState, [field]: item }));

        if (field === 'phone' && item.toString().length == 10) {
            loadMemberByPhone(item);
        }
    }

    const handleDDLChange = (field: string, changedItem: any) => {
        let fieldId = field + 'Id';
        setInputs(prevState => ({ ...prevState, [field]: changedItem.name }));
        setInputs(prevState => ({ ...prevState, [fieldId]: changedItem.id }));
        if (field === 'taluka') {
            let villagesByFilter = villages.filter(item => { return item.taluka == changedItem.name; });
            //console.log('set village as per taluka', villagesByFilter);
            setVillagesByTaluka(villagesByFilter);
        }
    }

    const handleError = (field: string, errorMessage: string) => {
        setErrors(prevState => ({ ...prevState, [field]: errorMessage }))
    }

    return (
        <View style={{ backgroundColor: Colors.white, flex: 1 }}>
            <Loader visible={loading} />
            <InternetConnectivityCheck />
            <ScrollView contentContainerStyle={{ paddingTop: 50, paddingHorizontal: 20 }}>
                <Text style={{ color: Colors.black, fontSize: 40, fontWeight: 'bold' }}>Fees & Donation</Text>
                <Text style={{ color: Colors.grey, fontSize: 18, marginVertical: 10 }}>Enter member details & amount.</Text>
                <View style={{ marginVertical: 20 }}>

                    <CustomDropdownList
                        data={donationTypes}
                        label="Contribution Type"
                        error={errors.donationType}
                        selectedId={inputs.donationTypeId}
                        onChange={item => {
                            handleDDLChange('donationType', item)
                        }}
                    />
                    <CustomTextInput
                        label="Member Phone"
                        data={inputs.phone}
                        iconName="phone"
                        error={errors.phone}
                        placeholder="Enter member phone"
                        keyboardType='numeric'
                        onFocus={() => { handleError('phone', null) }}
                        onChangeText={text => handleInputChange('phone', text)}
                    />
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
                        label="Amount"
                        data={inputs.amount}
                        iconName="person"
                        error={errors.amount}
                        placeholder="Enter amount"
                        keyboardType='numeric'
                        onFocus={() => { handleError('amount', null) }}
                        onChangeText={text => handleInputChange('amount', text)}
                    />
                    <CustomTextInput
                        label="Receipt#"
                        data={inputs.receiptNumber}
                        iconName="person"
                        error={errors.receiptNumber}
                        placeholder="Enter receipt number"
                        keyboardType='numeric'
                        onFocus={() => { handleError('receiptNumber', null) }}
                        onChangeText={text => handleInputChange('receiptNumber', text)}
                    />
                    <CustomTextInput
                        label="Description"
                        data={inputs.desc}
                        iconName="person"
                        error={errors.desc}
                        multiline
                        multilines={4}
                        maxLength={250}
                        placeholder="Enter description"
                        onFocus={() => { handleError('desc', null) }}
                        onChangeText={text => handleInputChange('desc', text)}
                    />
                    <CustomDropdownList
                        data={talukas}
                        label="Taluka"
                        error={errors.taluka}
                        selectedId={inputs.talukaId}
                        onChange={item => {
                            handleDDLChange('taluka', item)
                        }}
                    />
                    <CustomDropdownList
                        data={villagesByTaluka}
                        label="Village"
                        error={errors.village}
                        selectedId={inputs.villageId}
                        onChange={item => {
                            handleDDLChange('village', item)
                        }}
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

export default DonationNewScreen

const styles = StyleSheet.create({

})
