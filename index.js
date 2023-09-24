import 'react-native-gesture-handler';
import * as React from 'react';
import { AppRegistry } from 'react-native';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import { name as appName } from './app.json';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RecoilRoot, } from 'recoil';
import { navigationRef } from './RootNavigation';
import FlipperAsyncStorage from 'rn-flipper-async-storage-advanced';
import LoginPage from './components/LoginPage';
import Products from './components/Products';
import AddProduct from './components/Products/AddProduct';
import Variants from './components/Variants';
import AddVariant from './components/Variants/AddVariant';
import Employees from './components/Employees';
import AddEmployee from './components/Employees/AddEmployee';
import Pos from './components/Pos';
import AddPos from './components/Pos/AddPos';
import { createDrawerNavigator } from '@react-navigation/drawer';
// import { Drawer } from 'react-native-paper';

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'tomato',
        secondary: 'yellow',
    },
};

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const Root = () => {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="Products" component={Products} />
            <Drawer.Screen name="Login" component={LoginPage} />
            <Drawer.Screen name="Employees" component={Employees} />
            <Drawer.Screen name="Pos" component={Pos} />
        </Drawer.Navigator>
    );
}


export default function Main() {
    return (
        <RecoilRoot>
            <FlipperAsyncStorage />
            <PaperProvider theme={theme}>
                <NavigationContainer ref={navigationRef}>
                    <Stack.Navigator>
                        <Stack.Screen name="Root" component={Root} options={{ headerShown: false }} />
                        <Stack.Screen name="Login" component={LoginPage} />
                        <Stack.Screen name="Products" component={Products} />
                        <Stack.Screen name="Add Product" component={AddProduct} options={({ route }) => ({ title: route.params.headerTitle })} />
                        <Stack.Screen name="Variants" component={Variants} options={({ route }) => ({ title: route.params.headerTitle })} />
                        <Stack.Screen name="Add Variant" component={AddVariant} options={({ route }) => ({ title: route.params.headerTitle })} />
                        <Stack.Screen name="Employees" component={Employees} />
                        <Stack.Screen name="Add Employee" component={AddEmployee} options={({ route }) => ({ title: route.params.headerTitle })} />
                        <Stack.Screen name="Pos" component={Pos} />
                        <Stack.Screen name="Add Pos" component={AddPos} options={({ route }) => ({ title: route.params.headerTitle })} />
                    </Stack.Navigator>
                </NavigationContainer>
            </PaperProvider>
        </RecoilRoot>
    );
}

AppRegistry.registerComponent(appName, () => Main);