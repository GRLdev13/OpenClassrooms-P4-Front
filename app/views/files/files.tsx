import { useGetFilesQuery } from "~/services/app-service";
import FileList from "./file-list";
import FileLinkDownload from "./file-link-download";
import FilePopUp from "./file-pop-up";
import ErrorComponent from "~/views/helpers/ErrorsComponent";
import type { RequestFilesDto } from "~/dto/file/RequestFilesDto";
import { useNavigate } from "react-router";
import { useState } from "react";

export default function Files() {
  const navigate = useNavigate();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const {
    data: files = [],
    error,
    isFetching,
    isLoading,
    refetch,
  } = useGetFilesQuery(
    {
      id: localStorage.getItem("id"),
      email: localStorage.getItem("email"),
      token: localStorage.getItem("token"),
    } as RequestFilesDto,
    { refetchOnMountOrArgChange: true },
  );

  return (
    <div className="min-h-svh bg-[#fffaf7] font-sans text-zinc-900 md:grid md:grid-cols-[220px_1fr]">
      <aside className="flex items-center justify-between bg-gradient-to-b from-[#ffad7f] to-[#e96267] px-6 py-4 text-white md:fixed md:inset-y-0 md:left-0 md:w-[220px] md:flex-col md:items-stretch md:px-5 md:py-5">
        <div>
          <div className="px-2 text-2xl font-bold tracking-tight">DataShare</div>
          <nav className="mt-8 hidden md:block" aria-label="Navigation principale">
            <span className="block rounded-xl bg-white/55 px-4 py-3 text-sm font-medium text-[#723d2f]">
              Mes fichiers
            </span>
          </nav>
        </div>
        <p className="text-[11px] text-white/95">
          Copyright DataShare® 2025
        </p>
      </aside>

      <div className="md:col-start-2">
        <header className="flex min-h-14 items-center justify-end gap-5 border-b border-[#f0b59d] bg-[#fff0e8] px-5 py-3 sm:px-8">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-xs text-[#e66f38] transition-colors hover:text-[#b94b1e]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="size-4"
              aria-hidden="true"
            >
              <path d="M10 17l5-5-5-5M15 12H3" />
              <path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
            </svg>
            Déconnexion
          </button>
        </header>

        <main className="px-5 py-6 sm:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-5 flex items-center gap-3">
              <h1 className="text-2xl font-bold">Mes fichiers</h1>
              <button
                type="button"
                onClick={() => setIsUploadOpen(true)}
                className="inline-flex size-8 items-center justify-center rounded-full bg-[#ed754f] text-2xl font-light leading-none text-white shadow-sm transition-colors hover:bg-[#d95f3b] focus:outline-none focus:ring-2 focus:ring-[#ed754f]/35"
                aria-label="Ajouter des fichiers"
                title="Ajouter des fichiers"
              >
                <span aria-hidden="true" className="-mt-0.5">
                  +
                </span>
              </button>
            </div>

            {error ? (
              <ErrorComponent error={error} />
            ) : isFetching || isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="mx-auto mb-3 h-9 w-9 animate-spin rounded-full border-2 border-[#f0c6b4] border-b-[#eb765e]" />
                  <p className="text-sm text-zinc-500">
                    Chargement de vos fichiers...
                  </p>
                </div>
              </div>
            ) : (
              <FileList
                files={files}
                onFileDeleted={() => {
                  refetch();
                }}
              />
            )}

            <div className="mt-12">
              <section className="max-w-xl rounded-xl border border-[#f2c5b2] bg-white p-5">
                <h2 className="mb-4 text-lg font-bold">
                  Télécharger depuis un lien
                </h2>
                <FileLinkDownload />
              </section>

            </div>
          </div>
        </main>
      </div>

      <FilePopUp
        visible={isUploadOpen}
        onHide={() => setIsUploadOpen(false)}
        onFileUploaded={() => {
          refetch();
          setIsUploadOpen(false);
        }}
      />
    </div>
  );
}
