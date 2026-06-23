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
      <div className="ds-empty-state">
        <p>Aucun fichier disponible.</p>
      </div>
    );
  }

  return (
    <>
      <div
        className="ds-filter-group"
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
            className={`ds-filter-button ${
              filter === value
                ? "ds-filter-button--active"
                : "ds-filter-button--inactive"
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
        <div className="ds-empty-state">
          <p>
            Aucun fichier dans cette catégorie.
          </p>
        </div>
      )}
    </>
  );
}
