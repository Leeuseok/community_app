// ImageUploader 컴포넌트
// - Expo ImagePicker를 사용하여 기기에서 이미지를 선택
// - 선택된 이미지 URI를 부모로 전달(onImageSelected)
// Props: onImageSelected: (uri: string) => void

import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Alert, Linking, TouchableOpacity, Text, Platform, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
    onImageSelected: (uri: string | null) => void;
}

const ImageUploader: React.FC<Props> = ({ onImageSelected }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isPicking, setIsPicking] = useState(false);

    const handleResult = async (result: any) => {
        try {
            console.debug('ImageUploader: picker result', result);

            if (!result) return;

            if (result.cancelled === true || result.canceled === true || result?.type === 'cancel' || result?.type === 'dismissed') {
                console.debug('ImageUploader: user cancelled image picker');
                return;
            }

            const asset = result?.assets?.[0] ?? result;
            let uri: string | undefined = asset?.uri ?? asset?.localUri ?? asset?.uriString;
            if (!uri && asset?.base64) {
                uri = `data:image/jpeg;base64,${asset.base64}`;
            }

            if (uri && typeof uri === 'string') {
                setSelectedImage(uri);
                onImageSelected(uri);
            } else {
                console.debug('ImageUploader: no uri found in picker asset', asset);
                Alert.alert('오류', '선택된 이미지의 경로를 찾을 수 없습니다. 다른 이미지를 시도해보세요.');
            }
        } catch (err) {
            console.error('handleResult error', err);
            Alert.alert('오류', '이미지 처리 중 오류가 발생했습니다.');
        } finally {
            setIsPicking(false);
        }
    };

    const pickFromLibrary = async () => {
        if (Platform.OS === 'web') {
            Alert.alert('제한', '웹에서는 이미지 선택이 제한됩니다. 실제 기기에서 테스트하세요.');
            return;
        }

        try {
            setIsPicking(true);
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            console.debug('ImageUploader: media permission', permissionResult);
            const status = (permissionResult as any).status;
            const grantedLegacy = (permissionResult as any).granted;
            const isGranted = status === 'granted' || grantedLegacy === true;

            if (!isGranted) {
                Alert.alert(
                    '권한 필요',
                    '갤러리 접근 권한이 필요합니다. 앱 설정에서 권한을 허용하시겠습니까?',
                    [
                        { text: '취소', style: 'cancel', onPress: () => setIsPicking(false) },
                        { text: '설정으로 이동', onPress: () => Linking.openSettings() },
                    ]
                );
                setIsPicking(false);
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
                allowsEditing: true,
                aspect: [4, 3],
            });

            await handleResult(result as any);
        } catch (err) {
            console.error('pickFromLibrary error', err);
            Alert.alert('오류', '이미지 선택 중 오류가 발생했습니다.');
            setIsPicking(false);
        }
    };

    const takePhoto = async () => {
        if (Platform.OS === 'web') {
            Alert.alert('제한', '웹에서는 카메라 촬영이 제한됩니다. 실제 기기에서 테스트하세요.');
            return;
        }

        try {
            setIsPicking(true);
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            console.debug('ImageUploader: camera permission', permissionResult);
            const status = (permissionResult as any).status;
            const grantedLegacy = (permissionResult as any).granted;
            const isGranted = status === 'granted' || grantedLegacy === true;

            if (!isGranted) {
                Alert.alert(
                    '권한 필요',
                    '카메라 권한이 필요합니다. 앱 설정에서 권한을 허용하시겠습니까?',
                    [
                        { text: '취소', style: 'cancel', onPress: () => setIsPicking(false) },
                        { text: '설정으로 이동', onPress: () => Linking.openSettings() },
                    ]
                );
                setIsPicking(false);
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
                allowsEditing: true,
                aspect: [4, 3],
            });

            await handleResult(result as any);
        } catch (err) {
            console.error('takePhoto error', err);
            Alert.alert('오류', '사진 촬영 중 오류가 발생했습니다.');
            setIsPicking(false);
        }
    };

    const onPressPicker = () => {
        Alert.alert('이미지 선택', '원하시는 방법을 선택하세요.', [
            { text: '사진 찍기', onPress: takePhoto },
            { text: '갤러리에서 선택', onPress: pickFromLibrary },
            { text: '취소', style: 'cancel' },
        ]);
    };

    const clearImage = () => {
        setSelectedImage(null);
        onImageSelected(null);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.pickBtn}
                onPress={onPressPicker}
                disabled={isPicking}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityLabel={selectedImage ? '이미지 변경' : '이미지 추가'}
            >
                {isPicking ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Icon name="camera" size={20} color="#fff" />
                )}
            </TouchableOpacity>

            {selectedImage ? (
                <View style={styles.previewWrap}>
                    <Image source={{ uri: selectedImage }} style={styles.image} />
                    <TouchableOpacity style={styles.removeBtn} onPress={clearImage}>
                        <Text style={styles.removeBtnText}>삭제</Text>
                    </TouchableOpacity>
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        marginVertical: 12,
    },
    pickBtn: {
        backgroundColor: 'rgba(255,114,38,1)',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    pickBtnText: {
        color: '#fff',
        fontWeight: '600',
    },
    previewWrap: {
        marginTop: 10,
        alignItems: 'flex-start',
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
    removeBtn: {
        marginTop: 8,
        backgroundColor: 'rgba(255, 114, 38, 1)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    removeBtnText: {
        color: '#fff',
        fontWeight: '600',
    },
});

export default ImageUploader;