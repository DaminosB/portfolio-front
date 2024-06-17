"use client";

import styles from "./ContactModale.module.css";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import ContactForm from "../ContactForm/ContactForm";

const ContactModale = ({ profile, customStyle }) => {
  const [showContactForm, setShowContactForm] = useState(false);
  const domTarget = useRef(null);

  useEffect(() => {
    domTarget.current = document.body;
  }, [showContactForm]);

  const handleOnClick = () => {
    setShowContactForm(true);
  };
  return (
    <>
      <button onClick={handleOnClick}>Contact</button>
      {showContactForm &&
        createPortal(
          <ContactForm
            profile={profile}
            customStyle={customStyle}
            setShowContactForm={setShowContactForm}
          />,
          domTarget.current
        )}
    </>
  );
};

export default ContactModale;
