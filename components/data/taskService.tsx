import { db } from './firebaseConfig';
import { getUserId } from './userService';
import {
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';

import { unlockAward } from './awardService';

import PageType from '../types/PageType'; 
import NoteType from '../types/NoteType'; 

// ======= Страницы =======

export const getPages = async (): Promise<PageType[]> => {
  const userId = await getUserId();
  const q = query(collection(db, 'pages'), where('user_id', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as PageType);
};


export const addPage = async (page: PageType) => {
  const userId = await getUserId();
  const docRef = doc(db, 'pages', page.id);
  await setDoc(docRef, { ...page, user_id: userId });
  await unlockAward("first_page");
};


export const deletePage = async (id: string) => {
  try {
    const pageRef = doc(db, 'pages', id);

    // Удаляем связанные заметки
    const notesQuery = query(
      collection(db, 'notes'),
      where('pageId', '==', id)
    );
    const notesSnapshot = await getDocs(notesQuery);

    const deletePromises = notesSnapshot.docs.map(noteDoc =>
      deleteDoc(noteDoc.ref)
    );
    await Promise.all(deletePromises);

    // Удаляем саму страницу
    await deleteDoc(pageRef);
  } catch (error) {
    console.error('Ошибка при удалении страницы:', error);
  }
};

export const updatePage = async (
    id: string,
    data: Partial<Pick<PageType, 'title'>>
  ) => {
    const docRef = doc(db, 'pages', id);
    await updateDoc(docRef, data);
  };

// ======= Заметки =======

export const getNotes = async (pageId: string): Promise<NoteType[]> => {
  const userId = await getUserId();
  const q = query(collection(db, 'notes'),
    where('pageId', '==', pageId),
    where('user_id', '==', userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as NoteType);
};

export const addNote = async (note: NoteType) => {
  const userId = await getUserId();
  const docRef = doc(db, 'notes', note.id);
  await setDoc(docRef, { ...note, user_id: userId });
  await unlockAward("first_page");
};


export const deleteNote = async (id: string) => {
  const docRef = doc(db, 'notes', id);
  await deleteDoc(docRef);
};

export const updateNote = async (
  id: string,
  data: Partial<Pick<NoteType, 'text' | 'done'>>
) => {
  const docRef = doc(db, 'notes', id);
  await updateDoc(docRef, data);
};


//запрос к нейронке по апи
const getAdviceFromOpenRouter = async (tasksList: string[]) => {
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
                У пользователя есть список дел: "${tasksList}". 
                Дай короткий, но исчерпывающий персонализированный совет, на основе данного списка,
                который поможет пользователю справиться с делами лучше и быстрее.
                Можешь даже дать советы о том, как выполнить эти дела максимально эффективно.
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
  

  export async function getTaskAdvice(tasksList: string[]): Promise<string> {
    try {
      const advice = await getAdviceFromOpenRouter(tasksList);
      return advice;
    } catch (error) {
      console.error("Ошибка при получении совета: ", error);
      return "Не удалось получить совет.";
    }
  }