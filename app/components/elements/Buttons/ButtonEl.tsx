import { View, StyleSheet } from "react-native"
import { FAB } from "react-native-paper"

import { useThemeContext } from '@/components/context/ThemeContext';

type ButtonProps = {
    typeButton: string,
    icon: string,
    label: string,
    onPress: () => void,
    disabled?: boolean;
    visible?: boolean;
}

export default function ButtonEl({typeButton, icon, label, onPress, disabled, visible}: ButtonProps){

    const { theme } = useThemeContext();

    const styles = StyleSheet.create({
        buttonLabel:{
            width: 150,
            boxShadow: `0 2 10 0 ${theme.colors.onSurfaceDisabled}`,
            borderRadius: 20
        },
        buttonFocus:{
            width: 120,
            paddingHorizontal: 20,
            marginTop: 50,
            boxShadow: `0 2 10 0 ${theme.colors.onSurfaceDisabled}`,
            borderRadius: 20
        },
        buttonMoodEdit:{
            width: 55,
            paddingHorizontal: 0,
            paddingVertical: 0,
            boxShadow: `0 2 10 0 ${theme.colors.onSurfaceDisabled}`,
            borderRadius: 20
        }
    })

    return(
        <View>
            <FAB 
                style={
                    typeButton === 'buttonLabel' ? styles.buttonLabel :
                    typeButton === 'buttonFocus' ? styles.buttonFocus :
                    styles.buttonMoodEdit 
                } 
                icon={icon} 
                label={label}
                onPress={onPress}
                size="medium"
                customSize={
                    typeButton === 'buttonFocus' ? 75 : 55
                }
               color={theme.colors.primary}
               disabled={disabled}
               visible={visible}
            />
        </View>
    )
}

