import * as React from 'react';
import { StyleSheet, View, Alert, FlatList, ScrollView, Pressable } from 'react-native';
import { ActivityIndicator, Chip, FAB, List, Searchbar, Text } from 'react-native-paper';
import { useRecoilState } from 'recoil';
import { userDetailAtom } from '../../recoil/atoms';
import { _retrieveData, _storeData } from '../../utility/asyncStorage';
import api from '../../api';
import { useFocusEffect } from '@react-navigation/native';
import AddProduct from './AddProduct';
import { Modal, Portal, Button, PaperProvider } from 'react-native-paper';

const Tags = ({ tags }) => (
    tags.map(item => <Chip textStyle={{ textTransform: 'capitalize' }} compact mode='outlined' >{item}</Chip>)
);

const Item = ({ item, navigation }) => (
    <List.Item
        key={item._id}
        title={item.name}
        titleStyle={{ textTransform: 'capitalize' }}
        description={<Tags tags={item.tags} />}
        left={props => <List.Icon {...props} icon="folder" />}
        right={props =>
            <Pressable
                onPress={() => navigation.navigate('Add Product', {
                    product: item,
                    mode: 'edit',
                    headerTitle: item.name + ' - Edit'
                })}
            >
                <List.Icon
                    {...props}
                    icon="book-edit" />
            </Pressable>
        }
        onPress={() => navigation.navigate('Variants', {
            productId: item._id,
            headerTitle: item.name
        })}
        // onPress={() => navigation.navigate('Add Product', {
        //     product: item,
        //     mode: 'edit',
        //     headerTitle: item.name + ' - Edit'
        // })}
    />
);

const Products = ({ navigation }) => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [userDetail, setUserDetail] = useRecoilState(userDetailAtom);
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [products, setProducts] = React.useState([]);
    const [productsCopy, setProductsCopy] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState('');

    const onChangeSearch = (query) => {
        setSearchQuery(query);
        if (query == '') {
            return setProducts(productsCopy);
        } else {
            let filteredProducts = products.filter((item) => item.name.includes(query));
            setProducts(filteredProducts);
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
            console.log('useEffect of products--');

            fetchProducts();

            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, [])
    );

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            console.log('insode fetchProducts')
            const response = await api.get('/products');
            if (response.data.success) {
                setIsLoading(false);
                console.log(response.data.products.length);
                setProducts(response.data.products);
                setProductsCopy(response.data.products);
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
                        data={products}
                        renderItem={({ item }) => <Item item={item} navigation={navigation} />}
                        keyExtractor={item => item._id}
                    />
                </>
            }
            <FAB
                icon="plus"
                style={style.fab}
                onPress={() => navigation.navigate('Add Product')}
            />
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
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: 'orange'
    },
});