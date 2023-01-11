import React, {useEffect, useState} from 'react';
import {ThemeProvider} from "styled-components";
import {Poppins_400Regular, Poppins_500Medium, Poppins_700Bold, useFonts} from "@expo-google-fonts/poppins";

import theme from './src/global/styles/theme'
import {NavigationContainer} from "@react-navigation/native";
import {AppRoutes} from "./src/routes/routes";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import * as SplashScreen from 'expo-splash-screen';

import "intl";
import "intl/locale-data/jsonp/pt-BR";
import {StatusBar} from "react-native";
import {SingIn} from "./src/screens/SingIn";
import {AuthProvider, useAuth} from "./src/hooks/auth";
import {Routes} from "./src/routes";

SplashScreen.preventAutoHideAsync().then();

export default function App() {

    const [appIsReady, setAppIsReady] = useState(false);

    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_700Bold
    });

    const {userStorageLoading} = useAuth()

    useEffect(() => {
        if (fontsLoaded && !userStorageLoading) setAppIsReady(true);
        setTimeout(() => {
        }, 2000)
    }, [fontsLoaded]);

    if (appIsReady) {
        SplashScreen.hideAsync().then();
    } else {
        return null;
    }

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <ThemeProvider theme={theme}>
                <StatusBar barStyle={"light-content"}/>
                <AuthProvider>
                    <Routes/>
                </AuthProvider>
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}
