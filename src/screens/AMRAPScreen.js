import React, {useState, useEffect, useRef, useCallback} from 'react';
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Sound from 'react-native-sound';
import KeepAwake from 'react-native-keep-awake';
import Select from '../components/Select';
import Title from '../components/Title';
import Time from '../components/Time';
import ProgressBar from '../components/ProgressBar';
import BackgroundProgress from '../components/BackgroundProgress';

const alert = new Sound(require('../../assets/sounds/alert.wav'));

const AMRAPScreen = ({navigation: {goBack}}) => {
  const [keyboardIsVisible, setKeyboardIsVisible] = useState('');

  const [alerts, setAlerts] = useState([0, 15]);
  const [countdown, setCountdown] = useState(1);
  const [time, setTime] = useState('2');

  const [isRunning, setIsRunning] = useState(false);
  const [countdownValue, setCountdownValue] = useState(0);
  const [count, setCount] = useState(0);
  const [repetitions, setRepetitions] = useState(0);
  const [paused, setPaused] = useState(false);

  const kbShow = useRef(null);
  const kbHide = useRef(null);

  useEffect(() => {
    if (isRunning) {
      const resto = count % 60;
      if (alerts.indexOf(resto) >= 0) {
        alert.play();
      }
      if (countdown === 1) {
        if (resto >= 55 && resto < 60) {
          alert.play();
        }
      }
    }
  }, [alerts, count, countdown, isRunning]);

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
      setPaused(false);
      setRepetitions(0);
      setCount(0);
      setCountdownValue(countdown === 1 ? 5 : 0);
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
    setTime(1);
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
  }, [countdown, countdownValue, isRunning, paused]);

  useEffect(() => {
    if (isRunning) {
      let countTimer = null;
      if (countdown === 1 && countdownValue === 0 && !paused) {
        countTimer = setInterval(memoizedCallback, 1000);
      }
      if (count === parseInt(time, 10) * 60) {
        clearInterval(countTimer);
      }
      return () => {
        clearInterval(countTimer);
      };
    }
  }, [
    count,
    countdown,
    countdownValue,
    time,
    isRunning,
    memoizedCallback,
    paused,
  ]);

  useEffect(() => {
    if (isRunning) {
      let countTimer = null;

      if (countdown === 0 && !paused) {
        countTimer = setInterval(memoizedCallback, 1000);
      }
      if (count === parseInt(time, 10) * 60) {
        clearInterval(countTimer);
      }

      return () => {
        clearInterval(countTimer);
      };
    }
  }, [
    count,
    memoizedCallback,
    countdown,
    countdownValue,
    time,
    isRunning,
    paused,
  ]);

  const decrement = () => {
    if (repetitions > 0) {
      setRepetitions(repetitions - 1);
    }
  };
  const increment = () => {
    if (repetitions >= 0) {
      setRepetitions(repetitions + 1);
    }
  };

  if (isRunning) {
    const percMinute = parseInt(((count % 60) / 60) * 100);
    const percTime = parseInt((count / 60 / parseInt(time)) * 100);
    const media = repetitions > 0 ? count / repetitions : 0;
    const estimated = media > 0 ? Math.floor((parseInt(time) * 60) / media) : 0;
    const opacity = !paused ? 0.6 : 1;
    return (
      <BackgroundProgress percentage={percMinute}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <KeepAwake />
          <View style={{flex: 1}}>
            <Title
              title="AMRAP"
              subTitle="As Many Repetitions As Possible"
              style={{paddingTop: keyboardIsVisible ? 80 : 100}}
            />
          </View>
          {repetitions > 0 ? (
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <Time time={media} type="text3" />
                <Text style={styles.subTitle}>por repetição</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.count}>{estimated}</Text>
                <Text style={styles.subTitle}>repetições</Text>
              </View>
            </View>
          ) : null}
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Time time={count} />
            <ProgressBar percentage={percTime} />
            <Time
              time={parseInt(time, 10) * 60 - count}
              type="text2"
              appendedText=" restantes"
            />
          </View>
          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            {countdownValue > 0 ? (
              <Text style={styles.countdown}>{countdownValue}</Text>
            ) : (
              <View
                style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <TouchableOpacity
                  onPress={() => {
                    decrement();
                  }}>
                  <Text style={styles.countdown}>-</Text>
                </TouchableOpacity>
                <Text style={styles.countdown}>{repetitions}</Text>
                <TouchableOpacity
                  onPress={() => {
                    increment();
                  }}>
                  <Text style={styles.countdown}>+</Text>
                </TouchableOpacity>
              </View>
            )}
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
        <Title
          title="AMRAP"
          subTitle="As Many Repetitions As Possible"
          style={{paddingTop}}
        />
        <TouchableOpacity onPress={() => goBack()}>
          <Icon
            style={{alignSelf: 'center'}}
            name="settings"
            size={60}
            color="white"
          />
        </TouchableOpacity>
        <Select
          label="Alertas"
          current={alerts}
          options={[
            {id: 0, label: '0s'},
            {id: 15, label: '15s'},
            {id: 30, label: '30s'},
            {id: 45, label: '45s'},
          ]}
          onSelect={opt => setAlerts(opt)}
        />
        <Select
          label="Contagem regressiva"
          current={countdown}
          options={[
            {id: 1, label: 'sim'},
            {id: 0, label: 'não'},
          ]}
          onSelect={opt => setCountdown(opt)}
        />
        <Text style={styles.label}>Quantos Minutos:</Text>
        <TextInput
          keyboardType="numeric"
          style={styles.input}
          value={time}
          onChangeText={text => setTime(text)}
        />
        <Text style={styles.label}>minutos</Text>
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
  countdown: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 144,
    color: 'white',
    textAlign: 'center',
  },
  count: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 36,
    color: 'white',
    textAlign: 'center',
  },
  subTitle: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: 11,
    textAlign: 'center',
    color: 'white',
  },
});

export default AMRAPScreen;
