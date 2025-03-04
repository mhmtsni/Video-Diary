import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { useSelectedVideoStore } from "../store/videoStore";

export default function PickVideo() {
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
      <TouchableOpacity style={{backgroundColor: "transparent", paddingInline: 10, borderWidth: 2, borderRadius: 20}} onPress={pickVideo}>
        <Text style={{fontSize: 14, fontWeight: "bold"}}>Pick A Video</Text>
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
