import React, {useState} from 'react';
import { View} from 'react-native';
import { Appbar, Snackbar } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";

import { useThemeContext } from '../../components/context/ThemeContext';
import { useTimerSettings } from '../../components/context/TimerSettingsContext';

import MainText from '../../components/elements/Typography/MainText';
import ButtonEl from '../../components/elements/Buttons/ButtonEl';
import InputEl from '../../components/elements/Inputs/InputEl';

export default function Settings() {
    //навигация для перехода назад
    const navigation = useNavigation();

    //цветовая тема
    const { theme } = useThemeContext();

    //состояния для отслеживания полей ввода
    const [focusTimeValue, setFocusTimeValue] = useState('');
    const [shortBreakTimeValue, setShortBreakTimeValue] = useState('');
    const [longBreakTimeValue, setLongBreakTimeValue] = useState('');

    //состояния снэкбара
    const [visibleSnackbar, setVisibleSnackbar] = useState(false)

    //функции из провайдера для изменения значений времени
    const {
        setFocusDuration,
        setShortBreakDuration,
        setLongBreakDuration
    } = useTimerSettings()

    //функция для сохранения изменений
    const saveChanges = () => {
        if(focusTimeValue != '') {
            setFocusDuration(+focusTimeValue);
            setVisibleSnackbar(true);
        } 
        if(shortBreakTimeValue != '') {
            setShortBreakDuration(+shortBreakTimeValue);
            setVisibleSnackbar(true);
        }
        if(longBreakTimeValue != '') {
            setLongBreakDuration(+longBreakTimeValue);
            setVisibleSnackbar(true);
        }

        setFocusTimeValue('');
        setShortBreakTimeValue('');
        setLongBreakTimeValue('');
    }

    return (
        <>
            <Appbar.Header mode='center-aligned'>
                <Appbar.Action icon='arrow-left' onPress={() => navigation.goBack()} />
                <Appbar.Content title="Настройки" />
            </Appbar.Header>

            <View style={{
                backgroundColor: theme.colors.background,
                width: '100%',
                height: '100%'
            }}>
                <View>
                    <MainText>Настройки таймера</MainText>
                    <View style={{
                        rowGap: 20
                    }}>
                        <InputEl 
                            placeholder='Время фокуса' 
                            inputType='settings'
                            value={focusTimeValue}
                            onChangeText={setFocusTimeValue}
                        />
                        <InputEl 
                            placeholder='Время короткого перерыва' 
                            inputType='settings'
                            value={shortBreakTimeValue}
                            onChangeText={setShortBreakTimeValue}
                        />
                        <InputEl 
                            placeholder='Время большого перерыва' 
                            inputType='settings'
                            value={longBreakTimeValue}
                            onChangeText={setLongBreakTimeValue}
                        />
                    </View>
                </View>

                <View style={{
                    width: '100%',
                    alignItems: 'center',
                    marginTop: 30
                }}>
                    <ButtonEl 
                        typeButton='buttonLabel'
                        icon='check'
                        label='Сохранить'
                        onPress={saveChanges}
                    />
                </View>

                <View style={{
                    position: 'absolute',
                    bottom: '10%',
                    width: '100%'
                }}>
                    <Snackbar
                        visible={visibleSnackbar}
                        onDismiss={() => setVisibleSnackbar(false)}
                        action={{
                        label: 'Закрыть'
                        
                    }}>
                        Успешно сохранено
                    </Snackbar>
                </View>

            </View>
        </>
    );
}