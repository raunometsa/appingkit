import React from 'react';
import { View, Text, TextInput, Dimensions, Image, ImageBackground, ScrollView, AsyncStorage, FlatList, TouchableOpacity, TouchableHighlight, ActionSheetIOS, ActivityIndicator } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import Config from '../Config';
import { Ionicons } from '@expo/vector-icons';
import { ImagePicker, Permissions, Location } from 'expo';

export default class TodoScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { navigate } = navigation;

        return {
            headerStyle: {
                backgroundColor: '#f8f8f8'
            },
            headerTitle: 'Todo List',
            headerBackTitle: null,
            headerRight: (
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Ionicons name='ios-home' size={20} color='#333' style={{
                        marginRight: 15
                    }} />
                </TouchableOpacity>
            )
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            tasks: null
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({ signOut: this._signOut });

        this.props.navigation.addListener('willFocus', (playload) => {
            this.getTasks();
        });

        this.getTasks();
    }

    _keyExtractor = (item, index) => item.id.toString();

    addTask() {
        this.setState({
            addIsLoading: true
        });

        AsyncStorage.getItem('token', (err, token) => {
            token = JSON.parse(token);

            let formData = new FormData();

            formData.append('dummy', 'dummy');

            if (this.state.title) {
                formData.append('title', this.state.title);
            }

            let options = {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + token.access_token
                },
            };

            fetch(Config.getApiUrl() + '/tasks', options)
                .then(response => response.json())
                .then(res => {
                    console.log(res);

                    if (typeof(res.error) !== 'undefined') {
                        this.setState({
                            error: res.error,
                            addIsLoading: false
                        });

                        this.scrollView.scrollTo({
                            x: 0,
                            y: 0,
                            animated: true
                        });
                    } else {
                        this.setState({
                            addIsLoading: false,
                            error: null,
                            title: ''
                        });

                        this.getTasks();
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        });
    }

    async getTasks() {
        AsyncStorage.getItem('token', (err, result) => {
            token = JSON.parse(result);

            if (token && token.access_token) {
                return fetch(Config.getApiUrl() + '/tasks', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.access_token
                    }
                })
                .then((response) => response.json())
                .then((res) => {
                    this.setState({
                        isLoading: false,
                        tasks: res
                    });
                })
                .catch((error) => {
                    console.error(error);
                });
            }
        });
    }

    task(task) {
        return <View style={{
                    flexDirection: 'row',
                    marginBottom: 10
                }}>
                    <TouchableOpacity onPress={(e) => this.toggleTask(task.id, e)}>
                        {
                            task.completed_at ?
                            <Ionicons name='ios-checkbox' size={23} color='green' style={{
                                marginLeft: 8,
                                marginTop: 2
                            }}/>
                            :
                            <Ionicons name='ios-square-outline' size={23} color='#ddd' style={{
                                marginLeft: 8,
                                marginTop: 2
                            }}/>
                        }
                    </TouchableOpacity>

                    <View style={{
                        marginLeft: 8,
                        marginTop: 5,
                        flex: 1
                    }}>
                        <Text style={{ fontSize: 16 }}>{task.title}</Text>
                    </View>

                    <TouchableOpacity onPress={(e) => this.deleteTask(task.id, e)} style={{
                        padding: 2,
                        paddingLeft: 15,
                        paddingRight: 12
                    }}>
                        <Ionicons name='ios-trash' size={22} color='#999'/>
                    </TouchableOpacity>
                </View>
    }

    deleteTask(taskId) {
        AsyncStorage.getItem('token', (err, token) => {
            token = JSON.parse(token);

            let options = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + token.access_token
                },
            };

            fetch(Config.getApiUrl() + '/tasks/' + taskId + '/delete', options)
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
                        this.setState({
                            isLoading: false,
                            error: null
                        });

                        this.getTasks();
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        });
    }

    toggleTask(taskId) {
        AsyncStorage.getItem('token', (err, token) => {
            token = JSON.parse(token);

            let options = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + token.access_token
                },
            };

            fetch(Config.getApiUrl() + '/tasks/' + taskId + '/toggle', options)
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
                        this.setState({
                            isLoading: false,
                            error: null
                        });

                        this.getTasks();
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        });
    }

    render() {
        return (
            <ScrollView style={{ backgroundColor: '#fff' }}
                    ref={ref => this.scrollView = ref}>
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
                
                <View style={{
                    padding: 15
                }}>
                    <View style={{
                        flexDirection: 'row'
                    }}>
                        <View style={{
                            position: 'relative',
                            paddingBottom: 10,
                            flex: 1
                        }}>
                            <TextInput
                                value={this.state.title}
                                onChangeText={ (title) => this.setState({ title }) }
                                placeholder='What needs to be done?'
                                clearButtonMode='while-editing'
                                style={{
                                    marginTop: 11,
                                    fontSize: 16,
                                    flex: 1,
                                    marginRight: 30
                                }}
                            />

                            {
                                this.state.addIsLoading ?
                                <ActivityIndicator style={{
                                    alignItems: 'center',
                                    position: 'absolute',
                                    top: 8,
                                    right: 2
                                }} /> :
                                <TouchableOpacity onPress={this.addTask.bind(this)} style={{
                                    alignItems: 'center',
                                    position: 'absolute',
                                    top: 6,
                                    right: 0,
                                    zIndex: 9999
                                }}>
                                    <Ionicons name='ios-add-circle' size={28} color='#3897f0' />
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                </View>

                <FlatList data={this.state.tasks}
                    renderItem={({item}) => this.task(item)}
                    keyExtractor={this._keyExtractor}
                    style={{
                        margin: 10
                    }}
                />
            </ScrollView>
        );
    }
}
