import AsyncStorage from '@react-native-community/async-storage';
import { Root } from "native-base";
import React, { useEffect } from 'react';
import 'react-native-gesture-handler'; //do not remove this line else app will get crash while using drawer in release mode due to gesture handling 
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/es/integration/react'
import { onLogin } from './actions/auth';
import AppContainer from './AppContainer';
import { store, persistor } from "./store";
import OneSignal from 'react-native-onesignal';
import { OneSignalAppId } from '../env';
import { BackHandler, Platform } from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import * as Sentry from "@sentry/react-native";
import RNUxcam from 'react-native-ux-cam';
import firebase from '@react-native-firebase/app'
import appsFlyer from 'react-native-appsflyer';
RNUxcam.enableAdvancedGestureRecognizers = (enable) => void
  // Example
  // Set to FALSE before startWithKey to disable - Default is TRUE
  RNUxcam.setAutomaticScreenNameTagging(false)
RNUxcam.enableAdvancedGestureRecognizers(false);
RNUxcam.optIntoSchematicRecordings(); // Add this line to enable iOS screen recordings
RNUxcam.startWithKey('qercwheqrlqze96'); // Add this line after RNUxcam.optIntoSchematicRecordings();

const App = () => {

  useEffect(() => {
    // store.dispatch(loadUser())

    const initialFunction = async () => {
      let userDetails = await AsyncStorage.getItem('userDetails');
      let parsedUserDetails = await JSON.parse(userDetails);
      if (parsedUserDetails !== null) {
        appsFlyer.setCustomerUserId(parsedUserDetails.customerDetails.id, (res) => {
          //..
        });
        store.dispatch(onLogin(parsedUserDetails))
      }
      appsFlyer.initSdk(
        {
          devKey: 'VGRZSCo9PgEpmGARECWLG3',
          isDebug: false,
          appId: 'id1541056118',
          onInstallConversionDataListener: true, //Optional
          onDeepLinkListener: true, //Optional
          timeToWaitForATTUserAuthorization: 10 //for iOS 14.5
        },
        (res) => {
          // alert(JSON.stringify(res, null, "   "))
          console.log(res);
        },
        (err) => {
          console.error("aaaaaaa", err);
        }
      );

      const eventName = 'af_purchase';
      const eventValues = {
        af_revenue: '2',
        af_price: '100',
        // af_content_id: 'id123',
        af_currency: 'INR',
        af_quantity: "2",
        af_order_id: 1
      };

      appsFlyer.logEvent(
        eventName,
        eventValues,
        (res) => {
          console.log(res);
          // alert(res)
        },
        (err) => {
          console.error(err);
        }
      );

      if (Platform.OS == "ios") {
        PushNotificationIOS.requestPermissions()
        try {
          await firebase.initializeApp({
            apiKey: 'AIzaSyBJwFWNxLCCk99P911k5LmuCEcsWqFtz6o',
            appId: "1:135821146938:ios:e21478741c6b9e770a6e03",
            databaseURL: "https://zasket-9f0ab.firebaseio.com",
            messagingSenderId: '135821146938',
            projectId: 'zasket-9f0ab',
            storageBucket: 'zasket-9f0ab.appspot.com'
          })
        } catch (err) {

        }
      }


    }
    initialFunction()

    Sentry.init({
      dsn: "https://3fe28747315644a6adfe8787746b7923@o515547.ingest.sentry.io/5621805",
    });

  }, [])

  useEffect(() => {
    OneSignal.setLogLevel(6, 0);

    // Replace 'YOUR_ONESIGNAL_APP_ID' with your OneSignal App ID.
    OneSignal.init(OneSignalAppId, { kOSSettingsKeyAutoPrompt: false, kOSSettingsKeyInAppLaunchURL: false, kOSSettingsKeyInFocusDisplayOption: 2 });
    OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.
  }, [])


  return (
    <Root>
      <PaperProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AppContainer />
          </PersistGate>
        </Provider>
      </PaperProvider>
    </Root>
  );
}

export default App;
