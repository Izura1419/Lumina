import ListEl from "../elements/Lists/ListEl"
import PageType from "../types/PageType"

type PageScreenProps = {
    page: PageType;
    selectedPages: string[];
    toggleOnPress: (id:string) => void;
    toggleOnLongPress: (id:string) => void;
}

export default function PageScreen({page, selectedPages, toggleOnPress, toggleOnLongPress}: PageScreenProps){
    return(
        <ListEl 
            key={page.id}
            label={page.title}
            listType='page'
            checked={selectedPages.includes(page.id)}
            onToggle={() => toggleOnPress(page.id)}
            onLongPress={() => toggleOnLongPress(page.id)}
        />
    )
}