import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { icons } from "../constants";
import { ResizeMode, Video } from "expo-av";
import { useGlobalContext } from "../context/GlobalProvider";
import { isFavourite, manageFavouritesVideos } from "../lib/appwrite";
import useAppwrite from "../lib/useAppwrite";

const VideCard = ({
  video: {
    title,
    thumbnail,
    video,
    creator: { username, avatar },
  },
  videoId,
}) => {
  const { user } = useGlobalContext();
  const [play, setPlay] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: favoriteVideos, isLoading } = useAppwrite(() =>
    isFavourite(user.$id, videoId)
  );

  // Check if the video is a favorite
  useEffect(() => {
    // const checkIsFavorite = async () => {

    // const isFavorite = await isFavourite(user.$id, videoId);
    setIsFavorite(favoriteVideos);
    // };
    // checkIsFavorite();
  }, [favoriteVideos, user.$id, videoId]);

  const handleFavourites = async () => {
    try {
      // Call the manageFavouritesVideos function with the videoId and userId
      await manageFavouritesVideos(user.$id, videoId);
      // Update the isFavorite state
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[49px] rounded-lg border border-secondary">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="contain"
            />
          </View>

          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>

            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>

        <View className="pt-2">
          <TouchableOpacity onPress={handleFavourites} disabled={isLoading}>
            <Image
              source={isFavorite ? icons.heartFull : icons.heartOutline}
              className="w-5 h-5"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className="w-full h-60 rounded-xl relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideCard;
