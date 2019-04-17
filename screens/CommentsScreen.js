import React from 'react';
import { View, Text, TextInput, Dimensions, ScrollView, AsyncStorage, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import Config from '../Config';
import { Ionicons } from '@expo/vector-icons';

export default class CommentScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { navigate } = navigation;

        return {
            headerStyle: {
                backgroundColor: '#f8f8f8'
            },
            headerTitle: 'Comments',
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
            addIsLoading: false,
            comments: null
        }
    }

    componentDidMount() {
        this.props.navigation.addListener('willFocus', (playload) => {
            this.getComments();
        });

        this.getComments();
    }

    _keyExtractor = (item, index) => item.id.toString();

    addComment() {
        this.setState({
            addIsLoading: true
        });

        AsyncStorage.getItem('token', (err, token) => {
            token = JSON.parse(token);

            let formData = new FormData();

            formData.append('dummy', 'dummy');

            if (this.state.text) {
                formData.append('text', this.state.text);
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

            fetch(Config.getApiUrl() + '/comments', options)
                .then(response => response.json())
                .then(res => {
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
                            text: ''
                        });

                        this.getComments();
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        });
    }

    async getComments() {
        AsyncStorage.getItem('token', (err, result) => {
            token = JSON.parse(result);

            if (token && token.access_token) {
                return fetch(Config.getApiUrl() + '/comments', {
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
                        comments: res
                    });
                })
                .catch((error) => {
                    console.error(error);
                });
            }
        });
    }

    comment(comment) {
        return <View style={{
                    flexDirection: 'row',
                    marginBottom: 10
                }}>
                    <View style={{
                        backgroundColor: this.getColor(comment),
                        borderRadius: 20,
                        width: 30,
                        height: 30
                    }}>
                        <Ionicons name='ios-person' size={23} color='#fff' style={{
                            marginLeft: 8,
                            marginTop: 2
                        }}/>
                    </View>

                    <View style={{
                        marginLeft: 8,
                        marginTop: 5,
                        flex: 1
                    }}>
                        <Text style={{ fontSize: 16 }}>{comment.text}</Text>
                    </View>

                    <TouchableOpacity onPress={(e) => this.deleteComment(comment.id, e)} style={{
                        padding: 2,
                        paddingLeft: 15,
                        paddingRight: 6
                    }}>
                        <Ionicons name='ios-trash' size={22} color='#999'/>
                    </TouchableOpacity>
                </View>
    }

    deleteComment(commentId) {
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

            fetch(Config.getApiUrl() + '/comments/' + commentId + '/delete', options)
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

                        this.getComments();
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        });
    }

    getColor(guest) {
        return guest.color;
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

                <AutoHeightImage
                    width={Dimensions.get('window').width}
                    source={require('../assets/beach.png')}
                />

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
                                value={this.state.text}
                                onChangeText={ (text) => this.setState({ text }) }
                                placeholder='Add your comment...'
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
                                <TouchableOpacity onPress={this.addComment.bind(this)} style={{
                                    alignItems: 'center',
                                    position: 'absolute',
                                    top: 6,
                                    right: 0,
                                    zIndex: 9999
                                }}>
                                    <Ionicons name='ios-send' size={28} color='#3897f0' />
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                </View>

                <FlatList data={this.state.comments}
                    renderItem={({item}) => this.comment(item)}
                    keyExtractor={this._keyExtractor}
                    style={{
                        margin: 10
                    }}
                />
            </ScrollView>
        );
    }
}
