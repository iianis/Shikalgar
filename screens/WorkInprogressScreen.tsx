import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native'
import React from 'react'

const WorkInprogressScreen = ({ route }) => {
    const item = route.params?.item;
    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../utility/images/workinprogress.jpeg')}
                style={[styles.image]}>
                <View style={styles.containerText}>
                    <Text style={styles.text}>{item.title}</Text>
                    <Text style={styles.text2}>{item.description}</Text>
                </View>
            </ImageBackground>
        </View>
    )
}

export default WorkInprogressScreen


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        justifyContent: 'center',
        width: '100%',
        height: '120%'
    },
    containerText: {
        flex: 1,
        justifyContent: 'space-around'
    },
    text: {
        color: 'orange',
        fontSize: 32,
        lineHeight: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        top: -70,
        //backgroundColor: '#000000c0',
    },
    text2: {
        color: 'white',
        fontSize: 24,
        paddingBottom: 20,
        paddingHorizontal: 20,
        paddingTop: 20,
        textAlign: 'center',
        //lineHeight: 84,
        fontWeight: 'bold',
        opacity: .4,
        backgroundColor: '#000000c0',
    },
});

/*
import React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';

const WorkInProgress = ({ route }) => {
  const item = route.params?.item;
  return (
    <View style={[styles.container]}>
      <View>
        <Image
          source={require('../images/appbackground.jpeg')}
          style={{ width: '100%', height: '100%' }}
        />
      </View>
      <View style={styles.labelFloatAtBottom}>
        <Text style={styles.textFloatAtBottom}>We are working on this idea.
          Please feel free to contact us in case you have any suggestions.</Text>
      </View>
      <View style={styles.labelFloatAtTop}>
        <View style={{ flex: 1 }}>
          <Text style={styles.textFloatAtTop}>{item?.title}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
  },
  labelFloatAtBottom: {
    position: 'absolute',
    bottom: 50,
    paddingHorizontal: 10
  }, textFloatAtBottom: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold'
  },
  labelFloatAtTop: {
    position: 'absolute',
    top: 50,
    paddingHorizontal: 10
  },
  textFloatAtTop: {
    color: 'red',
    fontSize: 26,
    fontWeight: 'bold',
    marginLeft: 120
  }
});

export default WorkInProgress;

*/