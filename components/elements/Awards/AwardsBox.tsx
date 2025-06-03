import { View, ScrollView } from 'react-native'
import { useCallback, useState } from 'react'
import AwardsEl from './AwardEl'
import { getUserAwards } from '@/components/data/awardService'
import { useFocusEffect } from '@react-navigation/native'

export default function AwardsBox(){

    const [awards, setAwards] = useState<Record<string, boolean>>({});

    useFocusEffect(
        useCallback(() => {
          const fetchAwards = async () => {
            const data = await getUserAwards();
            setAwards(data);
          };
          fetchAwards();
        }, [])
    );

    return(
        <View style={{marginHorizontal: 15, flex: 1}}>
            <ScrollView>
                <AwardsEl 
                    title='Первый шаг' 
                    subtitle='Создал первую страницу'
                    icon="walk"
                    done={awards["first_page"] === true}
                />
                <AwardsEl 
                    title='Начало пути' 
                    subtitle='Создал первую заметку'
                    icon="file-document-edit"
                    done={awards["first_note"] === true}
                />
                <AwardsEl 
                    title='Первые плоды' 
                    subtitle='Отметил первую выполненную задачу'
                    icon="check-bold"
                    done={awards["first_task_done"] === true}
                />
                <AwardsEl 
                    title='Фокус 3 дня' 
                    subtitle='Открывал приложение 3 дня подряд'
                    icon="calendar-check"
                    done={awards["focused_3_days"] === true}
                />
                <AwardsEl 
                    title='Фокус недели' 
                    subtitle='Открывал приложение 7 дней подряд'
                    icon="calendar-star"
                    done={awards["focused_7_days"] === true}
                />
                <AwardsEl 
                    title='Мастер заметок' 
                    subtitle='Создал 20 заметок'
                    icon="note-multiple"
                    done={awards["20_notes"] === true}
                />
                <AwardsEl 
                    title='Завершитель' 
                    subtitle='Выполнил 20 задач'
                    icon="checkbox-marked"
                    done={awards["20_tasks_done"] === true}
                />
                <AwardsEl 
                    title='Чистильщик' 
                    subtitle='Удалил 5 заметок'
                    icon="pistol"
                    done={awards["deleted_5_notes"] === true}
                />
                <AwardsEl 
                    title='Глубокий фокус' 
                    subtitle='Работал 1 ч+'
                    icon="timer-outline"
                    done={awards["focus_hour"] === true}
                />
                <AwardsEl 
                    title='Чёрный пояс по фокусу' 
                    subtitle='Открыл приложение 30 дней подряд'
                    icon="karate"
                    done={awards["karate"] === true}
                />
                <AwardsEl 
                    title='Ночной режим' 
                    subtitle='Использовал тёмную тему'
                    icon="weather-night"
                    done={awards["night_mode"] === true}
                />
                <AwardsEl 
                    title='Скиталец страниц' 
                    subtitle='Создал 10 разных страниц'
                    icon="book-open-variant"
                    done={awards["10_pages"] === true}
                />
                <AwardsEl 
                    title='Терпеливый' 
                    subtitle='Выполнил задачу через 7+ дней'
                    icon="timer-sand-complete"
                    done={awards["done_after_7_days"] === true}
                />
                <AwardsEl 
                    title='Настроение плюс' 
                    subtitle='Отметил 5 дней хорошего настроения'
                    icon='emoticon-cool-outline'
                    done={awards["5_days_good_mood"] === true}
                />
                <AwardsEl 
                    title='Искренность' 
                    subtitle='Отметил плохое настроение'
                    icon="emoticon-sad"
                    done={awards["mood_sad"] === true}
                />
            </ScrollView>
        </View>
    )
}