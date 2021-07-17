import React, {useEffect, useState} from 'react';
import {List, FAB, Avatar} from 'react-native-paper';
import {View, ScrollView, StyleSheet} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const DocList = ({openCapture}) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    loadList();
  }, []);

  const loadList = async () => {
    let store = await AsyncStorage.getItem('list');
    console.log(store);
    if (store && store.length) {
      store = JSON.parse(store);
      if (store.list) setList(store.list);
    }
  };

  console.log(list.length);

  return (
    <View style={{flex: 1, paddingTop: 64}}>
      <ScrollView style={{flex: 1}}>
        {Boolean(list.length) &&
          list.map((item, i) => (
            <List.Item
              key={i}
              title={item.name}
              left={() => <Avatar.Image size={48} source={{uri: item.img}} />}
            />
          ))}
      </ScrollView>
      <FAB style={styles.fab} icon="plus" onPress={openCapture} />
    </View>
  );
};

export default DocList;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 24,
    right: 0,
    bottom: 0,
  },
});
