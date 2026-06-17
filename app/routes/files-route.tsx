import Files from "~/views/files/files";

export function meta() {
  return [
    { title: "Files" },
    { name: "description", content: "Manage your files" },
  ];
}

export default function FilesRoute() {
  return <Files />;
}
