import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";

export default function StartScreen() {
  const router = useRouter();
  const [name, setName] = useState("");

  const onGetStarted = () => {
    // navigate to /home and pass name as param
    router.push({ pathname: "/home", params: { name } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.title}>MANAGE YOUR{"\n"}TASK</Text>
        <TextInput
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={onGetStarted}>
          <Text style={styles.buttonText}>GET STARTED →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  title: { color: "#5D2CE6", fontWeight: "700", fontSize: 28, textAlign: "center", marginBottom: 24 },
  input: {
    width: "85%",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 18,
  },
  button: {
    backgroundColor: "#15C1D6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: { color: "white", fontWeight: "700" },
});