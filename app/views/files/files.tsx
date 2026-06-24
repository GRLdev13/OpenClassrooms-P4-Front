import { useGetFilesQuery } from "~/services/app-service";
import FileList from "./file-list";
import FilePopUp from "./file-pop-up";
import FileLinkDownloadPopUp from "./file-link-download-pop-up";
import ErrorComponent from "~/views/helpers/ErrorsComponent";
import type { RequestFilesDto } from "~/dto/file/request-files-dto";
import { useNavigate } from "react-router";
import { useState } from "react";

export default function Files() {
  const navigate = useNavigate();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLinkDownloadOpen, setIsLinkDownloadOpen] = useState(false);

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
    <div className="ds-dashboard">
      <aside className="ds-sidebar">
        <div>
          <div className="px-2 text-2xl font-bold tracking-tight">DataShare</div>
          <nav className="mt-8 hidden md:block" aria-label="Navigation principale">
            <span className="ds-sidebar-link">
              Mes fichiers
            </span>
            <button
              type="button"
              onClick={() => setIsLinkDownloadOpen(true)}
              className="ds-sidebar-action"
            >
              Télécharger depuis un lien
            </button>
          </nav>
        </div>
        <p className="text-[11px] text-white/95">
          Copyright DataShare® 2025
        </p>
      </aside>

      <div className="ds-dashboard-main">
        <header className="ds-topbar">
          <button
            type="button"
            onClick={handleLogout}
            className="ds-logout-button"
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
          <div className="ds-content">
            <div className="mb-5 flex items-center gap-3">
              <h1 className="text-2xl font-bold">Mes fichiers</h1>
              <button
                type="button"
                onClick={() => setIsUploadOpen(true)}
                className="ds-add-button"
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
                  <div className="ds-loading-spinner" />
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
      <FileLinkDownloadPopUp
        visible={isLinkDownloadOpen}
        onHide={() => setIsLinkDownloadOpen(false)}
      />
    </div>
  );
}
