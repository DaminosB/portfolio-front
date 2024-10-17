"use client";

import styles from "./ErrorComponent.module.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { faArrowRotateBack } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ErrorComponent = ({ error, reset, text, type }) => {
  const router = useRouter();

  // Log the error if it exists
  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  const goToHomepage = () => {
    router.replace("/");
  };

  // Default texts for different types of pages
  const errorMessages = {
    error: "Une erreur est survenue",
    notFound: "Page introuvable",
    default: "Quelque chose s'est mal passé",
  };

  const buttonText = {
    error: "Raffraîchir la page",
    notFound: "Retour à l'accueil",
  };

  // Choose the appropriate text based on the type of error
  const message = errorMessages[type] || errorMessages.default;
  const buttonActionText = buttonText[type] || buttonText.error;

  return (
    <div className={styles.errorComponent}>
      <h2>{message}</h2>
      <p>
        {text ? text : "Veuillez raffraîchir la page ou revenir à l'accueil."}
      </p>
      <button onClick={reset ? reset : goToHomepage}>
        {buttonActionText} <FontAwesomeIcon icon={faArrowRotateBack} />
      </button>
    </div>
  );
};

export default ErrorComponent;
