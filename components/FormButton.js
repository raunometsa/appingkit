import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';

class FormButton extends Component {
    static propTypes = {
        label: PropTypes.string
    }

    render = () => {
        const { label, onPress, isLoading } = this.props;

        return (
            <TouchableOpacity onPress={onPress}>
                <View style={{
                    backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : '#717e8b',
                    padding: 15,
                    marginLeft: 10,
                    marginRight: 10,
                    marginTop: 10,
                    borderRadius: 4
                }}>
                    {
                        isLoading ?
                            <View style={{ padding: 2 }}>
                                <ActivityIndicator color="white" />
                            </View> :
                            <Text style={{
                                color: this.props.textColor ? this.props.textColor : '#fff',
                                fontSize: 20,
                                paddingLeft: 10,
                                textAlign: 'center'
                            }}>{label}</Text>
                    }
                </View>
            </TouchableOpacity>
        );
    }
}
export default FormButton;
