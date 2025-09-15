// PostDetail 화면
// - 단일 게시글의 상세 내용을 표시
// - 해당 게시글의 댓글 목록을 불러오고 댓글 추가 기능 제공

import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TextInput } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { fetchPostDetails, fetchComments, addComment } from '../services/firebase';
import { RootStackParamList } from '../navigation/types';
import { Post, Comment as CommentType } from '../types';

type PostDetailRouteProp = RouteProp<RootStackParamList, 'PostDetail'>;

const PostDetail: React.FC = () => {
    const route = useRoute<PostDetailRouteProp>();
    const id = route.params?.id;
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<CommentType[]>([]);
    const [newComment, setNewComment] = useState<string>('');

    useEffect(() => {
        if (!id) return;

        const loadPostDetails = async () => {
            const postDetails = await fetchPostDetails(id);
            setPost(postDetails);
        };

        const loadComments = async () => {
            const postComments = await fetchComments(id);
            setComments(postComments);
        };

        loadPostDetails();
        loadComments();
    }, [id]);

    const handleAddComment = async () => {
        if (!id) return;
        if (newComment.trim()) {
            await addComment(id, newComment);
            setNewComment('');
            const updatedComments = await fetchComments(id);
            setComments(updatedComments);
        }
    };

    if (!id) {
        return <Text>Invalid post</Text>;
    }

    if (!post) {
        return <Text>Loading...</Text>;
    }

    return (
        <View>
            <Text>{post.title}</Text>
            <Text>{post.content}</Text>
            <FlatList
                data={comments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.authorId ?? 'Unknown'}: {item.content}</Text>
                    </View>
                )}
            />
            <TextInput
                placeholder="Add a comment..."
                value={newComment}
                onChangeText={setNewComment}
            />
            <Button title="Submit" onPress={handleAddComment} />
        </View>
    );
};

export default PostDetail;