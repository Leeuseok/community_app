// PostDetail 화면
// - 단일 게시글의 상세 내용을 표시
// - 해당 게시글의 댓글 목록을 불러오고 댓글 추가 기능 제공

import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchPostDetails, fetchComments, addComment } from '../services/firebase';
import { RootStackParamList } from '../navigation/types';
import { Post, Comment as CommentType } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type PostDetailRouteProp = RouteProp<RootStackParamList, 'PostDetail'>;

const PostDetail: React.FC = () => {
    const route = useRoute<PostDetailRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'PostDetail'>>();
    const id = route.params?.id;
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<CommentType[]>([]);
    const [newComment, setNewComment] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if (!id) return;

        const load = async () => {
            setLoading(true);
            try {
                const postDetails = await fetchPostDetails(id);
                setPost(postDetails);
                const postComments = await fetchComments(id);
                setComments(postComments);
            } catch (e) {
                console.error('load post detail error', e);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    const handleAddComment = async () => {
        if (!id) return;
        if (!newComment.trim()) return;
        setSubmitting(true);
        try {
            await addComment(id, newComment.trim());
            setNewComment('');
            const updatedComments = await fetchComments(id);
            setComments(updatedComments);
        } catch (e) {
            console.error('add comment error', e);
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (value: any) => {
        try {
            // fetchPostDetails normalizes timestamps to JS Date when possible
            const d = value instanceof Date ? value : value?.toDate ? value.toDate() : new Date(value);
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            const hh = String(d.getHours()).padStart(2, '0');
            const min = String(d.getMinutes()).padStart(2, '0');
            return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
        } catch (e) {
            return '';
        }
    };

    if (!id) return <View style={styles.center}><Text>잘못된 게시글입니다.</Text></View>;
    if (loading) return <View style={styles.center}><Text>로딩 중...</Text></View>;
    if (!post) return <View style={styles.center}><Text>게시글을 찾을 수 없습니다.</Text></View>;

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('PostList')} style={styles.backBtn}>
                    <Icon name="chevron-back" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>게시글</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={styles.title}>{post.title}</Text>
                <Text style={styles.meta}>{post.authorName ?? post.userId ?? '익명'} · {formatDate(post.createdAt)}</Text>

                {post.imageUrl ? (
                    <Image source={{ uri: post.imageUrl }} style={styles.image} />
                ) : null}

                <Text style={styles.body}>{post.content}</Text>

                <View style={styles.commentSection}>
                    <Text style={styles.sectionTitle}>댓글 {comments.length}</Text>
                    <FlatList
                        data={comments}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.commentRow}>
                                <View style={styles.commentHeader}>
                                    <Text style={styles.commentAuthor}>{item.authorId ?? '익명'}</Text>
                                    <Text style={styles.commentDate}>{formatDate(item.createdAt)}</Text>
                                </View>
                                <Text style={styles.commentBody}>{item.content}</Text>
                            </View>
                        )}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        scrollEnabled={false}
                    />

                    <View style={styles.commentInputRow}>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="댓글을 입력하세요"
                            value={newComment}
                            onChangeText={setNewComment}
                            editable={!submitting}
                        />
                        <TouchableOpacity style={styles.submitBtn} onPress={handleAddComment} disabled={submitting}>
                            <Text style={styles.submitBtnText}>{submitting ? '...' : '등록'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: 'rgba(241, 220, 194, 1)' },
    header: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 89, 92, 1)' },
    backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '600' },
    contentContainer: { padding: 16, paddingBottom: 40 },
    title: { fontSize: 22, fontWeight: '700', marginBottom: 8, color: '#000' },
    meta: { color: '#666', marginBottom: 12 },
    image: { width: '100%', height: 200, borderRadius: 8, marginBottom: 12, backgroundColor: '#eee' },
    body: { fontSize: 16, lineHeight: 22, color: '#111', marginBottom: 20 },
    commentSection: { marginTop: 8 },
    sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
    commentRow: { paddingVertical: 8 },
    commentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    commentAuthor: { fontWeight: '600' },
    commentDate: { color: '#666', fontSize: 12 },
    commentBody: { color: '#333', lineHeight: 20 },
    separator: { height: 1, backgroundColor: 'rgba(0,0,0,0.04)', marginVertical: 8 },
    commentInputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
    commentInput: { flex: 1, height: 44, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: '#ddd' },
    submitBtn: { marginLeft: 8, backgroundColor: 'rgba(255, 114, 38, 1)', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
    submitBtnText: { color: '#fff', fontWeight: '600' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default PostDetail;