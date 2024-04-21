import { useState, useEffect } from "react";
import { useLocalSearchParams, router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import {
  SafeAreaView,
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { icons } from "../../constants";
import { getPost, updatePost } from "../../lib/appwrite";
import { CustomButton, FormField } from "../../components";

const Edit = () => {
  const { id } = useLocalSearchParams();

  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    thumbnail: null,
    description: "",
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await getPost(id);
        setForm({
          title: post.title,
          thumbnail: { uri: post.thumbnail },
          description: post.description,
        });
      } catch (error) {
        Alert.alert("Error", "Failed to load the post details");
      }
    };

    fetchPost();
  }, [id]);

  const openPicker = async (selectType) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setForm({
        ...form,
        [selectType]: result.assets[0],
      });
    }
  };

  const submit = async () => {
    if (
      (form.description === "") |
      (form.title === "") |
      !form.thumbnail 
    ) {
      return Alert.alert("Please provide all fields");
    }

    setUploading(true);
    try {
      await updatePost(id, {
        ...form,
        thumbnailUri: form.thumbnail.uri,
      });

      Alert.alert("Success", "Post updated successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Edit Recipe</Text>

        <FormField
          title="Recipe Title"
          value={form.title}
          placeholder="Give your recipe a catchy title..."
          handleChangeText={(title) => setForm({ ...form, title })}
          otherStyles="mt-10"
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>

          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  alt="upload"
                  className="w-5 h-5"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField
          title="Description"
          value={form.description}
          placeholder="Description"
          handleChangeText={(description) => setForm({ ...form, description })}
          otherStyles="mt-7"
        />

        <CustomButton
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Edit;
