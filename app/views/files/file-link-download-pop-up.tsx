import FileLinkDownload from "./file-link-download";

type FileLinkDownloadPopUpProps = {
  visible: boolean;
  onHide: () => void;
};

export default function FileLinkDownloadPopUp({
  visible,
  onHide,
}: FileLinkDownloadPopUpProps) {
  if (!visible) {
    return null;
  }

  return (
    <div
      className="ds-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="link-download-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onHide();
        }
      }}
    >
      <section className="ds-modal-card">
        <button
          type="button"
          onClick={onHide}
          className="ds-modal-close"
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

        <h2
          id="link-download-title"
          className="mb-7 text-center text-xl font-bold"
        >
          Télécharger depuis un lien
        </h2>
        <FileLinkDownload />
      </section>
    </div>
  );
}
