import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Keyboard, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import CustomDropdownList from '../components/CustomDropdownList';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import Loader from '../components/Loader';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors, { IEvent, dBTable, eventTypes } from '../utility/MasterTypes';
import InternetConnectivityCheck from '../components/InternetConnectivityCheck';

const NoticeNewScreen = ({ navigation, route }) => {
    //const [selectedId, setSelectedId] = useState(1);
    const item = route.params?.item;
    const loggedInUser = route.params?.user;
    const [documentId, setDocumentId] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [datePickerToggle, setDatePickerToggle] = useState(false);
    const [dateTimePickerMode, setDateTimePickerMode] = useState("date");
    const [selectedEventDate, setSelectedEventDate] = useState(new Date());
    const [selectedEventDateText, setSelectedEventDateText] = useState("");
    const [selectedEventTimeText, setSelectedEventTimeText] = useState("");
    const [villagesByTaluka, setVillagesByTaluka] = useState([]);
    const [timePickerToggle, setTimePickerToggle] = useState(false);
    const [uiDetails, setUIDetails] = useState({
        dbTable: "events", redirectComponent: 'NoticeScreen'
    });
    const [inputs, setInputs] = useState<IEvent>({
        name: '',
        description: '',
        eventType: 'Meeting',
        eventTypeId: 1,
        deleted: false,
        location: 'Satara',
        eventDate: '',
        eventTime: '',
        createdOn: new Date().toString(),
        createdBy: 'Admin',
        updatedOn: '',
        updatedBy: '',
    });

    //console.log('data', inputs);

    useEffect(() => {
        if (item) {
            setInputs(item);
            handleEventDate(item.eventDate);
            //handleDDLChange("taluka", { id: item.talukaId, name: item.taluka });
            setDocumentId(item.id);
        } else {
            setLoading(false);
        }
    }, []);

    const validate = () => {
        Keyboard.dismiss();
        //console.log('validation..', inputs);
        let valid = true;

        if (!inputs.description) {
            handleError('description', 'Please enter description');
            valid = false;
        }
        if (!inputs.eventDate) {
            handleError('eventDate', 'Please enter event date');
            valid = false;
        }
        if (!inputs.location) {
            handleError('location', 'Please enter event location');
            valid = false;
        }

        //console.log('saving event..valid', valid);
        if (valid) {
            //console.log('saving event..documentId', documentId);
            if (documentId) update(); else save();
        }
    }

    const save = () => {
        setLoading(true);
        //console.log('saving event..');
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
                Alert.alert("Error", "Event Save - Something went wrong.");
                console.log(error);
            } finally {
                navigation.navigate(uiDetails.redirectComponent, { filter: null, user: loggedInUser });
            }
        }, 3000)
    };

    const update = async () => {
        //console.log('updating event..');
        try {
            inputs.updatedBy = '';
            inputs.updatedOn = new Date().toString();
            await firestore().collection(dBTable(uiDetails.dbTable)).doc(documentId).set(inputs);
        } catch (error) {
            Alert.alert("Error", "Event Update - Something went wrong.");
        } finally {
            navigation.navigate(uiDetails.redirectComponent, { filter: null, user: loggedInUser });
        }

    };

    const deleteEvent = async () => {
        setLoading(true);
        console.log('deleting..', documentId);
        console.log('deleting..', inputs);
        try {
            inputs.deleted = true;
            console.log('deleting..2');
            await firestore().collection(dBTable(uiDetails.dbTable)).doc(documentId).set(inputs);
            console.log('deleting..3');
        } catch (error) {
            //console.log('deleting.. Error', error);
            Alert.alert("Error", "Event Update - Something went wrong.");
        } finally {
            navigation.navigate('Events', { filter: null, user: loggedInUser });
        }
    };

    const handleInputChange = (field: string, item: any) => {
        //console.log('field item:', field, item);
        setInputs(prevState => ({ ...prevState, [field]: item }));
    }

    const handleDDLChange = (field: string, changedItem: any) => {
        let fieldId = field + 'Id';
        setInputs(prevState => ({ ...prevState, [field]: changedItem.name }));
        setInputs(prevState => ({ ...prevState, [fieldId]: changedItem.id }));
    }

    const handleEventDateChange = ((event, dateSelected) => {
        const eventDate = dateSelected || selectedEventDate;
        setInputs(prevState => ({ ...prevState, ["eventDate"]: eventDate }));
        //console.log('innputs', inputs.eventDate);
        setSelectedEventDate(eventDate);
        let eventDateText = eventDate.getDate() + '-' + (eventDate.getMonth() + 1) + '-' + eventDate.getFullYear();
        let eventTimeText = eventDate.getHours() + ':' + eventDate.getMinutes();
        setSelectedEventDateText(eventDateText);
        setSelectedEventTimeText(eventTimeText);
    });

    const handleEventDate = ((dateSelected: any) => {
        if (!dateSelected) return;
        //console.log('eventDateSelected', dateSelected);
        let eventDateText = dateSelected.toDate().getDate() + '-' + (dateSelected.toDate().getMonth() + 1) + '-' + dateSelected.toDate().getFullYear();
        setSelectedEventDateText(eventDateText);
        let eventTimeText = dateSelected.toDate().getHours() + ':' + dateSelected.toDate().getMinutes();
        setSelectedEventTimeText(eventTimeText);
    });

    const handleError = (field: string, errorMessage: string) => {
        setErrors(prevState => ({ ...prevState, [field]: errorMessage }))
    }

    return (
        <View style={{ backgroundColor: Colors.white, flex: 1 }}>
            <Loader visible={loading} />
            <InternetConnectivityCheck />
            <ScrollView contentContainerStyle={{ paddingTop: 50, paddingHorizontal: 20 }}>
                <Text style={{ color: Colors.black, fontSize: 40, fontWeight: 'bold' }}>Event</Text>
                <Text style={{ color: Colors.grey, fontSize: 18, marginVertical: 10 }}>Enter event details.</Text>
                <View style={{ marginVertical: 20 }}>

                    <CustomDropdownList
                        data={eventTypes}
                        label="Event Type"
                        error={errors.eventType}
                        selectedId={inputs.eventTypeId}
                        onChange={item => {
                            handleDDLChange('eventType', item)
                        }}
                    />
                    <CustomTextInput
                        label="Description"
                        data={inputs.description}
                        iconName="description"
                        error={errors.description}
                        maxLength={250}
                        multiline={true}
                        multilines={3}
                        placeholder="Enter description"
                        onFocus={() => { handleError('description', null) }}
                        onChangeText={text => handleInputChange('description', text)}
                    />
                    <CustomTextInput
                        label="Place"
                        data={inputs.location}
                        iconName="location-on"
                        error={errors.location}
                        placeholder="Enter location"
                        onFocus={() => { handleError('location', null) }}
                        onChangeText={text => handleInputChange('location', text)}
                    />
                    <CustomTextInput
                        label="Date"
                        data={selectedEventDateText}
                        iconName="calendar-today"
                        error={errors.eventDate}
                        placeholder="Enter Event Date dd/mm/yy"
                        onFocus={() => { handleError('eventDate', null); setDateTimePickerMode("date"); setDatePickerToggle(true); }}
                    //onChangeText={text => handleInputChange('eventDate', text)}
                    />{datePickerToggle && <View><DateTimePicker
                        value={selectedEventDate}
                        mode={dateTimePickerMode}
                        display="default"
                        onChange={(event, data) => {
                            setDatePickerToggle(false);
                            handleEventDateChange(event, data);
                        }}

                    /></View>}

                    <CustomTextInput
                        label="Time"
                        data={selectedEventTimeText}
                        iconName="access-time"
                        error={errors.eventDate}
                        placeholder="Enter Event Time hh:mm"
                        onFocus={() => { handleError('eventDate', null); setDateTimePickerMode("time"); setDatePickerToggle(true); }}
                    //onChangeText={text => handleInputChange('eventDate', text)}
                    />
                    {loggedInUser.accessLevel > 1 && <CustomButton title="Save" onPress={() => validate()} />}
                    {documentId && loggedInUser.accessLevel > 2 && <CustomButton title="Delete" bgColor="lightgrey" color="black" onPress={() => deleteEvent()} />}
                </View>
            </ScrollView>
        </View>
    );
}

export default NoticeNewScreen

const styles = StyleSheet.create({

})
