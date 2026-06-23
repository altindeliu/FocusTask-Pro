import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "../types/Task";

const TASKS_KEY = "FOCUSTASK_TASKS";

export const getTasks = async (): Promise<Task[]> => {
  try {
    const data = await AsyncStorage.getItem(TASKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log("Error loading tasks:", error);
    return [];
  }
};

export const saveTasks = async (tasks: Task[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.log("Error saving tasks:", error);
  }
};