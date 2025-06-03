import { Keyboard, TextInput } from 'react-native';

import {
    addPage,
    deletePage,
    updatePage,
    addNote,
    deleteNote,
    updateNote
} from '@/components/data/taskService'

import { unlockAward } from '@/components/data/awardService';

//подключение типов
import PageType  from '../types/PageType';
import NoteType from '../types/NoteType';
import { getLocalCount, saveLocalCount } from '@/components/data/counterService';

//создание типов для хука
type UseTaskLogicParams = {
  pages: PageType[];
  setPages: React.Dispatch<React.SetStateAction<PageType[]>>;
  notes: NoteType[];
  setNotes: React.Dispatch<React.SetStateAction<NoteType[]>>;
  selectedPages: string[];
  setSelectedPages: React.Dispatch<React.SetStateAction<string[]>>;
  selectedNotes: string[];
  setSelectedNotes: React.Dispatch<React.SetStateAction<string[]>>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  currentPageId: string | null;
  setCurrentPageId: React.Dispatch<React.SetStateAction<string | null>>;
  editItemId: string | null;
  setEditItemId: React.Dispatch<React.SetStateAction<string | null>>;
  inputRef: React.RefObject<TextInput>;
};

//хуки :)
export const useTaskLogic = ({
  pages, setPages,
  notes, setNotes,
  selectedPages, setSelectedPages,
  selectedNotes, setSelectedNotes,
  inputValue, setInputValue,
  currentPageId, setCurrentPageId,
  editItemId, setEditItemId,
  inputRef
}: UseTaskLogicParams) => {

    //добавление или изменение элемента в списке
  const handleAddOrEditItem = async () => {
    const trimmed = inputValue.trim();
    if (trimmed === '') return;

    //очистка поля ввода и скрытие клавиатуры
    setInputValue('');
    Keyboard.dismiss();

    if (editItemId) {
      if (currentPageId === null) {
        // редактируем страницу
        const updatedPages = pages.map(page => 
            page.id === editItemId ? { ...page, title: trimmed } : page
        )
        setPages(updatedPages);
        //в бд
        await updatePage(editItemId, { title: trimmed });

        setEditItemId(null);
        setSelectedPages([]);
      } else {
        // редактируем заметку
        const updatedNotes = notes.map(note => 
            note.id === editItemId ? { ...note, text: trimmed } : note
        )
        setNotes(updatedNotes);
        //в бд
        await updateNote(editItemId, { text: trimmed });

        setEditItemId(null);
        setSelectedNotes([]);
      }
    } 
    else {
      if (currentPageId === null) {
        // создаём страницу
        const newPage: PageType = {
          id: Date.now().toString(),
          title: trimmed,
        };
        setPages([...pages, newPage]);
        //в бд
        await addPage(newPage)

        //достижение
        let pageCount = await getLocalCount("pageCount") || 0;
        pageCount++;
        await saveLocalCount("pageCount", pageCount);
        if(pageCount >= 10){
          await unlockAward("10_pages")
        }

      } else {
        // создаём заметку
        const newNote: NoteType = {
          id: Date.now().toString(),
          text: trimmed,
          done: false,
          pageId: currentPageId,
        };
        setNotes([...notes, newNote]);
        //в бд
        await addNote(newNote)
        
        //достижение
        await unlockAward('first_note');

        let noteCount = await getLocalCount("noteCount") || 0;
        noteCount++;
        await saveLocalCount("noteCount", noteCount);
        if(noteCount >= 20){
          await unlockAward("20_notes")
        }
      }
    }
  };

  //обработчик при нажатии на элемент списка
  const toggleOnPress = async (id: string) => {
    if (currentPageId === null) {
      // работа со страницами (выбор страницы)
      setSelectedPages(prev =>
        prev.includes(id)
          ? prev.filter(i => i !== id)
          : [...prev, id]
      );
    } 
    else {
      // переключение выполнения задачи (выполнение задачи)
      setNotes(prev =>
        prev.map(note =>
          note.id === id ? { ...note, done: !note.done } : note
        )
      );
      //в бд
      const targetNote = notes.find(note => note.id === id);
      if (targetNote) {
        await updateNote(id, { done: !targetNote.done });

        //достижение
        const daysAfterCreate = new Date(Math.abs(Date.now() - +targetNote.id)).getDate();
        if(daysAfterCreate >= 7){
          await unlockAward("done_after_7_days")
        }
      }
      
      //достижения
      await unlockAward("first_task_done");
      //
      let doneCount = await getLocalCount("doneCount") || 0;
      doneCount++;
      await saveLocalCount("doneCount", doneCount);
      if(doneCount >= 20){
        await unlockAward("20_tasks_done")
      }
    }
  };

  //обработчик длительного нажатия на элемент
  const toggleOnLongPress = (id: string) => {
    if (currentPageId === null) {
      // переход на страницу
      setCurrentPageId(id);
    } else {
      // выделение заметки
      setSelectedNotes(prev =>
        prev.includes(id)
          ? prev.filter(i => i !== id)
          : [...prev, id]
      );
    }
  };

  //удаление элементе
  const handleDeleteItems = async () => {
    if (currentPageId === null) {
      //удаление страниц из бд
      for(const id of selectedPages){
        await deletePage(id);
      }
      setPages(prev => prev.filter(page => !selectedPages.includes(page.id)));
      setSelectedPages([]);
    } else {
      //удаление заметок из бд
      for(const id of selectedNotes){
        await deleteNote(id);
      }
      setNotes(prev => prev.filter(note => !selectedNotes.includes(note.id)));
      setSelectedNotes([]);

      //счётчик для достижений
      let deletionCount = await getLocalCount("deletionCount") || 0;
      deletionCount++;
      await saveLocalCount("deletionCount", deletionCount);
      if(deletionCount >= 5){
        await unlockAward("deleted_5_notes")
      }
    }
  };

  //установка изменяемого элемента
  const handleEditItem = () => {
    if (currentPageId === null) {
      if (selectedPages.length !== 1) return;

      const pageId = selectedPages[0];
      const pageToEdit = pages.find(page => page.id === pageId);
      if (!pageToEdit) return;

      setInputValue(pageToEdit.title);
      setEditItemId(pageId);
    } else {
      if (selectedNotes.length !== 1) return;

      const noteId = selectedNotes[0];
      const noteToEdit = notes.find(note => note.id === noteId);
      if (!noteToEdit) return;

      setInputValue(noteToEdit.text);
      setEditItemId(noteId);
    }
    //фокус на поле ввода
    inputRef.current?.focus();
  };
 
  //экспортируемые функции
  return {
    handleAddOrEditItem,
    toggleOnPress,
    toggleOnLongPress,
    handleDeleteItems,
    handleEditItem,
  };
};
