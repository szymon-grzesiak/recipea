import { useEffect, useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Text,
} from "react-native";

import { icons } from "../../constants";
import useAppwrite from "../../hooks/useAppWrite";
import { getFavorites, signOut } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { EmptyState, InfoBox, RecipeCard } from "../../components";
import useStore from "../../lib/store";

const Bookmark = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: post, refetch } = useAppwrite(() => getFavorites(user.$id));
  const favorites = useStore((state) => state.favorites);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  useEffect(() => {
    refetch();
  }, [favorites]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={post}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <RecipeCard
            description={item.description}
            refetch={refetch}
            title={item.title}
            thumbnail={item.thumbnail}
            creator={item.creator.username}
            avatar={item.creator.avatar}
            userId={item.creator.$id}
            postId={item.$id}
          />
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No Recipes Found" subtitle="No recipes found" />
        )}
        ListHeaderComponent={() => (
          <View className="bg-white/10 mt-6 mb-12 p-4">
            <Text className="text-3xl font-bold text-black">
              Your favorites
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Bookmark;
