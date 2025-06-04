import { PropsWithChildren } from 'react';
import { View} from 'react-native';
import { Text } from 'react-native-paper';


export default function SwitchText({children}: PropsWithChildren<{}>){
    return(
        <View style={{
            width: '100%',
            flex: 1,
            justifyContent: 'flex-start',
            alignContent: 'center',
        }}>
            <Text 
                variant='titleLarge'
                style={{
                    fontWeight: 'regular',
                    marginHorizontal: 20,
                    paddingVertical: 40
                }}
                >{children}
            </Text>
        </View>
    )
}