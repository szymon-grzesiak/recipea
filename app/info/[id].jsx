import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getPost } from "../../lib/appwrite";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../../constants";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";

const Page = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const captureViewRef = useRef();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await getPost(id);
        fetchedPost.ingredients = JSON.parse(fetchedPost.ingredients);
        console.log("fetchedPost", fetchedPost);
        setPost(fetchedPost);
      } catch (e) {
        setError(e);
        console.error(e);
      }
    };

    fetchPost();
  }, [id]);

  if (error) {
    return (
      <View>
        <Text>Wystąpił błąd podczas ładowania postu.</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View className="w-screen h-screen flex items-center justify-center">
        <Text className="text-black text-3xl">
          <ActivityIndicator />
        </Text>
      </View>
    );
  }

  const sharePostDetails = async () => {
    try {
      const uri = await captureRef(captureViewRef.current, {
        format: "jpg",
        quality: 0.8,
      });
      await Sharing.shareAsync(uri, {
        mimeType: "image/jpeg",
        dialogTitle: "Share this post with your friends",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share post: " + error.message);
    }
  };

  return (
    <SafeAreaView className="bg-primary w-full h-full" ref={captureViewRef}>
      <View className="bg-secondary w-screen h-10 flex flex-row items-center px-4 justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            className="w-8 h-8"
            source={icons.arrowSquare}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={sharePostDetails}
          className="bg-white/30 rounded-full"
        >
          <Image
            source={icons.share}
            className="w-8 h-8 bg-white/10 rounded-xl"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <View className="flex bg-white items-start mx-4 mt-4 rounded-xl shadow-md p-3 space-y-5">
        <View className="flex flex-row justify-center items-center pt-5">
          <Text className="font-bold text-xl">{post.title}</Text>
          <Text className="text-xl"> | {post.creator.username}</Text>
        </View>

        <Image
          source={{ uri: post.thumbnail }}
          className="rounded-lg border-4 w-full h-[200px]"
          onLoad={() => setIsLoaded(true)}
        />
        {!isLoaded && (
          <View
            style={{
              position: "absolute",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}

        <Text className="text-xl tracking-widest">Ingredients</Text>
        <View className="w-full bg-black/5 shadow-md rounded-xl">
          <View className="flex flex-row space-x-2 justify-around bg-blue-200 p-2 rounded-xl">
            <Text>Name</Text>
            <Text>Quantity</Text>
          </View>
          {post.ingredients.map((ingredient, index) => (
            <View
              key={index}
              className="flex p-2 justify-around flex-row space-x-2"
            >
              <Text className="flex-1 shrink line-clamp-1 overflow-ellipsis">
                {ingredient.name}
              </Text>
              <Text className="flex-1 shrink line-clamp-1 overflow-ellipsis">
                {ingredient.quantity}
              </Text>
            </View>
          ))}
        </View>
        <Text>{post.description}</Text>
      </View>
    </SafeAreaView>
  );
};

export default Page;
