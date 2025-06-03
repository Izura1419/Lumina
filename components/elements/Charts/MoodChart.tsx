import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import { CartesianChart, Line } from 'victory-native';
import { useFont } from '@shopify/react-native-skia';

import spaceMono from '@/assets/fonts/SpaceMono-Regular.ttf'; 

import { useThemeContext } from "@/components/context/ThemeContext";

type MoodType = {
  title: string; // метка времени в миллисекундах
  moodValue: number;
  description: string;
};

type MoodChartProps = {
    moods: MoodType[];
};

export default function MoodChart({ moods }: MoodChartProps) {

    //цветовая тема
    const { theme } = useThemeContext();

    //состояния времени, чтобы выводить график
    const [data, setData] = useState<{ x: number; y: number; label: string }[]>([]);

    //шрифт
    const font = useFont(spaceMono, 12);

    //посылаем асинхронный запрос к бд, получаем все отметки настроений и форматируем даты
    
    useEffect(() => {
        const limitedMoods = moods.slice(-8); //  берём только последние 8 записей

        const formattedData = [...limitedMoods]
            .sort((a, b) => parseInt(a.title) - parseInt(b.title))
            .map((mood, index) => {
                const date = new Date(parseInt(mood.title));
                const label = date.toLocaleDateString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit'
                });
                return {
                    x: index,
                    y: mood.moodValue,
                    label,
                };
            });

        setData(formattedData);

    }, [moods]);// график обновляется при изменении moods

    //возвращаем линейный график из настроений

    return (
        <View style={{ height: 150, width: '95%', marginHorizontal: 5 }}>
            <CartesianChart
                data={data}
                xKey="x"
                yKeys={['y']}
                axisOptions={{ 
                    font,
                    labelColor: theme.colors.onSurface,
                    lineColor: theme.colors.outline
                }}
            >
                {({ points }) => (
                    <Line points={points.y} color={theme.colors.primary} strokeWidth={3} />
                )}
            </CartesianChart>

        {/* Подписи под графиком */}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                {data.map((point, index) => (

                <Text key={index} style={{ fontSize: 12, color: theme.colors.onSurface }}>
                    {point.label}
                </Text>
                
                ))}
            </View>
        </View>
    );
}
