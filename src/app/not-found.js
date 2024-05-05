import { faArrowRotateBack } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="error-component">
      <span className="medium">
        erreur
        <span className="xLarge">404</span>
      </span>
      <h2>Cette page n'existe pas ou a été supprimée.</h2>
      <Link href="/">
        Retour à la page d'accueil <FontAwesomeIcon icon={faArrowRotateBack} />
      </Link>
    </div>
  );
}
