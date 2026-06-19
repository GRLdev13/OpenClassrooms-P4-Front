import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { DownloadFileDto } from "~/dto/file/DownloadFileDto";
import { GetFileLinkDto, type GetFileDto } from "~/dto/file/GetFileDto";
import { useDownloadFileLinkMutation, useDownloadFileMutation } from "~/services/app-service";
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

export default function FileDownload() {
  const [password, setPassword] = useState("");
  const [fileLink, setFileLink] = useState("");
  const [fileName, setFileName] = useState("");

  const [downloadFile, { isLoading, error, reset }] =
    useDownloadFileMutation();

      const [downloadFileLink, { isLinkLoading, linkError, lreset }] =
    useDownloadFileLinkMutation();

  const handleHide = () => {
    setPassword("");
    reset();
  };

    const handleGetFile = async () => {
    try {
      const fileInfos = await downloadFileLink(new GetFileLinkDto(fileLink)).unwrap();

      setFileName(fileInfos.name);

      //set all data to display in the template to discribe what is the file we want to download.
      
      handleHide();
    } catch (downloadError) {
      console.log("error:", downloadError);
    }
  };


  const handleDownload = async () => {
    try {
      const blob = await downloadFile(
        new DownloadFileDto(file.id, password ? password : null),
      ).unwrap();
      downloadBlob(file.name, blob);
      handleHide();
    } catch (downloadError) {
      console.log("error:", downloadError);
    }
  };

  return (
      <div className="space-y-4">

        <input
          id="file-link"
          value={fileLink}
          onChange={(event) => setFileLink(event.target.value)}
          placeholder="Enter file Link"
          disabled={isLoading}
          className="w-full rounded border border-neutral-300 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
        />
           <input
          id="file-password"
          type="password"
          value={filePassword}
          onChange={(event) => setFilePassword(event.target.value)}
          autoComplete="new-password"
          placeholder="Protect this file with a password"
          disabled={isLoading}
          className="w-full rounded border border-neutral-300 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
        />

        <p className="text-sm text-zinc-700 dark:text-zinc-200">
          Download {file.name}?
        </p>

        {file.hasPassword && (
          <div>
            <label
              htmlFor={`download-password-${file.id}`}
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-200"
            >
              Password
            </label>
            <input
              id={`download-password-${file.id}`}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Enter the file password"
              required
              autoFocus
              className="w-full rounded border border-neutral-300 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            />
          </div>
        )}

        {error && <ErrorComponent error={error} />}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={handleHide}
            className="rounded border border-neutral-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-zinc-200 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={
              isLoading || (file.hasPassword && password.trim() === "")
            }
            className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-neutral-400"
          >
            {isLoading ? "Downloading..." : "Download"}
          </button>
        </div>
      </div>
  );
}
