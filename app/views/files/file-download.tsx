import { Dialog } from "primereact/dialog";
import { DownloadFileDto } from "~/dto/file/DownloadFileDto";
import type { GetFileDto } from "~/dto/file/GetFileDto";
import { useDownloadFileMutation } from "~/services/app-service";
import ErrorComponent from "~/views/helpers/ErrorsComponent";

type FileDownloadProps = {
  file: GetFileDto;
  visible: boolean;
  onHide: () => void;
};

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

export default function FileDownload({
  file,
  visible,
  onHide,
}: FileDownloadProps) {
  const [downloadFile, { isLoading, error }] = useDownloadFileMutation();

  const handleDownload = async () => {
    try {
      const blob = await downloadFile(
        new DownloadFileDto(file.id, null, null),
      ).unwrap();
      downloadBlob(file.name, blob);
      onHide();
    } catch (downloadError) {
      console.log("error:", downloadError);
    }
  };

  return (
    <Dialog
      header="Download file"
      visible={visible}
      onHide={onHide}
      className="w-[90vw] max-w-md"
      modal
    >
      <div className="space-y-4">
        <p className="text-sm text-zinc-700 dark:text-zinc-200">
          Download {file.name}?
        </p>

        {error && <ErrorComponent error={error as any} />}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onHide}
            className="rounded border border-neutral-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-zinc-200 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isLoading}
            className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-neutral-400"
          >
            {isLoading ? "Downloading..." : "Download"}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
