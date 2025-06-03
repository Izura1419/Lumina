import { View, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';

import { useThemeContext } from '@/components/context/ThemeContext';

type ListProps ={
    label: string,
    listType: string,
    checked?: boolean,
    selected?: boolean,
    onToggle: () => void;
    onLongPress?: () => void;
}

export default function ListEl({
    label, listType, checked, selected, onToggle, onLongPress
}: ListProps){

    const { theme } = useThemeContext();

    const styles = StyleSheet.create({
        itemContainer:{
            width: '100%',
            marginVertical: 5,
            backgroundColor: selected ? theme.colors.inversePrimary : 'transparent'
        },
        page:{
            fontSize: 24
        },
        note:{
            fontSize: 18
        },
        noteComplete:{
            fontSize: 18,
            color: 'transparent',

            textShadowColor: theme.colors.onSurfaceDisabled,
            textShadowOffset: {width : 0, height: 2},
            textShadowRadius: 4,

            textDecorationStyle: 'solid',
            textDecorationLine: 'line-through'
        },
        noteSelected:{
            fontSize: 18
        },
        item:{
            width: '100%'
        }
    })

    return(
        <View style={styles.itemContainer}>
            <Checkbox.Item 
                style={styles.item}
                labelStyle={
                    checked && listType == 'note' 
                    ? styles.noteComplete 
                    : selected && listType == 'note' 
                    ? styles.noteSelected
                    : listType == 'page' 
                    ? styles.page 
                    : styles.note
                }
                label={label}
                status={checked  ? 'checked' : 'unchecked'}
                onPress={onToggle}
                onLongPress={onLongPress}
            />
        </View>
    )
}