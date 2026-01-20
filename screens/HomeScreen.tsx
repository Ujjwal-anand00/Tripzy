import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { Image } from "react-native";
import FeatureGuides from "../components/FeatureGuides";
import PopularDestination from "../components/PopularDestination";
import WeekendTrip from "../components/WeekendTrip";

export type HomeScreenParamList = {
  HomeMain: undefined;
  NewTrip: undefined;
  PlanTrip: { trip: any };
  AIChat: undefined;
  MapScreen: undefined;
};
export type TabNavigatorParamList = {
  Home: undefined;
  Profile: undefined;
  Guides: undefined;
};

type HomeScreenNavigationProps = NativeStackNavigationProp<
  HomeScreenParamList & TabNavigatorParamList
>;

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="flex-row items-center justify-between px-4 pb-2 pt-4">
          <Image
              source={require("../assets/Tripzyy.png")}
              className="w-20 h-8"
              resizeMode="contain"
            />
          <View className="flex-row items-center space-x-4">
            <TouchableOpacity className="p-2 bg-gray-100 rounded-full">
              <Text className="text-lg">🔍</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="border-b border-gray-200 mx-4" />
        <View className="relative">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1521336575822-6da63fb45455?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            }}
            className="w-full h-80"
            resizeMode="cover"
          />
          <View className="absolute inset-0 flex items-center justify-center">
            <Text className="text-white text-4xl font-bold p-6  text-center ">
              Discover New Places
            </Text>
            <Text className="text-2xl px-4 pb-4 text-center text-orange-600">
              Explore the world's best destinations with Tripzy. Your adventure
              starts here!
            </Text>
            <TouchableOpacity className="bg-orange-500 px-6 py-2 rounded-full mt-4">
              <Text className="text-white font-semibold text-base">
                Create new trip plan
              </Text>
            </TouchableOpacity>

          </View>
        </View>
        <View className="p-4">
            <Text className="text-2xl font-semibold mb-4">Featured Guides From Users</Text>
            <FeatureGuides/>
        </View>
        <View className="p-4">
            <Text className="text-2xl font-semibold mb-4">Weekend Trips</Text>
            <WeekendTrip/>
        </View>
        <View className="p-4">
            <Text className="text-2xl font-semibold mb-4">Popular Destinations</Text>
            <PopularDestination/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
