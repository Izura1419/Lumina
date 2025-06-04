import { PropsWithChildren } from 'react';
import { View} from 'react-native';
import { Text } from 'react-native-paper';


export default function LabelText({children}: PropsWithChildren<{}>){
    return(
        <View style={{
            width: '100%',
            justifyContent: 'flex-start',
            alignContent: 'flex-start',
        }}>
            <Text 
                variant='bodyLarge'
                style={{
                    fontWeight: 'medium',
                    marginHorizontal: 30,
                    marginTop: 0,
                    paddingVertical: 0
                }}
                >{children}
            </Text>
        </View>
    )
}