import * as React from 'react';
import { StyleSheet, View, Alert, FlatList, ScrollView } from 'react-native';
import { ActivityIndicator, Chip, FAB, List, Switch, Text, TextInput } from 'react-native-paper';
import { useRecoilState } from 'recoil';
import { userDetailAtom } from '../../recoil/atoms';
import { _retrieveData, _storeData } from '../../utility/asyncStorage';
import api from '../../api';
import { useFocusEffect } from '@react-navigation/native';
import { Modal, Portal, Button, PaperProvider } from 'react-native-paper';

const Tags = ({ tags }) => (
    tags.map(item => <Chip textStyle={{ textTransform: 'capitalize' }} compact mode='outlined' >{item}</Chip>)
);


const AddProduct = ({ navigation, route }) => {
    const { productId, product, mode } = route.params;
    const [spinner, setSpinner] = React.useState(false);
    const [setSubmitStatus, setSubmitMessage] = React.useState('');

    const [visible, setVisible] = React.useState(false);

    const [isSwitchOn, setIsSwitchOn] = React.useState(false);

    const [formData, setFormData] = React.useState(
        {
            name: '',
            manufacturer: '',
            tags: '',
            manufacturerAddress: '',
            directions: '',
            caution: '',
            contactEmail: '',
            contactNumber: '',
            shelfLife: '',
            productImage: 'https://i.ibb.co/brFh7nG/box-1252639-640.png',
            isActive: true
        });

    const handleChange = (event) => {
        return setFormData({ ...formData, [event.target.name]: event.target.value });
    }


    const onToggleSwitch = () => setFormData({ ...formData, isActive: !formData.isActive });

    useFocusEffect(
        React.useCallback(() => {
            // Do something when the screen is focused
            console.log('useEffect of add product');
            if (mode === 'edit') {
                setFormData({
                    name: product.name,
                    manufacturer: product.manufacturer,
                    tags: product.tags.join(','),
                    manufacturerAddress: product.manufacturerAddress,
                    directions: product.directions,
                    caution: product.caution,
                    contactEmail: product.contactEmail,
                    contactNumber: product.contactNumber,
                    shelfLife: String(product.shelfLife),
                    productImage: product.productImage,
                    isActive: product.isActive
                });
            }

            //fetchProducts();

            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, [])
    );


    const handleSubmit = async () => {
        if (formData.name === '' || formData.manufacturer === '' || formData.tags === '') {
            return Alert.alert('Error', 'Name, Manufacturer and Tags fields are required');
        }
        let newdata = { ...formData, tags: formData.tags.split(',') };
        console.log(newdata);

        setSpinner(true);

        try {
            let response = await api.post('/products', newdata);
            console.log(response?.data);
            if (response.data.success === true) {
                setSpinner(false);
                Alert.alert('Success', 'Added Successfully');
                return navigation.navigate('Products');

            } else {
                setSpinner(false);
                Alert.alert('Error', response.data?.status);
                return;
            }


        }
        catch (err) {
            console.log(err);
            Alert.alert('Error', err?.response.data?.status);
            setSpinner(false);
            return;
        }
    }


    const handleUpdate = async () => {
        console.log('submit called : ');
        console.log({ ...formData, tags: formData.tags.split(',') });
        setSpinner(true);
        try {
            let modifiedProduct = { ...formData };
            const response = await api.patch(`/products/${product._id}`, modifiedProduct);
            if (response.data.success === true) {
                setSpinner(false);
                //setOriginalVariant(formData);
                Alert.alert('Success', 'Product updated successfully');
                return;
            }
        } catch (error) {
            console.log(err);
            Alert.alert('Error', err?.response.data?.status);
            setSpinner(false);
            return;
        }
    }

    const handleArchive = async () => {
        setSpinner(true);
        try {
            const response = await api.put(`/products/${product._id}`, { isActive: false });
            if (response.data.success === true) {
                setSpinner(false);
                Alert.alert('Success', 'Product archived successfully');
                return;
            }
        } catch (error) {
            console.log(err);
            Alert.alert('Error', err?.response.data?.status);
            setSpinner(false);
            return;
        }
    }


    return (
        <View style={style.container}>
            <ScrollView style={style.scrollView}>
                <TextInput
                    mode="flat"
                    label="Product Name"
                    placeholder="Enter Product Name"
                    value={formData.name}
                    onChangeText={text => handleChange({ target: { name: 'name', value: text } })}
                    style={style.margin}
                    disabled={spinner}
                />
                <TextInput
                    mode="flat"
                    label="Manufacturer"
                    name="manufacturer"
                    placeholder="Enter Manufacturer Name"
                    value={formData.manufacturer}
                    onChangeText={text => handleChange({ target: { name: 'manufacturer', value: text } })}
                    style={style.margin}
                    disabled={spinner}
                />
                <TextInput
                    mode="flat"
                    label="Tags"
                    placeholder="Enter Tags, comma seperated"
                    value={formData.tags}
                    onChangeText={text => handleChange({ target: { name: 'tags', value: text } })}
                    style={style.margin}
                    disabled={spinner}
                />
                <TextInput
                    mode="flat"
                    label="Manufacturer Address"
                    value={formData.manufacturerAddress}
                    onChangeText={text => handleChange({ target: { name: 'manufacturerAddress', value: text } })}
                    placeholder="Enter manufacturer address"
                    style={style.margin}
                    disabled={spinner}
                />
                <TextInput
                    mode="flat"
                    label="Directions"
                    value={formData.directions}
                    onChangeText={text => handleChange({ target: { name: 'directions', value: text } })}
                    placeholder="Enter directions"
                    style={style.margin}
                    disabled={spinner}
                />
                <TextInput
                    mode="flat"
                    label="Caution"
                    value={formData.caution}
                    onChangeText={text => handleChange({ target: { name: 'caution', value: text } })}
                    placeholder="Enter caution information"
                    style={style.margin}
                    disabled={spinner}
                />
                <TextInput
                    mode="flat"
                    label="Contact Email"
                    value={formData.contactEmail}
                    onChangeText={text => handleChange({ target: { name: 'contactEmail', value: text } })}
                    placeholder="Enter contact email"
                    style={style.margin}
                    disabled={spinner}
                />
                <TextInput
                    mode="flat"
                    label="Contact Number"
                    value={formData.contactNumber}
                    onChangeText={text => handleChange({ target: { name: 'contactNumber', value: text } })}
                    placeholder="Enter Contact Number"
                    style={style.margin}
                    disabled={spinner}
                />
                <TextInput
                    mode="flat"
                    label="Shelf Life"
                    value={formData.shelfLife}
                    onChangeText={text => handleChange({ target: { name: 'shelfLife', value: text } })}
                    placeholder="Enter Shelf Life"
                    style={style.margin}
                    disabled={spinner}
                />
                <TextInput
                    mode="flat"
                    label="Image Link"
                    value={formData.productImage}
                    onChangeText={text => handleChange({ target: { name: 'productImage', value: text } })}
                    placeholder="Enter image link"
                    style={style.margin}
                    disabled={spinner}
                />
                <View style={style.isActiveContainer}>
                    <Text>
                        Is Active
                    </Text>
                    <Switch value={formData.isActive} onValueChange={onToggleSwitch} />
                </View>

                {!mode && <Button mode="contained" style={style.submitBtn} onPress={handleSubmit}>
                    Create
                </Button>}

                {mode &&
                    <>
                        <Button mode="contained" style={style.submitBtn} onPress={handleUpdate}>
                            Update
                        </Button>
                        <Button mode="outlined" style={style.submitBtn} onPress={handleArchive}>
                            Archive
                        </Button>
                    </>
                }
            </ScrollView>

        </View>
    );
};



export default AddProduct;

const style = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        //justifyContent: 'center',
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
    margin: {
        margin: 8,
    },
    isActiveContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 10,
    },
    submitBtn: {
        margin: 12,
    },
});