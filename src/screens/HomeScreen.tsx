import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Task } from "../types/Task";
import { getTasks, saveTasks } from "../storage/taskStorage";
import { getQuote } from "../services/quoteService";

type RootStackParamList = {
  Home: undefined;
  AddTask: undefined;
  TaskDetails: { task: Task };
};

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [quote, setQuote] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadTasks);
    loadQuote();
    return unsubscribe;
  }, [navigation]);

  const loadTasks = async () => {
    const storedTasks = await getTasks();
    setTasks(storedTasks);
  };

  const loadQuote = async () => {
    const dailyQuote = await getQuote();
    setQuote(dailyQuote);
  };

  const toggleTask = async (id: string) => {
    const selectedTask = tasks.find((task) => task.id === id);
    if (!selectedTask) return;

    if (selectedTask.completed) {
      Alert.alert("Restore Task", "Are you sure you want to restore this task?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Restore",
          onPress: async () => {
            const updatedTasks = tasks.map((task) =>
              task.id === id ? { ...task, completed: false } : task
            );
            setTasks(updatedTasks);
            await saveTasks(updatedTasks);
          },
        },
      ]);
      return;
    }

    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: true } : task
    );

    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updatedTasks = tasks.filter((task) => task.id !== id);
          setTasks(updatedTasks);
          await saveTasks(updatedTasks);
        },
      },
    ]);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());

    if (filter === "completed") return matchesSearch && task.completed;
    if (filter === "pending") return matchesSearch && !task.completed;

    return matchesSearch;
  });

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.filter((task) => !task.completed).length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FocusTask Pro</Text>
      <Text style={styles.subtitle}>Manage your day with clarity.</Text>

      <View style={styles.quoteBox}>
        <Text style={styles.quote}>{quote}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{tasks.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{completedCount}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search tasks..."
        placeholderTextColor="#94A3B8"
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.filterRow}>
        {["all", "pending", "completed"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.filterButton, filter === item && styles.activeFilter]}
            onPress={() => setFilter(item as "all" | "completed" | "pending")}
          >
            <Text style={[styles.filterText, filter === item && styles.activeFilterText]}>
              {item.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {filter === "completed"
              ? "No completed tasks yet."
              : "No tasks found. Add your first task."}
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.taskCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("TaskDetails", { task: item })}
          >
            <View style={styles.taskContent}>
              <Text
                style={[
                  styles.taskTitle,
                  item.completed && filter === "all" && styles.completedText,
                ]}
              >
                {item.title}
              </Text>

              <Text style={styles.taskDescription}>{item.description}</Text>

              <Text style={styles.arrow}>›</Text>

              <Text style={styles.taskDate}>Created: {item.createdAt}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => toggleTask(item.id)}
                style={[styles.statusButton, item.completed && styles.restoreButton]}
              >
                <Text style={styles.statusText}>{item.completed ? "Restore" : "Complete"}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteButton}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddTask")}>
        <Text style={styles.addButtonText}>+ Add Task</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A", padding: 20, paddingTop: 55 },
  title: { color: "#F8FAFC", fontSize: 32, fontWeight: "bold" },
  subtitle: { color: "#94A3B8", fontSize: 15, marginTop: 4, marginBottom: 16 },

  quoteBox: {
    backgroundColor: "#1E293B",
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
  },

  quote: { color: "#CBD5E1", fontSize: 13, lineHeight: 20 },

  statsRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1,
    backgroundColor: "#1E293B",
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  statNumber: { color: "#38BDF8", fontSize: 24, fontWeight: "bold" },
  statLabel: { color: "#CBD5E1", fontSize: 12, marginTop: 4 },

  searchInput: {
    backgroundColor: "#1E293B",
    color: "#F8FAFC",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },

  filterRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  filterButton: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    backgroundColor: "#1E293B",
    borderRadius: 20,
  },

  activeFilter: { backgroundColor: "#38BDF8" },
  filterText: { color: "#CBD5E1", fontSize: 12, fontWeight: "700" },
  activeFilterText: { color: "#0F172A" },

  taskCard: {
    backgroundColor: "#1E293B",
    padding: 15,
    borderRadius: 18,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  taskContent: { flex: 1 },

  taskTitle: {
    color: "#F8FAFC",
    fontSize: 17,
    fontWeight: "bold",
  },

  completedText: {
    textDecorationLine: "line-through",
    color: "#64748B",
  },

  taskDescription: {
    color: "#CBD5E1",
    marginTop: 5,
    lineHeight: 20,
  },

  arrow: {
    color: "#38BDF8",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 2,
  },

  taskDate: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 2,
  },

  actions: {
    gap: 8,
    marginLeft: 12,
  },

  statusButton: {
    backgroundColor: "#22C55E",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 76,
  },

  restoreButton: {
    backgroundColor: "#FACC15",
  },

  statusText: {
    color: "#052E16",
    fontWeight: "800",
    fontSize: 12,
  },

  deleteButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 76,
  },

  deleteText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
  },

  emptyText: {
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 40,
  },

  addButton: {
    backgroundColor: "#38BDF8",
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 8,
    shadowColor: "#38BDF8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  
  addButtonText: {
    color: "#0F172A",
    fontWeight: "900",
    fontSize: 18,
    letterSpacing: 0.3,
  },
});