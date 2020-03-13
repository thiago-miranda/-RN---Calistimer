import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Button from '../components/Button';

const HomeScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>CalisTimer</Text>
      <Button style={styles.btn} onPress={() => navigation.navigate('EMOM')}>
        EMOM
      </Button>
      <Button style={styles.btn} onPress={() => navigation.navigate('AMRAP')}>
        AMRAP
      </Button>
      <Button
        style={styles.btn}
        onPress={() => navigation.navigate('Isometria')}>
        Isometria
      </Button>
      <Button style={styles.btn} onPress={() => navigation.navigate('About')}>
        Sobre
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D6304A',
  },
  logo: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 48,
    color: 'white',
    textAlign: 'center',
    marginTop: 111,
    marginBottom: 111,
  },
  btn: {
    padding: 20,
  },
});

export default HomeScreen;
