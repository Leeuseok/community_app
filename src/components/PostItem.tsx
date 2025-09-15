import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PostItemProps {
  title: string;
  content: string;
}

const PostItem: React.FC<PostItemProps> = ({ title, content }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content.substring(0, 100)}...</Text>
    </View>
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