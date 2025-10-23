import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'students:v1';

export const saveStudents = async (students) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (e) {
    console.warn('Failed to save students', e);
  }
};

export const loadStudents = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn('Failed to load students', e);
    return [];
  }
};
