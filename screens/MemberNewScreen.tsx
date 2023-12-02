import { View, Text, StyleSheet, Keyboard, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import CustomTextInput from '../components/CustomTextInput'
import CustomButton from '../components/CustomButton'
import Loader from '../components/Loader'
import CustomDropdownList from '../components/CustomDropdownList'
import { talukas, villages, dBTable } from '../utility/MasterTypes'
import firestore from '@react-native-firebase/firestore';
import { educations, IMember, memberPublicTypes, relations, works } from '../utility/MemberTypes';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButtonSwitch from '../components/CustomButtonSwitch'
import InternetConnectivityCheck from '../components/InternetConnectivityCheck'

const MemberNewScreen = ({ navigation, route }) => {
    const item = route.params?.item;
    const loggedInUser = route.params?.user;
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
        isFounder: false,
        isDirector: false,
        isTalukaTeamMember: false,
        designation: "",
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
        dbTable: "members", redirectComponent: 'MembersScreen'
    });

    useEffect(() => {
        //console.log('loading selected user..', route.params);
        if (loggedInUser && loggedInUser.talukaId) handleDefaultSettings("taluka");
        if (item) {
            loadMember();
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
        await firestore()
            .collection(dBTable(uiDetails.dbTable))
            .doc(item.id)
            .get()
            .then(memberSnapshot => {
                if (memberSnapshot.exists) {
                    let data = memberSnapshot.data();
                    //console.log('loadMember > 1', loggedInUser);
                    loadMemberDetails(data, memberSnapshot.id);
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
            name: '',
            taluka: '',
            village: '',
            talukaId: 0,
            villageId: 0,
            district: 'Satara',
            districtId: 1,
            address: '',
            pin: '',
            dob: '',
            work: 'Other',
            workId: 99,
            education: 'Other',
            educationId: 99,
            memberType: member.name,
            memberTypeId: member.id,
            relation: (member.name == 'Family' ? 'Other' : 'Self'),
            relationId: (member.name == 'Family' ? 99 : 1),
            familyMembers: 1,
            familyHeadName: '',
            familyHeadPhone: '',
            certificateIssued: false,
            password: "1234",
            isDirector: false,
            isFounder: false,
            isTalukaTeamMember: false,
            accessLevel: 1,
            deleted: false
        });
        setSelectedDOBText('');
    };

    //console.log('inputs - education : ', inputs.education + "== work : " + inputs.work);
    //console.log('errors: ', errors)

    return (
        <View style={{ backgroundColor: Colors.white, flex: 1 }}>
            <Loader visible={loading} />
            <InternetConnectivityCheck />
            <ScrollView contentContainerStyle={{ paddingTop: 50, paddingHorizontal: 20 }}>
                <Text style={{ color: Colors.black, fontSize: 40, fontWeight: 'bold' }}>Member Information</Text>
                <Text style={{ color: Colors.grey, fontSize: 18, marginVertical: 10 }}>Enter details of the member.</Text>
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
                    {loggedInUser.accessLevel > 3 &&
                        <CustomButtonSwitch
                            label="Is Taluka Member"
                            data={inputs.isTalukaTeamMember == true ? 1 : 0}
                            iconName="approval"
                            error={errors.isTalukaTeamMember}
                            onChange={(value: boolean) => { handleInputChange('isTalukaTeamMember', value) }}
                        />
                    }
                    {(itemEditable || loggedInUser.accessLevel > 1) && <CustomButton title="Save" onPress={() => validate()} />}
                </View>
            </ScrollView>
        </View>
    )
}

export default MemberNewScreen

const styles = StyleSheet.create({

})
