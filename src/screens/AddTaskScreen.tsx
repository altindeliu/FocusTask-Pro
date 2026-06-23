import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Task } from "../types/Task";
import { getTasks, saveTasks } from "../storage/taskStorage";

type RootStackParamList = {
  Home: undefined;
  AddTask: undefined;
  TaskDetails: { task: Task };
};

type Props = NativeStackScreenProps<RootStackParamList, "AddTask">;

export default function AddTaskScreen({ navigation }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddTask = async () => {
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (!cleanTitle) {
      Alert.alert("Validation Error", "Task title is required.");
      return;
    }

    if (!cleanDescription) {
      Alert.alert("Validation Error", "Task description is required.");
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: cleanTitle,
      description: cleanDescription,
      completed: false,
      createdAt: new Date().toLocaleDateString(),
    };

    const currentTasks = await getTasks();
    await saveTasks([newTask, ...currentTasks]);

    Alert.alert("Success", "Task created successfully.", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Task</Text>
      <Text style={styles.subtitle}>
        Add a clear title and description for your task.
      </Text>

      <Text style={styles.label}>Task Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter task title..."
        placeholderTextColor="#94A3B8"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter task description..."
        placeholderTextColor="#94A3B8"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleAddTask}>
        <Text style={styles.buttonText}>Save Task</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    padding: 20,
    paddingTop: 60,
  },

  title: {
    color: "#F8FAFC",
    fontSize: 30,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#94A3B8",
    marginTop: 6,
    marginBottom: 25,
    lineHeight: 22,
  },

  label: {
    color: "#CBD5E1",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#1E293B",
    color: "#F8FAFC",
    padding: 15,
    borderRadius: 14,
    marginBottom: 15,
    fontSize: 15,
  },

  textArea: {
    height: 140,
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: "#38BDF8",
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: "center",
    marginTop: 10,
  },
  
  buttonText: {
    color: "#0F172A",
    fontWeight: "900",
    fontSize: 18,
  },
});