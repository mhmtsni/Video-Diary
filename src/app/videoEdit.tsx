import React, { useEffect, useRef, useState, useCallback } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useSelectedVideoStore } from "../store/videoStore";
import { router } from "expo-router";
import Slider from "@react-native-community/slider";

const { width, height } = Dimensions.get("window");
const MemoizedVideoView = React.memo(VideoView);

const VideoEdit = () => {
  const { selectedVideo, setSelectedVideo } = useSelectedVideoStore();
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(2);
  const player = useVideoPlayer(selectedVideo.uri, (player) => {
    player.play();
  });

  const playerRef = useRef<VideoView>(null);
  const animationFrameRef = useRef<number | null>(null);
  // Synchronizing the video and the slider through the animation frame
  const updateCurrentTime = useCallback(() => {
    if (player) {
      setStartTime(player.currentTime);
      setEndTime(player.currentTime + 5);
      animationFrameRef.current = requestAnimationFrame(updateCurrentTime);
    }
  }, [player]);

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
      if (player) {
        player.pause();
        setStartTime(value);
        setEndTime(value + 5);
        player.currentTime = value;
      }
    },
    [player]
  );

  const handleProceed = () => {
    if (player) {
      if (endTime > player.duration) {
        setEndTime(player.duration);
      } else {
        player.pause();
        router.push({
          pathname: "/addDetails",
          params: { startTime, endTime },
        });
      }
    }
  };

  useEffect(() => {
    if (player && endTime === player.duration) {
      player.pause();
      router.push({
        pathname: "/addDetails",
        params: { startTime, endTime },
      });
    }
  }, [endTime, player]);

  if (!player) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 p-5">
        <Text className="text-lg text-gray-800">
          Video player is not available.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#2C3D4F] pt-12 px-5">
      <Text className="text-2xl text-[#F1E8DF] font-semibold mb-5 text-center">
        Trim a five second segment of the video
      </Text>
      {selectedVideo.uri && (
        <View className="w-full items-center">
          <MemoizedVideoView
            ref={playerRef}
            style={{ width: width * 0.9, height: height * 0.5 }}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
          />
          <View className="w-full items-center mt-5">
            <Text className="text-lg font-bold text-[#F1E8DF] mb-2">
              Start time: {startTime.toFixed(2)}
            </Text>
            <Slider
              minimumTrackTintColor="#F1E8DF"
              maximumTrackTintColor="white"
              thumbTintColor="#F1E8DF"
              minimumValue={0}
              maximumValue={player.duration}
              style={{ width: "90%", height: 40 }}
              value={startTime}
              onSlidingStart={() => {
                if (player) player.pause();
              }}
              onSlidingComplete={(value) => {
                handleStartSliderValueChange(value);
              }}
            />
            <View className="flex-row justify-between mt-5 w-3/5">
              <TouchableOpacity
                onPress={() => {
                  setSelectedVideo(null);
                  router.back();
                }}
                className="bg-red-500 px-6 py-3 rounded-lg"
              >
                <Text className="text-black self-center text-sm font-medium">Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleProceed}
                className="bg-[#D6E3B2] px-6 py-3 rounded-lg"
              >
                <Text className="text-black text-sm font-medium">Proceed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default VideoEdit;
