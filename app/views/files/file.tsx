import { useState } from "react";
import { DeleteFileDto } from "~/dto/file/delete-file-dto";
import { type GetFileDto } from "~/dto/file/get-file-dto";
import { useDeleteFileMutation } from "~/services/app-service";
import ErrorComponent from "~/views/helpers/ErrorsComponent";
import FileDownload from "./file-download";
import FileLinkPopup from "./file-link-popup";

type FileProps = {
  file: GetFileDto;
  onFileDeleted: () => void;
};

function formatFileExpiration(date: Date | string | null) {
  if (!date) {
    return "Sans expiration";
  }

  const expirationDate = new Date(date);
  const differenceInDays = Math.ceil(
    (expirationDate.getTime() - Date.now()) / 86_400_000,
  );

  if (differenceInDays <= 0) {
    return "Expiré";
  }

  if (differenceInDays === 1) {
    return "Expire demain";
  }

  return `Expire dans ${differenceInDays} jours`;
}

export default function File({ file, onFileDeleted }: FileProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isLinkPopupOpen, setIsLinkPopupOpen] = useState(false);
  const [deleteFile, { isLoading }] = useDeleteFileMutation();

  const handleDelete = async () => {
    setErrorMessage("");

    const deleteFileDto = new DeleteFileDto(file.id);

    try {
      await deleteFile(deleteFileDto).unwrap();
      onFileDeleted();
    } catch (error) {
      console.log("error:", error);
      setErrorMessage(error as any);
    }
  };

  return (
    <li className="ds-file-row">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5 shrink-0 text-black"
            aria-hidden="true"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
            <path d="M14 2v6h6M9 15l2-2 2 2 2-2" />
          </svg>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-zinc-900">
              {file.name}
            </p>
            <p
              className={`mt-0.5 text-[11px] ${
                file.hasExpired ? "text-red-500" : "text-zinc-700"
              }`}
            >
              {file.hasExpired
                ? "Expiré"
                : formatFileExpiration(file.expirationDate)}
            </p>
            {file.tags?.length > 0 && (
              <p className="mt-1 truncate text-[10px] text-zinc-400">
                {file.tags.map((tag) => tag.name).join(" · ")}
              </p>
            )}
          </div>
        </div>

        {file.hasExpired ? (
          <p className="text-[11px] text-zinc-400">
            Ce fichier a expiré, il n'est plus stocké chez nous
          </p>
        ) : (
          <div className="flex shrink-0 items-center justify-end gap-2">
            {file.hasPassword && (
              <span
                className="mr-1 text-zinc-800"
                title="Protégé par mot de passe"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4"
                  aria-hidden="true"
                >
                  <rect width="16" height="10" x="4" y="11" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
                <span className="sr-only">Protégé par mot de passe</span>
              </span>
            )}
            {file.link && (
              <button
                type="button"
                onClick={() => setIsLinkPopupOpen(true)}
                className="ds-file-action ds-file-action--icon"
                aria-label="Afficher le lien de partage"
                title="Afficher le lien de partage"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="size-4"
                  aria-hidden="true"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </button>
            )}
            <button
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className="ds-file-action"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="size-3.5"
                aria-hidden="true"
              >
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5" />
              </svg>
              {isLoading ? "Suppression..." : "Supprimer"}
            </button>
            <button
              type="button"
              onClick={() => setIsDownloadOpen(true)}
              className="ds-file-action gap-2"
            >
              Accéder
              <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </div>
      {errorMessage && <ErrorComponent error={errorMessage} />}
      <FileDownload
        file={file}
        visible={isDownloadOpen}
        onHide={() => setIsDownloadOpen(false)}
      />
      <FileLinkPopup
        file={file}
        visible={isLinkPopupOpen}
        onHide={() => setIsLinkPopupOpen(false)}
      />
    </li>
  );
}
