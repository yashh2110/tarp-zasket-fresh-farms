import "react-native-gesture-handler";
import React, { useEffect, useContext, useState } from "react";
import { connect } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Login from "../components/auth/Login";
import OtpScreen from "../components/auth/OtpScreen";
import EmailScreen from "../components/auth/EmailScreen";
import OnBoardScreen from "../components/auth/OnBoard";
import { View, Text, Image } from "react-native";
import * as Animatable from "react-native-animatable";
import HomeScreen from "../components/HomeScreen/HomeScreen";
import ProductDetailScreen from "../components/ProductScreens/ProductDetailScreen";
import ProductListScreen from "../components/ProductScreens/ProductListScreen";
import MapScreen from "../components/MapStack/MapScreen";
import MapScreenGrabPincode from "../components/MapStack/MapScreenGrabPincode";
import AccountScreen from "../components/AccountStack/AccountScreen";
import SupportScreen from "../components/AccountStack/SupportScreen";
import CancelOrderScreen from "../components/AccountStack/CancelOrderScreen";
import MyOrders from "../components/AccountStack/MyOrders";
import MyOrdersDetailScreen from "../components/AccountStack/MyOrdersDetailScreen";
import PaymentSuccessScreenOrderDetail from "../components/AccountStack/PaymentSuccessScreenOrderDetail";
import RateOrdersScreen from "../components/AccountStack/RateOrdersScreen";
import ManageAddressScreen from "../components/AccountStack/ManageAddressScreen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FeatherIcons from "react-native-vector-icons/Feather";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Theme from "../styles/Theme";
import AccessPermissionScreen from "../components/MapStack/AccessPermissionScreen";
import CartScreen from "../components/cartStack/CartScreen";
import CheckoutScreen from "../components/cartStack/CheckoutScreen";
import PaymentSuccessScreen from "../components/cartStack/PaymentSuccessScreen";
import MyWallet from "../components/AccountStack/MyWalletScreen";
import WalletSuccessScreen from "../components/AccountStack/WalletSuccessScreen";
import TransactionHistory from "../components/AccountStack/TransactionHistory";
import AddMoney from "../components/AccountStack/AddMoney";
import SearchScreen from "../components/SearchStack/SearchScreen";
import AsyncStorage from "@react-native-community/async-storage";
import { ActivityIndicator } from "react-native";
import SetAuthContext from "../components/MapStack/setAuthContext";
import CartButton from "./CartButton";
import { AxiosDefaultsManager } from "../axios/default";
import OneSignal from "react-native-onesignal";
import SetDeliveryLocationScreen from "../components/MapStack/SetDeliveryLocationScreen";
import AutoCompleteLocationScreen from "../components/MapStack/AutoCompleteLocationScreen";
import SwitchNavigator from "./SwitchNavigator";
import LoadingScreen from "./LoadingScreen";
import ReferalCodeScreen from "../components/AccountStack/ReferalCodeScreen";
import ReferralScreen from "../components/ReferralsScreens/Referral";
import IconBadge from "react-native-icon-badge";
import QuickTips from "../components/ReferralsScreens/QuickTips";
import PcProductsScreen from "../components/PriceChopStack/PcProductsScreen";
import PcProductDetailsScreen from "../components/PriceChopStack/PcProductDetailsScreen";
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
export const AuthContext = React.createContext();

