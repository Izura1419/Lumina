import React, { useState, useEffect } from 'react';
import { View, ScrollView, Keyboard} from 'react-native';
import { Appbar, ActivityIndicator, Portal, Dialog } from 'react-native-paper';

import { useNavigation } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";

import { saveMood, getMoods, getMoodAdvice } from '@/components/data/moodService'

import MainText from '../../components/elements/Typography/MainText';
import ButtonEl from '../../components/elements/Buttons/ButtonEl';
import InputEl from '../../components/elements/Inputs/InputEl';
import MoodButton from '../../components/elements/Buttons/MoodButton';
import MoodList from '../../components/elements/Lists/MoodList';
import LabelText from "../../components/elements/Typography/LabelText";

import MoodChart from "../../components/elements/Charts/MoodChart";

//тип для создания заметки настроения
type MoodType = {
    title: string,
    moodValue: number,
    description: string;
}

export default function Mood() {
    //навигация для меню
    const navigation = useNavigation();

    //состояния выбранного настроения
    const [selectedMood, setSelectedMood] = useState(0);

    //состояния для поля ввода
    const [inputValue, setInputValue] = useState('');

    //состояния для видимости всплывающего окна
    const [visibleDialog, setVisibleDialog] = useState(false);

    //совет от нейросети
    const [advise, setAdvise] = useState('');

    //состояние загрузки
    const [loading, setLoading] = useState(true)

    //массив настроений
    const [moods, setMoods] = useState<MoodType[]>([]);

    //загрузка массива записей настроений из базы данных
    useEffect(() => {
        const loadMoods = async () => {
            const storedMoods = await getMoods();
            setMoods(storedMoods);
            setLoading(false);
        }

        loadMoods();
    }, []);

    //переменная проверяющая возможность добавления записи
    const canAddMood = selectedMood != 0;

    //функция для форматирования даты и времени
    const formatDate = (date: Date): string => {
        const formatNumber = (num: number) => num.toString().padStart(2, '0');

        const day = formatNumber(date.getDate());
        const month = formatNumber(date.getMonth() + 1);
        const hours = formatNumber(date.getHours());
        const minutes = formatNumber(date.getMinutes());

        return `${day}.${month} ${hours}:${minutes}`
    }

    //асинхронная функция создания записи настроения и добавления в базу
    const handleAddMood =  async () => {
        if(selectedMood == 0) return

        const newMood: MoodType = {
            title: new Date().getTime().toString(),
            moodValue: selectedMood,
            description: inputValue
        }
        //сначала локально
        setMoods([...moods, newMood]);

        setInputValue('');
        setSelectedMood(0)
        Keyboard.dismiss();

        //потом в бд
        await saveMood(newMood)

        //и совет от нейросети 
        const advise = await getMoodAdvice(inputValue);
        setAdvise(advise);
    }

    return (
        <>
        {/* Шапка и название страницы */}
            <Appbar.Header mode='center-aligned'>
                <Appbar.Action icon='menu' onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
                <Appbar.Content title="Настроение" />
            </Appbar.Header>

            <View style={{width: '100%', height:'80%'}}>

            {/* Всплывающее окно с советом */}
                <View>
                    <Portal>
                        <Dialog visible={visibleDialog} onDismiss={() => setVisibleDialog((prev) => !prev)} style={{maxHeight: '90%'}}>
                            <Dialog.Title>Совет от нейросети</Dialog.Title>
                            <Dialog.ScrollArea>
                                <ScrollView >
                                    <Dialog.Content style={{paddingHorizontal: 0, marginVertical: 20}}>
                                        <LabelText>{advise}</LabelText>
                                    </Dialog.Content>
                                </ScrollView>
                            </Dialog.ScrollArea>
                            <Dialog.Actions>
                                <ButtonEl 
                                    typeButton='buttonLabel'
                                    icon='check'
                                    label='Хорошо'
                                    onPress={() => setVisibleDialog((prev) => !prev)}
                                />
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </View>

                {/* Главный текст */}
                <MainText>Как настроение?</MainText>

                {/* Панель выбора настроения */}
                <View>
                    <MoodButton moodValue={selectedMood} setMoodValue={setSelectedMood} />
                </View>

                {/* Поле ввода и кнопка */}
                <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginVertical: 20
                }}>
                    <InputEl 
                        inputType='mood'
                        placeholder='Опишите своё настроение'
                        value={inputValue}
                        onChangeText={setInputValue}
                    />
                    <ButtonEl 
                        typeButton='buttonMoodEdit'
                        icon='pencil-outline'
                        label=''
                        onPress={handleAddMood}
                        disabled={!canAddMood}
                    />
                </View>

                <View style={{flex: 1}}>

                    {/* Индикатор загрузки */}
                    <ActivityIndicator animating={loading} style={{position: 'absolute', width: '100%'}}/>

                    <ScrollView>
                        
                        {/* Статистика */}
                        {moods.length > 0 && (
                            <MoodChart moods={moods} />
                        )}

                        {/* Список заметок с настроением */}
                        {[...moods].reverse().map((mood) => (
                            <MoodList 
                                key={mood.title}
                                title={
                                    `${formatDate(new Date(+mood.title))} - ${
                                        mood.moodValue == 1 ? 'Ужасно' : 
                                        mood.moodValue == 2 ? 'Грустно' : 
                                        mood.moodValue == 3 ? 'Нормально' : 
                                        mood.moodValue == 4 ? 'Хорошо' : 
                                        'Отлично' 
                                    }`
                                } 
                                moodValue={mood.moodValue}
                                description={mood.description}
                            />
                        ))}
                    </ScrollView>

                        {/* Кнопка спросить совет */}
                        <View style={{
                            width: '100%',
                            alignItems: 'center',
                            marginBottom: -60,
                            marginTop: 20
                        }}>
                            <ButtonEl 
                                typeButton='buttonLabel'
                                icon='robot-confused-outline'
                                label='Совет'
                                onPress={() => setVisibleDialog((prev) => !prev)}
                                disabled={advise == ''}
                            />
                        </View>
                </View>
            </View>
        </>
    );
}