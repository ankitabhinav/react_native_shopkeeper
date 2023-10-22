import * as React from 'react';
import { StyleSheet, View, Alert, FlatList, ScrollView } from 'react-native';
import { ActivityIndicator, Chip, FAB, List, Menu, Switch, Text, TextInput } from 'react-native-paper';
import { useRecoilState } from 'recoil';
import { userDetailAtom } from '../../recoil/atoms';
import { _retrieveData, _storeData } from '../../utility/asyncStorage';
import api from '../../api';
import { useFocusEffect } from '@react-navigation/native';
import { Modal, Portal, Button, PaperProvider } from 'react-native-paper';
import { set } from 'react-native-reanimated';

const AddPosCounter = ({ navigation, route }) => {
    const { pos, mode } = route.params;
    const [spinner, setSpinner] = React.useState(false);
    const [setSubmitStatus, setSubmitMessage] = React.useState('');
    const [employees, setEmployees] = React.useState([]);
    const [visible, setVisible] = React.useState(false);

    const [isSwitchOn, setIsSwitchOn] = React.useState(false);

    const [formData, setFormData] = React.useState(
        {
            counterName: '',
            assignedTo: '',
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
            console.log('useEffect of add/edit pos counter');
            getAllEmployees();
            if (mode === 'edit') {
                setFormData({
                    counterName: pos.counterName,
                    assignedTo: pos.assignedTo,
                    isActive: pos.isActive
                });
            }

            //fetchProducts();

            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, [])
    );

    const getAllEmployees = async () => {
        try {
            const response = await api.get('/employees?isActive=true');
            if (response.data.success) {
                console.log(response.data);
                return setEmployees(response.data.employees);
            }
        } catch (error) {
            console.log("error");
            return console.log(error);
        }
    }


    const handleSubmit = async () => {
        if (formData.counterName === '' || formData.assignedTo === '') {
            return Alert.alert('Error', 'Please fill all the fields');
        }
        let newdata = { ...formData, assignedTo: formData.assignedTo._id };
        console.log(newdata);

        setSpinner(true);

        try {
            let response = await api.post('/pos', newdata);
            console.log(response?.data);
            if (response.data.success === true) {
                setSpinner(false);
                Alert.alert('Success', 'Pos Added Successfully');
                return navigation.navigate('Pos');

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
        console.log('update called : ');
        console.log({ ...formData });
        setSpinner(true);
        try {
            let modifiedEmployee = { ...formData };
            const response = await api.patch(`/pos/${pos._id}`, modifiedEmployee);
            if (response.data.success === true) {
                setSpinner(false);
                //setOriginalVariant(formData);
                Alert.alert('Success', 'Pos updated successfully');
                return navigation.navigate('Pos')
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

    const handleAssignee = (employee) => {
        setVisible(false);
        setFormData({ ...formData, assignedTo: employee });
    }


    return (
        <View style={style.container}>
            <ScrollView style={style.scrollView}>
                <TextInput
                    mode="flat"
                    label="Counter Name"
                    placeholder="Enter Counter Name"
                    value={formData.counterName}
                    onChangeText={text => handleChange({ target: { name: 'counterName', value: text } })}
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
                        Assigned To
                    </Text>
                    <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={
                            <Chip onPress={openMenu} mode='outlined' disabled={spinner} >
                                {formData.assignedTo ? `${formData.assignedTo.firstName} ${formData.assignedTo.lastName} ` : 'Not Selected'}
                            </Chip>
                        }
                    >
                        {
                            employees.map((employee, index) => {
                                return <Menu.Item key={index} onPress={() => handleAssignee(employee)} title={`${employee.firstName} ${employee.lastName} `} />
                            })
                        }
                    </Menu>

                </View>


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



export default AddPosCounter;

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