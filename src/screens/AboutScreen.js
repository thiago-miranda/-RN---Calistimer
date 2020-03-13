import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AboutScreen = ({navigation: {goBack}}) => {
  const openURL = url => () => {
    Linking.openURL(url);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Calistimer</Text>
      <Text style={styles.description}>
        Este aplicativo foi construído durante as aulas do curso de
        ReactJS/React-Native do DevPleno, o devReactJS nos módulos de
        react-native.
      </Text>
      <TouchableOpacity onPress={openURL('https://devpleno.com')}>
        <Image
          style={{height: 80, width: 330}}
          source={require('../../assets/logoDevPleno.png')}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={openURL('https://devpleno.com/devreactjs')}>
        <Image
          style={{height: 60, width: 290}}
          source={require('../../assets/logoDevReactJS.png')}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => goBack()}>
        <Icon name="keyboard-backspace" color="white" size={40} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D6304A',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  logo: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 48,
    color: 'white',
    textAlign: 'center',
    marginTop: 111,
    marginBottom: 111,
  },
  description: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 24,
    color: 'white',
    margin: 20,
  },
});

export default AboutScreen;
