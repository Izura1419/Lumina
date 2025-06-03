import { useState, useEffect } from 'react';
import { View, Vibration } from 'react-native';
import Animated, { useSharedValue, withTiming, withSequence, useAnimatedProps } from 'react-native-reanimated';
import { Svg, Circle } from 'react-native-svg';
import * as Notifications from 'expo-notifications';

import { useThemeContext } from '@/components/context/ThemeContext';
import { useTimerSettings  } from "@/components/context/TimerSettingsContext";

import MainText from '@/components/elements/Typography/MainText';
import ButtonEl from '../Buttons/ButtonEl';
import { unlockAward } from '@/components/data/awardService';

const AnimatedCircle = Animated.createAnimatedComponent(Circle) //сам таймер (основной круг)
const AnimatedCircleBack = Animated.createAnimatedComponent(Circle) // фоновый круг

//статусы таймера
type TimerMode = 'focus' | 'shortBreak' | 'longBreak'

export default function Timer(){

    //берем время из провайдера
    const {
        focusDuration,
        shortBreakDuration,
        longBreakDuration
    } = useTimerSettings()

    //создаём переменные состояния
    const [mode, setMode] = useState<TimerMode>('focus');

    //вычисляем количество секунд из переменной провайдера
    const [ secondsLeft, setsecondsLeft] = useState(focusDuration * 60);

    //активен ли таймер
    const [isRunning, setIsRunning] = useState(false);

    //счётчик пройдённых кругов
    const [cycleCount, setCycleCount] = useState(0);

    //следим за изменением состояния таймера
    //в зависимости от состояния устанавливаем оставшееся время
    useEffect(() => {
        let duration = 0;
        if(mode == 'focus') duration = focusDuration * 60;
        if(mode == 'shortBreak') duration = shortBreakDuration * 60;
        if(mode == 'longBreak') duration = longBreakDuration * 60;
        setsecondsLeft(duration);
    }, [mode, focusDuration, shortBreakDuration, longBreakDuration])

    //берем тему
    const { theme } = useThemeContext();

    //переменные для кругов
    const radius = 120;
    const strokeWidth = 10
    const innerRadius = radius - strokeWidth / 2
    const circumference = 2 * Math.PI * innerRadius

    //переменные для анимации круга
    const progress = useSharedValue<number>(0)
    const animatedStrokeWidth = useSharedValue<number>(strokeWidth)

    //стили, которые анимируем
    const animatedPropsFill = useAnimatedProps(() => ({
        strokeDasharray: [circumference * progress.value, circumference],
        strokeWidth: animatedStrokeWidth.value,
        stroke: mode == 'focus' ? theme.colors.primary : theme.colors.inversePrimary
    }))
    const animatedPropsBack = useAnimatedProps(() => ({
        strokeWidth: animatedStrokeWidth.value
    }))

    //Обработчик уведомлений
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
    });

    //фукнция, которая проверяет какой этап следующий
    //устанавливает его плюс включает вибрацию и уведомление
    const handleTimerEnd = async () => {
        Vibration.vibrate();

        await Notifications.scheduleNotificationAsync({
            content: {
              title: '⏰ Время вышло!',
              body: mode === 'focus' ? 'Хорошая работа! Пора сделать перерыв' 
              : 'Отдохнули? Пора сфокусироваться'
            },
            trigger: null, 
          });

        if(mode == 'focus'){
            const nextCycle = cycleCount + 1;
            setCycleCount(nextCycle);
            if(nextCycle % 4 == 0){
                setMode('longBreak');
            }
            else{
                setMode('shortBreak');
            }

            //достижение
            if(cycleCount * focusDuration >= 60){
                await unlockAward("focus_hour");
            }
        }
        else{
            setMode('focus');
        }
        setIsRunning(false);
    }

    //отслеживание состояния активности
    useEffect(() => {
        if(!isRunning) return;
        //интервал, который отсчитывает секунды (отнимает время) и запускает анимацию
        const interval = setInterval(() => {
            setsecondsLeft((prev) => {
                if(prev <= 0){
                    progress.value = withTiming(progress.value - progress.value, {duration: 1000})
                    clearInterval(interval);
                    handleTimerEnd();
                    return 0;
                }
                progress.value = withTiming(progress.value + (1 / (focusDuration * 60) ), {duration: 1000})
                animatedStrokeWidth.value = withSequence(
                    withTiming(animatedStrokeWidth.value - 2, {duration: 500}),
                    withTiming(animatedStrokeWidth.value = 10, {duration: 500})
                )
                return prev - 1;
            })

        }, 1000);

        return () => clearInterval(interval)
    },[isRunning])

    //преобразовываем секунды в формат мм:сс
    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60)
            .toString()
            .padStart(2, '0');
        const seconds = (totalSeconds % 60)
            .toString()
            .padStart(2, '0');
        return `${minutes}:${seconds}`
    }

    //статусы для вывода на экран
    const modeLabel = {
        focus: 'Фокус',
        shortBreak: 'Перерыв',
        longBreak: 'Большой перерыв'
    }

    // выводим элементы
    return(
        <View style={{ alignItems: 'center', justifyContent: 'center' }} >
            <Svg style={{height: 250, width: 250}}>
                <AnimatedCircleBack
                    cx={radius}
                    cy={radius}
                    r={innerRadius}
                    originX={radius}
                    originY={radius}
                    fill='transparent'
                    stroke={theme.colors.surfaceVariant}
                    strokeLinecap='round' 
                    animatedProps={animatedPropsBack}
                />
                <AnimatedCircle
                    cx={radius}
                    cy={radius}
                    r={innerRadius}
                    originX={radius}
                    originY={radius}
                    fill='transparent'
                    strokeLinecap='round'
                    rotation='-90'
                    animatedProps={animatedPropsFill}
                />
                <View style={{
                    width: '95%'
                }}>
                    <MainText style={{textAlign: 'center', paddingVertical: 50}}>{modeLabel[mode]}</MainText>
                    <MainText style={{textAlign: 'center', paddingVertical: 0}}>{formatTime(secondsLeft)}</MainText>
                </View>
            </Svg>
            <View style={{flexDirection: 'row', columnGap: 50}}>
                <ButtonEl 
                    typeButton='buttonFocus' 
                    icon={isRunning ? 'pause' : 'play'}
                    label='' 
                    onPress={() => setIsRunning((prev) => !prev)}
                />
                <ButtonEl 
                    typeButton='buttonFocus' 
                    icon={'skip-next'}
                    label='' 
                    onPress={() => {
                        setIsRunning(false);
                        handleTimerEnd();
                        setsecondsLeft(
                            mode === 'focus'
                                ? focusDuration * 60
                                : mode === 'shortBreak'
                                ? shortBreakDuration * 60
                                : longBreakDuration * 60
                        )
                        progress.value = withTiming(progress.value - progress.value, {duration: 1000})
                    }}
                />
            </View>
    </View>
    )   
}