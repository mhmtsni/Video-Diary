import { FFmpegKit, FFmpegKitConfig } from "ffmpeg-kit-react-native";
import { useEffect } from "react";

export const trimVideo = async (
  inputUri: string,
  startTime: number,
  duration: number,
  outputUri: string
) => {
  FFmpegKitConfig.init();
  const command = `-i ${inputUri} -ss ${startTime} -t ${duration} -c copy ${outputUri}`;

  console.log("fdsafdsa2");
  try {
    const session = await FFmpegKit.execute(command);
    const returnCode = await session.getReturnCode();
    if (returnCode.isValueSuccess()) {
      return outputUri;
    } else {
      throw new Error("Trimming failed");
    }
  } catch (error) {
    console.error("Error trimming video:", error);
    throw error;
  }
};
