// Home 화면
// - 게시글 목록을 불러와서 표시
// - PostItem 클릭 시 상세(PostDetail)로 이동

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { fetchPosts } from '../services/firebase';
import PostItem from '../components/PostItem';
import { RootStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Post } from '../types';

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const Home: React.FC<{ navigation: HomeNavProp }> = ({ navigation }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const renderItem = ({ item }: { item: Post }) => (
    <PostItem 
      post={item} 
      onPress={() => navigation.navigate('PostDetail', { id: item.id })} 
    />
  );

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View>
      <FlatList 
        data={posts} 
        renderItem={renderItem} 
        keyExtractor={item => item.id} 
      />
    </View>
  );
};

export default Home;