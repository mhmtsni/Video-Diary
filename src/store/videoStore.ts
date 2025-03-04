import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";
import { clearVideoCache } from "../utils/clearCache";


export interface Video {
  id: string;
  uri: string;
  name: string;
  description: string;
  thumbnailImg: string;
  thumbnailAspect: number;
}
// Videos in the home screen
interface VideoStore {
  videos: Video[];
  addVideo: (video: Omit<Video, "id">) => void;
  editVideo: (
    id: string,
    updatedFields: Pick<Video, "name" | "description">
  ) => void;
  removeVideo: (id: string) => void;
  removeVideoFromMedia: (uri: string | undefined) => void;
}

interface SelectedVideo {
  uri: string | null;
}
// State for managing the videoView
interface SelectedVideoStore {
  selectedVideo: SelectedVideo;
  setSelectedVideo: (uri: string | null) => void;
}

export const useVideoStore = create<VideoStore>()(
  persist(
    (set) => ({
      videos: [],

      addVideo: (video: Omit<Video, "id">) =>
        set((state) => {
          const newState = state.videos.some((vid) => vid.uri === video.uri)
            ? state
            : { videos: [...state.videos, { ...video, id: uuid.v4() as string }] };
      
          if (newState !== state) {
            setTimeout(clearVideoCache, 0);
          }
      
          return newState;
        }),
      
      removeVideo: (id) =>
        set((state) => ({
          videos: state.videos.filter((vid) => id !== vid.id),
        })),
      editVideo: (id, updatedFields) =>
        set((state) => ({
          videos: state.videos.map((video) =>
            video.id === id ? { ...video, ...updatedFields } : video
          ),
        })),
      removeVideoFromMedia: async (uri) => {
        try {
          const album = await MediaLibrary.getAlbumAsync("Movies");
          if (!album) {
            Alert.alert("Album doesn't exist");
            return;
          }
          const assets = await MediaLibrary.getAssetsAsync({
            album: album.id,
            first: 1000,
            mediaType: "video",
          });
          const asset = assets.assets.find((item) => item.uri === uri);
          if (!asset) {
            3;
            Alert.alert("Video doesn't exist");
            return;
          }
          await MediaLibrary.deleteAssetsAsync([asset.id]);
        } catch (error) {
          console.log(error);
        }
      },
    }),
    {
      name: "video-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useSelectedVideoStore = create<SelectedVideoStore>((set) => ({
  selectedVideo: { uri: null },
  setSelectedVideo: (uri) => set({ selectedVideo: { uri } }),
}));
