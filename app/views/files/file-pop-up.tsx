import FileUploadForm from "./file-upload";

type FilePopUpProps = {
  visible: boolean;
  onHide: () => void;
  onFileUploaded: () => void;
};

export default function FilePopUp({
  visible,
  onHide,
  onFileUploaded,
}: FilePopUpProps) {
  if (!visible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-zinc-950/35 px-5 py-8 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onHide();
        }
      }}
    >
      <section className="relative w-full max-w-[590px] rounded-xl bg-white px-5 py-7 shadow-[0_8px_30px_rgba(44,26,23,0.3)] sm:px-6">
        <button
          type="button"
          onClick={onHide}
          className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-[#fff0e8] hover:text-[#e46f38]"
          aria-label="Fermer le formulaire"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="size-5"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <h2 id="upload-title" className="mb-7 text-center text-xl font-bold">
          Ajouter un fichier
        </h2>
        <FileUploadForm onFileUploaded={onFileUploaded} />
      </section>
    </div>
  );
}
