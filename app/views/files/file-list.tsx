import { useState } from "react";
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
    new Date("2026-06-12"),
    new Date("2026-06-19"),
    false,
    [{ name: "documents" }],
    true,
  ),
  new GetFileDto(
    "fake-file-2",
    "budget-forecast.xlsx",
    new Date("2026-06-14"),
    new Date("2026-06-21"),
    false,
    [{ name: "finance" }],
    true,
  ),
  new GetFileDto(
    "fake-file-3",
    "expired-contract.docx",
    new Date("2026-05-28"),
    new Date("2026-06-10"),
    true,
    [{ name: "legal" }],
    false
  ),
];

export default function FileList({ files, onFileDeleted }: FileListProps) {
  const [filter, setFilter] = useState<"all" | "active" | "expired">("all");
  const filesToDisplay = [...fakeFiles, ...files];
  const filteredFiles = filesToDisplay.filter((file) => {
    if (filter === "active") {
      return !file.hasExpired;
    }

    if (filter === "expired") {
      return file.hasExpired;
    }

    return true;
  });

  if (filesToDisplay.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[#efbca6] p-8 text-center">
        <p className="text-sm text-zinc-500">Aucun fichier disponible.</p>
      </div>
    );
  }

  return (
    <>
      <div
        className="mb-5 inline-flex overflow-hidden rounded-full border border-[#efc3b0] bg-white"
        aria-label="Filtrer les fichiers"
      >
        {[
          ["all", "Tous"],
          ["active", "Actifs"],
          ["expired", "Expirés"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value as typeof filter)}
            className={`min-w-14 px-4 py-2 text-xs transition-colors ${
              filter === value
                ? "bg-[#ec7464] text-white"
                : "text-zinc-800 hover:bg-[#fff0e9]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filteredFiles.length ? (
        <ul className="space-y-3">
          {filteredFiles.map((file, index) => (
            <File
              key={file.id ? file.id : index}
              file={file}
              onFileDeleted={onFileDeleted}
            />
          ))}
        </ul>
      ) : (
        <div className="rounded-lg border border-dashed border-[#efbca6] p-8 text-center">
          <p className="text-sm text-zinc-500">
            Aucun fichier dans cette catégorie.
          </p>
        </div>
      )}
    </>
  );
}
