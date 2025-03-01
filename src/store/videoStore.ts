import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Video {
  uri: string;
  name: string;
  description: string;
  thumbnailImg: any;
  thumbnailAspect: number;
}

interface VideoStore {
  videos: Video[];

  addVideo: (video: Video) => void;
}

interface SelectedVideo {
  uri: string | null;
}

interface SelectedVideoStore {
  selectedVideo: SelectedVideo;
  setSelectedVideo: (uri: string | null) => void;
}

export const useVideoStore = create<VideoStore>()(
  persist(
    (set) => ({
      videos: [],
      addVideo: (video: Video) =>
        set((state) => ({
          videos: state.videos.some((vid) => vid.uri === video.uri)
            ? state.videos
            : [...state.videos, video],
        })),
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
