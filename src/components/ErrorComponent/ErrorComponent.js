import { faArrowRotateBack } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";

const ErrorComponent = ({ error, reset }) => {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="error-component">
      <h2>Une erreur est survenue</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Raffraîchir la page <FontAwesomeIcon icon={faArrowRotateBack} />
      </button>
    </div>
  );
};

export default ErrorComponent;
