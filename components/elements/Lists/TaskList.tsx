import { useState, useRef, useEffect } from 'react';
import { View, Keyboard, ScrollView, TextInput } from 'react-native';
import { FAB, ActivityIndicator, Portal, Dialog } from 'react-native-paper';

import PageScreen from '../../Screens/PageScreen';
import NoteScreen from '../../Screens/NoteScreen';

import MainText from '../Typography/MainText';
import InputEl from '../Inputs/InputEl';
import ButtonEl from '../Buttons/ButtonEl';
import LabelText from '../Typography/LabelText';

import { useTaskLogic } from '../../hooks/useTaskLogic';
import { getPages, getNotes, getTaskAdvice } from '@/components/data/taskService';


//тип для страниц, каждая имеет айди и что в ней записано
type PageType = {
  id: string;
  title: string;
}

//тип для записей, каждая имеет айди, что в ней записано и состояние выполнения
type NoteType = {
  id: string;
  text: string;
  done: boolean;
  pageId: string;
}

export default function TaskList() {
  //переменные для массива задач и страниц
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [pages, setPages] = useState<PageType[]>([]);

  //значение в поле ввода
  const [inputValue, setInputValue] = useState('');

  //выбранные задачи и страницы
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [selectedPages, setSelectedPages] = useState<string[]>([]);

  //айди изменяемого элемент
  const [editItemId, setEditItemId] = useState<string | null>(null)

  //состояние выбранной страницы или списка страниц
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);

  //отсылка к инпуту, чтобы можно было сделать фокус
  const inputRef = useRef<TextInput>(null)

  //переменные для состояния кнопок, можно ли удалять или изменять
  const canDelete = selectedPages.length >= 1 || selectedNotes.length >= 1;
  const canEdit = selectedPages.length === 1 || selectedNotes.length === 1;

  //вывод названия текущей страницы
  const currentPage = pages.find(page => page.id === currentPageId);

  //состояния для видимости всплывающего окна
  const [visibleDialog, setVisibleDialog] = useState(false);

  //совет по делам от нейросети
  const [advise, setAdvise] = useState('');

  //состояние загрузки
  const [loading, setLoading] = useState(true);

  //импортируемые функции из хука
  const {
    handleAddOrEditItem,
    toggleOnPress,
    toggleOnLongPress,
    handleDeleteItems,
    handleEditItem,
    } = useTaskLogic({
      pages, setPages,
      notes, setNotes,
      selectedPages, setSelectedPages,
      selectedNotes, setSelectedNotes,
      inputValue, setInputValue,
      currentPageId, setCurrentPageId,
      editItemId, setEditItemId,
      inputRef
  });

  //загрузка данных из бд при запуске
  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
      const fetchedPages = await getPages();
      setPages(fetchedPages);
    };
    setLoading(false);

    loadData();
  }, []);

  //загрузка данных из бд при смене страницы

  useEffect(() => {
    setLoading(true);
    const loadNotes = async () => {
      if (currentPageId) {
        const fetchedNotes = await getNotes(currentPageId);
        setNotes(fetchedNotes);
      } else {
        setNotes([]);
      }
      setLoading(false);
    };

    loadNotes();
  }, [currentPageId]);

  //функция загрузки совета от нейросети
  const showTaskAdvise = async () => {
    //показ всплывающего окна
    setVisibleDialog((prev) => !prev)

    //совет от нейросети
    const textFromNotes = notes.map(note => note.text);
    const advise = await getTaskAdvice(textFromNotes);
    setAdvise(advise);
  }

  //фукнция закрытия всплывающего окна
  const closeTaskAdvise = () => {
    setVisibleDialog((prev) => !prev);
    setAdvise('');
  }
  

  return (
    <View style={{ flex: 1, width: '100%', height: '90%' }}>

      {/* Всплывающее окно с советом */}
      <View>
          <Portal>
              <Dialog visible={visibleDialog} onDismiss={closeTaskAdvise} style={{maxHeight: '90%'}}>
                  <Dialog.Title>Совет от нейросети</Dialog.Title>
                  <Dialog.ScrollArea>
                      <ScrollView >
                          <Dialog.Content style={{paddingHorizontal: 0, marginVertical: 20}}>
                              {/* Индикатор загрузки */}
                              <ActivityIndicator animating={advise == '' ? true : false} style={{position: 'relative', width: '100%'}}/>

                              <LabelText>{advise}</LabelText>
                          </Dialog.Content>
                      </ScrollView>
                  </Dialog.ScrollArea>
                  <Dialog.Actions>
                      <ButtonEl 
                          typeButton='buttonLabel'
                          icon='check'
                          label='Хорошо'
                          onPress={closeTaskAdvise}
                      />
                  </Dialog.Actions>
              </Dialog>
          </Portal>
      </View>

      <View style={{
        width: '100%',
        flexDirection: 'row'
      }}>
        <FAB 
          style={{
            height: 55,
            marginTop: 30,
            marginLeft: 10
          }}
          icon='arrow-left'
          onPress={() => setCurrentPageId(null)}
          visible={currentPageId !== null}
        />

        <MainText>{currentPageId === null ? 'Мои страницы' : currentPage?.title}</MainText>
      </View>

      {/* Вывод списка задач */}

      <ScrollView>
      { currentPageId === null
      // Страницы
        ? pages.map((page) => ( 
            <PageScreen 
              key={page.id}
              page={page}
              selectedPages={selectedPages}
              toggleOnPress={toggleOnPress}
              toggleOnLongPress={toggleOnLongPress}
            />
          ))
      // Заметки
        : notes
            .filter(note => note.pageId === currentPageId)
            .map((note) => (
              <NoteScreen 
                key={note.id}
                note={note}
                selectedNotes={selectedNotes}
                toggleOnPress={toggleOnPress}
                toggleOnLongPress={toggleOnLongPress}
              />
          ))
      }

        {/* Вывод в конце всех задач пустое поле ввода для новой задачи */}
        <InputEl
          ref={inputRef}
          inputType='list'
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={handleAddOrEditItem}
          placeholder={currentPageId === null ? 'Создать новую страницу' : 'Напишите заметку'}
        />
      </ScrollView>

      {/* Индикатор загрузки */}
      <ActivityIndicator animating={loading} style={{position: 'relative', width: '100%'}}/>

        {/* Кнопки для управления задачами */}
      <View style={{
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        rowGap: 20,
        marginTop: 20,
        marginBottom: -70
      }}>
        <ButtonEl 
            typeButton='buttonLabel'
            icon='delete'
            label={currentPageId === null ? 'Удалить страницу' : 'Удалить заметку'}
            onPress={handleDeleteItems}
            disabled={!canDelete}
        />
        <ButtonEl 
            typeButton='buttonLabel'
            icon='pencil-outline'
            label={currentPageId === null ? 'Изменить страницу' : 'Изменить заметку'}
            onPress={handleEditItem}
            disabled={!canEdit}
        />
        <ButtonEl 
            typeButton='buttonLabel'
            icon='robot-confused-outline'
            label='Совет'
            onPress={showTaskAdvise}
            disabled={notes.length < 1}
            visible={currentPageId !== null}
        />
      </View>

    </View>
  );
}
