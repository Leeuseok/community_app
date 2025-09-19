import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Post } from '../types';

interface PostItemProps {
  post: Post;
  imageUrl?: string;
  createdAt?: any;
  commentCount?: number;
  onPress?: () => void;
}

const formatDate = (value: any) => {
  try {
    const d = value?.toDate ? value.toDate() : value ? new Date(value) : new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${mm}.${dd} ${hh}:${min}`;
  } catch (e) {
    return '';
  }
};

const PostItem: React.FC<PostItemProps> = ({ post, imageUrl, createdAt, commentCount = 0, onPress }) => {
  return (
    <TouchableOpacity style={styles.root} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.leftCol}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{post.title}</Text>
        <Text style={styles.date}>{formatDate(createdAt ?? post.createdAt)}</Text>
      </View>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.thumb} />
      ) : (
        <View style={styles.thumbPlaceholder} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 89, 92, 1)',
  },
  leftCol: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    rowGap: 5,
    columnGap: 5,
    flex: 1,
    paddingRight: 12,
  },
  title: {
    color: 'rgba(0, 0, 0, 1)',
    textAlign: 'left',
    fontSize: 18,
    fontWeight: '600',
  },
  date: {
    color: 'rgba(78, 77, 77, 1)',
    textAlign: 'left',
    fontSize: 14,
    fontWeight: '500',
  },
  thumb: {
    width: 66,
    height: 62,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  thumbPlaceholder: {
    width: 66,
    height: 62,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
});

export default PostItem;