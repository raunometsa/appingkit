import React, { Component } from 'react';
import {
    Text,
    View,
    TextInput
} from 'react-native';

class FormTextInput extends Component {
    render = () => {
        return (
            <View style={{
                flex: 1,
                flexDirection: 'row',
                paddingTop: 15,
                paddingBottom: 15,
                paddingLeft: 10,
                paddingRight: 10,
                backgroundColor: '#fff',
                borderBottomColor: '#d1d5da',
                borderBottomWidth: 1,
            }}>
                <View style={{
                    width: 95,
                    justifyContent: 'center',
                }}>
                    <Text style={{
                        fontSize: 16,
                        color: '#333'
                    }}>{this.props.placeholder}</Text>
                </View>

                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                }}>
                    <TextInput
                        {...this.props}
                        style={{
                            borderWidth: 0,
                            marginLeft: 0,
                            marginRight: 0,
                            fontSize: 16
                        }}
                        underlineColorAndroid="transparent"
                        placeholder={this.props.placeholder}
                        // onChangeText={this.props.onChange}
                        secureTextEntry={this.props.secureTextEntry}
                        autoCapitalize={this.props.autoCapitalize}
                        keyboardType={this.props.keyboardType}
                        value={this.props.value}
                        clearButtonMode='while-editing'
                    />
                </View>
            </View>
        );
    }
}
export default FormTextInput;
