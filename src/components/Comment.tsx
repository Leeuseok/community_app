import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Comment as CommentType } from '../types';

// Comment 컴포넌트
// - 댓글 표시용 단일 항목
// - Props: comment: Comment

interface Props {
  comment: CommentType;
}

const Comment: React.FC<Props> = ({ comment }) => {
  return (
    <View style={styles.commentContainer}>
      <Text style={styles.author}>{comment.authorId ?? 'Unknown'}</Text>
      <Text style={styles.text}>{comment.content}</Text>
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