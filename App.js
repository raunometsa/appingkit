import React from 'react';
import { Text } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import CreateAccountScreen from './screens/CreateAccountScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import FeedScreen from './screens/FeedScreen';
import TodoScreen from './screens/TodoScreen';
import MapScreen from './screens/MapScreen';
import CommentsScreen from './screens/CommentsScreen';

const HomeStack = createStackNavigator({
    Home: HomeScreen
});

const FeedStack = createStackNavigator({
    Feed: FeedScreen
});

const TodoStack = createStackNavigator({
    Todo: TodoScreen
});

const CommentsStack = createStackNavigator({
    Comments: CommentsScreen
});

const LoginStack = createStackNavigator({
    Login: LoginScreen,
    CreateAccount: CreateAccountScreen
});

const MapStack = createStackNavigator({
    Map: MapScreen
});

const App = createStackNavigator(
{
    Login: { screen: LoginStack },
    Home: { screen: HomeStack },
    Feed: { screen: FeedStack },
    Todo: { screen: TodoStack },
    Comments: { screen: CommentsStack },
    Map: { screen: MapStack }
},
{
    navigationOptions: {
        header: null
    }
});

export default App;
