import { View, Text, StyleSheet, Keyboard, Alert, TouchableOpacity, Image, PermissionsAndroid, ScrollView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
//import { ScrollView } from 'react-native-gesture-handler';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import Loader from '../components/Loader';
import CustomDropdownList from '../components/CustomDropdownList';
import firestore from '@react-native-firebase/firestore';
import { educations, IMember, memberPublicTypes, memberType, relations, works } from '../utility/MemberTypes';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButtonSwitch from '../components/CustomButtonSwitch';
import { AuthContext } from './AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { dBTable, talukas, villages } from '../utility/MasterTypes';
import InternetConnectivityCheck from '../components/InternetConnectivityCheck';

export const ProfileIcon = () => {
    return (
        <TouchableOpacity
            style={{
                position: 'absolute',
                right: 5,
                top: 5,
                flex: 1,
                zIndex: 1,
                backgroundColor: 'white',
                borderRadius: 50,
            }}
        />
    );
};

export const TableRow = ({ item }) => {
    return (
        <View style={styles.tableRow}>
            <View style={styles.tableRowLeft}>
                <Text style={styles.tableRowLeftText}>{item.key}</Text>
            </View>
            <View style={styles.tableRowRight}>
                <Text style={styles.tableRowRightText}>{item.value}</Text>
            </View>
        </View>
    );
};

const ProfileScreen = ({ navigation, route }) => {
    const item = route.params?.item;
    //const loggedInUser = route.params?.user;
    const [loggedInUser, setLoggedInUser] = useState({});
    const { logout } = useContext(AuthContext);
    const [documentId, setDocumentId] = useState('');
    const [villagesByTaluka, setVillagesByTaluka] = useState([]);
    const [inputs, setInputs] = useState<IMember>({
        phone: '',
        password: '1234',
        name: '',
        taluka: loggedInUser ? loggedInUser.taluka : 'Satara',
        talukaId: loggedInUser ? loggedInUser.talukaId : 1,
        village: loggedInUser ? loggedInUser.village : 'Satara',
        villageId: loggedInUser ? loggedInUser.villageId : 1,
        district: 'Satara',
        districtId: 1,
        address: '',
        pin: '',
        dob: '',
        work: 'Other',
        workId: 99,
        education: 'Other',
        educationId: 99,
        memberType: 'Member',
        memberTypeId: 8,
        relation: 'Self',
        relationId: 1,
        familyMembers: 1,
        familyHeadPhone: '',
        familyHeadName: '',
        certificateIssued: false,
        deleted: false,
        isDirector: false,
        accessLevel: 1,
        //fees: [],
        //requests: [],
        //invitations: [],
        //donations: [],
    });
    //console.log("onrefresh: ", loggedInUser.accessLevel);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [dobToggle, setDOBToggle] = useState(false);
    const [itemEditable, setItemEditable] = useState(false);
    const [selectedDOB, setSelectedDOB] = useState(new Date());
    const [selectedDOBText, setSelectedDOBText] = useState("");
    const [uiDetails, setUIDetails] = useState({
        dbTable: "members", redirectComponent: 'Members'
    });

    useEffect(() => {
        //console.log('UseEffect ..');
        console.log('Intro 1: getLoggedInUser');
        getLoggedInUser();
        const unsubscribe = navigation.addListener('focus', async () => {
            //console.log('route.params: loggedInUser.accessLevel', loggedInUser.accessLevel);
            //setMembersData([]);
            //setSearchResult([]);
            setTimeout(() => {
                //console.log('date cleared?', membersData.length);
                loadMember();
            }, 1000);
        });
        return unsubscribe;
    }, []);

    const getLoggedInUser = async () => {
        console.log('Intro 2: getLoggedInUser');
        let user = await AsyncStorage.getItem('user');
        await setLoggedInUser(JSON.parse(user));
        console.log('Intro 3: getLoggedInUser');
    };

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
        if (inputs.taluka == '') {
            handleError('taluka', 'Please select Taluka');
            valid = false;
        }
        if (inputs.village == '') {
            handleError('village', 'Please select Village');
            valid = false;
        }
        if (inputs.work == '') {
            handleError('work', 'Please select Work');
            valid = false;
        }

        if (valid) {
            if (documentId) update(); else save();
        }
    }
    const save = () => {
        setLoading(true);
        //console.log('adding..');
        setTimeout(async () => {
            setLoading(false);
            try {
                //AsyncStorage.setItem('user', JSON.stringify(inputs));
                await firestore()
                    .collection(dBTable(uiDetails.dbTable))
                    .add(inputs)
                    .then(res => {
                        //console.log(res);
                    });
            } catch (error) {
                Alert.alert("Error", "Member Save - Something went wrong.");
            } finally {
                navigation.navigate(uiDetails.redirectComponent, { filter: null, user: loggedInUser });
            }
        }, 3000)
    }
    const update = async () => {
        //console.log('updating..');
        try {
            await firestore().collection(dBTable(uiDetails.dbTable)).doc(documentId).set(inputs);
        } catch (error) {
            Alert.alert("Error", "Member Update - Something went wrong.");
        } finally {
            navigation.navigate(uiDetails.redirectComponent, { filter: null, user: loggedInUser });
        }
    };

    const loadMember = async () => {
        setLoading(true);
        console.log('loadMember > 1', loggedInUser.phone);
        await firestore()
            .collection(dBTable(uiDetails.dbTable))
            .where('phone', '==', loggedInUser.phone)
            //.doc(loggedInUser.id)
            .get()
            .then(memberSnapshot => {
                memberSnapshot.forEach(item => {
                    let data = item.data();
                    loadMemberDetails(data, memberSnapshot.id);
                    if (data.phone == loggedInUser.phone || data.familyPhone == loggedInUser.phone) {
                        setItemEditable(true);
                        console.log('User can Edit this record');
                    }
                });
                //console.log('loadMember > 1', memberSnapshot, memberSnapshot.exists);
                if (memberSnapshot.exists) {
                    let data = memberSnapshot.data();
                    loadMemberDetails(data, item.id);
                    if (data.phone == loggedInUser.phone || data.familyPhone == loggedInUser.phone) {
                        setItemEditable(true);
                        console.log('User can Edit this record');
                    }
                } else {
                    console.log("No matching member found! documentId: ", documentId);
                    setDocumentId('');
                }
                setLoading(false);
            });
    };

    const loadMemberDetails = (data, memberId, isFamilyPhone = false) => {
        if (!isFamilyPhone) {
            setInputs(data);
            if (data.dob) handleDOBSet(data.dob.toDate());
            if (data.dob) setSelectedDOB(data.dob.toDate());
            setDocumentId(memberId);
        } else {
            setInputs(prevState => ({ ...prevState, ['taluka']: data.taluka }));
            setInputs(prevState => ({ ...prevState, ['talukaId']: data.talukaId }));
            setInputs(prevState => ({ ...prevState, ['village']: data.village }));
            setInputs(prevState => ({ ...prevState, ['villageId']: data.villageId }));
            setInputs(prevState => ({ ...prevState, ['familyHeadName']: data.name }));
        }
        handleDDLChange("taluka", { id: data.talukaId, name: data.taluka });
    };

    const loadMemberByPhone = async (phone: string, familyPhone: boolean = false) => {
        setLoading(true);
        //console.log('getMember > by phone: ', phone);
        await firestore()
            .collection(dBTable(uiDetails.dbTable))
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
                                    loadMemberDetails(data, item.id, familyPhone);
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

        if ((field === 'phone' || field == 'familyHeadPhone') && item.toString().length == 10) {
            loadMemberByPhone(item, field == 'familyHeadPhone'); //name == 'Student' ? name : 'Business'
        }
    }

    const handleDDLChange = (field: string, changedItem: any) => {
        let fieldId = field + 'Id';
        setInputs(prevState => ({ ...prevState, [field]: changedItem.name }));
        setInputs(prevState => ({ ...prevState, [fieldId]: changedItem.id }));
        if (field === 'taluka') {
            let villagesByFilter = villages.filter(item => { return item.taluka == changedItem.name; });
            setVillagesByTaluka(villagesByFilter);
        }
        if (field === 'memberType') {
            clearFormFields(changedItem);
        }
        //setInputs(prevState => ({ ...prevState, [fieldId]: item.id }));
    }

    const handleError = (field: string, errorMessage: string) => {
        setErrors(prevState => ({ ...prevState, [field]: errorMessage }))
    }

    const handleDOBChange = ((event, dobSelected) => {
        const dobDate = dobSelected || selectedDOB;
        setInputs(prevState => ({ ...prevState, ["dob"]: dobDate }));
        setSelectedDOB(dobDate);
        let dobInText = dobDate.getDate() + '-' + (dobDate.getMonth() + 1) + '-' + dobDate.getFullYear();
        setSelectedDOBText(dobInText);
    });

    const handleDOBSet = ((dobSelected: string) => {
        let dobInText = dobSelected.getDate() + '-' + (dobSelected.getMonth() + 1) + '-' + dobSelected.getFullYear();
        setSelectedDOBText(dobInText);
    });

    const handleDefaultSettings = (field: string) => {
        let fieldId = field + 'Id';
        setInputs(prevState => ({ ...prevState, [field]: loggedInUser.village }));
        if (field === 'taluka') {
            let villagesByFilter = villages.filter(item => { return item.taluka == loggedInUser.taluka; });
            setVillagesByTaluka(villagesByFilter);
        }
        setInputs(prevState => ({ ...prevState, [fieldId]: loggedInUser.villageId }));
    }

    const clearFormFields = (member: any) => {
        setInputs({
            phone: '',
            password: '1234',
            name: '',
            taluka: loggedInUser ? loggedInUser.taluka : 'Satara',
            talukaId: loggedInUser ? loggedInUser.talukaId : 1,
            village: loggedInUser ? loggedInUser.village : 'Satara',
            villageId: loggedInUser ? loggedInUser.villageId : 1,
            district: 'Satara',
            districtId: 1,
            address: '',
            pin: '',
            dob: '',
            work: 'Other',
            workId: 99,
            education: 'Other',
            educationId: 99,
            memberType: 'Member',
            memberTypeId: 8,
            relation: 'Self',
            relationId: 1,
            familyMembers: 1,
            familyHeadPhone: '',
            familyHeadName: '',
            certificateIssued: false,
            deleted: false,
            isDirector: false,
            accessLevel: 1,
        });
        setSelectedDOBText('');
    };

    const [cameraPhoto, setCameraPhoto] = useState();
    const opencamera = async () => {
        //console.log('camera 1');
        const permission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA
        );
        //console.log('camera 2');
        if (permission == PermissionsAndroid.RESULTS.GRANTED) {
            //console.log('camera 3');
            const result = await launchCamera({ saveToPhotos: true, mediaType: 'photo' });
            if (result.assets[0] && result.assets[0].uri)
                setCameraPhoto(result.assets[0].uri);

        }
    };

    const [galleryPhoto, setGalleryPhoto] = useState();
    const opengallery = async () => {
        const result = await launchImageLibrary({ mediaType: 'mixed' });
        if (result.assets[0] && result.assets[0].uri) setGalleryPhoto(result.assets[0].uri);
    };

    return (
        <View style={styles.container}>
            <InternetConnectivityCheck />
            <Loader visible={loading} />
            <TouchableOpacity
                onPress={() => { logout(); }}
                style={{
                    position: 'absolute',
                    right: 5,
                    top: 5,
                    flex: 1,
                    zIndex: 1,
                }}>
                <Icon name="logout" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
                //onPress={updateMember}
                style={{
                    position: 'absolute',
                    left: 5,
                    top: 5,
                    flex: 1,
                    zIndex: 1,
                }}>
                <Icon name="save" size={30} color="white" />
            </TouchableOpacity>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => opencamera()}>
                    {!cameraPhoto && <Image
                        source={require('../utility/images/members/profile.jpg') || { uri: cameraPhoto || galleryPhoto }}
                        style={styles.photo}
                    />}
                    <Image
                        source={{ uri: cameraPhoto || galleryPhoto }}
                        style={styles.photo}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.footer}>
                <InternetConnectivityCheck />
                <ScrollView contentContainerStyle={{ paddingTop: 10, paddingHorizontal: 20 }}>
                    <View style={{ marginVertical: 20 }}>
                        <CustomDropdownList
                            data={memberPublicTypes}
                            label="Member Type"
                            error={errors.memberType}
                            selectedId={inputs.memberTypeId || 8}
                            onChange={item => {
                                handleDDLChange('memberType', item)
                            }}
                        />
                        {inputs.memberType == 'Family' && <View>
                            <CustomTextInput
                                label="Family Phone"
                                data={inputs.familyHeadPhone}
                                iconName="phone"
                                error={errors.familyHeadPhone}
                                placeholder="Enter family phone"
                                keyboardType='numeric'
                                onFocus={() => { handleError('familyHeadPhone', null) }}
                                onChangeText={text => handleInputChange('familyHeadPhone', text)}
                            />
                            <CustomDropdownList
                                data={relations}
                                label="Relation"
                                error={errors.relation}
                                selectedId={inputs.relationId || 1}
                                onChange={item => {
                                    handleDDLChange('relation', item)
                                }}
                            />
                        </View>}
                        <CustomTextInput
                            label="Member Phone"
                            data={inputs.phone}
                            iconName="phone"
                            error={errors.phone}
                            placeholder="Enter members phone"
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
                        <CustomDropdownList
                            data={educations}
                            label="Education"
                            error={errors.education}
                            selectedId={inputs.educationId || 1}
                            onChange={(item: any) => {
                                handleDDLChange('education', item);
                                //handleDDLChange('work', item);
                            }}
                        />
                        {inputs.education != 'Student' && <View>
                            <CustomDropdownList
                                data={works}
                                label="Work"
                                error={errors.work}
                                selectedId={inputs.workId || 1}
                                onChange={item => {
                                    handleDDLChange('work', item)
                                }}
                            />
                        </View>
                        }
                        <CustomTextInput
                            label="Date of Birth"
                            data={selectedDOBText}
                            iconName="calendar-today"
                            error={errors.dob}
                            placeholder="dd/mm/yyyy"
                            onFocus={() => { handleError('dob', null); setDOBToggle(true); }}
                        />{dobToggle && <View><DateTimePicker
                            value={selectedDOB}
                            mode="date"
                            display="default"
                            onChange={(event, data) => {
                                setDOBToggle(false);
                                handleDOBChange(event, data);
                            }}

                        /></View>}
                        {loggedInUser.accessLevel > 3 &&
                            <CustomButtonSwitch
                                label="Is Director"
                                data={inputs.isDirector == true ? 1 : 0}
                                iconName="approval"
                                error={errors.isDirector}
                                onChange={(value: boolean) => { handleInputChange('isDirector', value) }}
                            />
                        }
                        {loggedInUser.accessLevel > 3 &&
                            <CustomButtonSwitch
                                label="Is Founder Member"
                                data={inputs.isFounder == true ? 1 : 0}
                                iconName="approval"
                                error={errors.isFounder}
                                onChange={(value: boolean) => { handleInputChange('isFounder', value) }}
                            />
                        }
                        {(itemEditable || loggedInUser.accessLevel > 1) && <CustomButton title="Save" onPress={() => validate()} />}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    tableRow: { flexDirection: 'row', marginBottom: 5 },
    tableRowLeft: { flex: 2 },
    tableRowLeftText: { fontSize: 18, fontWeight: 'bold' },
    tableRowRight: { flex: 4 },
    tableRowRightText: { fontSize: 18 },
    container: {
        flex: 1,
        backgroundColor: '#009387',
    },
    header: {
        flex: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        top: 75,
    },
    footer: {
        flex: 4,
        backgroundColor: '#fff',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    button: {
        marginTop: 10,
        alignItems: 'center',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 5,
        height: 35,
        paddingTop: 5,
    },
    buttonRegister: {
        marginVertical: 10,
        alignItems: 'center',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 3,
        height: 35,
        paddingTop: 5,
    },
    photo: {
        width: 150,
        height: 150,
        borderRadius: 90,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingBottom: 10,
    },
    text: {
        fontSize: 12,
        fontWeight: 'bold',
        paddingBottom: 10,
    },
    textHeader: { color: '#fff', fontSize: 30, fontWeight: 'bold' },
    textFooter: { fontSize: 20 },
    textInfo: {
        fontSize: 20,
        fontStyle: 'italic',
        paddingVertical: 10,
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
    },
    textInput: {
        flex: 1,
        marginTop: 0,
        paddingLeft: 10,
        fontSize: 18,
        color: '#05375a',
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    textInvalid: { color: 'red', fontSize: 12 },
});
