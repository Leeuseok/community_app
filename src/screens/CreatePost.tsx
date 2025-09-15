import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import ImageUploader from '../components/ImageUploader';
import { createPost } from '../services/firebase'; // Assuming you have a function to handle post creation

const CreatePost = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);

    const handleSubmit = async () => {
        if (title && content) {
            await createPost({ title, content, image });
            navigation.navigate('Home'); // Navigate back to Home after creating a post
        } else {
            alert('Please fill in all fields');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Create a New Post</Text>
            <TextInput
                style={styles.input}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.input}
                placeholder="Content"
                value={content}
                onChangeText={setContent}
                multiline
            />
            <ImageUploader onImageSelected={setImage} />
            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
});

export default CreatePost;