import React from 'react';
import { View, Text, Dimensions, Image, ScrollView, TouchableHighlight, AsyncStorage } from 'react-native';
import FormButton from '../components/FormButton';
import FormTextInput from '../components/FormTextInput';
import Config from '../Config';

export default class LoginScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { navigate } = navigation;

        return {
            headerStyle: {
                backgroundColor: '#f8f8f8'
            },
            headerTitle: 'Sign In',
            headerLeft: null
        };
    };

    constructor(props){
        super(props);

        this.state = {
            email: null,
            password: null
        };
    }

    componentDidMount() {
        AsyncStorage.getItem('token', (err, result) => {
            token = JSON.parse(result);

            if (token && token.access_token) {
                fetch(Config.getApiUrl() + '/my/user', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.access_token
                    }
                })
                .then(response => response.json())
                .then(user => {
                    AsyncStorage.setItem('user', JSON.stringify(user), () => {
                        this.props.navigation.navigate('Home');
                    });
                })
                .catch(error => {
                    console.error(error);
                });
            }
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

    signIn() {
        this.setState({
            isLoading: true
        });

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
                this.setState({
                    isLoading: false
                });

                AsyncStorage.setItem('token', JSON.stringify(token), () => {
                    fetch(Config.getApiUrl() + '/my/user', {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token.access_token
                        }
                    })
                    .then(response => response.json())
                    .then(user => {
                        AsyncStorage.setItem('user', JSON.stringify(user), () => {
                            this.props.navigation.navigate('Home');
                        });
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

                <FormTextInput
                        placeholder='Email'
                        onChangeText={this.onEmailChange.bind(this)}
                        keyboardType='email-address'
                        autoCapitalize='none'
                />

                <FormTextInput
                        placeholder='Password'
                        onChangeText={this.onPasswordChange.bind(this)}
                        secureTextEntry={true}
                />

                <FormButton
                    backgroundColor='#3897f0'
                    onPress={this.signIn.bind(this)}
                    label='Sign In'
                />

                <FormButton
                    backgroundColor='#f1f1f1'
                    textColor='#333'
                    onPress={() => this.props.navigation.navigate('CreateAccount')}
                    label='New user? Sign Up 👋'
                />
            </ScrollView>
        );
    }
}
