import type { GetFileDto } from "~/dto/file/GetFileDto";
import File

type NotesListProps = {
  notes: GetFileDto[];
  onNoteDeleted: () => void;
};

export default function FileList({ notes, onNoteDeleted }: NotesListProps) {
  return (
    <ul className="space-y-3">
      {notes.map((note, index) => (
        <File
          key={note.id ? note.id : index}
          note={note}
          onNoteDeleted={onNoteDeleted}
        />
      ))}
    </ul>
  );
}
