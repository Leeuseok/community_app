import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Home: undefined;
  PostList: undefined;
  PostDetail: { id?: string } | undefined;
  CreatePost: undefined;
};

export type CreatePostNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreatePost'>;
