import * as React from 'react';
import { AppRegistry } from 'react-native';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import { name as appName } from './app.json';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RecoilRoot, } from 'recoil';
import LoginPage from './components/LoginPage';
import Products from './components/Products';
import { navigationRef } from './RootNavigation';
import FlipperAsyncStorage from 'rn-flipper-async-storage-advanced';

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'tomato',
        secondary: 'yellow',
    },
};

const Stack = createNativeStackNavigator();


export default function Main() {
    return (
        <RecoilRoot>
            <FlipperAsyncStorage />
            <PaperProvider theme={theme}>
                <NavigationContainer ref={navigationRef}>
                    <Stack.Navigator>
                        <Stack.Screen name="Login" component={LoginPage} />
                        <Stack.Screen name="Products" component={Products} />
                    </Stack.Navigator>
                    {/* <App /> */}
                </NavigationContainer>
            </PaperProvider>
        </RecoilRoot>
    );
}

AppRegistry.registerComponent(appName, () => Main);