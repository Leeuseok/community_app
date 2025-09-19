// PostList 화면
// - 모든 게시글 목록을 표시 (홈과 유사)

import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { fetchPosts, fetchComments } from '../services/firebase';
import { Post } from '../types';
import PostItem from '../components/PostItem';

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

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'PostList'>;

const PostList: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        const getPostsAndCounts = async () => {
            try {
                const fetchedPosts = await fetchPosts();
                setPosts(fetchedPosts);

                // Fetch comment counts in parallel
                const countsArr = await Promise.all(
                    fetchedPosts.map(async (p) => {
                        try {
                            const comments = await fetchComments(String(p.id));
                            return { id: String(p.id), count: Array.isArray(comments) ? comments.length : 0 };
                        } catch (e) {
                            return { id: String(p.id), count: 0 };
                        }
                    })
                );

                const countsMap: Record<string, number> = {};
                countsArr.forEach((c) => (countsMap[c.id] = c.count));
                setCommentCounts(countsMap);
            } catch (error) {
                console.error('Error fetching posts or comments: ', error);
            } finally {
                setLoading(false);
            }
        };

        getPostsAndCounts();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const renderItem = ({ item }: { item: Post }) => {
        const key = String(item.id);
        const commentCount = commentCounts[key] ?? 0;

        return (
            <PostItem
                post={item}
                imageUrl={item.imageUrl}
                createdAt={item.createdAt}
                commentCount={commentCount}
                onPress={() => navigation.navigate('PostDetail', { id: String(item.id) })}
            />
        );
    };

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>게시판</Text>
                <TouchableOpacity style={styles.createBtn} onPress={() => navigation.navigate('CreatePost')}>
                    <Text style={styles.createBtnText}>글작성</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={posts}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
};

export default PostList;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: 'rgba(241, 220, 194, 1)',
        paddingTop: 20,
        alignItems: 'center',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 89, 92, 1)',
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
    },
    createBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: 'rgba(255, 114, 38, 1)',
        borderRadius: 8,
    },
    createBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    listContent: {
        width: '100%',
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(255, 89, 92, 1)',
        opacity: 0.15,
    }
});