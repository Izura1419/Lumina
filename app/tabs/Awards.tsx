import * as React from 'react';
import { View} from 'react-native';
import { Appbar } from 'react-native-paper';

import { useNavigation } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";

import MainText from '../../components/elements/Typography/MainText';
import AwardsBox from '../../components/elements/Awards/AwardsBox';

export default function Awards() {
    const navigation = useNavigation();
    return (
        <>
            <Appbar.Header mode='center-aligned'>
                    <Appbar.Action icon='menu' onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
                <Appbar.Content title="Достижения" />
            </Appbar.Header>

            <View style={{
                width: '100%',
                height: '90%'
            }}>
                <MainText>Ваши достижения 🔥</MainText>
                <AwardsBox />
            </View>
        </>
    );
}