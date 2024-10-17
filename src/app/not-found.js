import ErrorComponent from "@/components/ErrorComponent/ErrorComponent";

export default function NotFound() {
  return (
    <ErrorComponent
      text={"Cette page n'existe pas ou a été supprimée."}
      type={"notFound"}
    />
  );
}
