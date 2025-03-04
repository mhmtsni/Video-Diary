import * as FileSystem from "expo-file-system"

export async function clearVideoCache() {
    try {
      const cacheDir = FileSystem.cacheDirectory;
      if (!cacheDir) {
        console.log("no cache directory available");
        return;
      }
      const files = await FileSystem.readDirectoryAsync(cacheDir);
      console.log(files)
      files.forEach(async (file) => {
        console.log(file)
        if (file != "VideoThumbnails"){
          await FileSystem.deleteAsync(cacheDir + file);
        }
        
      });
      console.log("Cache cleared!");
    } catch (error) {
      console.error("Error clearing cache", error);
    }
  }
  clearVideoCache()