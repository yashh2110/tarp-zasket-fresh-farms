import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, StyleSheet, View, Text, SafeAreaView, Dimensions, Image, Linking } from 'react-native';
import { Icon } from 'native-base'
import Modal from 'react-native-modal';
import Theme from "../../styles/Theme";
import { ScrollView } from "react-native-gesture-handler";
import { connect } from 'react-redux';
import { ActivityIndicator } from "react-native";
import CustomHeader from "../common/CustomHeader";
import call from 'react-native-phone-call';

const SupportScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const initialFunction = async () => {

        }

        initialFunction()
    }, [])

    const callToThisNumber = () => {
        //handler to make a call
        const args = {
            number: "6300105949",
            prompt: false,
        };
        call(args).catch(console.error);
    };
    const onPressWhatsapp = () => {
        Linking.canOpenURL("https://wa.me/message/7QWKVJGNQ4VJD1").then(supported => {
            if (supported) {
                Linking.openURL("https://wa.me/message/7QWKVJGNQ4VJD1");
            } else {
                console.warn("Don't know how to open URI");
            }
        });
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <CustomHeader navigation={navigation} title={"Support"} showSearch={false} />
            <ScrollView style={{ flex: 1, backgroundColor: '#F8F8F8' }} showsVerticalScrollIndicator={false}>
                <View style={{ backgroundColor: 'white', padding: 15, marginTop: 10 }}>
                    <Text style={{}}>We are Available to assist you from 10AM - 7PM on all days</Text>
                    <TouchableOpacity onPress={() => onPressWhatsapp()} style={{ borderWidth: 1, borderColor: "#EFEFEF", borderRadius: 6, padding: 10, flexDirection: 'row', marginTop: 15 }}>
                        <View style={{ backgroundColor: '#FDEFEF', borderRadius: 50, width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name="whatsapp" type="FontAwesome" style={{ fontSize: 24, color: Theme.Colors.primary }} />
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', paddingLeft: 15 }}>
                            <Text style={{ color: '#727272' }}>Whatsapp</Text>
                            {/* <Text style={{ fontWeight: 'bold' }}>6300105949</Text> */}
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => callToThisNumber()} style={{ borderWidth: 1, borderColor: "#EFEFEF", borderRadius: 6, padding: 10, flexDirection: 'row', marginTop: 15 }}>
                        <View style={{ backgroundColor: '#FDEFEF', borderRadius: 50, width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                style={{ width: 20, height: 20, }}
                                resizeMode="contain"
                                source={require('../../assets/png/SupportScreenPhone.png')}
                            />
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', paddingLeft: 15 }}>
                            <Text style={{ color: '#727272' }}>Call Us</Text>
                            <Text style={{ fontWeight: 'bold' }}>6300105949</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{ borderWidth: 1, borderColor: "#EFEFEF", borderRadius: 6, padding: 10, flexDirection: 'row', marginTop: 15 }}>
                        <View style={{ backgroundColor: '#FDEFEF', borderRadius: 50, width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                style={{ width: 20, height: 20, }}
                                resizeMode="contain"
                                source={require('../../assets/png/SupportScreenMessage.png')}
                            />
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', paddingLeft: 15 }}>
                            <Text style={{ color: '#727272' }}>Email Us</Text>
                            <Text style={{ fontWeight: 'bold' }}>service@zasket.in</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({

});

const mapStateToProps = (state) => ({

})


export default connect(mapStateToProps, {})(SupportScreen)