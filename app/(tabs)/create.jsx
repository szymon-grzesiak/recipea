import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "../../constants";
import { createPost } from "../../lib/appwrite";
import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    thumbnail: null,
    description: "",
    ingredients: [],
  });

  const handleIngredientChange = (text, index, type) => {
    const newIngredients = [...form.ingredients];
    if (type === "name") {
      newIngredients[index].name = text;
    } else {
      newIngredients[index].quantity = text;
    }
    setForm({ ...form, ingredients: newIngredients });
  };

  const addIngredient = () => {
    const newIngredients = [...form.ingredients, { name: "", quantity: "" }];
    setForm({ ...form, ingredients: newIngredients });
  };

  const openPicker = async (selectType) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({ ...form, thumbnail: result.assets[0] });
      }
    }
  };

  const submit = async () => {
    if (
      !form.title ||
      !form.thumbnail ||
      !form.description ||
      form.ingredients.length === 0
    ) {
      return Alert.alert("Please provide all fields");
    }

    setUploading(true);
    try {
      const newPost = await createPost({
        ...form,
        userId: user.$id,
      });

      Alert.alert("Success", "Post uploaded successfully");
      // router.push("/home"); // Assuming you have navigation setup
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",
        thumbnail: null,
        description: "",
        ingredients: [],
      });
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView className="px-4 my-6">
          <Text className="text-2xl text-black font-semibold">
            Upload Recipe
          </Text>
          <FormField
            title="Recipe Title"
            value={form.title}
            placeholder="Give your recipe a catchy title..."
            handleChangeText={(text) => setForm({ ...form, title: text })}
            otherStyles="mt-10"
          />
          <View className="mt-7 space-y-2">
            <Text className="text-base text-black font-pmedium">
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
                  <Text className="text-sm text-black font-pmedium">
                    Choose a file
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <FormField
            title="Description"
            value={form.description}
            placeholder="Description of your recipe"
            handleChangeText={(text) => setForm({ ...form, description: text })}
            otherStyles="mt-7"
          />
          {form.ingredients.map((ingredient, index) => (
            <View key={index} className="flex flex-row mt-4 ">
              <FormField
                title={`#${index + 1} Name`}
                value={ingredient.name}
                placeholder="Name"
                handleChangeText={(text) =>
                  handleIngredientChange(text, index, "name")
                }
              />
              <FormField
                title={`#${index + 1} Quantity`}
                value={ingredient.quantity}
                placeholder="Quantity "
                handleChangeText={(text) =>
                  handleIngredientChange(text, index, "quantity")
                }
              />
            </View>
          ))}
          <TouchableOpacity
            onPress={addIngredient}
            className="mt-4 mb-2 bg-black-200 p-2 rounded-xl flex justify-center items-center"
          >
            <Text className="text-base text-black font-pmedium">
              Add Another Ingredient
            </Text>
          </TouchableOpacity>
          <CustomButton
            title="Submit & Publish"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={uploading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Create;
