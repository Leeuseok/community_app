import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Post } from '../types';

// PostItem 컴포넌트
// - 게시글 목록용 UI 아이템
// - Props: post: Post, onPress?: () => void

interface PostItemProps {
  post: Post;
  onPress?: () => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.content}>{(post.content || '').substring(0, 100)}...</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    fontSize: 14,
    color: '#666',
  },
});

export default PostItem;