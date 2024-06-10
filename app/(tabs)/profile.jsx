import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";

import { icons } from "../../constants";
import useAppwrite from "../../hooks/useAppWrite";
import { getUserPosts, signOut } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { EmptyState, InfoBox, RecipeCard } from "../../components";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(() => getUserPosts(user.$id));
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation(); // Use useNavigation hook

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);

    navigation.replace("index");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const navigateToLicense = () => {
    navigation.navigate("license");
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <RecipeCard
            description={item.description}
            onProfile={true}
            title={item.title}
            thumbnail={item.thumbnail}
            creator={item.creator.username}
            avatar={item.creator.avatar}
            userId={item.creator.$id}
            postId={item.$id}
          />
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Recipes Found"
            subtitle="No recipes found for this profile"
          />
        )}
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <View className="flex w-full justify-end mb-10 flex-row">
              <TouchableOpacity onPress={navigateToLicense} className="mr-4">
                <Image
                  source={icons.bookmark}
                  resizeMode="contain"
                  className="w-6 h-6"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={logout}>
                <Image
                  source={icons.logout}
                  resizeMode="contain"
                  className="w-6 h-6"
                />
              </TouchableOpacity>
            </View>

            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <View className="mt-5 flex flex-row">
              <InfoBox
                title={posts.length || 0}
                subtitle="Posts"
                titleStyles="text-xl"
                containerStyles="mr-10"
              />
              <InfoBox title="Check them out" titleStyles="text-xl" />
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Profile;
