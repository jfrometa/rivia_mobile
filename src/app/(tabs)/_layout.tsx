import { Tabs } from "expo-router";
import {
  Home,
  FileText,
  Users,
  BarChart2,
  Shield,
} from "lucide-react-native";
import { tokens } from "../../theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tokens.colors.primary[600],
        tabBarInactiveTintColor: tokens.colors.gray[500],
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="appraisal"
        options={{
          title: "Tasaciones",
          tabBarIcon: ({ color, size }) => (
            <FileText color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: "Clientes",
          tabBarIcon: ({ color, size }) => (
            <Users color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="comparison"
        options={{
          title: "Comparables",
          tabBarIcon: ({ color, size }) => (
            <BarChart2 color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: "Usuarios",
          tabBarIcon: ({ color, size }) => (
            <Users color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="roles"
        options={{
          title: "Roles",
          tabBarIcon: ({ color, size }) => (
            <Shield color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
