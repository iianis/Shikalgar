import { StyleSheet, View, Keyboard, Alert, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import CustomTextInput from '../components/CustomTextInput'
import CustomButton from '../components/CustomButton'
import { AuthContext } from './AuthContext'
import Loader from '../components/Loader'

const LoginScreen = ({ navigation, route }) => {
    const { login } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [inputs, setInputs] = useState({
        phone: '', password: ''
    })

    const validate = async () => {
        Keyboard.dismiss();
        //console.log('validation..', inputs);
        let valid = true;

        if (!inputs.phone || inputs.phone.length != 10) {
            handleError('phone', 'Please enter 10 digit phone number');
            valid = false;
        }

        if (!inputs.password || inputs.password.length < 4) {
            handleError('password', 'Please enter valid password. Minimum length of 4');
            valid = false;
        }

        if (valid) {
            let res = await login(inputs.phone, inputs.password);
            if (res === "failed") {
                Alert.alert("Login Error", "Please check your phone number and password.");
            }
        }
    }

    const handleInputChange = (field: string, item: any) => {
        setInputs(prevState => ({ ...prevState, [field]: item }));
    }

    const handleError = (field: string, errorMessage: string) => {
        setErrors(prevState => ({ ...prevState, [field]: errorMessage }))
    }

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
                    label="Password"
                    data={inputs.password}
                    iconName="lock"
                    password
                    error={errors.password}
                    placeholder="Enter Password"
                    onFocus={() => { handleError('password', null) }}
                    onChangeText={text => handleInputChange('password', text)}
                />
                <CustomButton title="Login" onPress={() => validate()} />
                <CustomButton title="Register" bgColor="lightgrey" color="black"
                    onPress={() => navigation.navigate("Register")} />
            </View>
        </View>
    )
}

export default LoginScreen

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
    logoImage: { width: 230, height: 230, borderRadius: 120, marginVertical: 20 },
});
