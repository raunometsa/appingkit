import React from 'react';
import { View, Text, TextInput, Dimensions, Image, ImageBackground, ScrollView, AsyncStorage, FlatList, TouchableOpacity, TouchableHighlight, ActionSheetIOS, ActivityIndicator } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import Config from '../Config';
import { Ionicons } from '@expo/vector-icons';
import { ImagePicker, Permissions, Location } from 'expo';

export default class FeedScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { navigate } = navigation;

        return {
            headerStyle: {
                backgroundColor: '#f8f8f8'
            },
            headerTitle: 'Photo Feed',
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
            posts: null
        }
    }

    componentDidMount() {
        this.props.navigation.addListener('willFocus', (playload) => {
            this.getFeed();
        });

        this.getFeed();
    }

    _takePhoto = async () => {
        const {
            status: cameraPerm
        } = await Permissions.askAsync(Permissions.CAMERA);

        const {
            status: cameraRollPerm
        } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        // only if user allows permission to camera AND camera roll
        if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
            let pickerResult = await ImagePicker.launchCameraAsync();

            this._handleImagePicked(pickerResult);
        }
    };

    _pickImage = async () => {
        const {
            status: cameraRollPerm
        } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        // only if user allows permission to camera roll
        if (cameraRollPerm === 'granted') {
            let pickerResult = await ImagePicker.launchImageLibraryAsync();

            this._handleImagePicked(pickerResult);
        }
    };

    _handleImagePicked = async pickerResult => {
        if (!pickerResult.cancelled) {
            this.setState({photo: pickerResult});
        }
    }

    _removeImage = async index => {
        this.setState({photo: null});
    };

    addPost() {
        this.setState({
            addIsLoading: true
        });

        AsyncStorage.getItem('token', (err, token) => {
            token = JSON.parse(token);

            let formData = new FormData();

            if (this.state.photo) {
                var photo = this.state.photo;
                let uri = photo.uri;
                let uriParts = uri.split('.');
                let fileType = uri[uri.length - 1];

                formData.append('photo', {
                    uri,
                    name: `photo.${fileType}`,
                    type: `image/${fileType}`,
                });
            }

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

            fetch(Config.getApiUrl() + '/posts', options)
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
                            photo: null,
                            text: ''
                        });

                        this.getFeed();
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        });
    }

    openPhotoMenu() {
        ActionSheetIOS.showActionSheetWithOptions({
            options: ['Cancel', 'Choose from gallery', 'Take a photo'],
            cancelButtonIndex: 0,
        },
        (buttonIndex) => {
            if (buttonIndex === 1) {
                this._pickImage();
            } else if (buttonIndex === 2) {
                this._takePhoto();
            }
        });
    }

    async getFeed() {
        AsyncStorage.getItem('token', (err, result) => {
            token = JSON.parse(result);

            if (token && token.access_token) {
                return fetch(Config.getApiUrl() + '/posts', {
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
                        posts: res
                    });
                })
                .catch((error) => {
                    console.error(error);
                });
            }
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
                        {
                            this.state.photo ?
                            <TouchableOpacity onPress={this._removeImage} style={{
                                backgroundColor: '#f8f8f8',
                                borderRadius: 3,
                                width: 40,
                                height: 40,
                                marginRight: 8
                            }}>
                                <ImageBackground source={{uri: this.state.photo.uri}} style={{width: '100%', height: '100%', borderRadius: 3}} imageStyle={{ borderRadius: 3 }}>
                                    <Ionicons name='ios-trash' size={24} color='#fff' style={{
                                        marginLeft: 14,
                                        marginTop: 7
                                    }} />
                                </ImageBackground>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={this.openPhotoMenu.bind(this)} style={{
                                backgroundColor: '#f8f8f8',
                                borderRadius: 3,
                                width: 40,
                                height: 40,
                                marginRight: 8
                            }}>
                                <Ionicons name='ios-camera' size={30} color='#bbb' style={{
                                    marginLeft: 9,
                                    marginTop: 5
                                }} />
                            </TouchableOpacity>
                        }

                        <View style={{
                            position: 'relative',
                            paddingBottom: 10,
                            flex: 1
                        }}>
                            <TextInput
                                value={this.state.text}
                                onChangeText={ (text) => this.setState({ text }) }
                                placeholder="What's up?"
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
                                <TouchableOpacity onPress={this.addPost.bind(this)} style={{
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

                <FlatList
                    renderItem={({item}) => <View style={{
                        flex: 1,
                        marginBottom: 10
                    }}>
                        {
                            item.photo ?
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                            }}>
                                <TouchableOpacity activeOpacity={1}>
                                    <AutoHeightImage
                                        width={Dimensions.get('window').width}
                                        source={{uri: Config.getStorageUrl() + '/posts/screens/' + item.photo}}
                                    />
                                </TouchableOpacity>
                            </View>
                            : null
                        }

                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            margin: 10
                        }}>
                            <View style={{
                                flex: 1,
                            }}>
                                <Text style={{
                                    fontSize: 14,
                                    color: '#777',
                                    marginTop: 1,
                                    marginLeft: 5,
                                    textAlign: 'left'
                                }}>{item.text}</Text>
                            </View>
                        </View>
                    </View>}
                        data={this.state.posts}
                        keyExtractor={(item, index) => item.id.toString()}
                    />
            </ScrollView>
        );
    }
}
