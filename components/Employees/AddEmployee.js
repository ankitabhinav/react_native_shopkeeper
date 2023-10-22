import * as React from 'react';
import { StyleSheet, View, Alert, FlatList, ScrollView } from 'react-native';
import { ActivityIndicator, Chip, FAB, List, Switch, Text, TextInput } from 'react-native-paper';
import { useRecoilState } from 'recoil';
import { userDetailAtom } from '../../recoil/atoms';
import { _retrieveData, _storeData } from '../../utility/asyncStorage';
import api from '../../api';
import { useFocusEffect } from '@react-navigation/native';
import { Modal, Portal, Button, PaperProvider } from 'react-native-paper';

const AddEmployee = ({ navigation, route }) => {
    const { employee, mode } = route.params;
    const [spinner, setSpinner] = React.useState(false);
    const [setSubmitStatus, setSubmitMessage] = React.useState('');

    const [visible, setVisible] = React.useState(false);

    const [isSwitchOn, setIsSwitchOn] = React.useState(false);

    const [formData, setFormData] = React.useState(
        {
            firstName: '',
            lastName: '',
            contactEmail: '',
            contactNumber: '',
            profileImage: 'https://i.ibb.co/2K2qWdD/personal.png',
            isActive: true
        });

    const handleChange = (event) => {
        return setFormData({ ...formData, [event.target.name]: event.target.value });
    }


    const onToggleSwitch = () => setFormData({ ...formData, isActive: !formData.isActive });

    useFocusEffect(
        React.useCallback(() => {
            // Do something when the screen is focused
            console.log('useEffect of add/edit employee');
            if (mode === 'edit') {
                setFormData({
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    contactEmail: employee.contactEmail,
                    profileImage: employee.profileImage,
                    isActive: employee.isActive
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
        if (formData.firstName === '' || formData.lastName === '' || formData.contactEmail === '' || formData.contactNumber === '') {
            return Alert.alert('Error', 'Please fill all the fields');
        }
        let newdata = { ...formData };
        console.log(newdata);

        setSpinner(true);

        try {
            let response = await api.post('/employees', newdata);
            console.log(response?.data);
            if (response.data.success === true) {
                setSpinner(false);
                Alert.alert('Success', 'Added Successfully');
                return navigation.navigate('Employees');

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
        console.log({ ...formData });
        setSpinner(true);
        try {
            let modifiedEmployee = { ...formData };
            const response = await api.patch(`/employees/${employee._id}`, modifiedEmployee);
            if (response.data.success === true) {
                setSpinner(false);
                //setOriginalVariant(formData);
                Alert.alert('Success', 'Employee updated successfully');
                return navigation.navigate('Employees')
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
            const response = await api.put(`/employees/${employee._id}`, { isActive: false });
            if (response.data.success === true) {
                setSpinner(false);
                Alert.alert('Success', 'Employee archived successfully');
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
                    label="First Name"
                    placeholder="Enter First Name"
                    value={formData.firstName}
                    onChangeText={text => handleChange({ target: { name: 'firstName', value: text } })}
                    style={style.margin}
                    disabled={spinner}
                />
                <TextInput
                    mode="flat"
                    label="Enter last name"
                    name="lastName"
                    placeholder="Enter Enter last name Name"
                    value={formData.lastName}
                    onChangeText={text => handleChange({ target: { name: 'lastName', value: text } })}
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
                    label="Profile Image"
                    value={formData.profileImage}
                    onChangeText={text => handleChange({ target: { name: 'profileImage', value: text } })}
                    placeholder="Enter Profile Image Link"
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
                        <Button mode="contained" style={style.submitBtn} disabled={spinner} onPress={handleUpdate}>
                            Update
                        </Button>
                        <Button mode="outlined" style={style.submitBtn} disabled={spinner} onPress={handleArchive}>
                            Archive
                        </Button>
                    </>
                }
            </ScrollView>

        </View>
    );
};



export default AddEmployee;

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