import * as React from 'react';
import { StyleSheet, View, Alert, FlatList, ScrollView } from 'react-native';
import { ActivityIndicator, Chip, FAB, List, Menu, Switch, Text, TextInput } from 'react-native-paper';
import { useRecoilState } from 'recoil';
import { userDetailAtom } from '../../recoil/atoms';
import { _retrieveData, _storeData } from '../../utility/asyncStorage';
import api from '../../api';
import { useFocusEffect } from '@react-navigation/native';
import { Modal, Portal, Button, PaperProvider } from 'react-native-paper';

const Tags = ({ tags }) => (
    tags.map(item => <Chip textStyle={{ textTransform: 'capitalize' }} compact mode='outlined' >{item}</Chip>)
);


const AddVariant = ({ navigation, route }) => {
    const { variant, productId, mode } = route.params;
    const [spinner, setSpinner] = React.useState(false);
    const [setSubmitStatus, setSubmitMessage] = React.useState('');

    const [visible, setVisible] = React.useState(false);

    const [isSwitchOn, setIsSwitchOn] = React.useState(false);

    const [formData, setFormData] = React.useState(
        {
            barcode: '',
            unit: '',
            tags: '',
            size: '',
            availableQuantity: '',
            currency: 'rs',
            price: '',
            manufactureDate: '',
            variantImage: 'https://i.ibb.co/brFh7nG/box-1252639-640.png',
            isActive: true
        });

    const handleChange = (event) => {
        return setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);

    const onToggleSwitch = () => setFormData({ ...formData, isActive: !formData.isActive });

    useFocusEffect(
        React.useCallback(() => {
            // Do something when the screen is focused
            console.log('useEffect of add/edit variant');
            if (mode === 'edit') {
                console.log('edit mode');
                console.log(variant);
                setFormData({
                    barcode: String(variant.barcode),
                    unit: String(variant.unit),
                    tags: variant.tags.join(','),
                    size: String(variant.size),
                    availableQuantity: String(variant.availableQuantity),
                    currency: variant.currency,
                    price: String(variant.price),
                    manufactureDate: variant.manufactureDate,
                    variantImage: variant.variantImage,
                    isActive: variant.isActive
                });
            }

            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, [])
    );


    const handleSubmit = async () => {
        if (formData.barcode === '' || formData.unit === '' || formData.size === '' || formData.price === '') {
            return Alert.alert('Error', 'Barcode, Unit, Size and Price fields are required');
        }
        let newdata = { ...formData, tags: formData.tags.split(',') };

        setSpinner(true);

        try {
            let response = await api.post(`/variants/${productId}`, newdata);
            console.log(response?.data);
            if (response.data.success === true) {
                setSpinner(false);
                Alert.alert('Success', 'Variant added successfully');
                return navigation.goBack();

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
        console.log('update variant called : ');
        if (formData.barcode === '' || formData.unit === '' || formData.size === '' || formData.price === '') {
            return Alert.alert('Error', 'Barcode, Unit, Size and Price fields are required');
        }
        console.log({ ...formData, tags: formData.tags.split(',') });
        setSpinner(true);
        try {
            let modifiedVariant = { ...formData };
            const response = await api.patch(`/variants/${variant._id}`, modifiedVariant);
            if (response.data.success === true) {
                setSpinner(false);
                //setOriginalVariant(formData);
                Alert.alert('Success', 'Variant updated successfully');
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
            const response = await api.put(`/variants/${variant._id}`, { isActive: false });
            if (response.data.success === true) {
                setSpinner(false);
                Alert.alert('Success', 'Variant archived successfully');
                return;
            }
        } catch (error) {
            console.log(err);
            Alert.alert('Error', err?.response.data?.status);
            setSpinner(false);
            return;
        }
    }

    const handleUnitMenu = (unit) => {
        setFormData({ ...formData, unit: unit });
        setVisible(false);
    }


    return (
        <View style={style.container}>
            <ScrollView style={style.scrollView}>
                <TextInput
                    mode="flat"
                    label="Barcode"
                    placeholder="Enter variant's barcode"
                    value={formData.barcode}
                    onChangeText={text => handleChange({ target: { name: 'barcode', value: text } })}
                    style={style.margin}
                    disabled={spinner}
                />
                <TextInput
                    mode="flat"
                    label="Size"
                    name="size"
                    placeholder="Enter size of variant "
                    value={formData.size}
                    onChangeText={text => handleChange({ target: { name: 'size', value: text } })}
                    style={style.margin}
                    disabled={spinner}
                />
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 10,
                    }}>
                    <Text style={{ paddingRight: 10 }}>
                        Select Variant's Unit
                    </Text>
                    <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={<Chip onPress={openMenu} mode='outlined' disabled={spinner} >{formData.unit ? formData.unit : 'Not Selected'}</Chip>}>
                        <Menu.Item onPress={() => handleUnitMenu('gram')} title="Gram(g)" />
                        <Menu.Item onPress={() => handleUnitMenu('kilogram')} title="Kilo Gram(kg)" />
                        <Menu.Item onPress={() => handleUnitMenu('litre')} title="Litre(l)" />
                        <Menu.Item onPress={() => handleUnitMenu('millilitre')} title="Milli Litre(ml)" />
                        <Menu.Item onPress={() => handleUnitMenu('piece')} title="Piece" />
                    </Menu>

                </View>
                <TextInput
                    mode="flat"
                    label="Available Quantity"
                    value={formData.availableQuantity}
                    onChangeText={text => handleChange({ target: { name: 'availableQuantity', value: text } })}
                    placeholder="Enter available quantity"
                    style={style.margin}
                    disabled={spinner}
                />
                <TextInput
                    mode="flat"
                    label="price"
                    value={formData.price}
                    onChangeText={text => handleChange({ target: { name: 'price', value: text } })}
                    placeholder="Enter Variant's Price"
                    style={style.margin}
                    disabled={spinner}
                />
                <TextInput
                    mode="flat"
                    label="currency"
                    value={formData.currency}
                    onChangeText={text => handleChange({ target: { name: 'currency', value: text } })}
                    placeholder="Enter currency of price"
                    style={style.margin}
                    disabled={spinner}
                />

                <TextInput
                    mode="flat"
                    label="Image Link"
                    value={formData.variantImage}
                    onChangeText={text => handleChange({ target: { name: 'variantImage', value: text } })}
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
                    Create Variant
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



export default AddVariant;

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