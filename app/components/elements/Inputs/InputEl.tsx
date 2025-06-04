import { forwardRef } from 'react';
import { View } from "react-native";
import { TextInput } from "react-native-paper";

type InputProps = {
    inputType: string;
    placeholder: string; 
    value: string;
    onChangeText: (text: string) => void;
    onSubmitEditing?: (e: any) => void; 
}

const InputEl = forwardRef<any, InputProps>(
    ({ inputType, placeholder, value, onChangeText, onSubmitEditing}, ref) => {

    return (
        <View style={{marginHorizontal: 15, width: inputType == 'mood' ? 280 : 350}}>
            <TextInput 
                ref={ref}
                mode="outlined" 
                placeholder={placeholder} 
                keyboardType={inputType == 'settings' ? 'number-pad' : 'default'}
                value={value}
                onChangeText={(text) => {
                    inputType == 'settings' 
                    ? onChangeText(text.replace(/[^0-9]/g, ''))
                    : onChangeText(text)
                }}
                onSubmitEditing={onSubmitEditing}
                multiline={inputType == 'mood'}
            />
        </View>
    )
}
);

export default InputEl;