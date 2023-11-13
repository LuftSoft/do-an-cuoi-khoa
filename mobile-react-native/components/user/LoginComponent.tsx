import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {TextInput, Button, Text} from 'react-native-paper';
import {LoginModel} from './LoginModel';
import {LoginService} from './LoginService';
import {useUserProvider} from '../../utils/user.context';
import {CONFIG} from '../../utils/config';
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};
type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};
const initValues: LoginModel = {
  email: 'sv@student.ptithcm.edu.vn',
  password: 'Ptithcm2023',
};
const LoginComponent: React.FC<Props> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState(initValues);
  const [formData, setFormData] = useState(initValues);
  const {user, setUser} = useUserProvider();

  const handleLogin = async () => {
    // You can add your login logic here
    if (formData.password.trim().length < 6) {
      setErrors({...errors, password: 'Password is min length 6'});
      return;
    }
    if (formData.email.trim().length < 6) {
      setErrors({...errors, email: 'email is min length 6'});
      return;
    }
    const response = await LoginService.login(formData);
    if (response?.data?.code === CONFIG.API_RESPONSE_STATUS.SUCCESS) {
      const responseData = response?.data?.data;
      setUser({
        user: responseData?.user,
        accessToken: responseData?.accessToken,
        refreshToken: responseData?.refreshToken,
      });
      navigation.navigate('Home');
      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
    }
  };
  const handleChange = (type: string, text: string) => {
    switch (type) {
      case 'email':
        setFormData({...formData, email: text});
        break;
      case 'password':
        setFormData({...formData, password: text});
        break;
    }
  };
  const logoPath = require('../../assets/logo.jpg');
  return (
    <View style={styles.container}>
      <View style={styles.line_container}>
        <Image source={logoPath} style={styles.tinyLogo} />
      </View>
      <TextInput
        label="Email"
        value={formData.email}
        onChangeText={text => handleChange('email', text)}
        error={Boolean(errors.email)}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Mật khẩu"
        value={formData.password}
        onChangeText={text => handleChange('password', text)}
        secureTextEntry
        error={Boolean(errors.password)}
        mode="outlined"
        style={styles.input}
      />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>
      <Text style={styles.forgotPassword}>Forgot Password?</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  line_container: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  forgotPassword: {
    textAlign: 'center',
    marginTop: 16,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  tinyLogo: {
    width: 80,
    height: 80,
  },
});

export default LoginComponent;
