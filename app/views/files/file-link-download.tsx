import { useState, type FormEvent } from "react";
import { DownloadFileDto } from "~/dto/file/DownloadFileDto";
import type { GetFileDto } from "~/dto/file/GetFileDto";
import {
  useDownloadFileLinkMutation,
  useDownloadFileMutation,
} from "~/services/app-service";
import ErrorComponent from "~/views/helpers/ErrorsComponent";

function downloadBlob(fileName: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function formatDate(date: Date | string | null) {
  if (!date) {
    return "No expiration date";
  }

  return new Date(date).toLocaleDateString();
}

function formatTags(tags: GetFileDto["tags"]) {
  if (!tags?.length) {
    return "No tags";
  }

  return tags.map((tag) => tag.name).join(", ");
}

export default function FileLinkDownload() {
  const [fileLink, setFileLink] = useState("");
  const [file, setFile] = useState<GetFileDto | null>(null);
  const [password, setPassword] = useState("");

  const [
    getFileFromLink,
    {
      isLoading: isFileLoading,
      error: fileLinkError,
      reset: resetFileLinkRequest,
    },
  ] = useDownloadFileLinkMutation();
  const [
    downloadFile,
    {
      isLoading: isDownloadLoading,
      error: downloadError,
      reset: resetDownloadRequest,
    },
  ] = useDownloadFileMutation();

  const handleClear = () => {
    setFileLink("");
    setFile(null);
    setPassword("");
    resetFileLinkRequest();
    resetDownloadRequest();
  };

  const handleGetFile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetFileLinkRequest();

    try {
      const fileInfo = await getFileFromLink(fileLink.trim()).unwrap();
      setFile(fileInfo);
      setPassword("");
      resetDownloadRequest();
    } catch (error) {
      console.error("Unable to retrieve file:", error);
    }
  };

  const handleDownload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      return;
    }

    resetDownloadRequest();

    try {
      const blob = await downloadFile(
        new DownloadFileDto(file.id, password.trim() || null),
      ).unwrap();
      downloadBlob(file.name, blob);
    } catch (error) {
      console.error("Unable to download file:", error);
    }
  };

  if (!file) {
    return (
      <form onSubmit={handleGetFile} className="ds-form">
        <div>
          <label htmlFor="file-link" className="ds-form-label ds-coral-label">
            Lien du fichier
          </label>
          <input
            id="file-link"
            value={fileLink}
            onChange={(event) => setFileLink(event.target.value)}
            placeholder="Collez le lien du fichier"
            disabled={isFileLoading}
            required
            autoFocus
            className="ds-form-input ds-coral-input"
          />
        </div>

        {fileLinkError && <ErrorComponent error={fileLinkError} />}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isFileLoading || fileLink.trim() === ""}
            className="ds-primary-button ds-bright-button"
          >
            {isFileLoading ? "Recherche..." : "Rechercher le fichier"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleDownload} className="ds-form">
      <div className="ds-download-summary">
        <h2 className="text-base font-semibold text-[#bd4f2f]">{file.name}</h2>
        <dl className="mt-3 grid gap-2 text-sm text-[#a4533b]">
          <div>
            <dt className="inline font-medium">Uploaded: </dt>
            <dd className="inline">{formatDate(file.uploadDate)}</dd>
          </div>
          <div>
            <dt className="inline font-medium">Expires: </dt>
            <dd className="inline">{formatDate(file.expirationDate)}</dd>
          </div>
          <div>
            <dt className="inline font-medium">Status: </dt>
            <dd className="inline">
              {file.hasExpired ? "Expired" : "Available"}
            </dd>
          </div>
          <div>
            <dt className="inline font-medium">Tags: </dt>
            <dd className="inline">{formatTags(file.tags)}</dd>
          </div>
          <div>
            <dt className="inline font-medium">Password protected: </dt>
            <dd className="inline">{file.hasPassword ? "Yes" : "No"}</dd>
          </div>
        </dl>
      </div>

      {file.hasPassword && (
        <div>
          <label
            htmlFor="file-password"
            className="ds-form-label ds-coral-label"
          >
            Mot de passe
          </label>
          <input
            id="file-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            placeholder="Saisissez le mot de passe"
            disabled={isDownloadLoading}
            required
            autoFocus
            className="ds-form-input ds-coral-input"
          />
        </div>
      )}

      {downloadError && <ErrorComponent error={downloadError} />}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={handleClear}
          disabled={isDownloadLoading}
          className="ds-clear-button"
        >
          Effacer
        </button>
        <button
          type="submit"
          disabled={
            isDownloadLoading || (file.hasPassword && password.trim() === "")
          }
          className="ds-primary-button ds-bright-button"
        >
          {isDownloadLoading ? "Téléchargement..." : "Télécharger"}
        </button>
      </div>
    </form>
  );
}
