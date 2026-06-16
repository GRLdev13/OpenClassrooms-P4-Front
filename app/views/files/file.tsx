import { useState } from "react";
import { DeleteFileDto } from "~/dto/file/DeleteFileDto";
import { type GetFileDto } from "~/dto/file/GetFileDto";
import { useDeleteFileMutation } from "~/services/app-service";
import ErrorComponent from "~/views/helpers/ErrorsComponent";

type FileProps = {
  file: GetFileDto;
  onFileDeleted: () => void;
};

export default function File({ file, onFileDeleted }: FileProps) {
  const [errorMessage, setErrorMessage] = useState("");
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
    <li className="flex items-start justify-between gap-4 rounded-lg border border-neutral-200 p-3 transition hover:shadow-sm dark:border-neutral-700">
      <div className="min-w-0">
        <p className="text-sm text-zinc-900 dark:text-white">{file.name}</p>

        {/* //handle tags in sub combonent */}
        {/* {file.tag?.name && (
          <small className="mt-2 inline-block text-sm text-zinc-500 dark:text-zinc-400">
            Tag:{" "}
            <span className="rounded bg-blue-100 px-2 py-1 text-blue-800 dark:bg-blue-950 dark:text-blue-200">
            {file.tag.name}
          </span>
          </small>
        )} */}
        {errorMessage && <ErrorComponent error={errorMessage} />}
      </div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isLoading}
        className="shrink-0 text-sm font-medium text-red-500 transition hover:text-red-600 disabled:cursor-not-allowed disabled:text-neutral-400"
      >
        {isLoading ? "Deleting..." : "Delete"}
      </button>
    </li>
  );
}
