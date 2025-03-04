import React from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useMutation } from "@tanstack/react-query";
import { useSelectedVideoStore, useVideoStore } from "../store/videoStore";
import * as FileSystem from "expo-file-system";
import { trimVideo } from "@/src/utils/trimVideo";
import * as VideoThumbnails from "expo-video-thumbnails";
import Form from "../components/Form";
import * as MediaLibrary from "expo-media-library";
import { Text } from "react-native";
import uuid from "react-native-uuid";

const DEFAULT_THUMBNAIL = require("../../assets/images/no-thumbnail.jpg");

const AddDetails = () => {
  const { addVideo } = useVideoStore();
  const params = useLocalSearchParams();
  const { selectedVideo, setSelectedVideo } = useSelectedVideoStore();

  const generateThumbnail = async (outputUri: string) => {
    try {
      const response = await VideoThumbnails.getThumbnailAsync(outputUri, {
        time: 0,
      });
      return response;
    } catch (error) {
      console.error("Error generating thumbnail:", error);
      return null;
    }
  };

  const mutation = useMutation({
    mutationFn: async ({
      inputUri,
      startTime,
      duration,
      name,
      description,
    }: any) => {
      const outputUri = `${FileSystem.documentDirectory}${
        uuid.v4() as string
      }.mp4`;

      const trimmedVideoUri = await trimVideo(
        inputUri,
        startTime,
        duration,
        outputUri
      );
      
      const thumbnailResponse = await generateThumbnail(trimmedVideoUri);
      try {
        // Adding the video to media library to access it later from the phone
        const asset = await MediaLibrary.createAssetAsync(trimmedVideoUri);
        const album = await MediaLibrary.getAlbumAsync("Movies");

        if (album) {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        } else {
          await MediaLibrary.createAlbumAsync("Movies", asset, false);
        }
        const isSucess = await MediaLibrary.deleteAssetsAsync([asset.id]);
        const updatedAsset = await MediaLibrary.getAssetInfoAsync(
          (parseInt(asset.id) + 1).toString()
        );
        console.log(isSucess)
        return {
          trimmedVideoUri: updatedAsset.uri,
          thumbnailResponse,
          name,
          description,
        };
      } catch (error) {
        console.log(error);
        return { trimmedVideoUri, thumbnailResponse, name, description };
      }
    },
    onSuccess: async (data) => {
      const { trimmedVideoUri, thumbnailResponse, name, description } = data;

      const thumbnailImg = thumbnailResponse
        ? thumbnailResponse.uri
        : DEFAULT_THUMBNAIL;
      const thumbnailAspect = thumbnailResponse
        ? thumbnailResponse.width / thumbnailResponse.height
        : 1;

      addVideo({
        uri: trimmedVideoUri,
        name,
        description,
        thumbnailImg,
        thumbnailAspect,
      });

      setSelectedVideo(null);
      router.push("/");
    },
  });

  function handleSubmit(name: string, description: string) {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName || !trimmedDescription) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const startTime = parseFloat(params.startTime as string);
    const endTime = parseFloat(params.endTime as string);

    if (isNaN(startTime) || isNaN(endTime)) {
      Alert.alert("Error", "Invalid start or end time.");
      return;
    }

    const duration = endTime - startTime;

    if (duration <= 0) {
      Alert.alert("Error", "End time must be greater than start time.");
      return;
    }

    mutation.mutate({
      inputUri: selectedVideo.uri,
      startTime,
      duration,
      name,
      description,
    });
  }

  return (
    <Form
    action="Execute Trimming"
      text={
        <Text className="text-[#F1E8DF]" style={{ marginBottom: 20, fontSize: 15, fontWeight: "bold" }}>
          This process is not going to delete your original file
        </Text>
      }
      onSubmit={handleSubmit}
    />
  );
};

export default AddDetails;
