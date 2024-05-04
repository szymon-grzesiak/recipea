import { useState, useEffect } from "react";
import { ResizeMode, Video } from "expo-av";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { toggleFavorite, isFavorite, deletePost } from "../lib/appwrite";
import { Link, usePathname } from "expo-router";
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { captureRef } from 'react-native-view-shot';

import { icons } from "../constants";
import useStore from "../lib/store";
import { router } from "expo-router";

const RecipeCard = ({
  description,
  onProfile,
  title,
  creator,
  avatar,
  thumbnail,
  userId,
  postId,
}) => {
  const favorites = useStore((state) => state.favorites);
  const addFavorite = useStore((state) => state.addFavorite);
  const removeFavorite = useStore((state) => state.removeFavorite);

  useEffect(() => {
    const checkFavorite = async () => {
      const favId = await isFavorite({ userId, postId });
      if (favId) {
        addFavorite(userId, postId);
      } else {
        removeFavorite(userId, postId);
      }
    };

    checkFavorite();
  }, []);

  const handleEdit = () => {
    router.push(`/edit/${postId}`);
    console.log(creator, title, avatar, thumbnail, userId, postId);
  };

  const handleDelete = async () => {
    console.log("Delete post with ID:", postId);
    await deletePost(postId);
    Alert.alert("Post deleted successfully");
  };

  const handlePress = async () => {
    const favId = await isFavorite({ userId, postId });
    if (favId === null) {
      return;
    }
    const newFavStatus = await toggleFavorite({ userId, postId, favId });
    if (newFavStatus) {
      addFavorite(userId, postId);
    } else {
      removeFavorite(userId, postId);
    }
  };

  const heart = !!favorites[`${userId}-${postId}`];
  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 items-center">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-black"
              numberOfLines={2}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-black font-pregular"
              numberOfLines={2}
            >
              {creator}
            </Text>
          </View>
        </View>

        {onProfile ? (
          <View className="flex flex-row gap-x-4">
            <TouchableOpacity activeOpacity={0.7} onPress={handleEdit}>
              <Image
                source={icons.editIcon}
                className="w-8 h-8 bg-white/10 rounded-xl"
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={handleDelete}>
              <Image
                source={icons.deleteIcon}
                className="w-8 h-8 bg-white/10 rounded-xl"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="relative flex flex-row-reverse justify-center items-center gap-4">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handlePress}
            >
              <Image
                source={heart ? icons.heart : icons.blackHeart}
                className="w-8 h-8 bg-white/10 rounded-xl"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
        onPress={() => router.push(`/info/${postId}`)}
      >
        <Image
          source={{ uri: thumbnail }}
          className="w-full h-full rounded-xl mt-3"
          resizeMode="cover"
        />
      </TouchableOpacity>
    </View>
  );
};



export default RecipeCard;
