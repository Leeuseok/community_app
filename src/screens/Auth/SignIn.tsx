import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import useAuth from '../../hooks/useAuth';

import cafe from '../../assets/icon.png';

const SignIn: React.FC = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (error) {
      const message = (error as Error)?.message ?? '알 수 없는 오류가 발생했습니다';
      Alert.alert('로그인 오류', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View testID="sign-in-root" style={styles.root}>
      <Image source={cafe} style={styles.headerImage} />

      <View testID="inputs" style={styles.frame1}>
        <View testID="group-email" style={styles.groupRow}>
          <Text testID="label-email" style={styles.label}>
            {`아이디(이메일)`}
          </Text>
          <TextInput
            testID="input-email"
            style={styles.input}
            placeholder="이메일을 입력하세요"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#666"
          />
        </View>

        <View testID="group-password" style={styles.groupRow}>
          <Text testID="label-password" style={styles.label}>
            {`비밀번호`}
          </Text>
          <TextInput
            testID="input-password"
            style={styles.input}
            placeholder="비밀번호"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#666"
          />
        </View>
      </View>

      <TouchableOpacity testID="btn-signin" style={styles.btn} onPress={handleSignIn} disabled={loading}>
        <Text testID="btn-signin-text" style={styles.btnText}>{loading ? '로딩...' : '로그인'}</Text>
      </TouchableOpacity>

      <TouchableOpacity testID="link-signup" style={styles.signupWrap} onPress={() => { /* 네비게이션 연결 필요 시 수정 */ }}>
        <Text testID="link-signup-text" style={styles.signupText}>{`회원가입`}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'rgba(241, 220, 194, 1)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  headerImage: {
    width: 176,
    height: 176,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  frame1: {
    width: '100%',
    marginBottom: 20,
  },
  groupRow: {
    width: '100%',
    marginBottom: 18,
  },
  label: {
    color: 'rgba(17, 17, 17, 1)',
    fontFamily: 'SUIT',
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    color: '#111',
  },
  btn: {
    width: 300,
    height: 42,
    backgroundColor: 'rgba(255, 114, 38, 1)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  btnText: {
    color: '#fff',
    fontFamily: 'Montserrat',
    fontSize: 18,
    fontWeight: '600',
  },
  signupWrap: {
    marginTop: 16,
  },
  signupText: {
    color: 'rgba(0,0,0,1)',
    fontFamily: 'Montserrat',
    fontSize: 18,
  },
});

export default SignIn;