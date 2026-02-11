import { doc, setDoc, getDoc, getDocs, collection, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { DailyHabits, EMPTY_HABITS, countCompleted } from '../utils/constants';

function habitsRef(userId: string, date: string) {
  return doc(db, 'users', userId, 'habits', date);
}

export async function saveHabits(userId: string, date: string, habits: DailyHabits) {
  const data = {
    ...habits,
    completedCount: countCompleted(habits),
    updatedAt: Date.now(),
  };
  await setDoc(habitsRef(userId, date), data, { merge: true });
  return data;
}

export async function getHabits(userId: string, date: string): Promise<DailyHabits> {
  const snap = await getDoc(habitsRef(userId, date));
  if (snap.exists()) {
    return snap.data() as DailyHabits;
  }
  return { ...EMPTY_HABITS };
}

export async function getAllHabits(userId: string): Promise<Record<string, DailyHabits>> {
  const q = query(collection(db, 'users', userId, 'habits'), orderBy('updatedAt', 'desc'));
  const snap = await getDocs(q);
  const result: Record<string, DailyHabits> = {};
  snap.forEach((d) => {
    result[d.id] = d.data() as DailyHabits;
  });
  return result;
}
