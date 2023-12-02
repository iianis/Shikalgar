import { StyleSheet, View, Keyboard, Alert, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomTextInput from '../components/CustomTextInput'
import CustomButton from '../components/CustomButton'
import Loader from '../components/Loader'
import firestore from '@react-native-firebase/firestore';
import { dBTables, dBTable } from '../utility/MasterTypes'
import { IMember } from '../utility/MemberTypes'

const RegisterScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [inputs, setInputs] = useState<IMember>({
    phone: '',
    password: '',
    confirmPassword: '',
    name: '',
    taluka: 'Satara',
    talukaId: 1,
    village: 'Satara',
    villageId: 1,
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
  const [uiDetails, setUIDetails] = useState({
    dbTable: "members", redirectComponent: 'Members'
  });

  const validate = () => {
    Keyboard.dismiss();
    //console.log('validation..', inputs);
    let valid = true;

    if (!inputs.phone || inputs.phone.length != 10) {
      handleError('phone', 'Please enter 10 digit phone number');
      valid = false;
    }

    if (!inputs.password || inputs.password.length < 4) {
      handleError('password', 'Please enter valid password. Minimum length 4');
      valid = false;
    }

    if (!inputs.confirmPassword || (inputs.password != inputs.confirmPassword)) {
      handleError('confirmPassword', 'Please enter a matching password');
      valid = false;
    }
    if (!inputs.name) {
      handleError('name', 'Please enter Name');
      valid = false;
    }
    //console.log("validating login token");
    if (valid) save(); //register
  }

  const save = () => {
    setLoading(true);
    //console.log('adding..');
    setTimeout(async () => {
      setLoading(false);
      try {
        //AsyncStorage.setItem('user', JSON.stringify(inputs));
        await firestore()
          .collection(dBTables(uiDetails.dbTable))
          .add(inputs)
          .then(res => {
            Alert.alert("Success", "Registration was successful.");
          });
      } catch (error) {
        Alert.alert("Error", "Member Registration - Something went wrong.");
      } finally {
        navigation.navigate('Login');
      }
    }, 3000)
  }

  const loadMemberByPhone = async (phone: string) => {
    setLoading(true);
    await firestore()
      .collection(dBTable(uiDetails.dbTable))
      .where('phone', '==', phone)
      .get()
      .then(memberSnapshot => {
        memberSnapshot.forEach(item => {
          Alert.alert("Mobile number - " + phone + " is already Registered!", "Please check and use different number.",
            [
              {
                text: 'Ok', onPress: () => {
                  console.log('Try different Phone Number');
                }
              }
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
  };

  const handleError = (field: string, errorMessage: string) => {
    setErrors(prevState => ({ ...prevState, [field]: errorMessage }))
  };

  useEffect(() => {
  }, []);

  return (
    <View style={styles.container}>
      <Loader visible={loading} />
      <View style={styles.sectionMain}>
        <Image
          source={require('../utility/images/logo.jpg')}
          style={styles.logoImage}
        />
      </View>
      <View style={styles.container2}>
        <CustomTextInput
          label="Phone number"
          data={inputs.phone}
          iconName="phone"
          error={errors.phone}
          placeholder="Enter phone number"
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
          label="Password"
          data={inputs.password}
          iconName="lock"
          password
          error={errors.password}
          placeholder="Enter Password"
          onFocus={() => { handleError('password', null) }}
          onChangeText={text => handleInputChange('password', text)}
        />
        <CustomTextInput
          label="Confirm Password"
          data={inputs.confirmPassword}
          iconName="lock"
          password
          error={errors.confirmPassword}
          placeholder="Confirm Password"
          onFocus={() => { handleError('confirmPassword', null) }}
          onChangeText={text => handleInputChange('confirmPassword', text)}
        />
        <CustomButton title="Register" onPress={() => validate()} />
        <CustomButton title="Cancel" bgColor="lightgrey" color="black" onPress={() => navigation.navigate("Login")} />
      </View>
    </View>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container2: {
    marginHorizontal: 10,
  },
  sectionMain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: 'white',
  },
  logoImage: { width: 160, height: 160, borderRadius: 120, marginVertical: 20 },
});
