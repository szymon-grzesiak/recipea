import { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput, // Dodane do obsługi wprowadzania tekstu dla składników
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
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
    ingredients: [],
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await getPost(id);
        const loadedIngredients = post.ingredients ? JSON.parse(post.ingredients) : [];

        setForm({
          title: post.title,
          thumbnail: { uri: post.thumbnail },
          description: post.description,
          ingredients: loadedIngredients,
        });
      } catch (error) {
        Alert.alert("Error", "Failed to load the post details");
      }
    };

    fetchPost();
  }, [id]);

  const handleIngredientChange = (text, index, type) => {
    let newIngredients = [...form.ingredients];
    if (type === "name") {
      newIngredients[index].name = text;
    } else {
      newIngredients[index].quantity = text;
    }
    setForm({ ...form, ingredients: newIngredients });
  };

  const addIngredient = () => {
    let newIngredients = [...form.ingredients, { name: "", quantity: "" }];
    setForm({ ...form, ingredients: newIngredients });
  };

  const deleteIngredient = (index) => {
    let newIngredients = [...form.ingredients];
    newIngredients.splice(index, 1);
    setForm({ ...form, ingredients: newIngredients });
    console.log("newIngredients", newIngredients)
  };

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
      !form.title ||
      !form.thumbnail ||
      !form.description ||
      form.ingredients.some(
        (ingredient) => !ingredient.name || !ingredient.quantity
      )
    ) {
      return Alert.alert("Please provide all fields");
    }
    setUploading(true);
    try {
      await updatePost(id, {
        ...form,
        thumbnailUri: form.thumbnail.uri,
        ingredients: JSON.stringify(form.ingredients),
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView className="px-4 my-6">
          <Text className="text-2xl text-black font-semibold">Edit Recipe</Text>

          <FormField
            title="Recipe Title"
            value={form.title}
            placeholder="Give your recipe a catchy title..."
            handleChangeText={(title) => setForm({ ...form, title })}
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
            placeholder="Description"
            handleChangeText={(description) =>
              setForm({ ...form, description })
            }
            otherStyles="mt-7"
          />

          {form.ingredients.map((ingredient, index) => (
            <View key={index} className="flex flex-row mt-4">
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
                placeholder="Quantity"
                handleChangeText={(text) =>
                  handleIngredientChange(text, index, "quantity")
                }
              />
              <TouchableOpacity
                onPress={() => deleteIngredient(index)}
                className='flex justify-center items-center pt-10'
              >
                <Text style={{ color: "red" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            onPress={addIngredient}
            className="mt-4 mb-2 bg-black-200 p-2 rounded-xl flex justify-center items-center"
          >
            <Text className="text-base text-black font-medium">
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

export default Edit;
