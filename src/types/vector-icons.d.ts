declare module 'react-native-vector-icons/Ionicons' {
  import { ComponentType } from 'react';
  import { TextProps } from 'react-native';
  const Icon: ComponentType<TextProps & { name?: string; size?: number; color?: string }>;
  export default Icon;
}
