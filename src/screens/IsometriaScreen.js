import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  Platform,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  View,
  TouchableOpacity,
} from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Sound from 'react-native-sound';
import Select from '../components/Select';
import Title from '../components/Title';
import Time from '../components/Time';
import BackgroundProgress from '../components/BackgroundProgress';

const alert = new Sound(require('../../assets/sounds/alert.wav'));

const IsometriaScreen = ({navigation: {goBack}}) => {
  const [keyboardIsVisible, setKeyboardIsVisible] = useState('');

  const [goal, setGoal] = useState(1);
  const [paused, setPaused] = useState(false);
  const [time, setTime] = useState('20');

  const [isRunning, setIsRunning] = useState(false);
  const [countdownValue, setCountdownValue] = useState(0);
  const [countdown, setCountdown] = useState(1);
  const [count, setCount] = useState(0);

  const kbShow = useRef(null);
  const kbHide = useRef(null);

  useEffect(() => {
    if (isRunning) {
      if (count >= parseInt(time) - 5 && count <= parseInt(time)) {
        alert.play();
      }
    }
  }, [count, isRunning, time]);

  useEffect(() => {
    Sound.setCategory('Playback', true);
  }, []);

  useEffect(() => {
    kbShow.current = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardIsVisible(true),
    );
    kbHide.current = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardIsVisible(false),
    );
    return () => {
      kbShow.current.remove();
      kbHide.current.remove();
    };
  });

  const play = () => {
    if (time > 0) {
      const timeAux = goal === 0 ? '0' : time;
      setTime(timeAux);
      setPaused(false);
      setCount(0);
      setCountdownValue(5);
      setIsRunning(true);
    }
  };

  const back = () => {
    if (paused || !isRunning) {
      goBack();
    }
  };

  const restart = () => {
    if (paused) {
      play();
    }
  };

  const stop = () => {
    setPaused(!paused);
  };

  const test = () => {
    const timeAux = goal === 0 ? '0' : 10;
    setTime(timeAux);
    setPaused(false);
    setCount(0);
    setCountdownValue(0);
    setIsRunning(true);
  };

  const memoizedCallback = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  useEffect(() => {
    if (isRunning) {
      let interval = null;
      if (countdown === 1 && !paused) {
        alert.play();
        interval = setInterval(() => {
          alert.play();
          setCountdownValue(countdownValue - 1);
        }, 1000);
      }
      if (countdownValue === 0) {
        clearInterval(interval);
      }

      return () => {
        clearInterval(interval);
      };
    }
  }, [countdownValue, isRunning, countdown, paused]);

  useEffect(() => {
    if (isRunning) {
      let countTimer = null;
      if (countdownValue === 0 && !paused) {
        countTimer = setInterval(memoizedCallback, 1000);
      }
      return () => {
        clearInterval(countTimer);
      };
    }
  }, [memoizedCallback, countdownValue, isRunning, paused]);

  if (isRunning) {
    const percMinute =
      time === '0' ? 0 : parseInt((count / parseInt(time)) * 100);
    const restante =
      parseInt(time) >= parseInt(count) ? parseInt(time) - parseInt(count) : 0;
    const opacity = !paused ? 0.6 : 1;
    return (
      <BackgroundProgress percentage={percMinute}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <KeepAwake />
          <View style={{flex: 1}}>
            <Title
              title="ISOMETRIA"
              style={{paddingTop: keyboardIsVisible ? 80 : 100}}
            />
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Time time={count} />
            {goal === 1 ? (
              <Time time={restante} type="text2" appendedText=" restantes" />
            ) : null}
          </View>
          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            {countdownValue > 0 ? (
              <Text style={styles.countdown}>{countdownValue}</Text>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginBottom: 40,
              }}>
              <TouchableOpacity
                onPress={() => back()}
                style={{alignSelf: 'center'}}>
                <Icon
                  style={{opacity}}
                  name="keyboard-backspace"
                  color="white"
                  size={40}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => stop()}
                style={{alignSelf: 'center'}}>
                {paused ? (
                  <Icon name="play-circle" color="white" size={60} />
                ) : (
                  <Icon name="stop-circle" color="white" size={60} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => restart()}
                style={{alignSelf: 'center'}}>
                <Icon
                  style={{opacity}}
                  name="restart"
                  color="white"
                  size={40}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BackgroundProgress>
    );
  }
  const behavior = Platform.OS !== 'ios' ? 'height' : 'padding';
  const paddingTop =
    Platform.OS === 'ios' ? (keyboardIsVisible ? 20 : 200) : 100;
  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={behavior}>
      <ScrollView style={styles.container}>
        <Title title="Isometria" style={{paddingTop}} />
        <Icon
          style={{alignSelf: 'center'}}
          name="settings"
          size={60}
          color="white"
        />
        <Select
          label="Objetivos:"
          current={goal}
          options={[
            {id: 0, label: 'livre'},
            {id: 1, label: 'bater tempo'},
          ]}
          onSelect={opt => setGoal(opt)}
        />
        {goal !== 0 ? (
          <React.Fragment>
            <Text style={styles.label}>Quantos segundos:</Text>
            <TextInput
              keyboardType="numeric"
              style={styles.input}
              value={time}
              onChangeText={text => setTime(text)}
            />
          </React.Fragment>
        ) : null}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 40,
          }}>
          <TouchableOpacity
            onPress={() => back()}
            style={{alignSelf: 'center'}}>
            <Icon name="keyboard-backspace" color="white" size={40} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => play()}
            style={{alignSelf: 'center'}}>
            <Icon name="play-circle" size={60} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => test()}
            style={{alignSelf: 'center'}}>
            <Text style={{color: 'white'}}>Testar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D6304A',
  },
  label: {
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Ubuntu-Regular',
    fontSize: 24,
  },
  input: {
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Ubuntu-Regular',
    fontSize: 48,
  },
  imgSettings: {
    alignSelf: 'center',
    marginBottom: 17,
  },
  countdown: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 144,
    color: 'white',
    textAlign: 'center',
  },
});

export default IsometriaScreen;
