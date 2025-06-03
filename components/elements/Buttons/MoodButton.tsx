import { View, StyleSheet } from "react-native";
import { SegmentedButtons } from "react-native-paper"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type MoodButtonProps = {
    moodValue: number,
    setMoodValue: (e: any) => void;
}

export default function MoodButton({moodValue, setMoodValue}: MoodButtonProps){

    return(
        <View>
            <SegmentedButtons 
                value={moodValue}
                onValueChange={setMoodValue}
                buttons={[
                    {
                        icon: ({ color }) => 
                            <MaterialCommunityIcons 
                            name="emoticon-dead-outline" size={32} color={color} />,
                        value: 1
                    },
                    {
                        icon: ({ color }) => 
                            <MaterialCommunityIcons 
                            name="emoticon-sad-outline" size={32} color={color} />,
                        value: 2
                    },
                    {
                        icon: ({ color }) => 
                            <MaterialCommunityIcons 
                            name="emoticon-neutral-outline" size={32} color={color} />,
                        value: 3
                    },
                    {
                        icon: ({ color }) => 
                            <MaterialCommunityIcons 
                            name="emoticon-happy-outline" size={32} color={color} />,
                        value: 4
                    },
                    {
                        icon: ({ color }) => 
                            <MaterialCommunityIcons 
                            name="emoticon-excited-outline" size={32} color={color} />,
                        value: 5
                    },
                ]}
                style={{
                    marginHorizontal: 5
                }}
            />
        </View>
    )
}