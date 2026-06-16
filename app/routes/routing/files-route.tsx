import Files from "~/views/files/files";

export function meta() {
  return [
    { title: "Register" },
    { name: "description", content: "Create a new account" },
  ];
}

export default function RegisterRoute() {
  return <Files />;
}
