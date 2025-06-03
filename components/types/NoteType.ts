//тип для записей, каждая имеет айди, что в ней записано и состояние выполнения
type NoteType = {
    id: string;
    text: string;
    done: boolean;
    pageId: string;
  }

export default NoteType;