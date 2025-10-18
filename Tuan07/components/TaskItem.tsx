import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Task } from "../context/TaskContext";
import { Ionicons } from "@expo/vector-icons";

export default function TaskItem({
  item,
  onToggle,
  onEdit,
  onRemove,
}: {
  item: Task;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onToggle(item.id)} style={styles.left}>
        <View style={[styles.checkbox, item.done && styles.checked]}>
          {item.done && <Ionicons name="checkmark" size={16} color="white" />}
        </View>
        <Text style={[styles.title, item.done && styles.done]}>{item.title}</Text>
      </TouchableOpacity>
      <View style={styles.right}>
        <TouchableOpacity onPress={() => onEdit(item.id)} style={styles.iconBtn}>
          <Ionicons name="pencil" size={18} color="#e55" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.iconBtn}>
          <Ionicons name="trash" size={18} color="#c33" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F4F7FA",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginVertical: 8,
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  left: { flexDirection: "row", alignItems: "center", flex: 1 },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#bfc9d9",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checked: { backgroundColor: "#48C774", borderColor: "#48C774" },
  title: { fontSize: 14, color: "#333" },
  done: { textDecorationLine: "line-through", color: "#999" },
  right: { flexDirection: "row" },
  iconBtn: { padding: 6, marginLeft: 6 },
}); 