import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { fetchPosts } from '../services/firebase';
import PostItem from '../components/PostItem';

const Home = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const renderItem = ({ item }) => (
    <PostItem 
      post={item} 
      onPress={() => navigation.navigate('PostDetail', { postId: item.id })} 
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