import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { GetFileDto } from "~/dto/file/get-file-dto";
import type { GetTagDto } from "~/dto/tag/get-tag-dto";
import FileItem from "~/views/files/file";
import FileDownload from "~/views/files/file-download";
import FileLinkDownload from "~/views/files/file-link-download";
import FileUploadForm from "~/views/files/file-upload";
import Files from "~/views/files/files";
import {
  useDeleteFileMutation,
  useDownloadFileLinkMutation,
  useDownloadFileMutation,
  useGetFilesQuery,
  useGetTagsQuery,
  usePutLogoutMutation,
  useUploadFileMutation,
} from "~/services/app-service";

let mockFileUploadFiles: File[] = [];
let mockFileUploadClear = jest.fn();
const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("~/services/app-service", () => ({
  useDeleteFileMutation: jest.fn(),
  useDownloadFileLinkMutation: jest.fn(),
  useDownloadFileMutation: jest.fn(),
  useGetFilesQuery: jest.fn(),
  useGetTagsQuery: jest.fn(),
  usePutLogoutMutation: jest.fn(),
  useUploadFileMutation: jest.fn(),
}));

jest.mock("~/views/files/file-download", () => ({
  __esModule: true,
  default: ({
    visible,
    file,
    onHide,
  }: {
    visible: boolean;
    file: GetFileDto;
    onHide: () => void;
  }) =>
    visible ? (
      <div role="dialog" aria-label="download file">
        <span>{file.name}</span>
        <button type="button" onClick={onHide}>
          Close download
        </button>
      </div>
    ) : null,
}));

jest.mock("~/views/files/file-link-popup", () => ({
  __esModule: true,
  default: ({
    visible,
    file,
    onHide,
  }: {
    visible: boolean;
    file: GetFileDto;
    onHide: () => void;
  }) =>
    visible ? (
      <div role="dialog" aria-label="share link">
        <span>{file.link}</span>
        <button type="button" onClick={onHide}>
          Close link
        </button>
      </div>
    ) : null,
}));

jest.mock("primereact/dialog", () => ({
  Dialog: ({
    visible,
    children,
  }: {
    visible: boolean;
    children: React.ReactNode;
  }) => (visible ? <div role="dialog">{children}</div> : null),
}));

jest.mock("primereact/dropdown", () => ({
  Dropdown: ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (event: { value: number }) => void;
  }) => (
    <select
      aria-label="Expiration"
      value={value}
      onChange={(event) => onChange({ value: Number(event.target.value) })}
    >
      <option value={1}>1 day</option>
      <option value={7}>7 days</option>
    </select>
  ),
}));

jest.mock("primereact/multiselect", () => ({
  MultiSelect: ({
    value,
    options,
    optionLabel,
    onChange,
    placeholder,
    disabled,
    panelFooterTemplate,
  }: {
    value: GetTagDto[];
    options: GetTagDto[];
    optionLabel: keyof GetTagDto;
    onChange: (event: { value: GetTagDto[] }) => void;
    placeholder: string;
    disabled: boolean;
    panelFooterTemplate: React.ReactNode;
  }) => (
    <div data-testid="tag-selector" data-disabled={String(disabled)}>
      <span>{placeholder}</span>
      <div>
        {options.map((option) => (
          <button
            type="button"
            key={option.name}
            onClick={() => onChange({ value: [...value, option] })}
          >
            {String(option[optionLabel])}
          </button>
        ))}
      </div>
      {panelFooterTemplate}
    </div>
  ),
}));

jest.mock("primereact/fileupload", () => ({
  FileUpload: ({
    disabled,
    uploadHandler,
  }: {
    disabled: boolean;
    uploadHandler: (event: {
      files: File[];
      options: { clear: () => void };
    }) => void;
  }) => (
    <button
      type="button"
      disabled={disabled}
      onClick={() =>
        uploadHandler({
          files: mockFileUploadFiles,
          options: { clear: mockFileUploadClear },
        })
      }
    >
      Upload selected file
    </button>
  ),
}));

const RealFileDownload = jest.requireActual("~/views/files/file-download").default;

