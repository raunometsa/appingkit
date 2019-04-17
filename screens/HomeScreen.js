import React from 'react';
import { View, Text, Dimensions, Image, ScrollView, TouchableOpacity, AsyncStorage, ActivityIndicator, FlatList } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import FormButton from '../components/FormButton';
import { ImagePicker, Permissions, Location } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import Config from '../Config';
import { Font } from 'expo';

export default class HomeScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { navigate } = navigation;

        return {
            headerLeft: <View/>,
            gesturesEnabled: false,
            headerStyle: {
                borderBottomWidth: 0,
                shadowColor: '#ddd',
                shadowOffset: {
                    width: 0,
                    height: 5,
                },
                shadowOpacity: 0.5,
                shadowRadius: 3,
                elevation: 5,
            },
            titleStyle: {
                alignItems: 'center',
                textAlign: 'center'
            },
            headerTitle: (
                <View style={{flex:1, flexDirection:'row', justifyContent:'center'}}>
                    <Image
                        source={require('../assets/appingkit.png')}
                        fadeDuration={0}
                        style={{
                            width: 98,
                            height: 24,
                            alignSelf: 'center'
                        }}
                    />
                </View>
            ),
            headerRight: (
                <TouchableOpacity onPress={navigation.getParam('signOut')}>
                    <Ionicons name='ios-log-out' size={20} color='#333' style={{
                        marginRight: 25
                    }} />
                </TouchableOpacity>
            )
        };
    };

    _keyExtractor = (item, index) => item.name.toString();

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        this.props.navigation.setParams({ signOut: this._signOut });
    }

    _signOut = () => {
        AsyncStorage.removeItem('user');
        AsyncStorage.removeItem('token');

        this.props.navigation.navigate('Login');
    };

    getItemWidth() {
        return (Dimensions.get('window').width / 2 - 35);
    }

    render() {
        return (
            <ScrollView style={{
                backgroundColor: '#fff',
                padding: 15
            }}>
                <View style={{
                    flexDirection: 'row',
                }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Feed')} style={{
                        width: this.getItemWidth(),
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        padding: 5,
                        borderRadius: 6,
                        margin: 10,
                        shadowColor: '#067DFF',
                        shadowOffset: {
                            width: 0,
                            height: 5,
                        },
                        shadowOpacity: 0.15,
                        shadowRadius: 12,
                        elevation: 5
                    }}>
                        <Image
                            source={require('../assets/icons/feed.png')}
                            fadeDuration={0}
                            style={{
                                width: 30,
                                height: 30,
                                marginTop: 15,
                                marginBottom: 10
                            }}
                        />

                        <Text style={{
                            fontSize: 15,
                            textAlign: 'center',
                            marginBottom: 15,
                            color: '#333'
                        }}>Photo Feed</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Todo')} style={{
                        width: this.getItemWidth(),
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        padding: 5,
                        borderRadius: 6,
                        margin: 10,
                        shadowColor: '#067DFF',
                        shadowOffset: {
                            width: 0,
                            height: 5,
                        },
                        shadowOpacity: 0.15,
                        shadowRadius: 12,
                        elevation: 5
                    }}>
                        <Image
                            source={require('../assets/icons/todo.png')}
                            fadeDuration={0}
                            style={{
                                width: 30,
                                height: 30,
                                marginTop: 15,
                                marginBottom: 10
                            }}
                        />

                        <Text style={{
                            fontSize: 15,
                            textAlign: 'center',
                            marginBottom: 15,
                            color: '#333'
                        }}>Todo List</Text>
                    </TouchableOpacity>
                </View>

                <View style={{
                    flexDirection: 'row',
                }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Map')} style={{
                        width: this.getItemWidth(),
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        padding: 5,
                        borderRadius: 6,
                        margin: 10,
                        shadowColor: '#067DFF',
                        shadowOffset: {
                            width: 0,
                            height: 5,
                        },
                        shadowOpacity: 0.15,
                        shadowRadius: 12,
                        elevation: 5
                    }}>
                        <Image
                            source={require('../assets/icons/map.png')}
                            fadeDuration={0}
                            style={{
                                width: 30,
                                height: 30,
                                marginTop: 15,
                                marginBottom: 10
                            }}
                        />

                        <Text style={{
                            fontSize: 15,
                            textAlign: 'center',
                            marginBottom: 15,
                            color: '#333'
                        }}>Map</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Comments')} style={{
                        width: this.getItemWidth(),
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        padding: 5,
                        borderRadius: 6,
                        margin: 10,
                        shadowColor: '#067DFF',
                        shadowOffset: {
                            width: 0,
                            height: 5,
                        },
                        shadowOpacity: 0.15,
                        shadowRadius: 12,
                        elevation: 5
                    }}>
                        <Image
                            source={require('../assets/icons/comments.png')}
                            fadeDuration={0}
                            style={{
                                width: 30,
                                height: 30,
                                marginTop: 15,
                                marginBottom: 10
                            }}
                        />

                        <Text style={{
                            fontSize: 15,
                            textAlign: 'center',
                            marginBottom: 15,
                            color: '#333'
                        }}>Comments</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}
