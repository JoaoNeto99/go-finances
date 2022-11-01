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

SplashScreen.preventAutoHideAsync().then();

export default function App() {

    const [appIsReady, setAppIsReady] = useState(false);

    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_700Bold
    });

    useEffect(() => {
        if (fontsLoaded) setAppIsReady(true);
        setTimeout(() => {}, 2000)
    }, [fontsLoaded]);

    if (appIsReady) {
        SplashScreen.hideAsync().then();
    }

    if (!appIsReady) {
        return null;
    }

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <ThemeProvider theme={theme}>
                <NavigationContainer>
                    <AppRoutes/>
                </NavigationContainer>
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}

/*
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_700Bold
    });

    if (!fontsLoaded) {
        return <AppLoading/>
    }
*/
