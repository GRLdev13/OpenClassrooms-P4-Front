import type { Route } from "../+types/root";
import { Welcome } from "~/views/welcome/welcome";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "DataShare" },
    { name: "description", content: "Partagez vos fichiers avec DataShare." },
  ];
}

export default function Home() {
  return <Welcome />;
}
