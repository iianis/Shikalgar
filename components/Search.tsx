import { StyleSheet, View, TextInput } from 'react-native';

import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../utility/MasterTypes';
// in order use fonts add following 2 lines to android/app/build.gradle
//project.ext.vectoricons = [iconFontNames: ['MaterialIcons.ttf', 'EvilIcons.ttf', 'Feather.ttf']]
//apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"

const Search = ({ PlaceHolder, FilterBySearch }) => {
  const [searchInput, setSearchInput] = useState('');
  //console.log('search text.. ', searchInput);
  return (
    <View style={styles.container}>
      {/* <Feather
        name="search"
        size={30}
        color="grey"
        style={styles.imageSearch}
      /> */}
      <TextInput value={searchInput}
        onChangeText={(value) => { setSearchInput(value); FilterBySearch(value); }}
        style={styles.input} placeholder={PlaceHolder} />
      <Icon name="cancel" size={30} color="grey" style={styles.imageCancel} onPress={() => { setSearchInput(''); FilterBySearch(''); }} />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: { width: '90%', flexDirection: 'row' },
  imageSearch: { marginTop: 15, marginRight: 5 },
  imageCancel: { marginTop: 15, marginLeft: 5 },
  input: {
    backgroundColor: 'lightgrey',
    width: '100%',
    borderRadius: 5,
    marginVertical: 5,
    fontSize: 18,
    color: Colors.darkgrey,
    paddingLeft: 10,
  },
});
