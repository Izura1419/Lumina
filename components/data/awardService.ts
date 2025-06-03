import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { getUserId } from "./userService";

// Тип для удобства
type AwardId = 
  | "first_page" //
  | "first_note" //
  | "first_task_done" //
  | "focused_3_days" //
  | "focused_7_days" //
  | "20_notes" //
  | "20_tasks_done" //
  | "deleted_5_notes" //
  | "focus_hour" //
  | "karate" //
  | "night_mode" //
  | "10_pages" //
  | "done_after_7_days" //
  | "5_days_good_mood" //
  | "mood_sad" //


// Получить все награды
export const getUserAwards = async (): Promise<Record<string, boolean>> => {
  const userId = await getUserId();
  const docRef = doc(db, "awards", userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() as Record<string, boolean> : {};
};
//Разблокировать награду
export const unlockAward = async (awardId: AwardId): Promise<void> => {
  const userId = await getUserId();
  const docRef = doc(db, "awards", userId);
  await updateDoc(docRef, {
    [awardId]: true,
  }).catch(async () => {
    await setDoc(docRef, { [awardId]: true });
  });
};