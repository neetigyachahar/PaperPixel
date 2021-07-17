import React, {useState} from 'react';
import {View, TextInput, Image, StyleSheet} from 'react-native';
import DocumentScanner from '@woonivers/react-native-document-scanner';
import uriToBase64 from '../utils/uriToBase64';
import {Button, Portal, Dialog} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Capture = ({close}) => {
  const initialImage = {
    image: '',
    initialImage: '',
    rectangleCoordinates: '',
  };
  const [image, setImage] = useState(initialImage);
  const [nameDialog, setNameDialog] = useState(false);
  const [name, setName] = useState('');
  const [dataUrl, setDataUrl] = useState('');

  const captureHandler = async data => {
    const base64Image = await uriToBase64(data.croppedImage);
    setDataUrl(base64Image);
    setImage({
      image: base64Image,
      initialImage: data.initialImage,
      rectangleCoordinates: data.rectangleCoordinates,
    });
  };

  const retryHandler = () => setImage(initialImage);

  const saveHanler = async () => {
    try {
      if (!name.length) return;
      let store = await AsyncStorage.getItem('list');
      let newList;
      let newListItem = {
        name,
        img: dataUrl,
      };
      console.log(store)
      if (store && store.length) store = JSON.parse(store);
      if (store) {
        let list = store.list;
        console.log(store, list)
        newList = list.concat([newListItem]);
      } else {
        newList = [newListItem];
      }
      setNameDialog(false);
      await AsyncStorage.setItem('list', JSON.stringify({list: newList}));
      close();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {!Boolean(image.image.length) ? (
        <DocumentScanner
          style={{flex: 1, width: '100%', height: '100%'}}
          useBase64
          saveInAppDocument={false}
          onPictureTaken={captureHandler}
          overlayColor="rgba(255,130,0, 0.7)"
          enableTorch={false}
          brightness={0.3}
          saturation={1}
          contrast={1.1}
          quality={0.5}
          detectionCountBeforeCapture={1}
          detectionRefreshRateInMS={10}
          onPermissionsDenied={() => console.log('Permissions Denied')}
        />
      ) : null}
      {Boolean(image.image.length) ? (
        <>
          <Image
            style={{flex: 0.9}}
            source={{uri: image.image}}
            resizeMode="contain"
          />
          <View style={styles.btns}>
            <Button style={{margin: 8}} mode="outlined" onPress={retryHandler}>
              Retry
            </Button>
            <Button
              style={{margin: 8}}
              mode="contained"
              onPress={() => setNameDialog(true)}>
              Save
            </Button>
          </View>
        </>
      ) : null}
      <Portal>
        <Dialog visible={nameDialog}>
          <Dialog.Title>Set name</Dialog.Title>
          <Dialog.Content>
            <TextInput
              style={styles.input}
              label="Set a name"
              value={name}
              onChangeText={setName}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={saveHanler}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default Capture;

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderColor: '#808080',
    borderRadius: 8,
    padding: 8,
  },
  btns: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
