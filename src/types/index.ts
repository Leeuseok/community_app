export interface User {
    id: string;
    email: string;
    displayName?: string;
    createdAt: any; // Firestore Timestamp or Date
}

export interface Post {
    id: string;
    title: string;
    content: string;
    // Firestore currently stores userId and authorName; keep authorId for compatibility
    authorId?: string;
    userId?: string;
    authorName?: string;
    createdAt: any; // Firestore Timestamp or Date
    imageUrl?: string;
}

export interface Comment {
    id: string;
    postId: string;
    authorId: string;
    content: string;
    createdAt: any; // Firestore Timestamp or Date
}