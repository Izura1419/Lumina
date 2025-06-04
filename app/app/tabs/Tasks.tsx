import React, {useEffect} from 'react';

import { useNavigation } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";

import { View } from 'react-native';
import { Appbar } from 'react-native-paper';
import * as Notifications from 'expo-notifications';

import TaskList from '../../components/elements/Lists/TaskList'

export default function Tasks() {
    const navigation = useNavigation();

    // Запрос разрешения на уведомления при старте
    useEffect(() => {
        const requestPermissions = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            console.warn('Уведомления не разрешены');
        }
        };
    
        requestPermissions();
    }, []);

    return (
        <>
            <Appbar.Header mode='center-aligned'>
                <Appbar.Action icon='menu' onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
                <Appbar.Content title="Заметки" />
            </Appbar.Header>

            <View style={{width: '100%', height: '80%'}}>

                <TaskList />
                
            </View>
        </>
    );
}