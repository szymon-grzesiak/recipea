import React, { useState, useEffect } from "react";
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

const Page = () => {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await getPost(id);
        console.log(fetchedPost);
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

  return (
    <SafeAreaView className="bg-primary w-full h-full  gap-4">
      <TouchableOpacity onPress={() => router.back()}>
        <View className="bg-secondary w-screen h-10 flex items-start pl-4 justify-center">
          <Image
            style={{ width: "20px", height: "20px" }}
            source={icons.heart}
          />
        </View>
      </TouchableOpacity>
      <View className="p-6">
        <View className="flex-direction-rowjustify-content-space-between align-items-center">
          <Text className="text-2xl font-bold text-black">Post</Text>
        </View>
        <Image
          source={{ uri: post.thumbnail }}
          style={{ width: 200, height: 200 }}
          className="rounded-lg border-4"
        />
        <Text>{post.title}</Text>
        <Text>{post.description}</Text>
        <Text>{post.creator.username}</Text>
      </View>
    </SafeAreaView>
  );
};

export default Page;
