import { GetFileDto } from "~/dto/file/GetFileDto";
import File from "./file";

type FileListProps = {
  files: GetFileDto[];
  onFileDeleted: () => void;
};

const fakeFiles: GetFileDto[] = [
  new GetFileDto(
    "fake-file-1",
    "project-brief.pdf",
    null,
    new Date("2026-06-12"),
    new Date("2026-06-19"),
    false,
    [{ id: "documents" }],
    true,
  ),
  new GetFileDto(
    "fake-file-2",
    "budget-forecast.xlsx",
    null,
    new Date("2026-06-14"),
    new Date("2026-06-21"),
    false,
    [{ id: "finance" }],
    true,
  ),
  new GetFileDto(
    "fake-file-3",
    "expired-contract.docx",
    null,
    new Date("2026-05-28"),
    new Date("2026-06-10"),
    true,
    [{ id: "legal" }],
    false
  ),
];

export default function FileList({ files, onFileDeleted }: FileListProps) {
  const filesToDisplay = [...fakeFiles, ...files];

  if (filesToDisplay.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-neutral-200 p-6 text-center dark:border-neutral-700">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No files available.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {filesToDisplay.map((file, index) => (
        <File
          key={file.id ? file.id : index}
          file={file}
          onFileDeleted={onFileDeleted}
        />
      ))}
    </ul>
  );
}
