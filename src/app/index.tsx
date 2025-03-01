import { Button, Text, TouchableOpacity, View } from "react-native";
import Video from "../components/Video";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { useVideoStore } from "../store/videoStore";
import * as MediaLibrary from "expo-media-library"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient()
export default function Index() {
  const navigation = useNavigation();
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const {videos, addVideo} = useVideoStore()
  console.log(videos)
  useEffect(() => {
    if (!permissionResponse?.granted) {
      requestPermission()
    }
  }, [permissionResponse])
  

  useEffect(() => {
    navigation.setOptions({
      title: "Home",
      headerRight: () => (
        <View>
          <Video />
        </View>
      ),
    });
  }, [navigation]);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button title="fdsafasd" />
      <Text>Edit app/index.tsx edit this screen.</Text>
    </View> 
  );
}