const Navigate = ({ darkMode, isAuthenticated }) => {
  const forFade = ({ current, closing }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });

  // function LoadingScreen(props) {
  //     useEffect(() => {
  //         const _bootstrapAsync = async () => {
  //             const onBoardKey = await AsyncStorage.getItem('onBoardKey');
  //             if (!onBoardKey) {
  //                 props.navigation.navigate('OnBoardScreen')
  //             } else {
  //                 props.navigation.navigate('BottomTabRoute')
  //             }
  //         };
  //         _bootstrapAsync()
  //     }, [])

  //     return (
  //         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
  //             <ActivityIndicator size="large" color={Theme.Colors.primary} />
  //         </View>
  //     );
  // }

  const AuthRoute = () => (
    <Stack.Navigator
      // initialRouteName="OnBoardScreen"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ cardStyleInterpolator: forFade }}
      />
      <Stack.Screen
        name="EmailScreen"
        component={EmailScreen}
        options={{ cardStyleInterpolator: forFade }}
      />
      <Stack.Screen
        name="OtpScreen"
        component={OtpScreen}
        options={{ cardStyleInterpolator: forFade }}
      />
    </Stack.Navigator>
  );

  const MapStack = () => (
    <Stack.Navigator
      initialRouteName="AccessPermissionScreen"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="AccessPermissionScreen"
        component={AccessPermissionScreen}
        options={{ cardStyleInterpolator: forFade }}
      />
      <Stack.Screen
        name="MapScreen"
        component={MapScreen}
        options={{ cardStyleInterpolator: forFade }}
      />
      <Stack.Screen
        name="MapScreenGrabPincode"
        component={MapScreenGrabPincode}
        options={{ cardStyleInterpolator: forFade }}
      />
      <Stack.Screen
        name="SetAuthContext"
        component={SetAuthContext}
        options={{ cardStyleInterpolator: forFade }}
      />
    </Stack.Navigator>
  );

  const BottomTabRoute = () => (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      tabBarOptions={{
        activeTintColor: Theme.Colors.primary,
        activeBackgroundColor: "#fff",
        inactiveBackgroundColor: "#fff",
      }}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarLabel: "ZASKET",
          tabBarIcon: ({ color, size }) =>
            // <MaterialCommunityIcons name="home" color={color} size={size} />
            Theme.Colors.primary == color ? (
              <Image
                style={{ width: 25, height: 25 }}
                resizeMode={"contain"}
                source={require("../assets/png/activeLogo.png")}
              />
            ) : (
              <Image
                style={{ width: 25, height: 25 }}
                resizeMode={"contain"}
                source={require("../assets/png/inactiveLogo.png")}
              />
            ),
        }}
      />
      <Tab.Screen
        name="SearchStack"
        component={SearchStack}
        options={{
          tabBarLabel: "SEARCH",
          tabBarIcon: ({ color, size }) => (
            <FeatherIcons name="search" color={color} size={size} />
          ),
        }}
      />
      {/* <Tab.Screen
                name="CartStack"
                component={CartStack}
                options={{
                    tabBarLabel: 'CART',
                    tabBarIcon: ({ color, size }) => (
                        <CartButton color={color} size={size} />
                    ),
                }}
            // listeners={(navigation) => ({
            //     tabPress: event => {
            //         if (isAuthenticated == false) {
            //             event.preventDefault();
            //             navigation.navigation.navigate("AuthRoute", { screen: 'Login' })
            //         }
            //     }
            // })}
            /> */}
      <Tab.Screen
        name="ReferralStack"
        component={ReferralStack}
        options={{
          tabBarLabel: "REFERRALS",
          tabBarIcon: ({ color, size }) => (
            <View style={{ position: "relative" }}>
              {Theme.Colors.primary == color ? (
                <Image
                  style={{ width: 25, height: 25 }}
                  resizeMode={"contain"}
                  source={require("../assets/png/ReferralActiveIcon.png")}
                />
              ) : (
                <Image
                  style={{ width: 25, height: 25 }}
                  resizeMode={"contain"}
                  source={require("../assets/png/ReferralInActiveIcon.png")}
                />
              )}
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 9,
                  paddingHorizontal: 6,
                  paddingVertical: 3,
                  position: "absolute",
                  //   left: "60%",
                  borderRadius: 5,
                  marginLeft: 2,
                  marginTop: -2,
                  fontWeight: "bold",
                  backgroundColor: "#9462FF",
                }}>
                Get ₹ 500
              </Text>
            </View>
            // <FeatherIcons name="user" color={color} size={size} />
            // <IconBadge
            //   MainElement={
            //     Theme.Colors.primary == color ? (
            //       <Image
            //         style={{ width: 25, height: 25 }}
            //         resizeMode={"contain"}
            //         source={require("../assets/png/ReferralActiveIcon.png")}
            //       />
            //     ) : (
            //       <Image
            //         style={{ width: 25, height: 25 }}
            //         resizeMode={"contain"}
            //         source={require("../assets/png/ReferralInActiveIcon.png")}
            //       />
            //     )
            //   }
            //   BadgeElement={
            //     <Text style={{ color: "#FFFFFF", fontSize: 9 }}>Get Rs500</Text>
            //   }
            //   IconBadgeStyle={{
            //     // width: 20,
            //     padding: 5,
            //     // left: "10%",
            //     // ottom: 15,
            //     top: 0,
            //     backgroundColor: Theme.Colors.primary,
            //   }}
            //   // Hidden={this.state.BadgeCount==0}
            // />
          ),
        }}
        listeners={(navigation) => ({
          tabPress: (event) => {
            if (isAuthenticated == false) {
              event.preventDefault();
              navigation.navigation.navigate("AuthRoute", { screen: "Login" });
            }
          },
        })}
      />
      <Tab.Screen
        name="AccountStack"
        component={AccountStack}
        options={{
          tabBarLabel: "ACCOUNT",
          tabBarIcon: ({ color, size }) =>
            // <FeatherIcons name="user" color={color} size={size} />
            Theme.Colors.primary == color ? (
              <Image
                style={{ width: 25, height: 25 }}
                resizeMode={"contain"}
                source={require("../assets/png/AccountIconActive.png")}
              />
            ) : (
              <Image
                style={{ width: 25, height: 25 }}
                resizeMode={"contain"}
                source={require("../assets/png/AccountIconInactive.png")}
              />
            ),
        }}
        listeners={(navigation) => ({
          tabPress: (event) => {
            if (isAuthenticated == false) {
              event.preventDefault();
              navigation.navigation.navigate("AuthRoute", { screen: "Login" });
            }
          },
        })}
      />
    </Tab.Navigator>
  );

  function HomeStack(props) {
    return (
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          // headerStyle: { backgroundColor: '#42f44b' },
          // headerTintColor: '#fff',
          // headerTitleStyle: { fontWeight: 'bold' },
          headerShown: false,
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Home Page" }}
        />
        <Stack.Screen
          name="ProductDetailScreen"
          component={ProductDetailScreen}
          options={{ title: "Home Page" }}
        />
        <Stack.Screen
          name="ProductListScreen"
          component={ProductListScreen}
          options={{ title: "Home Page" }}
        />

        {/* for push stacks */}
      </Stack.Navigator>
    );
  }
  function SearchStack() {
    return (
      <Stack.Navigator
        initialRouteName="Search"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ title: "Search Page" }}
        />
        {/* <Stack.Screen
                    name="ProductDetailScreen"
                    component={ProductDetailScreen}
                    options={{ title: 'Home Page' }}
                /> */}
      </Stack.Navigator>
    );
  }
  function CartStack() {
    return (
      <Stack.Navigator
        initialRouteName="Cart"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{ title: "Cart Page" }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{ title: "Checkout Page" }}
        />
        <Stack.Screen
          name="PaymentSuccessScreen"
          component={PaymentSuccessScreen}
          options={{ title: "PaymentSuccess Screen" }}
        />
        <Stack.Screen name="MyOrders" component={MyOrders} />
        <Stack.Screen
          name="MyOrdersDetailScreen"
          component={MyOrdersDetailScreen}
        />
        <Stack.Screen
          name="PaymentSuccessScreenOrderDetail"
          component={PaymentSuccessScreenOrderDetail}
        />
        <Stack.Screen name="RateOrdersScreen" component={RateOrdersScreen} />
        <Stack.Screen name="SupportScreen" component={SupportScreen} />
        <Stack.Screen name="CancelOrderScreen" component={CancelOrderScreen} />
      </Stack.Navigator>
    );
  }

  function ReferralStack() {
    return (
      <Stack.Navigator
        initialRouteName="Referrals"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="Referrals"
          component={ReferralScreen}
          options={{ title: "Referrals Page" }}
        />
      </Stack.Navigator>
    );
  }

  function AccountStack() {
    return (
      <Stack.Navigator
        initialRouteName="Account"
        screenOptions={{
          // headerStyle: { backgroundColor: '#42f44b' },
          // headerTintColor: '#fff',
          // headerTitleStyle: { fontWeight: 'bold' },
          headerShown: false,
        }}>
        <Stack.Screen name="Account" component={AccountScreen} />
        <Stack.Screen name="SupportScreen" component={SupportScreen} />
        <Stack.Screen name="CancelOrderScreen" component={CancelOrderScreen} />
        <Stack.Screen name="MyOrders" component={MyOrders} />
        <Stack.Screen name="MyWallet" component={MyWallet} />

        <Stack.Screen
          name="TransactionHistory"
          component={TransactionHistory}
        />
        <Stack.Screen name="AddMoney" component={AddMoney} />
        <Stack.Screen
          name="WalletSuccessScreen"
          component={WalletSuccessScreen}
        />

        <Stack.Screen
          name="MyOrdersDetailScreen"
          component={MyOrdersDetailScreen}
        />
        <Stack.Screen
          name="PaymentSuccessScreenOrderDetail"
          component={PaymentSuccessScreenOrderDetail}
        />
        <Stack.Screen name="RateOrdersScreen" component={RateOrdersScreen} />
        <Stack.Screen
          name="MapScreen"
          component={MapScreen}
          options={{ title: "MapScreen" }}
        />

        <Stack.Screen
          name="MapScreenGrabPincode"
          component={MapScreenGrabPincode}
          options={{ title: "MapScreenGrabPincode" }}
        />
      </Stack.Navigator>
    );
  }

  const PriceChopStack = () => {
    return (
      <Stack.Navigator
        initialRouteName="PcProductsScreen"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="PcProductsScreen" component={PcProductsScreen} />
        <Stack.Screen
          name="PcProductDetailsScreen"
          component={PcProductDetailsScreen}
        />
      </Stack.Navigator>
    );
  };

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "SET_ONBOARD_KEY":
          return {
            ...prevState,
            onBoardKey: action.token,
          };
        case "REMOVE_ONBOARD_KEY":
          return {
            ...prevState,
            onBoardKey: null,
          };
      }
    },
    {
      onBoardKey: null,
    }
  );

  const authContext = React.useMemo(
    () => ({
      setOnBoardKey: async (data) => {
        await AsyncStorage.setItem("onBoardKey", "onBoardKey");
        dispatch({ type: "SET_ONBOARD_KEY", token: data });
      },
      removeOnBoardKey: () => dispatch({ type: "REMOVE_ONBOARD_KEY" }),
    }),
    []
  );
  console.log(isAuthenticated);

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let onBoardKey;
      try {
        onBoardKey = await AsyncStorage.getItem("onBoardKey");
      } catch (e) {
        // Restoring token failed
      }
      // After restoring token, we may need to validate it in production apps
      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: "SET_ONBOARD_KEY", token: onBoardKey });
    };
    bootstrapAsync();
  }, []);

  return (
    <>
      <AuthContext.Provider value={authContext}>
        {isAuthenticated != null ? (
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="BottomTabRoute"
              screenOptions={{
                headerShown: false,
              }}>
              {!isAuthenticated ? (
                <>
                  {/* <Stack.Screen name="LoadingScreen" component={LoadingScreen} /> */}
                  <Stack.Screen
                    name="OnBoardScreen"
                    component={OnBoardScreen}
                  />
                  <Stack.Screen
                    name="SwitchNavigator"
                    component={SwitchNavigator}
                    options={{ cardStyleInterpolator: forFade }}
                  />
                </>
              ) : (
                <>
                  <Stack.Screen
                    name="BottomTabRoute"
                    component={BottomTabRoute}
                  />
                  <Stack.Screen name="CartStack" component={CartStack} />
                  <Stack.Screen
                    name="MapStack"
                    component={MapStack}
                    options={{ cardStyleInterpolator: forFade }}
                  />
                  <Stack.Screen
                    name="PriceChopStack"
                    component={PriceChopStack}
                  />
                  <Stack.Screen
                    name="ProductDetailScreen"
                    component={ProductDetailScreen}
                    options={{ title: "Home Page" }}
                  />
                  <Stack.Screen
                    name="MapScreen"
                    component={MapScreen}
                    options={{ cardStyleInterpolator: forFade }}
                  />
                  <Stack.Screen
                    name="CartScreen"
                    component={CartScreen}
                    options={{ cardStyleInterpolator: forFade }}
                  />
                  <Stack.Screen
                    name="CheckoutScreen"
                    component={CheckoutScreen}
                    options={{ cardStyleInterpolator: forFade }}
                  />
                  <Stack.Screen
                    name="ManageAddressScreen"
                    component={ManageAddressScreen}
                    options={{ title: "Manage Addresses" }}
                  />
                  <Stack.Screen
                    name="ReferalCodeScreen"
                    component={ReferalCodeScreen}
                    options={{ title: "Referal Code" }}
                  />
                  <Stack.Screen
                    name="AccessPermissionScreen"
                    component={AccessPermissionScreen}
                    options={{ cardStyleInterpolator: forFade }}
                  />
                  <Stack.Screen
                    name="SetDeliveryLocationScreen"
                    component={SetDeliveryLocationScreen}
                    options={{ cardStyleInterpolator: forFade }}
                  />
                  <Stack.Screen
                    name="MyOrdersDetailScreen"
                    component={MyOrdersDetailScreen}
                    options={{ cardStyleInterpolator: forFade }}
                  />
                  <Stack.Screen
                    name="PaymentSuccessScreenOrderDetail"
                    component={PaymentSuccessScreenOrderDetail}
                    options={{ cardStyleInterpolator: forFade }}
                  />
                  <Stack.Screen
                    name="WalletSuccessScreen"
                    component={WalletSuccessScreen}
                    options={{ cardStyleInterpolator: forFade }}
                  />
                  <Stack.Screen
                    name="QuickTipsScreen"
                    component={QuickTips}
                    // options={{ cardStyleInterpolator: forFade }}
                  />
                </>
              )}
              <Stack.Screen name="AuthRoute" component={AuthRoute} />
              <Stack.Screen
                name="AutoCompleteLocationScreen"
                component={AutoCompleteLocationScreen}
                options={{ cardStyleInterpolator: forFade }}
              />
              <Stack.Screen
                name="MapScreenGrabPincode"
                component={MapScreenGrabPincode}
                options={{ cardStyleInterpolator: forFade }}
              />
              <></>
            </Stack.Navigator>
          </NavigationContainer>
        ) : (
          <LoadingScreen />
        )}
      </AuthContext.Provider>
    </>
  );
};

const mapStateToProps = (state) => ({
  darkMode: state.dark,
  isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Navigate);
