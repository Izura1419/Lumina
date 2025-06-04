import { createDrawerNavigator, DrawerItemList } from "@react-navigation/drawer";
import { View, StyleSheet, Pressable } from "react-native";
import { Text, Icon } from "react-native-paper";

import BottomTabs from "./BottomTabs";
import Settings from './tabs/Settings'
import { useThemeContext } from '../components/context/ThemeContext';
//создание навигатора
const Drawer = createDrawerNavigator();

export default function DrawerNavigator(){

  //переменные для переключения темы и цветов
  const { theme, isDarkTheme, toggleTheme } = useThemeContext();

  //стили для компонентов меню

  const styles = StyleSheet.create({
    drawContainer:{
      flex: 1,
      marginHorizontal: 10,
      gap: 10
    },
    textContainer:{
      width: '100%',
      height: 180,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceVariant ,
      borderRadius: 10
    },
    title:{
      color: theme.colors.primary,
      fontSize: 36
    },
    textContainerBottom:{
      width: '100%',
      height: 180,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 50
    },
    description:{
      color: theme.colors.primary,
      fontSize: 16,
      textAlign: 'center'
    },
    iconContainer:{
      width: '100%',
      height: 200,
      justifyContent: 'center',
      alignItems: 'center'
    }
  })

  //сами коспоненты, навигатор, его контент и страницы

    return(
        <Drawer.Navigator screenOptions={{ 
          //свойства навигатора, фон, как ведут себя элементы
          headerShown: false,
          drawerStyle:{
            backgroundColor: theme.colors.background,
            width: '90%',
          },
          drawerActiveTintColor: theme.colors.primary,
          drawerLabelStyle:{
            color: theme.colors.primary,
            fontSize: 16,
            marginHorizontal: 10,
            marginVertical: 5
          },
          drawerType: 'slide'
        }}

        //контент, который также входит в меню (текст, иконки)

        drawerContent={
          (props) => {
            return (
              <View style={styles.drawContainer}>
                <View style={styles.textContainer}>
                  <Text style={styles.title}
                  >Lumina</Text>
                </View>
                <DrawerItemList  {...props} />

                <View style={styles.iconContainer}>
                  <Pressable onPress={toggleTheme}>
                    <Icon source={isDarkTheme ? 'weather-sunny' : 'weather-night'} color={theme.colors.primary} size={50}/>
                  </Pressable>
                </View>

                <View style={styles.textContainerBottom}>
                  <Text style={styles.description}>
                    Приложение для повышения концентрации и продуктивности в любой деятельности. Выполнил: студент группы ИСП-211о Приходько В.А. 2025
                  </Text>
                </View>
              </View>
            );
          }
        }>

          {/* экраны, т.е. кнопки по нажатию на которые можно перейти на страницу */}

            <Drawer.Screen 
              name="Home" 
              component={BottomTabs} 
              options={{
                drawerLabel: 'Главная', 
                title: 'Home',
                drawerIcon: () => <Icon source='home-outline' size={24} color={theme.colors.primary}/>
              }}
            />
            <Drawer.Screen 
              name="Settings" 
              component={Settings} 
              options={{
                drawerLabel: 'Настройки', 
                title: 'Settings',
                drawerIcon: () => <Icon source='cog-outline' size={24} color={theme.colors.primary}/>
              }} 
            />
        </Drawer.Navigator>
    )
}
