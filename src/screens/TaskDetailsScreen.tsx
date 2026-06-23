import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Task } from "../types/Task";

type RootStackParamList = {
  Home: undefined;
  AddTask: undefined;
  TaskDetails: { task: Task };
};

type Props = NativeStackScreenProps<RootStackParamList, "TaskDetails">;

export default function TaskDetailsScreen({ route, navigation }: Props) {
  const { task } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Task Overview</Text>
      <Text style={styles.subtitle}>Detailed information about this task.</Text>

      <View style={styles.card}>
        <View style={styles.statusRow}>
          <Text style={styles.cardTitle}>{task.title}</Text>

          <Text style={[styles.status, task.completed ? styles.completed : styles.pending]}>
            {task.completed ? "Completed" : "Pending"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>{task.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Created Date</Text>
          <Text style={styles.value}>{task.createdAt}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            {task.completed
              ? "Great job. This task has been completed."
              : "This task is still active and waiting to be completed."}
          </Text>
        </View>
      </View>

      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },

  content: {
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
  },

  card: {
    backgroundColor: "#1E293B",
    padding: 20,
    borderRadius: 20,
  },

  statusRow: {
    gap: 12,
    marginBottom: 10,
  },

  cardTitle: {
    color: "#F8FAFC",
    fontSize: 22,
    fontWeight: "bold",
    lineHeight: 30,
  },

  section: {
    marginTop: 22,
  },

  label: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "uppercase",
  },

  value: {
    color: "#F8FAFC",
    fontSize: 16,
    lineHeight: 24,
  },

  status: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
    fontWeight: "bold",
    overflow: "hidden",
  },

  completed: {
    backgroundColor: "#22C55E",
    color: "#052E16",
  },

  pending: {
    backgroundColor: "#FACC15",
    color: "#422006",
  },

  infoBox: {
    backgroundColor: "#0F172A",
    padding: 14,
    borderRadius: 14,
    marginTop: 24,
  },

  infoText: {
    color: "#CBD5E1",
    fontSize: 14,
    lineHeight: 22,
  },
 
});