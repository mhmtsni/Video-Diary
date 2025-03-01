import {
  StyleSheet,
  Button,
  View,
  Dimensions,
  Text,
  TextInput,
} from "react-native";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import { useSelectedVideoStore } from "../store/videoStore";
import { router } from "expo-router";
import Slider from "@react-native-community/slider";

const { width, height } = Dimensions.get("window");
const MemoizedVideoView = React.memo(VideoView);

const VideoEdit = () => {
  const { selectedVideo, setSelectedVideo } = useSelectedVideoStore();
  const [startTime, setStartTime] = useState(0);
  const player = useVideoPlayer(selectedVideo.uri, (player) => {
    player.play();
  });

  const playerRef = useRef<VideoView>(null);
  const animationFrameRef = useRef<number | null>(null);

  const updateCurrentTime = useCallback(() => {
    if (player) {
      setStartTime(player.currentTime);
    }
    animationFrameRef.current = requestAnimationFrame(updateCurrentTime);
  }, [startTime]);
  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(updateCurrentTime);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [player, updateCurrentTime]);

  const handleStartSliderValueChange = useCallback(
    (value: number) => {
      setStartTime(value);
      player.currentTime = value;
    },
    [player]
  );

  const handleProceed = () => {
    router.push({
      pathname: "/addDetails",
      params: { startTime },
    });
  };
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Trim a five second segment of the video
      </Text>
      {selectedVideo.uri && (
        <View style={styles.videoContainer}>
          <MemoizedVideoView
            ref={playerRef}
            style={styles.video}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
          />
          <View style={styles.contentContainer}>
            <View>
              <Text>Start time: {startTime.toFixed(2)}</Text>
            </View>
            <Slider
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="#D3D3D3"
              thumbTintColor="#007AFF"
              minimumValue={0}
              maximumValue={player.duration}
              style={styles.slider}
              value={startTime}
              onSlidingStart={() => {
                player.pause();
              }}
              onSlidingComplete={(value) => {
                handleStartSliderValueChange(value);
              }}
            />

            <View style={styles.buttonContainer}>
              <Button
                title="Close"
                onPress={() => {
                  setSelectedVideo(null);
                  router.back();
                }}
                color="#FF3B30"
              />
              <Button title="Proceed" onPress={handleProceed} color="#007AFF" />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default VideoEdit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    width: "100%",
    paddingHorizontal: 10,
  },
  videoContainer: {
    width: "100%",
    alignItems: "center",
  },
  video: {
    width: width * 0.9,
    height: height * 0.5,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  slider: {
    width: "90%",
    height: 40,
  },
  buttonContainer: {
    marginTop: 20,
    width: "60%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  error: {
    marginTop: 10,
    color: "red",
  },
});
