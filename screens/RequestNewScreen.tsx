import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Keyboard, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import CustomDropdownList from '../components/CustomDropdownList';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import Loader from '../components/Loader';
import Colors, { IRequest, dBTable, requestTypes, talukas, villages } from '../utility/MasterTypes';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButtonSwitch from '../components/CustomButtonSwitch';
import InternetConnectivityCheck from '../components/InternetConnectivityCheck';

const RequestNewScreen = ({ navigation, route }) => {
    //const [selectedId, setSelectedId] = useState(1);
    const item = route.params?.item;
    const loggedInUser = route.params.user;
    const [documentId, setDocumentId] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [datePickerToggle, setDatePickerToggle] = useState(false);
    const [selectedApprovedDate, setSelectedApprovedDate] = useState(new Date());
    const [selectedApprovedDateText, setSelectedApprovedDateText] = useState("");
    const [villagesByTaluka, setVillagesByTaluka] = useState([]);
    const [uiDetails, setUIDetails] = useState({
        dbTable: "requests", redirectComponent: 'RequestScreen'
    });
    const [inputs, setInputs] = useState<IRequest>({
        name: '',
        description: '',
        requestType: 'Education',
        requestTypeId: 1,
        amount: 0,
        phone: '',
        taluka: '',
        village: '',
        talukaId: 0,
        villageId: 0,
        district: 'Satara',
        deleted: false,
        approvedDate: '',
        approvedAmount: 0,
        approved: false,
        paid: false,
        createdOn: new Date().toString(),
        createdBy: 'Admin',
        updatedOn: '',
        updatedBy: '',
    });

    //console.log('data', inputs);

    useEffect(() => {
        if (item) {
            //console.log('item loading.. approved', item.approved, item.approvedDate);
            setInputs(item);
            handleApprovedDate(item.approvedDate);
            handleDDLChange("taluka", { id: item.talukaId, name: item.taluka });
            setDocumentId(item.id);
        } else {
            setLoading(false);
        }
    }, []);

    const validate = () => {
        Keyboard.dismiss();
        //console.log('validation..', inputs.approved);
        let valid = true;

        if (!inputs.description) {
            handleError('description', 'Please enter description');
            valid = false;
        }
        if (!inputs.amount) {
            handleError('amount', 'Please enter amount');
            valid = false;
        }
        if (inputs.approved == true && !inputs.approvedAmount) {
            handleError('approvedAmount', 'Please enter approved amount');
            valid = false;
        }
        if (!inputs.name) {
            handleError('name', 'Please enter name');
            valid = false;
        }
        if (!inputs.phone) {
            handleError('phone', 'Please enter phone');
            valid = false;
        }

        //console.log('saving record..valid', valid);
        if (valid) {
            console.log('saving request..documentId', documentId);
            if (documentId) update(); else save();
        }
    }

    const save = () => {
        setLoading(true);
        console.log('saving record..');
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
                console.log("Request Save - Something went wrong: " + error);
            } finally {
                navigation.navigate(uiDetails.redirectComponent, { filter: null, user: loggedInUser });
            }
        }, 3000)
    };

    const update = async () => {
        console.log('updating record..', inputs.approvedDate);
        try {
            inputs.updatedBy = '';
            inputs.updatedOn = new Date().toString();
            await firestore().collection(dBTable(uiDetails.dbTable)).doc(documentId).set(inputs);
        } catch (error) {
            Alert.alert("Error", "Request Update - Something went wrong.");
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

    const loadMemberDetails = (data) => {
        setInputs(prevState => ({ ...prevState, ['taluka']: data.taluka }));
        setInputs(prevState => ({ ...prevState, ['talukaId']: data.talukaId }));
        setInputs(prevState => ({ ...prevState, ['village']: data.village }));
        setInputs(prevState => ({ ...prevState, ['villageId']: data.villageId }));
        setInputs(prevState => ({ ...prevState, ['name']: data.name }));
        //handleDOBSet(data.createdOn?.toDate());
        //setSelectedDOB(data.createdOn?.toDate());
        handleDDLChange("taluka", { id: data.talukaId, name: data.taluka });
    };

    const loadMemberByPhone = async (phone: string, familyPhone: boolean = false) => {
        setLoading(true);
        console.log('getMember > by phone: ', phone);
        await firestore()
            .collection(dBTable('members'))
            .where('phone', '==', phone)
            .get()
            .then(memberSnapshot => {
                memberSnapshot.forEach(item => {
                    Alert.alert(familyPhone ? "Head of Family!" : "Registered Member!", item.data().name + ", " + item.data().village + ", Phone - " + item.data().phone,
                        [
                            {
                                text: 'Ok', onPress: () => {
                                    console.log('Go ahead and load this Member Information');
                                    let data = item.data();
                                    if (!familyPhone) loadMemberDetails(data);
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
        //console.log('field item:', field, item);
        setInputs(prevState => ({ ...prevState, [field]: item }));
        if ((field === 'phone' || field == 'familyPhone') && item.toString().length == 10) {
            loadMemberByPhone(item, field == 'familyPhone'); //name == 'Student' ? name : 'Business'
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

    const handleApprovalChange = (value: number) => {
        //console.log("approval status changed", value);
        setInputs(prevState => ({ ...prevState, ['approved']: value == 1 ? true : false }));
    };

    const handleApprovedDateChange = ((event, dateSelected) => {
        //console.log('1 dateSelected', dateSelected);
        //console.log('2 selectedApprovedDate', selectedApprovedDate);
        const approvedDate = dateSelected || selectedApprovedDate;
        setInputs(prevState => ({ ...prevState, ["approvedDate"]: approvedDate + "" }));
        console.log('3 approvedDate ', approvedDate);
        setSelectedApprovedDate(approvedDate);
        let approvedDateText = approvedDate.getDate() + '-' + (approvedDate.getMonth() + 1) + '-' + approvedDate.getFullYear();
        console.log('4 approvedDateText', approvedDateText);
        setSelectedApprovedDateText(approvedDateText);
    });

    const handleApprovedDate = ((dateSelected: any) => {
        //console.log('handleApprovedDate 1', dateSelected);
        if (!dateSelected) return;
        let dateSelected2 = dateSelected.toString();
        //console.log('handleApprovedDate 2', dateSelected);
        let approvedDateText = new Date(dateSelected2).getDate() + '-' + (new Date(dateSelected2).getMonth() + 1) + '-' + new Date(dateSelected2).getFullYear();
        setSelectedApprovedDateText(approvedDateText);
    });

    const handleError = (field: string, errorMessage: string) => {
        setErrors(prevState => ({ ...prevState, [field]: errorMessage }))
    }

    return (
        <View style={{ backgroundColor: Colors.white, flex: 1 }}>
            <Loader visible={loading} />
            <InternetConnectivityCheck />
            <ScrollView contentContainerStyle={{ paddingTop: 50, paddingHorizontal: 20 }}>
                <Text style={{ color: Colors.black, fontSize: 40, fontWeight: 'bold' }}>Requests</Text>
                <Text style={{ color: Colors.grey, fontSize: 18, marginVertical: 10 }}>Enter details about your request.</Text>
                <View style={{ marginVertical: 20 }}>

                    <CustomDropdownList
                        data={requestTypes}
                        label="Request Type"
                        error={errors.requestType}
                        selectedId={inputs.requestTypeId}
                        onChange={item => {
                            handleDDLChange('requestType', item)
                        }}
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
                        label="Description"
                        data={inputs.description}
                        iconName="person"
                        error={errors.description}
                        placeholder="Enter description"
                        maxLength={250}
                        multiline={true}
                        multilines={3}
                        onFocus={() => { handleError('description', null) }}
                        onChangeText={text => handleInputChange('description', text)}
                    />
                    <CustomTextInput
                        label="Request By - Phone"
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
                    {documentId && loggedInUser.accessLevel > 2 &&
                        <CustomButtonSwitch
                            label="Is Approved"
                            data={inputs.approved == true ? 1 : 0}
                            iconName="approval"
                            error={errors.approved}
                            onChange={(value: boolean) => { handleApprovalChange(value) }}

                        />
                    }
                    {documentId && inputs.approved == true &&
                        <CustomTextInput
                            label="Amount"
                            data={inputs.approvedAmount}
                            iconName="person"
                            error={errors.approvedAmount}
                            placeholder="Enter Approved Amount"
                            keyboardType='numeric'
                            onFocus={() => { handleError('approvedAmount', null) }}
                            onChangeText={text => handleInputChange('approvedAmount', text)}
                        />}
                    {documentId && inputs.approved == true &&
                        <CustomTextInput
                            label="Approved Date"
                            data={selectedApprovedDateText}
                            iconName="calendar-today"
                            error={errors.approvedDate}
                            placeholder="Enter approved date"
                            isEditable={loggedInUser.accessLevel > 2 ? true : false}
                            onFocus={() => { handleError('approvedDate', null); setDatePickerToggle(true); }}
                        //onChangeText={text => handleInputChange('approvedDate', text)}
                        />}
                    {datePickerToggle && <View><DateTimePicker
                        value={selectedApprovedDate}
                        mode="date"
                        display="default"
                        onChange={(event, data) => {
                            setDatePickerToggle(false);
                            handleApprovedDateChange(event, data);
                        }}

                    /></View>}

                    {
                        loggedInUser && loggedInUser.accessLevel > 1 && inputs.approved === false &&
                        <CustomButton title="Save" onPress={() => validate()} />
                    }
                    {
                        documentId && loggedInUser && loggedInUser.accessLevel > 2 && inputs.approved === false &&
                        <CustomButton title="Delete" bgColor="lightgrey" color="black" onPress={() => deleteRecord()} />
                    }
                </View>
            </ScrollView>
        </View>
    );
}

export default RequestNewScreen

const styles = StyleSheet.create({

})
