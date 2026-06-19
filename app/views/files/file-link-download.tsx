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

  return tags.map((tag) => tag.id).join(", ");
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
      <form onSubmit={handleGetFile} className="space-y-4">
        <div>
          <label
            htmlFor="file-link"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-200"
          >
            File link
          </label>
          <input
            id="file-link"
            value={fileLink}
            onChange={(event) => setFileLink(event.target.value)}
            placeholder="Enter the file link"
            disabled={isFileLoading}
            required
            autoFocus
            className="w-full rounded border border-neutral-300 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
          />
        </div>

        {fileLinkError && <ErrorComponent error={fileLinkError} />}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isFileLoading || fileLink.trim() === ""}
            className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-neutral-400"
          >
            {isFileLoading ? "Loading..." : "Find file"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleDownload} className="space-y-4">
      <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
          {file.name}
        </h2>
        <dl className="mt-3 grid gap-2 text-sm text-zinc-700 dark:text-zinc-200">
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
            <dd className="inline">{file.hasExpired ? "Expired" : "Available"}</dd>
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
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-200"
          >
            Password
          </label>
          <input
            id="file-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            placeholder="Enter the file password"
            disabled={isDownloadLoading}
            required
            autoFocus
            className="w-full rounded border border-neutral-300 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
          />
        </div>
      )}

      {downloadError && <ErrorComponent error={downloadError} />}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={handleClear}
          disabled={isDownloadLoading}
          className="rounded border border-neutral-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:text-zinc-200 dark:hover:bg-neutral-800"
        >
          Clear
        </button>
        <button
          type="submit"
          disabled={
            isDownloadLoading ||
            (file.hasPassword && password.trim() === "")
          }
          className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-neutral-400"
        >
          {isDownloadLoading ? "Downloading..." : "Download"}
        </button>
      </div>
    </form>
  );
}
