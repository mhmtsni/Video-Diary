import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from "react-native";
import React from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import { useSelectedVideoStore } from "../store/videoStore";
import { router } from "expo-router";
const window = Dimensions.get("window");
const Video = () => {
  const { selectedVideo, setSelectedVideo } = useSelectedVideoStore();
  const player = useVideoPlayer(selectedVideo.uri, (player) => {
    player.play();
  });
  return (
    <View className="bg-[#2C3D4F]" style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <VideoView
        player={player}
        style={{ width: window.width * 0.9, height: window.height * 0.5 }}
        allowsFullscreen
        allowsPictureInPicture
      />
      <TouchableOpacity
      style={{marginTop: 20,}}
        className="bg-[#D6E3B2] px-6 py-3 rounded-lg"
        onPress={() => {
          setSelectedVideo(null);
          router.back();/*  */
        }}
      >
        <Text>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Video;

const styles = StyleSheet.create({});

