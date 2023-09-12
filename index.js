import * as React from 'react';
import { AppRegistry } from 'react-native';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import { name as appName } from './app.json';
import App from './App';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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
        <PaperProvider theme={theme}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Home" component={App} />
                </Stack.Navigator>
                {/* <App /> */}
            </NavigationContainer>
        </PaperProvider>
    );
}

AppRegistry.registerComponent(appName, () => Main);