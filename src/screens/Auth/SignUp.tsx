import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import useAuth from '../../hooks/useAuth';
import { validateEmail, validatePassword } from '../../utils/validators';
import cafe from '../../assets/icon.png';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import Icon from 'react-native-vector-icons/Ionicons';

type SignUpNavProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

const SignUp: React.FC = () => {
  const navigation = useNavigation<SignUpNavProp>();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    setError(null);
    if (!validateEmail(email)) {
      setError('유효한 이메일을 입력하세요.');
      return;
    }
    if (!validatePassword(password)) {
      setError('비밀번호는 최소 요구조건을 충족해야 합니다.');
      return;
    }
    if (password !== confirm) {
      setError('비밀번호와 확인이 일치하지 않습니다.');
      return;
    }

    setLoading(true);
    try {
      await signUp(email.trim(), password, name.trim() || undefined);
      // 회원가입 후 Firebase는 자동으로 로그인 처리됩니다. 바로 게시판으로 이동합니다.
      navigation.replace('PostList');
    } catch (err) {
      setError((err as Error)?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* Top app bar placed under the notch/status bar */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={36} color="#000" />
        </TouchableOpacity>
      </View>

      <Image source={cafe} style={styles.headerImage} />
      <View style={styles.frame1}>
        <View style={styles.groupRow}>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.input}
            placeholder="이메일을 입력하세요"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.groupRow}>
          <Text style={styles.label}>이름</Text>
          <TextInput
            style={styles.input}
            placeholder="이름을 입력하세요"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.groupRow}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.groupRow}>
          <Text style={styles.label}>비밀번호 확인</Text>
          <TextInput
            style={styles.input}
            placeholder="비밀번호 확인"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            placeholderTextColor="#666"
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.btn} onPress={handleSignUp} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>회원가입</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'rgba(241, 220, 194, 1)',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
  },
  appBar: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 0,
  },
  backBtn: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    // 터치 영역을 넓혀 사용성 향상
  },
  backText: {
    fontSize: 32,
    color: 'rgba(0,0,0,1)',
    fontWeight: '600',
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginLeft: 8,
  },
  headerImage: {
    width: 176,
    height: 176,
    marginTop: 32,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  frame1: {
    width: '100%',
    marginBottom: 20,
    maxWidth: 400,
  },
  groupRow: {
    width: '100%',
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: 'rgba(17, 17, 17, 1)',
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
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  btn: {
    width: '100%',
    maxWidth: 300,
    height: 42,
    backgroundColor: 'rgba(255, 114, 38, 1)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    alignSelf: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SignUp;