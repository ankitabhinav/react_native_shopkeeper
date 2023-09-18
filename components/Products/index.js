import * as React from 'react';
import { StyleSheet, View, Alert, FlatList } from 'react-native';
import { ActivityIndicator, Button, Chip, List, MD2Colors, Text, TextInput } from 'react-native-paper';
import { useRecoilState } from 'recoil';
import { userDetailAtom } from '../../recoil/atoms';
import { _retrieveData, _storeData } from '../../utility/asyncStorage';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../api';

const DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'First Item',
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
    },
];

const Tags = ({ tags }) => (
    tags.map(item => <Chip textStyle={{textTransform:'capitalize'}} compact mode='outlined' >{item}</Chip>)
);

const Item = ({ item }) => (
    <List.Item
        key={item._id}
        title={item.name}
        titleStyle={{textTransform:'capitalize'}}
        description={<Tags tags={item.tags} />}
        left={props => <List.Icon {...props} icon="folder" />}
    />
);

const Products = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [userDetail, setUserDetail] = useRecoilState(userDetailAtom);
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [products, setProducts] = React.useState([]);

    React.useEffect(() => {
        console.log('useEffect');
        if (_retrieveData('token')) {
            return setIsLoggedIn(true);
        }
        fetchProducts();
    }, []);


    const fetchProducts = async () => {
        try {
            console.log('insode fetchProducts')
            const response = await api.get('/products');
            if (response.data.success) {
                console.log(response.data.products.length);
                setProducts(response.data.products);
            }
        } catch (error) {
            console.log(error);
        }
    }

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
                return;
            }
        } catch (error) {
            setIsLoading(false);
            console.log(error);
            return Alert.alert('Failed', 'Invalid username or password');
        }
    }

    return (
        <View style={style.container}>
            {isLoading && <ActivityIndicator animating={true} />}
            {!isLoading && <FlatList
                data={products}
                renderItem={({ item }) => <Item item={item} />}
                keyExtractor={item => item._id}
            />}
            <Text>
                {products?.length}
            </Text>
            <Button mode="contained" style={style.signInBtn} onPress={fetchProducts}>
                Fetch
            </Button>
        </View>
    );
};



export default Products;

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
});