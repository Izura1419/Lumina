import * as React from 'react';
import { useState } from 'react';
import { BottomNavigation } from 'react-native-paper';

import Tasks from './tabs/Tasks';
import Focus from './tabs/Focus';
import Mood from './tabs/Mood';
import Awards from './tabs/Awards';

const BottomTabs = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'tasks', title: 'Заметки', focusedIcon: 'pencil', unfocusedIcon: 'pencil-outline'},
    { key: 'focus', title: 'Таймер', focusedIcon: 'clock-time-four', unfocusedIcon: 'clock-outline' },
    { key: 'mood', title: 'Настроение', focusedIcon: 'emoticon', unfocusedIcon: 'emoticon-outline' },
    { key: 'awards', title: 'Достижения', focusedIcon: 'star-circle', unfocusedIcon: 'star-circle-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    tasks: Tasks,
    focus: Focus,
    mood: Mood,
    awards: Awards,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default BottomTabs;
