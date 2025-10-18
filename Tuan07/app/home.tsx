import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTasks } from "../context/TaskContext";
import TaskItem from "../components/TaskItem";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const name = (params as any).name || "Twinkle";
  const { tasks, toggleTask, editTask, removeTask } = useTasks();
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => tasks.filter((t) => t.title.toLowerCase().includes(query.toLowerCase())),
    [tasks, query]
  );

  const onAdd = () => router.push("/add");

  const onEdit = (id: string) => router.push({ pathname: "/add", params: { editId: id } });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={require("../assets/images/emoji2.png")} style={styles.avatar} />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.hi}>Hi {name}</Text>
            <Text style={styles.sub}>Have a great day a head</Text>
          </View>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#888" />
        <TextInput
          placeholder="Search"
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TaskItem
            item={item}
            onToggle={toggleTask}
            onEdit={onEdit}
            onRemove={removeTask}
          />
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <TouchableOpacity style={styles.fab} onPress={onAdd}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  hi: { fontWeight: "700", fontSize: 16 },
  sub: { color: "#888", fontSize: 12 },
  searchContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: { marginLeft: 8, flex: 1 },
  fab: {
    position: "absolute",
    right: 18,
    bottom: 28,
    backgroundColor: "#15C1D6",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
});