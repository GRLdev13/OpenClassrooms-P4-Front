import type { GetFileDto } from "~/dto/file/GetFileDto";
import File from "./file";

type FileListProps = {
  files: GetFileDto[];
  onFileDeleted: () => void;
};

export default function FileList({ files, onFileDeleted }: FileListProps) {
  if (files.length === 0) {
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
      {files.map((file, index) => (
        <File
          key={file.id ? file.id : index}
          file={file}
          onFileDeleted={onFileDeleted}
        />
      ))}
    </ul>
  );
}
