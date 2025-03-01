import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { useSelectedVideoStore } from "../store/videoStore";

export default function Video() {
  const { setSelectedVideo } = useSelectedVideoStore();

  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
        multiple: false,
      });
      if (result.canceled) return;

      const [newVideo] = await Promise.all(
        result.assets.map(async (asset) => {
          return {
            uri: asset.uri,
          };
        })
      );
      setSelectedVideo(newVideo.uri);
      router.push("/videoEdit");
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickVideo}>
        <Text>Pick videos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
