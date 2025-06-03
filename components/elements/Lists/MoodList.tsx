import { View } from "react-native"
import { Card } from 'react-native-paper';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useThemeContext } from "@/components/context/ThemeContext";

import LabelText from "../Typography/LabelText";

type MoodListProps = {
    title: string,
    moodValue: number,
    description: string;
}

export default function MoodList({title, moodValue, description}: MoodListProps){
    const { theme } = useThemeContext();

    return(
        <View style={{marginHorizontal: 15, marginVertical: 5}}>
            <Card>
                <Card.Title style={{
                    minHeight: 40, 
                    marginTop: 10
                }}
                    title={title}
                    left={
                        () => 
                            <MaterialCommunityIcons 
                            name={
                                moodValue == 1 ? 'emoticon-dead-outline' :
                                moodValue == 2 ? 'emoticon-sad-outline' :
                                moodValue == 3 ? 'emoticon-neutral-outline' :
                                moodValue == 4 ? 'emoticon-happy-outline' :
                                'emoticon-excited-outline'
                            } 
                            size={32} 
                            color={theme.colors.primary}/>
                    } />
                    <Card.Content style={{
                        paddingBottom: description == '' ? 0 : 16
                    }}>
                        <LabelText>
                            {description}
                        </LabelText>
                    </Card.Content>
            </Card>
        </View>
    )
}