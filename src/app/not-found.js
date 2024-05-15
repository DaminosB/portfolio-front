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
      <h2>
        Cette page n&apos;existe pas ou a &eacute;t&eacute; supprim&eacute;e.
      </h2>
      <Link href="/">
        Retour &agrave; la page d&apos;accueil{" "}
        <FontAwesomeIcon icon={faArrowRotateBack} />
      </Link>
    </div>
  );
}
