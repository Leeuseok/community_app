import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CommentProps {
  author: string;
  text: string;
}

const Comment: React.FC<CommentProps> = ({ author, text }) => {
  return (
    <View style={styles.commentContainer}>
      <Text style={styles.author}>{author}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    marginVertical: 8,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  author: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
  },
});

export default Comment;