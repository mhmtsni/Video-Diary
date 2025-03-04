import {
  FlatList,
  Text,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import PickVideo from "../components/PickVideo";
import { Href, router, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect } from "react";
import { useSelectedVideoStore, useVideoStore } from "../store/videoStore";
import * as MediaLibrary from "expo-media-library";
import Feather from "@expo/vector-icons/Feather";

const screenWidth = Dimensions.get("window").width;
const numColumns = 2; // Set the number of columns for the grid
const itemWidth = screenWidth / numColumns - 20; // Adjust spacing between items

export default function Index() {
  const navigation = useNavigation();
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const { videos, removeVideo, removeVideoFromMedia } = useVideoStore();
  const { setSelectedVideo } = useSelectedVideoStore();

  useEffect(() => {
    if (!permissionResponse?.granted) {
      requestPermission();
    }
  }, [permissionResponse]);

  const handleSelection = (uri: string, path: Href) => {
    setSelectedVideo(uri);
    router.push(path);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Home",
      headerBackVisible: false,
      headerLeft: () => null,
      headerRight: () => (
        <View className="mr-4">
          <PickVideo />
        </View>
      ),
    });
  }, [navigation]);

  return (
    <View className="flex-1 bg-[#2C3D4F] p-4">
      {videos.length > 0 ? (
        <FlatList
          data={videos}
          keyExtractor={(item) => item.id}
          numColumns={numColumns} // Set grid layout
          columnWrapperStyle={{ justifyContent: "space-between" }} // Space between items
          renderItem={({ item }) => {
            const isLocal = typeof item.thumbnailImg === "number";

            return (
              <TouchableOpacity
                onPress={() => handleSelection(item.uri, "/editDetails")}
              >
                <View
                  className="p-4 rounded-xl mb-4"
                  style={{
                    width: itemWidth,
                    backgroundColor: "#F1E8DF",
                    justifyContent: "space-between",
                    shadowColor: "black",
                    shadowOffset: { width: 0, height: 3 },
                    shadowRadius: 1.65,
                    elevation: 3,
                    flex: 1
                  }}
                >
                  <View className="flex-row justify-between items-center">
                    <Text
                      className="text-md font-bold text-black flex-1"
                      numberOfLines={1}
                    >
                      {item.name.toUpperCase()}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        removeVideo(item.id);
                        removeVideoFromMedia(item.uri);
                      }}
                    >
                      <Feather name="trash" size={20} color="black" />
                    </TouchableOpacity>
                  </View>

                  <View className="h-[2px] w-full my-2 bg-black opacity-50" />

                  <TouchableOpacity
                    onPress={() => {
                      handleSelection(item.uri, "/video");
                    }}
                  >
                    <Image
                      className="rounded-lg self-center"
                      style={{
                        height: screenWidth / item.thumbnailAspect / 5,
                        width: screenWidth / 5,
                      }}
                      source={
                        isLocal
                          ? parseInt(item.thumbnailImg)
                          : { uri: item.thumbnailImg }
                      }
                    />
                  </TouchableOpacity>

                  <Text
                    className="text-black self-center mt-2"
                    numberOfLines={3}
                    style={{ fontSize: 12 }}
                  >
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-500">No videos found</Text>
        </View>
      )}
    </View>
  );
}
