import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import HomeScreen from "../screens/HomeScreen";
import AddTaskScreen from "../screens/AddTaskScreen";
import TaskDetailsScreen from "../screens/TaskDetailsScreen";
import { Task } from "../types/Task";

export type RootStackParamList = {
  Home: undefined;
  AddTask: undefined;
  TaskDetails: { task: Task };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#0F172A" />

      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#0F172A" },
          headerTintColor: "#F8FAFC",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
          },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: "#0F172A" },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "FocusTask Pro",
          }}
        />

        <Stack.Screen
          name="AddTask"
          component={AddTaskScreen}
          options={{
            title: "Create New Task",
          }}
        />

        <Stack.Screen
          name="TaskDetails"
          component={TaskDetailsScreen}
          options={{
            title: "Task Overview",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}