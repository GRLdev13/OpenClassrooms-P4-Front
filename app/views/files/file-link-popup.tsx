import { Dialog } from "primereact/dialog";
import { useState } from "react";
import type { GetFileDto } from "~/dto/file/get-file-dto";

type FileLinkPopupProps = {
  file: GetFileDto;
  visible: boolean;
  onHide: () => void;
};

export default function FileLinkPopup({
  file,
  visible,
  onHide,
}: FileLinkPopupProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!file.link) {
      return;
    }

    await navigator.clipboard.writeText(file.link);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const handleHide = () => {
    setCopied(false);
    onHide();
  };

  return (
    <Dialog
      header="File link"
      visible={visible}
      onHide={handleHide}
      className="w-[90vw] max-w-md"
      modal
    >
      <div>
        <label
          htmlFor={`file-link-${file.id}`}
          className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-200"
        >
          File link
        </label>
        <div className="flex gap-2">
          <input
            id={`file-link-${file.id}`}
            type="text"
            value={file.link ?? ""}
            placeholder="No link available"
            readOnly
            onFocus={(event) => event.currentTarget.select()}
            className="min-w-0 flex-1 rounded border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          />
          <button
            type="button"
            onClick={handleCopy}
            disabled={!file.link}
            title={copied ? "Copied" : "Copy link"}
            aria-label={copied ? "Link copied" : "Copy file link"}
            className="flex size-10 shrink-0 items-center justify-center rounded border border-neutral-300 text-zinc-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:text-zinc-200 dark:hover:bg-neutral-800"
          >
            {copied ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4 text-green-600"
                aria-hidden="true"
              >
                <path d="m5 12 4 4L19 6" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
                aria-hidden="true"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            )}
          </button>
        </div>
        {copied && (
          <p className="mt-2 text-sm text-green-600 dark:text-green-400">
            Link copied to clipboard.
          </p>
        )}
      </div>
    </Dialog>
  );
}
