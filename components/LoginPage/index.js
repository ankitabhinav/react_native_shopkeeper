import * as React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { ActivityIndicator, Button, MD2Colors, Text, TextInput } from 'react-native-paper';
import { useRecoilState } from 'recoil';
import { userDetailAtom } from '../../recoil/atoms';
import { _retrieveData, _storeData } from '../../utility/asyncStorage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const Login = ({ navigation }) => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [userDetail, setUserDetail] = useRecoilState(userDetailAtom);
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);



    useFocusEffect(
        React.useCallback(() => {
            // Do something when the screen is focused
            console.log('useEffect--');
            _retrieveData('token').then((data) => {
                console.log(data + '---');
                if (data) {
                    setIsLoggedIn(true);
                    return navigation.navigate('Products');
                }
            });
        
            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, [])
    );

    const handleSubmit = async (event) => {
        event.preventDefault();
    };

    const handleEmailChange = (email) => {
        setEmail(email);
        setUserDetail({ ...userDetail, email: email });
    }

    const handleLogin = async () => {
        if (email == "" || password == "") Alert.alert('Error', 'Email and Password fields are required');
        setIsLoading(true);
        //     fetch('https://jsonplaceholder.typicode.com/todos/1')
        //   .then(response => {
        //     console.log(response.json())
        // })
        //   .then(json => console.log(json))
        try {
            const response = await axios.post('https://next-js-shopkeeper.vercel.app/api/shop-login', {
                email: email,
                password: password
            });
            if (response.data.success) {
                setIsLoading(false);
                _storeData('token', response.data.token);
                _storeData('refreshToken', response.data.refreshToken);
                _storeData('name', response.data.name);
                _storeData('email', response.data.email);
                Alert.alert('Success', 'Login successful');
                setIsLoggedIn(true);
                return navigation.navigate('Products');
            }
        } catch (error) {
            setIsLoading(false);
            console.log(error);
            return Alert.alert('Failed', 'Invalid username or password');
        }
    }

    return (
        <View style={style.container}>
            <TextInput
                label="Email"
                value={email}
                onChangeText={handleEmailChange}
                style={style.email}
            />
            <TextInput
                label="Password"
                value={password}
                secureTextEntry={true}
                onChangeText={password => setPassword(password)}
                style={style.password}
            />
            {isLoading ?
                <ActivityIndicator animating={true} />
                :
                <Button mode="contained" style={style.signInBtn} onPress={handleLogin}>
                    Sign In
                </Button>
            }
            <Button mode="contained" style={style.signInBtn} onPress={() => navigation.navigate('Products')}>
                goto products
            </Button>
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    email: {
        margin: 12,
    },
    password: {
        margin: 12,
    },
    signInBtn: {
        margin: 12,
    }
});

export default Login;