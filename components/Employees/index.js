import * as React from 'react';
import { StyleSheet, View, Alert, FlatList, ScrollView, Pressable } from 'react-native';
import { ActivityIndicator, Chip, FAB, List, Searchbar, Text } from 'react-native-paper';
import { useRecoilState } from 'recoil';
import { userDetailAtom } from '../../recoil/atoms';
import { _retrieveData, _storeData } from '../../utility/asyncStorage';
import api from '../../api';
import { useFocusEffect } from '@react-navigation/native';
import { Modal, Portal, Button, PaperProvider } from 'react-native-paper';



const Item = ({ item, navigation }) => (
    <List.Item
        key={item._id}
        title={item.firstName + ' ' + item.lastName}
        titleStyle={{ textTransform: 'capitalize' }}
        description={
            `${item.contactEmail}`
        }
        left={props => <List.Icon {...props} icon="folder" />}
        right={props =>
            <Pressable
                onPress={() => navigation.navigate('Add Employee', {
                    employee: item,
                    mode: 'edit',
                    headerTitle: item.firstName + ' - Edit'
                })}
            >
                <List.Icon
                    {...props}
                    icon="book-edit" />
            </Pressable>
        }
    />
);

const Employees = ({ navigation }) => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [userDetail, setUserDetail] = useRecoilState(userDetailAtom);
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [employees, setEmployees] = React.useState([]);
    const [employeesCopy, setEmployeesCopy] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState('');

    const onChangeSearch = (query) => {
        setSearchQuery(query);
        if (query == '') {
            return setEmployees(employeesCopy);
        } else {
            let filteredEmployees = employees.filter((item) => item.firstName.includes(query));
            setEmployees(filteredEmployees);
        }
    };

    const [visible, setVisible] = React.useState(false);
    const showModal = () => {
        Alert.alert('showModal');
        setVisible(true);
    }
    const hideModal = () => setVisible(false);
    const containerStyle = { backgroundColor: 'white', padding: 20 };

    useFocusEffect(
        React.useCallback(() => {
            // Do something when the screen is focused
            console.log('useEffect of employees--');

            fetchEmployees();

            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, [])
    );

    const fetchEmployees = async () => {
        try {
            setIsLoading(true);
            console.log('inside fetchEmployees')
            const response = await api.get('/employees?isActive=true');
            if (response.data.success) {
                setIsLoading(false);
                console.log(response.data.employees.length);
                setEmployees(response.data.employees);
                setEmployeesCopy(response.data.employees);
            }
            if (response?.data?.status === 'tokens expired') {
                setIsLoading(false);
                return Alert.alert(
                    'Auth Failed',
                    'Session expired, please login again',
                    [
                        {
                            text: 'Sign In',
                            onPress: () => navigation.navigate('Login'),
                            style: 'cancel',
                        },
                    ],
                    {
                        cancelable: false,

                    },
                );

            }
        } catch (error) {
            setIsLoading(false);

            console.log(error.response.data);
            return Alert.alert(
                'Auth Failed',
                error.response?.data?.status,
                [
                    {
                        text: 'Sign In',
                        onPress: () => navigation.navigate('Login'),
                        style: 'cancel',
                    },
                ],
                {
                    cancelable: false,

                },
            );
        }
    }

    return (
        <View style={style.container}>
            {isLoading && <ActivityIndicator animating={true} />}
            {!isLoading &&
                <>
                    <Searchbar
                        placeholder="Search"
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                    />
                    <FlatList
                        data={employees}
                        renderItem={({ item }) => <Item item={item} navigation={navigation} />}
                        keyExtractor={item => item._id}
                    />
                </>
            }
            <FAB
                icon="plus"
                style={style.fab}
                onPress={() => navigation.navigate('Add Employee',{headerTitle:'Add Employee'})}
            />
        </View>
    );
};



export default Employees;

const style = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        justifyContent: 'center',
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
    tagContainer: {
        margin: 5,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: 'orange'
    },
});