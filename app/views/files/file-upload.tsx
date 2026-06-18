import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { useUploadFileMutation } from "~/services/app-service";
import ErrorComponent from "~/views/helpers/ErrorsComponent";
import { CreateFileDto } from "~/dto/file/CreateFileDto";

type FileUploadFormProps = {
  onFileUploaded: () => void;
};

type UploadHandlerEvent = {
  files: File[];
  options: {
    clear: () => void;
  };
};

const expirationOptions = [
  { label: "1 day", value: 1 },
  { label: "3 days", value: 3 },
  { label: "7 days", value: 7 },
];

function getFileExtension(fileName: string) {
  return fileName.includes(".") ? (fileName.split(".").pop() ?? "") : "";
}

export default function FileUploadForm({
  onFileUploaded,
}: FileUploadFormProps) {
  const [filePassword, setFilePassword] = useState("");
  const [expirationTimeInDay, setExpirationTimeInDay] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadFile, { isLoading }] = useUploadFileMutation();

  const handleUpload = async (event: UploadHandlerEvent) => {
    const file = event.files[0];

    if (!file) {
      setErrorMessage("Choose a file before uploading.");
      return;
    }

    setSuccessMessage("");
    setErrorMessage("");

    try {
      const createFileDto = new CreateFileDto(
        file.name,
        [],
        null,
        getFileExtension(file.name),
        filePassword.trim() || null,
        expirationTimeInDay,
      );

      //prepare data in a formData stream object
      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("name", createFileDto.name);
      formData.append("tags", JSON.stringify(createFileDto.tags)); //TODO
      formData.append("extension", createFileDto.extension);
      formData.append(
        "expirationTimeInDay",
        String(createFileDto.expirationTimeInDay),
      );
      if (createFileDto.password) {
        formData.append("password", createFileDto.password);
      }

      await uploadFile(formData).unwrap();

      event.options.clear();
      setFilePassword("");
      setSuccessMessage("File uploaded successfully.");
      onFileUploaded();
    } catch (error) {
      console.log("error:", error);
      setErrorMessage("File upload failed.");
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
        Expiration
      </label>
      <Dropdown
        className="w-full md:w-56"
        value={expirationTimeInDay}
        options={expirationOptions}
        onChange={(event) => setExpirationTimeInDay(event.value)}
        placeholder="Select expiration"
      />

      <div>
        <label
          htmlFor="file-password"
          className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-200"
        >
          Password (optional)
        </label>
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
      </div>

      <FileUpload
        name="file"
        customUpload
        uploadHandler={handleUpload}
        multiple={false}
        maxFileSize={10_000_000_000}
        disabled={isLoading}
        chooseLabel="Choose file"
        uploadLabel={isLoading ? "Uploading..." : "Upload"}
        cancelLabel="Clear"
        emptyTemplate={
          <p className="m-0 text-sm text-zinc-500 dark:text-zinc-400">
            Drag and drop a file here, or choose one from your computer.
          </p>
        }
      />

      {successMessage && (
        <p className="text-sm font-medium text-green-600 dark:text-green-400">
          {successMessage}
        </p>
      )}
      {errorMessage && <ErrorComponent error={errorMessage} />}
    </div>
  );
}
