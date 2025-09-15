import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TextInput } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { fetchPostDetails, fetchComments, addComment } from '../services/firebase';

const PostDetail = () => {
    const route = useRoute();
    const { postId } = route.params;
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const loadPostDetails = async () => {
            const postDetails = await fetchPostDetails(postId);
            setPost(postDetails);
        };

        const loadComments = async () => {
            const postComments = await fetchComments(postId);
            setComments(postComments);
        };

        loadPostDetails();
        loadComments();
    }, [postId]);

    const handleAddComment = async () => {
        if (newComment.trim()) {
            await addComment(postId, newComment);
            setNewComment('');
            const updatedComments = await fetchComments(postId);
            setComments(updatedComments);
        }
    };

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
                        <Text>{item.author}: {item.text}</Text>
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