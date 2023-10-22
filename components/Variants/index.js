import * as React from 'react';
import { StyleSheet, View, Alert, FlatList, ScrollView, Pressable } from 'react-native';
import { ActivityIndicator, Chip, FAB, List, Searchbar, Text } from 'react-native-paper';
import { useRecoilState } from 'recoil';
import { userDetailAtom } from '../../recoil/atoms';
import { _retrieveData, _storeData } from '../../utility/asyncStorage';
import api from '../../api';
import { useFocusEffect } from '@react-navigation/native';
import { Modal, Portal, Button, PaperProvider } from 'react-native-paper';

const Tags = ({ tags }) => (
    tags.map(item => <Chip textStyle={{ textTransform: 'capitalize' }} compact mode='outlined' >{item}</Chip>)
);

const Item = ({ item, navigation }) => (
    <List.Item
        key={item._id}
        title={`${item.size} - ${item.unit}`}
        titleStyle={{ textTransform: 'capitalize' }}
        description={`Price: ${item.price} - Stock: ${item.availableQuantity}`}
        left={props => <List.Icon {...props} icon="folder" />}
        right={props =>
            <Pressable
                onPress={() => navigation.navigate('Add Variant', {
                    variant: item,
                    mode: 'edit',
                    headerTitle: item.parentProduct.name + ' - Edit'
                })}
            >
                <List.Icon
                    {...props}
                    icon="book-edit" />
            </Pressable>
        }
    />
);

const Variants = ({ route, navigation }) => {
    const { productId, headerTitle } = route.params;
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [userDetail, setUserDetail] = useRecoilState(userDetailAtom);
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [variants, setVariants] = React.useState([]);
    const [variantsCopy, setVariantsCopy] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState('');

    const onChangeSearch = (query) => {
        setSearchQuery(query);
        console.log(query);
        if (query == '') {
            return setVariants(variantsCopy);
        } else {
            let filteredVariants = variants.filter((item) => item.size?.toString()?.includes(query));
            console.log(filteredVariants);
            setVariants(filteredVariants);
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
            console.log('useEffect of variants--');

            fetchVariants();

            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, [])
    );

    const fetchVariants = async () => {
        if(variants.length > 0) return console.log('already fetched');
        try {
            setIsLoading(true);
            console.log('inside fetchVariants')
            const response = await api.get('/variants/' + productId);
            if (response.data.success) {
                setIsLoading(false);
                console.log(response.data.variants.length);
                setVariants(response.data.variants);
                setVariantsCopy(response.data.variants);
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
                   {/* <Text variant="headlineMedium">{variants[0].parentProduct.name}</Text> */}
                    <FlatList
                        data={variants}
                        renderItem={({ item }) => <Item item={item} navigation={navigation} />}
                        keyExtractor={item => item._id}
                    />
                </>
            }
            <FAB
                icon="plus"
                style={style.fab}
                onPress={() => navigation.navigate('Add Variant', {headerTitle: headerTitle, productId: productId})}
            />
        </View>
    );
};



export default Variants;

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