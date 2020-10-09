import React from 'react';
import { Alert, Platform, StyleSheet, Image, SafeAreaView, Modal, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import MapView, { Marker, Callout, ProviderPropType } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import marker from '../assets/png/locationIcon.png';
import { Icon, Button, Text } from 'native-base';
import { MapApiKey } from "../../env"
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Theme from '../styles/Theme';
import AutoCompleteLocation from '../components/locationScreens/AutoCompleteInput'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const LATITUDE_DELTA = 0.005
const LONGITUDE_DELTA = 0.005

const initialRegion = {
    latitude: -37.78825,
    longitude: -122.4324,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
}

class MyMapView extends React.Component {

    map = null;

    state = {
        region: {
            latitude: null,
            longitude: null,
            latitudeDelta: LONGITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        },
        ready: true,
        filteredMarkers: [],
        address: null,
        latitude: null,
        longitude: null,
        houseNumber: "",
        landMark: "",
        saveAs: "",
        addressLoading: false,
        modalVisible: false
    };

    setRegion(region) {
        if (this.state.ready) {
            setTimeout(() => this.map.animateToRegion(region), 10);
        }
        //this.setState({ region });
    }

    componentDidMount() {
        this.getCurrentPosition();
    }

    getCurrentPosition() {
        try {
            Geolocation.getCurrentPosition(
                async (position) => {
                    // alert(JSON.stringify(position, null, "      "))
                    const region = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    };
                    await this.setRegion(region);

                    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + position.coords.latitude + ',' + position.coords.longitude + '&key=' + MapApiKey)
                        .then((response) => {
                            response.json().then(async (json) => {
                                await this.setLocation(json.results[0].formatted_address, position.coords.latitude, position.coords.longitude)
                            });
                        }).catch((err) => {
                            console.warn(err)
                        })
                },
                (error) => {
                    //TODO: better design
                    switch (error.code) {
                        case 1:
                            if (Platform.OS === "ios") {
                                Alert.alert("", "Para ubicar tu locación habilita permiso para la aplicación en Ajustes - Privacidad - Localización");
                            } else {
                                Alert.alert("", "Para ubicar tu locación habilita permiso para la aplicación en Ajustes - Apps - ExampleApp - Localización");
                            }
                            break;
                        default:
                            Alert.alert("", "Error al detectar tu locación");
                    }
                }
            );
        } catch (e) {
            alert(e.message || "");
        }
    };

    getCurrentLocation = async () => {
        await this.setState({ addressLoading: true })
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.state.region.latitude + ',' + this.state.region.longitude + '&key=' + MapApiKey)
            .then(async (response) => {
                response.json().then(async (json) => {
                    // console.warn(json)
                    // alert(JSON.stringify(json, null, "      "))
                    await this.setLocation(json.results[0].formatted_address, this.state.region.latitude, this.state.region.longitude)
                    await this.setState({ addressLoading: false })
                });
            }).catch(async (err) => {
                console.warn(err)
                await this.setState({ addressLoading: false })
            })
    }
    setLocation = async (address, latitude, longitude) => {
        this.setState({
            address: address,
            latitude: latitude,
            longitude: longitude
        })
        await AsyncStorage.setItem("location", JSON.stringify({
            address: address,
            latitude: latitude,
            longitude: longitude
        }));
    }

    onMapReady = (e) => {
        if (!this.state.ready) {
            this.setState({ ready: true });
        }
    };

    onRegionChange = async (region) => {
        // await this.setState({
        //     region
        // })
    };

    onRegionChangeComplete = async (region) => {
        await this.setState({
            region
        })
        await this.getCurrentLocation()
    };

    onSubmit = async () => {
    }

    render() {

        const { region } = this.state;
        const { children, renderMarker, markers, navigation } = this.props;

        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAvoidingView style={{ flex: 1, backgroundColor: 'white' }} behavior={Platform.OS == "ios" ? "padding" : null}>
                    <View style={styles.map}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 40, height: 40, justifyContent: 'center', position: "absolute", zIndex: 1, left: 10, top: 10 }}>
                            <Image
                                style={{ width: 20, height: 20, }}
                                resizeMode="contain"
                                source={require('../assets/png/backIcon.png')}
                            />
                        </TouchableOpacity>
                        <MapView
                            showsUserLocation
                            ref={map => { this.map = map }}
                            data={markers}
                            initialRegion={initialRegion}
                            onMapReady={this.onMapReady}
                            showsMyLocationButton={true}
                            onRegionChange={this.onRegionChange}
                            onRegionChangeComplete={this.onRegionChangeComplete}
                            style={StyleSheet.absoluteFill}
                            textStyle={{ color: '#bc8b00' }}
                            containerStyle={{ backgroundColor: 'white', borderColor: '#BC8B00' }}>
                            {children && children || null}
                        </MapView>
                        <View style={styles.markerFixed}>
                            {/* <Image style={styles.marker} source={marker} /> */}
                            <LottieView
                                style={styles.marker}
                                source={require("../assets/animations/favoriteDoctorHeart.json")}
                                autoPlay
                            />
                        </View>
                        <TouchableOpacity onPress={() => this.getCurrentPosition()} style={styles.getcurrentlocation} activeOpacity={0.6}>
                            <Icon name='gps-fixed' type="MaterialIcons" style={{ color: '#979197', fontSize: 20 }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: "100%", height: 3, overflow: "hidden" }}>
                        {this.state.addressLoading ?
                            <LottieView
                                style={{ width: "100%", }}
                                source={require("../assets/animations/lineLoading.json")}
                                autoPlay
                            />
                            :
                            null
                        }
                    </View>
                    <ScrollView style={{ flex: 1, width: "90%", alignSelf: 'center' }} showsVerticalScrollIndicator={false}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={{ color: "#727272", fontSize: 13 }}>Your current location</Text>
                            </View>
                            <TouchableOpacity activeOpacity={0.7} onPress={() => { this.setState({ modalVisible: true }) }} style={{ padding: 5 }}>
                                <Text style={{ color: "#73C92D" }}>Change</Text>
                            </TouchableOpacity>
                        </View>
                        {this.state.addressLoading ?
                            <View style={{ flexDirection: "row" }}>
                                <Image
                                    style={{ width: 30, height: 30, marginLeft: -5 }}
                                    source={require('../assets/png/locationIcon.png')}
                                />
                                <Text style={{ fontWeight: "bold" }}>Locating...</Text>
                            </View>
                            :
                            <View style={{ flexDirection: "row" }}>
                                <Image
                                    style={{ width: 30, height: 30, marginLeft: -5 }}
                                    source={require('../assets/png/locationIcon.png')}
                                />
                                <Text>{this.state.address}</Text>
                            </View>
                        }
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ color: "#727272", fontSize: 14 }}>House No/ Flat No/Floor/Building</Text>
                            <TextInput
                                style={{ height: 40, borderColor: '#D8D8D8', borderBottomWidth: 1 }}
                                onChangeText={text => this.setState({
                                    houseNumber: text
                                })}
                                value={this.state.houseNumber}
                            />
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ color: "#727272", fontSize: 14 }}>Landmark</Text>
                            <TextInput
                                style={{ height: 40, borderColor: '#D8D8D8', borderBottomWidth: 1 }}
                                onChangeText={text => this.setState({
                                    houseNumber: text
                                })}
                                value={this.state.houseNumber}
                            />
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ color: "#727272", fontSize: 14 }}>Save as</Text>
                            <TextInput
                                style={{ height: 40, borderColor: '#D8D8D8', borderBottomWidth: 1 }}
                                onChangeText={text => this.setState({
                                    houseNumber: text
                                })}
                                value={this.state.houseNumber}
                            />
                        </View>
                        <Button full style={{ marginTop: 20, backgroundColor: Theme.Colors.primary, borderRadius: 25, marginHorizontal: 20, }} onPress={() => this.onSubmit()}><Text>Save & continue</Text></Button>
                    </ScrollView>
                    {/* <SafeAreaView style={styles.footer}>
                        <Text style={styles.region}>{JSON.stringify(region, null, 2)}</Text>
                    </SafeAreaView> */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            this.setState({ modalVisible: false })
                        }}>
                        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                            <GooglePlacesAutocomplete
                                placeholder='Search'
                                onPress={(data, details = null) => {
                                    // 'details' is provided when fetchDetails = true
                                    alert(true)
                                    console.warn(data, details);
                                }}
                                fetchDetails={true}
                                query={{
                                    key: MapApiKey,
                                    language: 'en',
                                }}
                                styles={{
                                    height: 500
                                }}
                            />
                        </SafeAreaView>
                    </Modal>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        );
    }
}

export default MyMapView;

const styles = StyleSheet.create({
    map: {
        height: "40%"
    },
    // markerFixed: {
    //     left: '50%',
    //     marginLeft: -24,
    //     marginTop: -35,
    //     position: 'absolute',
    //     top: '50%',
    // },
    markerFixed: {
        left: '50%',
        marginLeft: -49,
        marginTop: -50,
        position: 'absolute',
        top: '50%',
    },
    // marker: {
    //     height: 48,
    //     width: 48
    // },
    marker: {
        height: 100,
        width: 100
    },
    footer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        bottom: 0,
        position: 'absolute',
        width: '100%'
    },
    region: {
        color: '#fff',
        lineHeight: 20,
        margin: 20
    },
    getcurrentlocation: {
        backgroundColor: "white",
        flexDirection: 'row',
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
        position: 'absolute',
        bottom: 10,
        right: 10
    }
})