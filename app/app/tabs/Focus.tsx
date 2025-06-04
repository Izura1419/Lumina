import * as React from 'react';
import { View} from 'react-native';
import { Appbar } from 'react-native-paper';

import { useNavigation } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";

import MainText from '../../components/elements/Typography/MainText';
import Timer from '../../components/elements/PomodoroTimer/Timer';

export default function Focus() {
    const navigation = useNavigation();
    return (
        <>
            <Appbar.Header mode='center-aligned'>
                    <Appbar.Action icon='menu' onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
                <Appbar.Content title="Таймер" />
            </Appbar.Header>

            <View>
                <MainText>Помодоро</MainText>

                <Timer />
            </View>
        </>
    );
}