import { collection, addDoc, getDocs, orderBy, query, where } from 'firebase/firestore'
import { db } from './firebaseConfig'
import { getUserId } from './userService';

import { unlockAward } from './awardService';
import { getLocalCount, saveLocalCount } from './counterService';

type MoodType = {
    title: string;
    moodValue: number;
    description: string;
}

const MOODS_COLLECTION = "moods";

//Сохранение новой записи
export async function saveMood(mood: {
    title: string;
    moodValue: number;
    description: string;
}) 
  {
    try {
        const userId = await getUserId();
        await addDoc(collection(db, MOODS_COLLECTION), {
          ...mood,
          user_id: userId,
        });

        //достижения
        if(mood.moodValue === 1){
          await unlockAward("mood_sad");
        }
        
        let count = await getLocalCount("goodMoodCount") || 0;
        count++;
        await saveLocalCount("goodMoodCount", count);
        if(count >= 5){
          await unlockAward("5_days_good_mood")
        }

    } catch(error){
        console.error("Ошибка при добавлении настроения: ", error)
    }
}

//Получение всех записей, отсортированных по дате
export async function getMoods(): Promise<MoodType[]>{
    try{
        const userId = await getUserId();
        const snapshot = await getDocs(
          query(collection(db, MOODS_COLLECTION),
            where("user_id", "==", userId),
            orderBy('title'))
        );
        const moods = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                title: data.title,
                moodValue: data.moodValue,
                description: data.description
            } as MoodType;
        });
        return moods;
    } catch (error) {
        console.error("Ошибка при получении настроений: ", error)
        return [];
    }
}

//запрос к нейронке по апи
const getAdviceFromOpenRouter = async (moodDescription: string) => {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout:free",
        messages: [
          {
            role: "user",
            content: `
                Пользователь описал своё настроение так: "${moodDescription}". 
                Дай короткий, но исчерпывающий персонализированный совет, на основе данного описания,
                который поможет ему чувствовать себя лучше. В конце обязательно похвали пользователя.
                Перед ответом хорошо подумай и дай совет, который действительно поможет пользователю.
            `
          }
        ]
      })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Ошибка OpenRouter:", errorText);
        throw new Error(`Ошибка OpenRouter: ${response.status}`);
      }
  
    const result = await response.json();
    return result.choices?.[0]?.message?.content ?? "Не удалось получить совет.";
  };
  

  export async function getMoodAdvice(description: string): Promise<string> {
    try {
      const advice = await getAdviceFromOpenRouter(description);
      return advice;
    } catch (error) {
      console.error("Ошибка при получении совета: ", error);
      return "Не удалось получить совет.";
    }
  }
  
  