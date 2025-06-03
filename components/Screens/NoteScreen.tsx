import ListEl from "../elements/Lists/ListEl"
import NoteType from "../types/NoteType"

type NoteScreenProps = {
    note: NoteType;
    selectedNotes: string[];
    toggleOnPress: (id:string) => void;
    toggleOnLongPress: (id:string) => void;
}

export default function NoteScreen({note, selectedNotes, toggleOnPress, toggleOnLongPress}: NoteScreenProps){
    return(
        <ListEl 
            key={note.id}
            label={note.text}
            listType='note'
            checked={note.done}
            selected={selectedNotes.includes(note.id)}
            onToggle={() => toggleOnPress(note.id)}
            onLongPress={() => toggleOnLongPress(note.id)}
        />
    )
}