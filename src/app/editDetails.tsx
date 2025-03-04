import { ActivityIndicator, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import {
  useSelectedVideoStore,
  useVideoStore,
  Video,
} from "../store/videoStore";
import Form from "../components/Form";
import { router } from "expo-router";

const editDetails = () => {
  const { selectedVideo, setSelectedVideo } = useSelectedVideoStore();
  const { videos, editVideo } = useVideoStore();
  const [video, setVideo] = useState<Video | undefined>();
  
  useEffect(() => {
    const findVideo = videos.find((item) => item.uri === selectedVideo.uri);
    setVideo(findVideo)
  }, [selectedVideo, videos]);
  const handleSubmit = (name: string, description: string) => {
    if (video) {
        editVideo(video.id, {name, description})
        setSelectedVideo(null)
        router.back()
    }
  };
  if (!video) {
    return <ActivityIndicator></ActivityIndicator>
  }

  return <Form action="Edit file" onSubmit={handleSubmit} defaultValues={{name: video.name, description: video.description}} />;
};

export default editDetails;

const styles = StyleSheet.create({});
