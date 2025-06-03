import * as React from 'react';
import { Card } from 'react-native-paper';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useThemeContext } from "@/components/context/ThemeContext";

type CardProps = {
    title: string,
    subtitle: string,
    icon: string,
    done: boolean;
}

export default function Award({title, subtitle, icon, done} :CardProps){
    const { theme } = useThemeContext();
    return(
        <Card style={{marginVertical: 5, opacity: done ? 1 : 0.5}} mode={done ? 'elevated' : 'outlined'}>
            <Card.Title 
                title={title} 
                subtitle={subtitle}
                style={{
                    height: 80
                }} 
                left={
                    () => 
                        <MaterialCommunityIcons 
                            name={icon as any}
                            size={32} 
                            color={theme.colors.primary}
                        />
                }
            />
        </Card>
    )
}