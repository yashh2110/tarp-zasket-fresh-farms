
import LottieView from 'lottie-react-native';
import { Button, Icon, Input, Item, Label, Text } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { Alert, BackHandler, Image, ImageBackground, Keyboard, Platform, ScrollView, StyleSheet, TextInput, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { ActivityIndicator } from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { requestOtp } from '../../actions/auth';
import { setDarkMode } from "../../actions/dark";
import AnimateLoadingButton from '../../lib/ButtonAnimated';
import alert from '../../reducers/alert';
import Theme from "../../styles/Theme";
import { Validation } from "../../utils/validate";
import DarkModeToggle from '../common/DarkModeToggle';


const Login = ({ navigation, darkMode, requestOtp }) => {

    const [mobileNumber, setMobileNumber] = useState("")
    const [loading, setLoading] = useState(false)
    const onSubmit = async () => {
        setLoading(true)
        let number = mobileNumber
        var filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
        if (filter.test(number)) {
            if (number.length == 10) {
                var validate = true;
            } else {
                setLoading(false)
                Alert.alert('Please put 10  digit mobile number');
                var validate = false;
            }
        }
        else {
            Alert.alert('Enter a valid mobile number');
            setLoading(false)
            var validate = false;
        }
        if (validate) {
            try {
                let number = "+91" + mobileNumber
                await requestOtp(number, (response, status) => {
                    if (status) {
                        navigation.navigate('OtpScreen', { mobileNumber: number })
                        setLoading(false)
                    } else {
                        setLoading(false)
                    }
                })
            } catch {
                setLoading(false)
            }
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[styles.container, (darkMode) ? styles.darkBackGroundColor : null]}>
                <ScrollView
                    contentContainerStyle={{ width: "90%", alignSelf: "center", flex: 1, }}
                    keyboardShouldPersistTaps="always"
                    showsVerticalScrollIndicator={false}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 10, width: 40, height: 40, justifyContent: 'center', }}>
                        <Image
                            style={{ width: 20, height: 20, }}
                            resizeMode="contain"
                            source={require('../../assets/png/backIcon.png')}
                        />
                    </TouchableOpacity>
                    <Text style={{ marginTop: "4%", fontSize: 20, fontWeight: Platform.OS == "ios" ? "500" : "700", letterSpacing: .5 }}>Enter Mobile Number</Text>
                    <Text style={{ marginTop: "2%", fontSize: 14, color: "#727272" }}>Login or sign up to get started</Text>
                    <View style={{ flex: 1, marginTop: "15%" }}>
                        <Text style={{ fontSize: 14, color: "#727272" }}>Phone Number</Text>
                        <View style={{ borderBottomColor: Theme.Colors.primary, flexDirection: 'row', borderBottomWidth: 1 }}>
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>+91</Text>
                            </View>
                            <View style={{ backgroundColor: "grey", width: 0.5, margin: 13 }} />
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    style={{ height: 40, fontWeight: 'bold' }}
                                    onChangeText={text => setMobileNumber(text)}
                                    value={mobileNumber}
                                    maxLength={10}
                                    keyboardType={"number-pad"}
                                />
                            </View>
                        </View>
                        {loading ?
                            <ActivityIndicator style={{ marginTop: "20%", }} color={Theme.Colors.primary} size="large" />
                            :
                            <Button full style={{ marginTop: "20%", backgroundColor: Theme.Colors.primary, borderRadius: 25, marginHorizontal: 20, }} onPress={() => onSubmit()}><Text>Continue</Text></Button>
                        }
                    </View>
                    <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Image
                            style={{ height: 300, width: 400, }}
                            resizeMode="contain"
                            source={require('../../assets/jpg/loginImage.jpg')}
                        />
                    </View>
                </ScrollView>
            </View>
        </TouchableWithoutFeedback >
    );
}

const mapStateToProps = (state) => ({
    darkMode: state.dark,
    isAuthenticated: state.auth.isAuthenticated
})


export default connect(mapStateToProps, { setDarkMode, requestOtp })(Login)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

});
