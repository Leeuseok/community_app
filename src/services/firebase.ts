// Firebase service (v9 modular SDK)
// - 초기화: Firebase 앱, Auth, Firestore, Storage를 초기화합니다.
// - export된 헬퍼:
//   - auth, firestore, storage: 앱 전역 인스턴스
//   - uploadImageAsync(localUri, path): 로컬 URI를 Storage에 업로드하고 다운로드 URL 반환
//   - createPost({title, content, image}): 이미지 업로드 후 Firestore에 게시글 문서 생성
//   - fetchPosts(), fetchPostDetails(id), fetchComments(postId), addComment(postId, content)
// 사용법 예시:
// import { createPost, uploadImageAsync } from '../services/firebase';
// await createPost({ title: 'Hi', content: 'Hello', image: localUri });

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, orderBy, getDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDr74nzMrKyEWFLXaM_M9_NodUYvVUVZ50",
  authDomain: "community-a1643.firebaseapp.com",
  projectId: "community-a1643",
  storageBucket: "community-a1643.appspot.com",
  appId: "1:481610290995:web:b5e0a8437af06a67075046",
  measurementId: "G-Y8ZZ94SNLV"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

async function uploadImageAsync(localUri: string, path: string): Promise<string> {
  // Convert local file URI to blob, upload to Firebase Storage, and return download URL
  const response = await fetch(localUri);
  const blob = await response.blob();
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob);
  return await getDownloadURL(storageRef);
}

interface CreatePostInput {
  title: string;
  content: string;
  image?: string | null; // local URI from ImagePicker
}

async function createPost({ title, content, image }: CreatePostInput): Promise<string> {
  let imageUrl = '';
  try {
    if (image) {
      const uid = auth.currentUser?.uid ?? 'anonymous';
      const filename = `posts/${uid}_${Date.now()}.jpg`;
      imageUrl = await uploadImageAsync(image, filename);
    }

    const docRef = await addDoc(collection(firestore, 'posts'), {
      title,
      content,
      imageUrl,
      userId: auth.currentUser?.uid ?? null,
      authorName: auth.currentUser?.displayName ?? null,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (err) {
    console.error('createPost error', err);
    throw err;
  }
}

// Helper to normalize Firestore timestamp -> JS Date
function toDate(value: any): any {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate();
  return value instanceof Date ? value : new Date(value);
}

// Fetch posts ordered by creation time (newest first)
async function fetchPosts(): Promise<any[]> {
  console.debug('fetchPosts: start');
  try {
    const q = query(collection(firestore, 'posts'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    console.debug(`fetchPosts: got ${snapshot.size} docs`);
    return snapshot.docs.map((d) => {
      const data = d.data() as any;
      return {
        id: d.id,
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl ?? null,
        // normalize author fields
        userId: data.userId ?? data.authorId ?? null,
        authorName: data.authorName ?? null,
        createdAt: toDate(data.createdAt),
      };
    });
  } catch (err: any) {
    console.error('fetchPosts error (ordered):', err?.message ?? err);
    // If ordering by createdAt failed (e.g., permission/index/timestamp problems), try a simple fallback fetch
    try {
      console.debug('fetchPosts: attempting fallback fetch without orderBy');
      const snapshot = await getDocs(collection(firestore, 'posts'));
      console.debug(`fetchPosts fallback: got ${snapshot.size} docs`);
      return snapshot.docs.map((d) => {
        const data = d.data() as any;
        return {
          id: d.id,
          title: data.title,
          content: data.content,
          imageUrl: data.imageUrl ?? null,
          userId: data.userId ?? data.authorId ?? null,
          authorName: data.authorName ?? null,
          createdAt: toDate(data.createdAt),
        };
      });
    } catch (err2) {
      console.error('fetchPosts fallback error:', err2);
      throw err2;
    }
  }
}

// Fetch single post details
async function fetchPostDetails(postId: string): Promise<any | null> {
  try {
    const docRef = doc(firestore, 'posts', postId);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    const data = snapshot.data() as any;
    return {
      id: snapshot.id,
      title: data.title,
      content: data.content,
      imageUrl: data.imageUrl ?? null,
      userId: data.userId ?? data.authorId ?? null,
      authorName: data.authorName ?? null,
      createdAt: toDate(data.createdAt),
    };
  } catch (err) {
    console.error('fetchPostDetails error', err);
    throw err;
  }
}

// Fetch comments for a post
async function fetchComments(postId: string): Promise<any[]> {
  try {
    const commentsQuery = query(collection(firestore, 'posts', postId, 'comments'), orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(commentsQuery);
    return snapshot.docs.map((d) => {
      const data = d.data() as any;
      return {
        id: d.id,
        content: data.content,
        authorId: data.authorId ?? data.userId ?? null,
        createdAt: toDate(data.createdAt),
      };
    });
  } catch (err) {
    console.error('fetchComments error', err);
    throw err;
  }
}

// Add a comment to a post
async function addComment(postId: string, content: string): Promise<string> {
  try {
    const docRef = await addDoc(collection(firestore, 'posts', postId, 'comments'), {
      content,
      authorId: auth.currentUser?.uid ?? null,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (err) {
    console.error('addComment error', err);
    throw err;
  }
}

export { auth, firestore, storage, uploadImageAsync, createPost, fetchPosts, fetchPostDetails, fetchComments, addComment };

