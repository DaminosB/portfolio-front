"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import ContactForm from "../ContactForm/ContactForm";
import ModaleWrapper from "../ModaleWrapper/ModaleWrapper";

const ContactButton = ({ profile, customStyle }) => {
  const [showContactForm, setShowContactForm] = useState(false);
  const domTarget = useRef(null);

  useEffect(() => {
    domTarget.current = document.body;
  }, [showContactForm]);

  const handleOnClick = () => {
    setShowContactForm(true);
  };

  const customColors = {
    mainColor: customStyle.mainColor,
    secondaryColor: customStyle.secondaryColor,
  };

  const handleExitModale = () => {
    setShowContactForm(false);
  };
  return (
    <>
      <button onClick={handleOnClick}>Contact</button>
      {showContactForm &&
        createPortal(
          <ModaleWrapper
            exitFunction={handleExitModale}
            customColors={customColors}
          >
            <ContactForm
              profile={profile}
              customStyle={customStyle}
              setShowContactForm={setShowContactForm}
            />
          </ModaleWrapper>,
          domTarget.current
        )}
    </>
  );
};

export default ContactButton;
