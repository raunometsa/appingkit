import React from 'react';
import { View, Text, Dimensions, Image, ScrollView, TouchableOpacity, AsyncStorage, ActivityIndicator, ActionSheetIOS } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import FormButton from '../components/FormButton';
import { ImagePicker, Permissions, Location } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import Config from '../Config';
import { MapView } from 'expo';

export default class MapScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { navigate } = navigation;

        return {
            headerStyle: {
                backgroundColor: '#f8f8f8'
            },
            headerTitle: 'Map',
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

    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
            location: null,
            locations: []
        }
    }

    async getMarkers() {
        AsyncStorage.getItem('token', (err, result) => {
            token = JSON.parse(result);

            if (token && token.access_token) {
                return fetch(Config.getApiUrl() + '/locations', {
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
                        locations: res
                    });
                })
                .catch((error) => {
                    console.error(error);
                });
            }
        });
    }

    componentDidMount() {
        this.props.navigation.addListener('willFocus', (playload) => {
            this._getLocationAsync();
        });

        this._getLocationAsync();

        this.getMarkers();
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                error: 'Permission to access location was denied',
            });
        }

        let location = await Location.getCurrentPositionAsync({});
        this.setState({ location });
    };

    save() {
        this.setState({
            isLoading: true
        });

        AsyncStorage.getItem('token', (err, token) => {
            token = JSON.parse(token);

            let formData = new FormData();

            if (this.state.location) {
                formData.append('location', JSON.stringify(this.state.location));
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

            fetch(Config.getApiUrl() + '/locations', options)
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
                        console.log('here!!!');
                        this.setState({
                            isLoading: false,
                            error: null,
                            location: null
                        });

                        this._getLocationAsync();

                        this.getMarkers();
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        });
    }

    render() {
        if (!this.state.location || !this.state.location.coords) {
            return <View style={{
                padding: 20
            }}>
                <ActivityIndicator />
            </View>;
        }

        return (
            <View style={{
                flex: 1,
                position: 'relative'
            }}>
                <TouchableOpacity onPress={this.save.bind(this)}>
                    <View style={{
                        backgroundColor: '#3897f0',
                        padding: 15,
                        marginLeft: 10,
                        marginRight: 10,
                        marginTop: 10,
                        borderRadius: 60,
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        right: 10,
                        zIndex: 9999,
                        shadowColor: '#3897f0',
                        shadowOffset: {
                            width: 0,
                            height: 5,
                        },
                        shadowOpacity: 0.60,
                        shadowRadius: 22,
                        elevation: 10
                    }}>
                        {
                            this.state.isLoading ?
                                <View style={{ padding: 2 }}>
                                    <ActivityIndicator color="white" />
                                </View> :
                                <Text style={{
                                    color: '#fff',
                                    fontSize: 20,
                                    paddingLeft: 10,
                                    textAlign: 'center'
                                }}>Put me on a map!</Text>
                        }
                    </View>
                </TouchableOpacity>

                {
                    this.state.locations.length > 0 ?
                    <MapView
                        provider='google'
                        style={{
                            flex: 1,
                            zIndex: -1
                        }}
                        initialRegion={{
                            latitude: this.state.location.coords.latitude,
                            longitude: this.state.location.coords.longitude,
                            latitudeDelta: 100,
                            longitudeDelta: 0.0421,
                        }}>
                            { this.state.isLoading ? null : this.state.locations.map((location, index) => {
                                const coords = {
                                    latitude: parseFloat(location.lat),
                                    longitude: parseFloat(location.lng),
                                };

                                return (
                                    <MapView.Marker
                                        key={index}
                                        coordinate={coords}
                                    />
                                );
                            })}
                    </MapView> : null
                }
            </View>
        );
    }
}
