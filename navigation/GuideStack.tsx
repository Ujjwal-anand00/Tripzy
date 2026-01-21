import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GuideScreen from '../screens/GuideScreen';
import GuideDetailsScreen from '../screens/GuideDetailsScreen';


export type Place = {
    id: string;
    name: string;
    description: string;
    image: string;
    attributes:{
        type: string;
        bestTime: string;
        location: string;
        attractions: string[];
    }
};

export type GuideStackParamList = {
    GuideMain: undefined;
    GuideDetails: {place: Place};
};

const GuideStack = () => {
    const Stack = createNativeStackNavigator<GuideStackParamList>();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GuideMain" component={GuideScreen} />
      <Stack.Screen name="GuideDetails" component={GuideDetailsScreen} />
    </Stack.Navigator>
  )
}

export default GuideStack;

const styles = StyleSheet.create({})