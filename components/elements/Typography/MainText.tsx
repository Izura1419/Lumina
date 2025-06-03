import React from 'react';
import { View, StyleProp, TextStyle } from 'react-native';
import { Text } from 'react-native-paper';

import { useThemeContext } from '@/components/context/ThemeContext';

type MainTextProps = {
    children: React.ReactNode,
    style?: StyleProp<TextStyle>
}


export default function MainText({children, style}: MainTextProps){
    const { theme } = useThemeContext();
    return(
        <View style={{
            width: '100%'
        }}>
            <Text 
                variant='headlineLarge'
                style={[{
                    fontWeight: '500',
                    textShadowColor: theme.colors.onSurfaceDisabled,
                    textShadowOffset: {width : 0, height: 2},
                    textShadowRadius: 4,
                    marginHorizontal: 20,
                    paddingVertical: 40
                }, style]}
                >{children}
            </Text>
        </View>
    )
}