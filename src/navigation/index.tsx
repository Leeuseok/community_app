// Navigation 설정
// - Native Stack Navigator를 사용하여 인증 및 주요 화면 네비게이션 구성

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '../screens/Auth/SignIn';
import SignUp from '../screens/Auth/SignUp';
import Home from '../screens/Home';
import PostList from '../screens/PostList';
import PostDetail from '../screens/PostDetail';
import CreatePost from '../screens/CreatePost';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="PostList" component={PostList} />
        <Stack.Screen name="PostDetail" component={PostDetail} />
        <Stack.Screen name="CreatePost" component={CreatePost} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;