"use client";

import ErrorComponent from "@/components/ErrorComponent/ErrorComponent";

export default function Error({ error, reset }) {
  return <ErrorComponent error={error} reset={reset} type={"error"} />;
}
