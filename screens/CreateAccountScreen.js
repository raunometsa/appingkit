import React from 'react';
import { View, Text, Dimensions, Image, ScrollView, TouchableOpacity, KeyboardAvoidingView, AsyncStorage, ActionSheetIOS, ActivityIndicator } from 'react-native';
import FormButton from '../components/FormButton';
import FormTextInput from '../components/FormTextInput';
import Config from '../Config';

export default class CreateAccountScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { navigate } = navigation;

        return {
            headerStyle: {
                backgroundColor: '#f8f8f8'
            },
            headerTitle: 'Create Account',
            headerLeft: null
        };
    };

    constructor(props){
        super(props);

        this.state = {
            isLoading: false
        }
    }

    onNameChange(value) {
        this.setState({
            name: value
        });
    }

    onEmailChange(value) {
        this.setState({
            email: value
        });
    }

    onPasswordChange(value) {
        this.setState({
            password: value
        });
    }

    save() {
        this.setState({
            isLoading: true
        });

        let formData = new FormData();

        if (this.state.name) {
            formData.append('name', this.state.name);
        }

        if (this.state.email) {
            formData.append('email', this.state.email);
        }

        if (this.state.password) {
            formData.append('password', this.state.password);
        }

        let options = {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            },
        };

        fetch(Config.getApiUrl() + '/users', options)
            .then(response => response.json())
            .then(res => {
                if (typeof(res.error) !== 'undefined') {
                    this.setState({
                        error: res.error,
                        isLoading: false
                    });

                    this.scrollView.scrollTo({
                        x: 0,
                        y: 0,
                        animated: true
                    });
                } else {
                    AsyncStorage.setItem('user', JSON.stringify(res), () => {
                        fetch(Config.getDomain() + '/oauth/token', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                grant_type: 'password',
                                client_id: '2',
                                client_secret: '1fCO3lhDFfsXJvhYIyEzZAP3pOCwqcngG7X83Bpv',
                                username: this.state.email,
                                password: this.state.password,
                                scope: ''
                            })
                        })
                        .then(response => response.json())
                        .then(token => {
                            if (typeof(token.error) !== 'undefined') {
                                var error = 'Whoops';
                                if (token.error == 'invalid_request') {
                                    error = 'Email or password missing';
                                } else if (token.error == 'invalid_credentials') {
                                    error = 'Invalid email or password';
                                }

                                this.setState({
                                    error: error,
                                    isLoading: false
                                });

                                this.scrollView.scrollTo({
                                    x: 0,
                                    y: 0,
                                    animated: true
                                });
                            } else {
                                AsyncStorage.setItem('token', JSON.stringify(token), () => {
                                    this.props.navigation.navigate('Home');
                                });
                            }
                        })
                        .catch(error => {
                            console.error(error);
                        });
                    });
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    render() {
        return (
            <ScrollView style={{
                    backgroundColor: '#fff'
                }} ref={ref => this.scrollView = ref}>
                    <View style={{marginBottom: 10}}>
                    {
                        this.state.error ?
                            <View style={{
                                backgroundColor: '#ff2d55',
                            }}>
                                <Text style={{
                                    fontSize: 16,
                                    padding: 15,
                                    color: '#fff'
                                }}>{ this.state.error }</Text>
                            </View> : null
                    }

                    <FormTextInput placeholder='Name'
                            onChangeText={this.onNameChange.bind(this)} />

                    <FormTextInput placeholder='Email'
                            keyboardType='email-address'
                            autoCapitalize='none'
                            onChangeText={this.onEmailChange.bind(this)} />

                    <FormTextInput placeholder='Password'
                            onChangeText={this.onPasswordChange.bind(this)}
                            secureTextEntry={true}  />

                    <FormButton
                        backgroundColor='#3897f0'
                        label='Create Account'
                        isLoading={this.state.isLoading}
                        onPress={this.save.bind(this)}
                    />

                    <FormButton
                        backgroundColor='#f1f1f1'
                        textColor='#333'
                        onPress={() => this.props.navigation.navigate('Login')}
                        label='Have an account? Sign In'
                    />
                </View>
            </ScrollView>
        );
    }
}
