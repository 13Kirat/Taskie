import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { Button, Paragraph } from 'react-native-paper';
import * as ExpoImagePicker from 'expo-image-picker';

const ImagePicker = ({ images, setImages, style }) => {
  const pickImages = async () => {
    const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
      return;
    }

    let result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets]);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <View style={[styles.container, style]}>
      <Button 
        mode="outlined" 
        onPress={pickImages}
        style={styles.button}
        icon="camera"
      >
        Select Images
      </Button>
      
      {images.length > 0 && (
        <>
          <Paragraph style={styles.imagesTitle}>Selected Images:</Paragraph>
          <ScrollView horizontal style={styles.imageScrollView}>
            {images.map((image, index) => (
              <TouchableOpacity 
                key={index} 
                onPress={() => removeImage(index)}
                style={styles.imageContainer}
              >
                <Image source={{ uri: image.uri }} style={styles.image} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  button: {
    marginBottom: 8,
  },
  imagesTitle: {
    marginTop: 8,
    marginBottom: 8,
  },
  imageScrollView: {
    flexDirection: 'row',
  },
  imageContainer: {
    marginRight: 8,
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});

export default ImagePicker;
