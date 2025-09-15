// ImageUploader 컴포넌트
// - Expo ImagePicker를 사용하여 기기에서 이미지를 선택
// - 선택된 이미지 URI를 부모로 전달(onImageSelected)
// Props: onImageSelected: (uri: string) => void

import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface Props {
    onImageSelected: (uri: string) => void;
}

const ImageUploader: React.FC<Props> = ({ onImageSelected }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        const granted = (permissionResult as any).granted !== undefined
            ? (permissionResult as any).granted
            : permissionResult.status === 'granted';

        if (!granted) {
            Alert.alert('권한 필요', '이미지 접근 권한이 필요합니다.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
            allowsEditing: true,
        });

        const anyResult = result as any;
        if (anyResult.cancelled === true || anyResult.canceled === true) {
            return;
        }

        const uri: string | undefined = anyResult.uri ?? (Array.isArray(anyResult.assets) ? anyResult.assets[0]?.uri : undefined);

        if (typeof uri === 'string') {
            setSelectedImage(uri);
            onImageSelected(uri);
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Upload Image" onPress={pickImage} />
            {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 20,
    },
    image: {
        width: 200,
        height: 200,
        marginTop: 10,
        borderRadius: 10,
    },
});

export default ImageUploader;