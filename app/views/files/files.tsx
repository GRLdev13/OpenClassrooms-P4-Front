import { useGetFilesQuery } from "~/services/app-service";
import FileUploadForm from "./file-upload";
import FileList from "./file-list";
import ErrorComponent from "~/views/helpers/ErrorsComponent";

export default function Files() {
  const { data: files = [], error, isFetching, isLoading, refetch } = useGetFilesQuery(
    "dashboard",
    { refetchOnMountOrArgChange: true },
  );

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950">
      <main className="[grid-area:main] min-h-screen flex-1 p-6 lg:p-8">
        <div className="mx-auto flex h-full w-full max-w-4xl flex-1 flex-col gap-4 rounded-xl">
          <header className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                Dashboard
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Manage your notes and tags.
              </p>
            </div>
          </header>

          {error ? (
            <ErrorComponent error={error} />
          ) : (
            <>
              <section className="mt-6 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
                <div className="space-y-4">
                  {/* {files?.tags && files.tags.length > 0 ? (
                    TODO: add Fles
                    <AddNote
                      tags={dashboard.tags}
                      onNoteCreated={() => {
                        refetch();
                      }}
                    />
                  ) : (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Add a tag before creating your first note.
                    </p>
                  )} */}

                  <hr className="border-neutral-200 dark:border-neutral-700" />

                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                    Your Files
                  </h2>
                  {isFetching || isLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="text-center">
                        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
                        <p className="text-zinc-600 dark:text-zinc-400">
                          Loading your files...
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
              </section>

              <section className="mt-6 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                    Upload a file
                  </h2>
                  <FileUploadForm
                    onFileUploaded={() => {
                      refetch();
                    }}
                  />
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
