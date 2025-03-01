import { StyleSheet, Text, View, TextInput, Button, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useMutation } from "@tanstack/react-query";
import { useSelectedVideoStore, useVideoStore } from "../store/videoStore";
import * as FileSystem from "expo-file-system";
import { trimVideo } from "@/src/utils/trimVideo";
import { FFmpegKitConfig } from "ffmpeg-kit-react-native";
const AddDetails = () => {
  const [name, setName] = useState("");
  const { addVideo } = useVideoStore();
  const [description, setDescription] = useState("");
  const params = useLocalSearchParams();
  const { selectedVideo } = useSelectedVideoStore();

  const mutation = useMutation({
    mutationFn: async ({ inputUri, startTime, duration }: any) => {
      const outputUri = `${FileSystem.documentDirectory}${name}.mp4`;
      return await trimVideo(inputUri, startTime, duration, outputUri);
    },

    onSuccess: (data: string) => {
      addVideo({
        uri: data,
        name,
        description,
        thumbnailImg: null,
        thumbnailAspect: 1,
      });
      router.push("/");
    },
  });

  function handleSubmit() {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName || !trimmedDescription) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    const startTime = params.startTime;
    const duration = 5;

    mutation.mutate({ inputUri: selectedVideo.uri, startTime, duration });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Button title="Execute Trimming" onPress={handleSubmit} />
    </View>
  );
};

export default AddDetails;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
});
