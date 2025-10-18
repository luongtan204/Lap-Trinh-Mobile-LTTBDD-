import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTasks } from "../context/TaskContext";

export default function AddScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addTask, tasks, editTask } = useTasks();
  const editId = (params as any).editId as string | undefined;
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (editId) {
      const t = tasks.find((x) => x.id === editId);
      if (t) setTitle(t.title);
    }
  }, [editId, tasks]);

  const onFinish = () => {
    if (!title.trim()) {
      Alert.alert("Enter your job");
      return;
    }
    if (editId) editTask(editId, title.trim());
    else addTask(title.trim());
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ padding: 16 }}>
        <Text style={styles.header}>ADD YOUR JOB</Text>
        <View style={{ marginVertical: 12 }}>
          <TextInput
            placeholder="Input your job"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <TouchableOpacity style={styles.finishBtn} onPress={onFinish}>
            <Text style={{ color: "white", fontWeight: "700" }}>
              {editId ? "SAVE" : "FINISH →"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Sticky-note.svg",
            }}
            style={{ width: 140, height: 110, resizeMode: "contain", opacity: 0.9 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 18, fontWeight: "700", letterSpacing: 0.5 },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  finishBtn: {
    marginTop: 12,
    backgroundColor: "#15C1D6",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
});