const mockUseUploadFileMutation = jest.mocked(useUploadFileMutation);
const mockUseGetTagsQuery = jest.mocked(useGetTagsQuery);
const mockUseDownloadFileMutation = jest.mocked(useDownloadFileMutation);
const mockUseDownloadFileLinkMutation = jest.mocked(useDownloadFileLinkMutation);
const mockUseGetFilesQuery = jest.mocked(useGetFilesQuery);
const mockUsePutLogoutMutation = jest.mocked(usePutLogoutMutation);
const mockUseDeleteFileMutation = jest.mocked(useDeleteFileMutation);

function buildFile(overrides: Partial<GetFileDto> = {}): GetFileDto {
  return {
    id: "file-1",
    name: "report.txt",
    uploadDate: new Date("2026-01-01"),
    expirationDate: null,
    hasExpired: false,
    tags: [],
    hasPassword: false,
    link: null,
    ...overrides,
  };
}

function mockUploadDependencies({
  upload = jest.fn((_payload: FormData) => ({
    unwrap: jest.fn().mockResolvedValue("uploaded"),
  })),
  tags = [],
  tagsError,
  areTagsLoading = false,
  isUploading = false,
}: {
  upload?: jest.Mock;
  tags?: Array<GetTagDto & { id?: string }>;
  tagsError?: unknown;
  areTagsLoading?: boolean;
  isUploading?: boolean;
} = {}) {
  mockUseUploadFileMutation.mockReturnValue([
    upload,
    { isLoading: isUploading, reset: jest.fn() },
  ] as unknown as ReturnType<typeof useUploadFileMutation>);
  mockUseGetTagsQuery.mockReturnValue({
    data: tags,
    error: tagsError,
    isLoading: areTagsLoading,
    isSuccess: !tagsError,
    isError: Boolean(tagsError),
    isFetching: areTagsLoading,
    refetch: jest.fn(),
  } as ReturnType<typeof useGetTagsQuery>);

  return upload;
}

function mockFileLinkDownloadDependencies({
  getFileFromLink = jest.fn((_link: string) => ({
    unwrap: jest.fn().mockResolvedValue(buildFile()),
  })),
  downloadFile = jest.fn((_payload: unknown) => ({
    unwrap: jest.fn().mockResolvedValue(new Blob(["downloaded content"])),
  })),
  fileLinkError,
  downloadError,
  isFileLoading = false,
  isDownloadLoading = false,
}: {
  getFileFromLink?: jest.Mock;
  downloadFile?: jest.Mock;
  fileLinkError?: unknown;
  downloadError?: unknown;
  isFileLoading?: boolean;
  isDownloadLoading?: boolean;
} = {}) {
  const resetFileLinkRequest = jest.fn();
  const resetDownloadRequest = jest.fn();

  mockUseDownloadFileLinkMutation.mockReturnValue([
    getFileFromLink,
    {
      isLoading: isFileLoading,
      error: fileLinkError,
      reset: resetFileLinkRequest,
    },
  ] as unknown as ReturnType<typeof useDownloadFileLinkMutation>);
  mockUseDownloadFileMutation.mockReturnValue([
    downloadFile,
    {
      isLoading: isDownloadLoading,
      error: downloadError,
      reset: resetDownloadRequest,
    },
  ] as unknown as ReturnType<typeof useDownloadFileMutation>);

  return {
    getFileFromLink,
    downloadFile,
    resetFileLinkRequest,
    resetDownloadRequest,
  };
}

