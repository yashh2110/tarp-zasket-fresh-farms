import React, { useEffect, useContext, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Image, StyleSheet, FlatList } from 'react-native';
import Theme from '../../styles/Theme';
import { updateCartItemsApi, getBillingDetails } from '../../actions/cart'
import { connect } from 'react-redux';
import { Icon } from 'native-base';
import LottieView from 'lottie-react-native';
import FeatherIcons from "react-native-vector-icons/Feather"
import AsyncStorage from '@react-native-community/async-storage';

const CardCartScreen = ({ item, navigation, cartItems, updateCartItemsApi, isAuthenticated, getOrdersBill, getBillingDetails, getOrdersBillingDetails }) => {
    const [addButton, setAddButton] = useState(true)
    const [count, setCount] = useState(0)
    const [loadingCount, setLoadingCount] = useState(false)

    useEffect(() => {
        // alert(JSON.stringify(getOrdersBill, null, "     "))
        let filteredItems = cartItems.filter(element => element?.id == item?.id);
        if (filteredItems.length == 1) {
            setAddButton(false)
            setCount(filteredItems[0].count)
            setLoadingCount(false)
        } else {
            setAddButton(true)
            setCount(0)
            setLoadingCount(false)
        }
        if (cartItems.length > 0) {
            initialBillingFunction()
        }
    }, [cartItems])
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            initialBillingFunction()
        });
        return unsubscribe;
        // Return the function to unsubscribe from the event so it gets removed on unmount
    }, [navigation]);
    const initialBillingFunction = async () => {
        let coupons = await AsyncStorage.getItem('appliedCoupon');
        let parsedCoupon = await JSON.parse(coupons);
        let appliedCoupon = await parsedCoupon?.offer?.offerCode
        let itemCreateRequests = []
        let validateOrders = {
            // itemCreateRequests,
            "useWallet": false,
            // "offerCode": appliedCoupon ? appliedCoupon : undefined

        }
        await cartItems?.forEach((el, index) => {
            itemCreateRequests.push({
                "itemId": el?.id,
                "quantity": el?.count,
                // "totalPrice": el?.discountedPrice * el?.count,
                // "unitPrice": el?.discountedPrice
            })
        })
        // alert(JSON.stringify(validateOrders, null, "      "))
        getBillingDetails(validateOrders, async (res, status) => {
            if (status) {
                // alert(JSON.stringify(res.data, null, "      "))
            } else {

            }
        })
    }

    useEffect(() => {

    }, [getOrdersBillingDetails])

    // useEffect(() => {
    //     alert(JSON.stringify(getOrdersBillingDetails, null, "     "))


    // })

    const onAddToCart = async () => {
        if (isAuthenticated) {
            setLoadingCount(true)
            updateCartItemsApi(item?.id, 1, item?.itemName, (res, status) => {
                setAddButton(!addButton)
                setCount(1)
                // initialBillingFunction()
            })

        } else {
            navigation.navigate("AuthRoute", { screen: 'Login' })
        }
    }

    const onCartUpdate = async (option) => {
        if (option == "DECREASE") {
            if (count >= 0) {
                onUpdateCartItemApi(count - 1)
                // setCount(count - 1)
            }
            // setCount(count - 1)
        }
        if (option == "INCREASE") {
            if (count < item?.maxAllowedQuantity) {
                onUpdateCartItemApi(count + 1)
                // setCount(count + 1)
            }
        }
    }

    const onUpdateCartItemApi = (quantity) => {
        setLoadingCount(true)
        updateCartItemsApi(item?.id, quantity, item?.itemName, (res, status) => {
            // alert(JSON.stringify(res, null, "     "))
            // initialBillingFunction()
        })
    }

    const onDeleteItem = () => {
        setLoadingCount(true)
        updateCartItemsApi(item?.id, 0, item?.itemName, (res, status) => {
            // alert(JSON.stringify(res, null, "     "))
            // initialBillingFunction()
        })
    }




    return (
        <View style={{ flex: 1, width: "94%", alignSelf: 'center', marginVertical: 1.5, }}>
            {item?.valid ?
                <View
                    // onPress={() => { navigation.navigate("ProductDetailScreen", { item: item }) }}
                    style={styles.productCard}>
                    <View style={{ justifyContent: 'center' }}>
                        <View style={{
                            justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F7F7', borderWidth: 0.5, borderColor: "#EFEFEF", borderRadius: 5, height: 90
                        }} onPress={() => { }}>
                            <Image
                                style={{ height: 90, borderRadius: 5, aspectRatio: 1.3, }}
                                resizeMode="contain"
                                source={item?.itemImages?.[0]?.mediumImagePath ?
                                    { uri: item?.itemImages?.[0]?.mediumImagePath } : require('../../assets/png/default.png')}
                            />
                            {/* {item?.discountedPrice == 1 &&
                            <View style={[styles.offerButton, {}]}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, flexDirection: 'row' }}>
                                    <Icon name="brightness-percent" type="MaterialCommunityIcons" style={{ fontSize: 14, color: '#ffffff' }} />
                                    <Text style={{ color: "#ffffff", fontWeight: 'bold', fontSize: 10 }}>  OFFER </Text>
                                </View>
                            </View>
                        } */}
                        </View>
                    </View>
                    <View style={[{ padding: 5, flex: 2 }]}>
                        {/* <Text>{JSON.stringify(item?.availableQuantity, null, "         ")} </Text> */}
                        <Text numberOfLines={2} style={{ fontSize: 14, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize' }}>{item?.itemName} </Text>
                        <Text numberOfLines={2} style={{ fontSize: 12, color: '#909090', marginBottom: 10 }}>{item?.itemSubName} </Text>
                        {item?.onDemand == false && (item?.availableQuantity < 1) &&
                            <View style={[styles.outOfStockButton, {}]}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                    <Text style={{ color: "#909090", fontWeight: 'bold' }}>Out of stock </Text>
                                </View>
                            </View>
                        }

                        {item?.onDemand == false && (item?.availableQuantity < 1) ?
                            null
                            :
                            !loadingCount ?
                                addButton ?
                                    <TouchableOpacity
                                        onPress={() => onAddToCart()}
                                        style={[styles.addButton, {}]}
                                    >
                                        <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold', padding: 5, }}>+ Add </Text>
                                    </TouchableOpacity>
                                    :
                                    <View style={[styles.addButton, {}]}>
                                        <TouchableOpacity onPress={() => onCartUpdate('DECREASE')} style={{ justifyContent: 'center', alignItems: 'center', flex: 1, padding: 5, }}>
                                            <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>-</Text>
                                        </TouchableOpacity>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                            <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>{count} </Text>
                                        </View>
                                        {count < item?.maxAllowedQuantity ?
                                            <TouchableOpacity onPress={() => onCartUpdate('INCREASE')} style={{ justifyContent: 'center', alignItems: 'center', flex: 1, padding: 5, }}>
                                                <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>+</Text>
                                            </TouchableOpacity>
                                            : <TouchableOpacity onPress={() => { }} activeOpacity={1} style={{ justifyContent: 'center', alignItems: 'center', flex: 1, }}>
                                                <Text style={{ color: "#E1E1E1", fontWeight: 'bold' }}>+</Text>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                :
                                <TouchableOpacity onPress={() => { }} activeOpacity={1} style={[styles.addButton, {}]}>
                                    <LottieView
                                        style={{ height: 50, }}
                                        source={require("../../assets/json/countLoading.json")}
                                        autoPlay
                                    />
                                </TouchableOpacity>
                        }

                    </View>
                    <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', padding: 5, }}>
                        <TouchableOpacity onPress={() => onDeleteItem()} style={{ backgroundColor: 'white', position: 'absolute', top: 0, right: 10, }}>
                            <Icon name="trash-o" type="FontAwesome" style={{ fontSize: 20 }} />
                        </TouchableOpacity>
                        <View style={{}}>
                            {(((item?.actualPrice - item?.discountedPrice) / item?.actualPrice) * 100).toFixed(0) == 0 ?
                                undefined :
                                <Text style={{ fontSize: 12.5, color: "#49c32c", fontWeight: "bold" }}>You Save ₹{(((item?.actualPrice - item?.discountedPrice) * item?.count)).toFixed(0)} </Text>
                            }
                        </View>
                        <View style={{ flexDirection: "row", maxWidth: 100, flexWrap: "wrap" }}>
                            <View style={{}}>
                                {item?.discountedPrice == item?.actualPrice ?
                                    undefined :
                                    <Text style={{ fontSize: 14, color: '#909090', textDecorationLine: 'line-through', marginHorizontal: 10 }}>₹ {item?.actualPrice * item?.count} </Text>
                                }
                            </View>
                            <Text style={{ fontSize: 14, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize', alignSelf: "flex-end" }}>₹ {item?.discountedPrice * item?.count} </Text>

                        </View>
                    </View>
                </View>

                : <>
                    <View
                        style={styles.productCard}>
                        <View style={{
                            backgroundColor: '#F7F7F7', borderWidth: 0.5, borderColor: "#EFEFEF", borderRadius: 5, height: 90
                        }} onPress={() => { }}>
                            {/* <Text>{JSON.stringify(item, null, "         ")} </Text> */}
                            <Image
                                style={{ height: 90, borderRadius: 5, aspectRatio: 1.3, opacity: 0.5 }}
                                resizeMode="contain"
                                source={item?.itemImages?.[0]?.mediumImagePath ?
                                    { uri: item?.itemImages?.[0]?.mediumImagePath } : require('../../assets/png/default.png')}
                            />
                        </View>
                        <View style={[{ padding: 5, flex: 2 }]}>
                            <Text numberOfLines={1} style={{ fontSize: 14, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize', opacity: 0.5 }}>{item?.itemName} </Text>
                            <Text style={{ fontSize: 12, color: '#909090', marginBottom: 10, opacity: 0.5 }}>{item?.itemSubName} </Text>
                            {!loadingCount ?
                                addButton ?
                                    <View
                                        style={[styles.addButton, {}]}
                                    >
                                        <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold', padding: 5, opacity: 0.5 }}>+ Add </Text>
                                    </View>
                                    :
                                    <View style={[styles.addButton, {}]}>
                                        <TouchableOpacity onPress={() => onCartUpdate('DECREASE')} style={{ justifyContent: 'center', alignItems: 'center', flex: 1, padding: 5, }}>
                                            <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold' }}>-</Text>
                                        </TouchableOpacity>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                            <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold', opacity: 0.5 }}>{count} </Text>
                                        </View>
                                        {count < item?.maxAllowedQuantity ?
                                            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, padding: 5, }}>
                                                <Text style={{ color: Theme.Colors.primary, fontWeight: 'bold', opacity: 0.5 }}>+</Text>
                                            </View>
                                            : <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, }}>
                                                <Text style={{ color: "#E1E1E1", fontWeight: 'bold', opacity: 0.5 }}>+</Text>
                                            </View>
                                        }
                                    </View>

                                :
                                <View style={[styles.addButton, {}]}>
                                    <LottieView
                                        style={{ height: 50, }}
                                        source={require("../../assets/json/countLoading.json")}
                                        autoPlay
                                    />
                                </View>
                            }

                        </View>
                        <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', padding: 5, }}>
                            <TouchableOpacity onPress={() => onDeleteItem()} style={{ backgroundColor: 'white', position: 'absolute', top: 0, right: 10, }}>
                                <Icon name="trash-o" type="FontAwesome" style={{ fontSize: 20 }} />
                            </TouchableOpacity>
                            <View style={{}}>
                                {(((item?.actualPrice - item?.discountedPrice) / item?.actualPrice) * 100).toFixed(0) == 0 ?
                                    undefined :
                                    <Text style={{ fontSize: 12.5, color: "#49c32c", fontWeight: "bold" }}>You Save ₹{(((item?.actualPrice - item?.discountedPrice) * item?.count)).toFixed(0)} </Text>
                                }
                            </View>
                            <View style={{ flexDirection: "row" }}>
                                <View style={{}}>
                                    {item?.discountedPrice == item?.actualPrice ?
                                        undefined :
                                        <Text style={{ fontSize: 14, color: '#909090', textDecorationLine: 'line-through', }}>₹ {item?.actualPrice * item?.count} </Text>
                                    }
                                    <Text style={{ fontSize: 14, color: '#2E2E2E', fontWeight: 'bold', textTransform: 'capitalize', alignSelf: "flex-end" }}>₹ {item?.discountedPrice * item?.count} </Text>
                                </View>

                            </View>
                        </View>
                    </View>
                    {
                        (item?.valid == false && item?.comment) ?
                            <View style={{ flex: 1, paddingLeft: 10, flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                <FeatherIcons name="info" color={'#E1271E'} size={18} />
                                <Text style={{ color: "#E1271E" }}>{item.comment} </Text>
                            </View>
                            :
                            undefined

                    }
                </>
            }
            {/* {count <= item?.maxAllowedQuantity ? null :
                <View style={{ flex: 1, paddingLeft: 10, flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                    <FeatherIcons name="info" color={'#E1271E'} size={18} />
                    <Text style={{ color: "#E1271E" }}>  Maximum quantity allowed is {item?.maxAllowedQuantity} per day</Text>
                </View>
            }
            {item?.onDemand == false ?
                item?.availableQuantity == 0 ? null :
                    item?.availableQuantity < count &&
                    <View style={{ flex: 1, paddingLeft: 10, flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                        <FeatherIcons name="info" color={'#E1271E'} size={18} />
                        <Text style={{ color: "#E1271E" }}> Only {item?.availableQuantity} left. Reduce the quantity to continue.</Text>
                    </View>
                : null} */}

        </View>
    )
}
const mapStateToProps = (state) => ({
    cartItems: state.cart.cartItems,
    isAuthenticated: state.auth.isAuthenticated,
    getOrdersBillingDetails: state.cart.getOrdersBillingDetails,

})


export default connect(mapStateToProps, { updateCartItemsApi, getBillingDetails })(CardCartScreen)
const styles = StyleSheet.create({

    scrollChildParent: {
        paddingHorizontal: 8,
        flex: 1,
        flexDirection: "row",
        backgroundColor: 'white',
        paddingVertical: 5,
    },
    productCard: {
        flexDirection: 'row',
        margin: 2,
        backgroundColor: '#FFFFFF',

        flex: 1,
        padding: 0,
        overflow: "hidden",
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00
    },
    addButton: {
        // padding: 5,
        height: 28,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        backgroundColor: 'white',
        flexDirection: 'row',
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        // position: 'absolute',
        // zIndex: 1,
        // right: 10,
        // bottom: 12,
    },
    outOfStockButton: {
        height: 28,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        backgroundColor: '#FBFBFB',
        flexDirection: 'row',
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        zIndex: 1,
        // position: 'absolute',
    },
    offerButton: {
        height: 20,
        width: 65,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        backgroundColor: '#E1171E',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        zIndex: 1,
        position: 'absolute',
        top: 5,
        right: 5
    }
});
