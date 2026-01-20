import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();


export type HomeStackParamList = {
    HomeMain: undefined;
    NewTrip: undefined;
    PlanTrip: {trip: any};
};

const HomeStack = () => {
    const stack = createNativeStackNavigator<HomeStackParamList>();
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
    </Stack.Navigator>
  )
}

export default HomeStack;

const styles = StyleSheet.create({})