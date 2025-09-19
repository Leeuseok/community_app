// CreatePost 화면
// - 게시글 작성 화면
// - 이미지 업로드(ImageUploader)와 제목/내용 입력 후 createPost 호출
// - Props: navigation (NativeStackNavigationProp)

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImageUploader from '../components/ImageUploader';
import { createPost } from '../services/firebase';
import { CreatePostNavigationProp } from '../navigation/types';

type Props = {
  navigation: CreatePostNavigationProp;
};

const CreatePost: React.FC<Props> = ({ navigation }) => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('입력 오류', '제목과 내용을 입력하세요.');
      return;
    }

    setLoading(true);
    try {
      await createPost({ title: title.trim(), content: content.trim(), image });
      Alert.alert('작성 완료', '게시글이 등록되었습니다.', [
        { text: '확인', onPress: () => navigation.navigate('PostList') },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert('오류', '게시글 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // Debug helper: create a quick sample post for testing
  const createSamplePost = async () => {
    setLoading(true);
    try {
      const sampleTitle = '샘플 게시글 제목';
      const sampleContent = '이것은 테스트용 샘플 게시글입니다. 앱에서 작성 흐름을 확인하세요.';
      await createPost({ title: sampleTitle, content: sampleContent, image: null });
      Alert.alert('샘플 작성 완료', '샘플 게시글이 등록되었습니다.', [
        { text: '확인', onPress: () => navigation.navigate('PostList') },
      ]);
    } catch (err) {
      console.error('createSamplePost error', err);
      Alert.alert('오류', '샘플 게시글 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>글쓰기</Text>
        <TouchableOpacity style={styles.iconBtn} onPress={handleSubmit} disabled={loading}>
          <Icon name="checkmark" size={24} color={loading ? '#999' : '#000'} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.inputRow}>
          <Text style={styles.label}>제목</Text>
          <TextInput
            style={styles.input}
            placeholder="제목을 입력하세요"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.textAreaRow}>
          <Text style={styles.label}>내용</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="내용을 입력하세요"
            value={content}
            onChangeText={setContent}
            placeholderTextColor="#666"
            multiline
          />
        </View>

        <View style={styles.imageRow}>
          <ImageUploader onImageSelected={setImage} />
        </View>

        {/* Debug: 샘플 게시글 생성 버튼 */}
        <View style={{ marginTop: 18 }}>
          <TouchableOpacity
            onPress={createSamplePost}
            style={{ backgroundColor: '#ddd', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8 }}
          >
            <Text style={{ textAlign: 'center', color: '#333' }}>샘플 작성</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'rgba(241, 220, 194, 1)',
  },
  headerRow: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 89, 92, 1)',
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: 'rgba(0,0,0,1)',
  },
  container: {
    padding: 20,
  },
  inputRow: {
    marginBottom: 16,
  },
  label: {
    color: 'rgba(198, 196, 196, 1)',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: 'rgba(255, 89, 92, 1)',
    borderBottomWidth: 1,
    height: 44,
    paddingHorizontal: 10,
    borderRadius: 4,
    color: '#111',
  },
  textAreaRow: {
    marginBottom: 16,
  },
  textArea: {
    height: 200,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  imageRow: {
    marginTop: 12,
    alignItems: 'flex-start',
  },
});

export default CreatePost;