describe("file flows", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    Object.defineProperty(globalThis, "cookieStore", {
      configurable: true,
      value: {
        delete: jest.fn().mockResolvedValue(undefined),
      },
    });
    mockFileUploadFiles = [
      new File(["hello"], "report.txt", { type: "text/plain" }),
    ];
    mockFileUploadClear = jest.fn();
    mockUseDeleteFileMutation.mockReturnValue([
      jest.fn(() => ({
        unwrap: jest.fn().mockResolvedValue(undefined),
      })),
      { isLoading: false, reset: jest.fn() },
    ] as unknown as ReturnType<typeof useDeleteFileMutation>);
  });

  test("uploads the selected file with metadata", async () => {
    const onFileUploaded = jest.fn();

    localStorage.setItem("email", "ada@example.com");
    const upload = mockUploadDependencies();

    render(<FileUploadForm onFileUploaded={onFileUploaded} />);

    await userEvent.type(screen.getByLabelText(/password/i), "file-secret");
    await userEvent.click(screen.getByRole("button", { name: /upload selected file/i }));

    await waitFor(() => {
      expect(upload).toHaveBeenCalledTimes(1);
    });

    const formData = upload.mock.calls[0][0];

    expect(formData.get("file")).toEqual(
      expect.objectContaining({ name: "report.txt" }),
    );
    expect(formData.get("name")).toBe("report.txt");
    expect(formData.get("tags")).toBe("[]");
    expect(formData.get("extension")).toBe("txt");
    expect(formData.get("password")).toBe("file-secret");
    expect(formData.get("expirationTimeInDay")).toBe("1");
    expect(mockFileUploadClear).toHaveBeenCalledTimes(1);
    expect(onFileUploaded).toHaveBeenCalledTimes(1);
    expect(screen.getByText("File uploaded successfully.")).toBeInTheDocument();
  });

  test("uploads selected existing and custom tags with the chosen expiration", async () => {
    const onFileUploaded = jest.fn();

    Object.defineProperty(globalThis, "crypto", {
      configurable: true,
      value: { randomUUID: jest.fn(() => "custom-tag-id") },
    });

    const upload = mockUploadDependencies({
      tags: [{ id: "tag-1", name: "Finance" }],
    });

    render(<FileUploadForm onFileUploaded={onFileUploaded} />);

    await userEvent.selectOptions(screen.getByLabelText("Expiration"), "7");
    await userEvent.type(screen.getByLabelText("New tag name"), "finance");
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    await userEvent.type(screen.getByLabelText("New tag name"), "quarterly");
    await userEvent.keyboard("{Enter}");
    await userEvent.type(screen.getByLabelText(/password/i), "  file-secret  ");
    await userEvent.click(screen.getByRole("button", { name: /upload selected file/i }));

    await waitFor(() => {
      expect(upload).toHaveBeenCalledTimes(1);
    });

    const formData = upload.mock.calls[0][0];

    expect(JSON.parse(String(formData.get("tags")))).toEqual([
      { name: "Finance" },
      { name: "quarterly" },
    ]);
    expect(formData.get("expirationTimeInDay")).toBe("7");
    expect(formData.get("password")).toBe("file-secret");
    expect(onFileUploaded).toHaveBeenCalledTimes(1);
  });

  test("shows tag loading and tag fetch errors", () => {
    mockUploadDependencies({
      areTagsLoading: true,
      tagsError: { data: { message: "Could not load tags" } },
      isUploading: true,
    });

    render(<FileUploadForm onFileUploaded={jest.fn()} />);

    expect(screen.getByText("Loading tags...")).toBeInTheDocument();
    expect(screen.getByTestId("tag-selector")).toHaveAttribute("data-disabled", "true");
    expect(
      screen.getByRole("button", { name: /upload selected file/i }),
    ).toBeDisabled();
    expect(screen.getByText("Could not load tags")).toBeInTheDocument();
  });

  test("shows an error when upload is attempted without a file", async () => {
    const upload = mockUploadDependencies();

    mockFileUploadFiles = [];

    render(<FileUploadForm onFileUploaded={jest.fn()} />);

    await userEvent.click(screen.getByRole("button", { name: /upload selected file/i }));

    expect(upload).not.toHaveBeenCalled();
    expect(screen.getByText("Choose a file before uploading.")).toBeInTheDocument();
  });

  test("shows upload errors without clearing the selected file", async () => {
    const onFileUploaded = jest.fn();
    const consoleLog = jest.spyOn(console, "log").mockImplementation();
    const upload = mockUploadDependencies({
      upload: jest.fn((_payload: FormData) => ({
        unwrap: jest.fn().mockRejectedValue({
          data: { message: "Upload failed" },
        }),
      })),
    });

    render(<FileUploadForm onFileUploaded={onFileUploaded} />);

    await userEvent.click(screen.getByRole("button", { name: /upload selected file/i }));

    await waitFor(() => {
      expect(upload).toHaveBeenCalledTimes(1);
      expect(screen.getByText("Upload failed")).toBeInTheDocument();
    });

    expect(mockFileUploadClear).not.toHaveBeenCalled();
    expect(onFileUploaded).not.toHaveBeenCalled();

    consoleLog.mockRestore();
  });

  test("logs out and deletes the session cookie", async () => {
    const logout = jest.fn(() => ({
      unwrap: jest.fn().mockResolvedValue(undefined),
    }));

    localStorage.setItem("token", "login-token");
    mockUsePutLogoutMutation.mockReturnValue([
      logout,
      { isLoading: false, reset: jest.fn() },
    ] as unknown as ReturnType<typeof usePutLogoutMutation>);
    mockUseGetFilesQuery.mockReturnValue({
      data: [],
      error: undefined,
      isFetching: false,
      isLoading: false,
      refetch: jest.fn(),
    } as unknown as ReturnType<typeof useGetFilesQuery>);

    render(<Files />);

    await userEvent.click(screen.getByRole("button", { name: /connexion/i }));

    await waitFor(() => {
      expect(logout).toHaveBeenCalledTimes(1);
      expect(globalThis.cookieStore.delete).toHaveBeenCalledWith("session_id");
      expect(localStorage.getItem("token")).toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
    });
  });

  test("renders a file row with tags, password, link, and opens its dialogs", async () => {
    render(
      <FileItem
        file={buildFile({
          expirationDate: new Date(Date.now() + 2 * 86_400_000),
          hasPassword: true,
          link: "https://datashare.test/share/file-1",
          tags: [{ name: "Finance" }, { name: "Quarterly" }],
        })}
        onFileDeleted={jest.fn()}
      />,
    );

    expect(screen.getByText("report.txt")).toBeInTheDocument();
    expect(screen.getByText(/expire dans 2 jours/i)).toBeInTheDocument();
    expect(screen.getByText(/finance/i)).toBeInTheDocument();
    expect(screen.getByText(/quarterly/i)).toBeInTheDocument();
    expect(screen.getByText(/prot/i)).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: /afficher le lien de partage/i }),
    );
    expect(screen.getByRole("dialog", { name: /share link/i })).toHaveTextContent(
      "https://datashare.test/share/file-1",
    );

    await userEvent.click(screen.getByRole("button", { name: /acc/i }));
    expect(screen.getByRole("dialog", { name: /download file/i })).toHaveTextContent(
      "report.txt",
    );
  });

  test("deletes a file and refreshes the list", async () => {
    const onFileDeleted = jest.fn();
    const deleteFile = jest.fn(() => ({
      unwrap: jest.fn().mockResolvedValue(undefined),
    }));

    mockUseDeleteFileMutation.mockReturnValue([
      deleteFile,
      { isLoading: false, reset: jest.fn() },
    ] as unknown as ReturnType<typeof useDeleteFileMutation>);

    render(<FileItem file={buildFile()} onFileDeleted={onFileDeleted} />);

    await userEvent.click(screen.getByRole("button", { name: /supprimer/i }));

    await waitFor(() => {
      expect(deleteFile).toHaveBeenCalledWith(expect.objectContaining({ id: "file-1" }));
      expect(onFileDeleted).toHaveBeenCalledTimes(1);
    });
  });

  test("shows delete errors without refreshing the list", async () => {
    const onFileDeleted = jest.fn();
    const consoleLog = jest.spyOn(console, "log").mockImplementation();
    const deleteFile = jest.fn(() => ({
      unwrap: jest.fn().mockRejectedValue({
        data: { message: "Delete failed" },
      }),
    }));

    mockUseDeleteFileMutation.mockReturnValue([
      deleteFile,
      { isLoading: false, reset: jest.fn() },
    ] as unknown as ReturnType<typeof useDeleteFileMutation>);

    render(<FileItem file={buildFile()} onFileDeleted={onFileDeleted} />);

    await userEvent.click(screen.getByRole("button", { name: /supprimer/i }));

    await waitFor(() => {
      expect(screen.getByText("Delete failed")).toBeInTheDocument();
      expect(onFileDeleted).not.toHaveBeenCalled();
    });

    consoleLog.mockRestore();
  });

  test("hides file actions for expired files", () => {
    render(
      <FileItem
        file={buildFile({
          hasExpired: true,
          expirationDate: new Date(Date.now() - 86_400_000),
        })}
        onFileDeleted={jest.fn()}
      />,
    );

    expect(screen.getByText("Expiré")).toBeInTheDocument();
    expect(screen.getByText(/il n'est plus stock/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /supprimer/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /acc/i })).not.toBeInTheDocument();
  });

  test("finds a file from a shared link and shows its details", async () => {
    const getFileFromLink = jest.fn((_link: string) => ({
      unwrap: jest.fn().mockResolvedValue(
        buildFile({
          name: "shared-report.pdf",
          uploadDate: new Date("2026-01-02"),
          expirationDate: null,
          hasPassword: false,
          tags: [{ name: "Public" }],
        }),
      ),
    }));
    const { resetFileLinkRequest, resetDownloadRequest } =
      mockFileLinkDownloadDependencies({ getFileFromLink });

    render(<FileLinkDownload />);

    expect(screen.getByRole("button", { name: /rechercher le fichier/i })).toBeDisabled();

    await userEvent.type(
      screen.getByLabelText(/lien du fichier/i),
      "  https://datashare.test/share/shared-report  ",
    );
    await userEvent.click(screen.getByRole("button", { name: /rechercher le fichier/i }));

    await waitFor(() => {
      expect(getFileFromLink).toHaveBeenCalledWith(
        "https://datashare.test/share/shared-report",
      );
      expect(screen.getByText("shared-report.pdf")).toBeInTheDocument();
    });

    expect(screen.getByText("Available")).toBeInTheDocument();
    expect(screen.getByText("Public")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
    expect(resetFileLinkRequest).toHaveBeenCalled();
    expect(resetDownloadRequest).toHaveBeenCalled();
  });

  test("downloads a password-protected file from a shared link", async () => {
    const blob = new Blob(["linked download"], { type: "text/plain" });
    const getFileFromLink = jest.fn((_link: string) => ({
      unwrap: jest.fn().mockResolvedValue(
        buildFile({
          id: "linked-file",
          name: "locked-report.pdf",
          hasPassword: true,
        }),
      ),
    }));
    const downloadFile = jest.fn((_payload: unknown) => ({
      unwrap: jest.fn().mockResolvedValue(blob),
    }));
    const createObjectURL = jest.fn().mockReturnValue("blob:linked-download-url");
    const revokeObjectURL = jest.fn();
    const click = jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation();

    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: createObjectURL,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: revokeObjectURL,
    });

    mockFileLinkDownloadDependencies({ getFileFromLink, downloadFile });

    render(<FileLinkDownload />);

    await userEvent.type(
      screen.getByLabelText(/lien du fichier/i),
      "https://datashare.test/share/locked-report",
    );
    await userEvent.click(screen.getByRole("button", { name: /rechercher le fichier/i }));

    await waitFor(() => {
      expect(screen.getByText("locked-report.pdf")).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: /t.l.charger/i })).toBeDisabled();

    await userEvent.type(screen.getByLabelText(/mot de passe/i), "  secret  ");
    await userEvent.click(screen.getByRole("button", { name: /t.l.charger/i }));

    await waitFor(() => {
      expect(downloadFile).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "linked-file",
          password: "secret",
        }),
      );
      expect(createObjectURL).toHaveBeenCalledWith(blob);
      expect(click).toHaveBeenCalledTimes(1);
    });

    click.mockRestore();
  });

  test("downloads a file blob and closes the dialog", async () => {
    const blob = new Blob(["downloaded content"], { type: "text/plain" });
    const download = jest.fn((_payload: unknown) => ({
      unwrap: jest.fn().mockResolvedValue(blob),
    }));
    const onHide = jest.fn();
    const createObjectURL = jest.fn().mockReturnValue("blob:download-url");
    const revokeObjectURL = jest.fn();
    const click = jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation();

    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: createObjectURL,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: revokeObjectURL,
    });

    mockUseDownloadFileMutation.mockReturnValue([
      download,
      {
        isLoading: false,
        error: undefined,
        reset: jest.fn(),
      },
    ] as unknown as ReturnType<typeof useDownloadFileMutation>);

    const file: GetFileDto = {
      id: "file-1",
      name: "report.txt",
      uploadDate: new Date("2026-01-01"),
      expirationDate: null,
      hasExpired: false,
      tags: [],
      hasPassword: false,
      link: null,
    };

    render(<RealFileDownload file={file} visible onHide={onHide} />);

    await userEvent.click(screen.getByRole("button", { name: /^download$/i }));

    await waitFor(() => {
      expect(download).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "file-1",
          password: null,
        }),
      );
      expect(createObjectURL).toHaveBeenCalledWith(blob);
      expect(click).toHaveBeenCalledTimes(1);
      expect(onHide).toHaveBeenCalledTimes(1);
    });

    click.mockRestore();
  });
});
