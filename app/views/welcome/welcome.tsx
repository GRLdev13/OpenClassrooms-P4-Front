import { useState } from "react";
import { Link, useNavigate } from "react-router";
import FileLinkDownloadPopUp from "~/views/files/file-link-download-pop-up";

export function Welcome() {
  const navigate = useNavigate();
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  const handleUploadClick = () => {
    const token = localStorage.getItem("token");
    navigate(token ? "/files" : "/login");
  };

  const handleDownloadClick = () => {
    setIsDownloadOpen(true);
  };

  return (
    <main className="flex min-h-svh flex-col bg-gradient-to-b from-[#ffb382] via-[#f58c78] to-[#e96368] font-sans text-black">
      <header className="flex items-center justify-between px-6 py-4 sm:px-12 lg:px-[6.5%]">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight transition-opacity hover:opacity-70"
        >
          DataShare
        </Link>

        <Link
          to="/login"
          className="rounded-md bg-[#292929] px-4 py-2 text-xs text-white shadow-sm transition-colors hover:bg-black"
        >
          Se connecter
        </Link>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center px-6 pb-12 text-center">
        <h1 className="mb-5 text-lg font-normal">
          Tu veux partager un fichier ?
        </h1>

        <button
          type="button"
          onClick={handleUploadClick}
          className="group flex size-[84px] items-center justify-center rounded-full bg-[#d87968] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Partager un fichier"
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-[#18001d] text-white shadow-sm transition-colors group-hover:bg-[#27002e]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-7"
              aria-hidden="true"
            >
              <path d="M16 16l-4-4-4 4" />
              <path d="M12 12v9" />
              <path d="M20.4 17.5A5 5 0 0 0 18 8.2 7 7 0 0 0 4.3 10.7 4.5 4.5 0 0 0 5.5 19H7" />
            </svg>
          </span>
        </button>
      </section>

      <section className="flex flex-1 flex-col items-center justify-center px-6 pb-12 text-center">
        <h1 className="mb-5 text-lg font-normal">Tu as un lien de fichier ?</h1>

        <button
          type="button"
          onClick={handleDownloadClick}
          className="group flex size-[84px] items-center justify-center rounded-full bg-[#d87968] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Télécharger un fichier depuis un lien"
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-[#18001d] text-white shadow-sm transition-colors group-hover:bg-[#27002e]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-7"
              aria-hidden="true"
            >
              <path d="M8 16l4 4 4-4" />
              <path d="M12 11v9" />
              <path d="M20.4 17.5A5 5 0 0 0 18 8.2 7 7 0 0 0 4.3 10.7 4.5 4.5 0 0 0 5.5 19H7" />
            </svg>
          </span>
        </button>
      </section>

      <FileLinkDownloadPopUp
        visible={isDownloadOpen}
        onHide={() => setIsDownloadOpen(false)}
      />

      <footer className="px-6 py-5 text-xs text-white sm:px-12 lg:px-[6.5%]">
        Copyright DataShare® 2025
      </footer>
    </main>
  );
}
