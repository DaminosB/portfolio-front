"use client";
import styles from "./ContactForm.module.css";

import { useEffect, useState, useRef } from "react";

import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-regular-svg-icons";

const ContactForm = ({ customStyle }) => {
  const [username, setUsername] = useState({
    value: "",
    isValid: false,
  });
  const [email, setEmail] = useState({
    value: "",
    isValid: false,
  });
  const [message, setMessage] = useState({
    value: "",
    isValid: false,
  });

  const [formIsDisabled, setFormIsDisabled] = useState(false);

  const [confirmationMessage, setConfirmationMessage] = useState({
    formIsSent: undefined,
    message: "",
  });

  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const nonEmptyStringRegex = /\S/;

  const inputChange = (event, func) => {
    const text = event.target.value;
    const targetId = event.target.id;

    const response = { value: text };

    if (targetId === "email") {
      response.isValid = emailRegex.test(response.value);
    } else {
      response.isValid = nonEmptyStringRegex.test(response.value);
    }

    func(response);
  };

  const submitMessage = async (e) => {
    e.preventDefault();

    setFormIsDisabled(true);

    try {
      if (username.isValid && email.isValid && message.isValid) {
        await axios.post("/api/new-message", {
          recipientEmail: "damien.bourcheix@gmail.com",
          name: username.value,
          email: email.value,
          message: message.value,
        });

        const resetValue = (func) => {
          func((prev) => {
            const newObj = { ...prev };
            newObj.value = "";
            return newObj;
          });
        };

        resetValue(setUsername);
        resetValue(setEmail);
        resetValue(setMessage);
        setConfirmationMessage({
          formIsSent: true,
          message: "Votre message a bien été envoyé.",
        });
      }
    } catch (error) {
      console.log(error);
      setConfirmationMessage({
        formIsSent: false,
        message: "Une erreur s'est produite. Veuillez recommencer",
      });
    }

    setFormIsDisabled(false);
  };

  useEffect(() => {
    if (!username.isValid || !email.isValid || !message.isValid) {
      setFormIsDisabled(true);
    } else {
      setFormIsDisabled(false);
    }
  }, [username, email, message]);

  const { inputStyle, activeButtonStyle, inactiveButtonStyle } =
    parseStyleToCSS(customStyle);

  return (
    <form
      onSubmit={submitMessage}
      className={styles.contactForm}
      onClick={(e) => e.stopPropagation()}
    >
      <h2>Contact</h2>
      <div>
        <label htmlFor="name">
          <input
            style={inputStyle}
            type="text"
            name="nom"
            id="name"
            placeholder="Nom"
            value={username.value}
            onChange={(e) => inputChange(e, setUsername)}
          />
          {username.isValid && username.value ? (
            <FontAwesomeIcon icon={faCheck} />
          ) : (
            <p className={`${styles.formMessage} small`}>
              {!username.isValid && "Ce champ est obligatoire."}
            </p>
          )}
        </label>

        <label htmlFor="email">
          <input
            style={inputStyle}
            // style={customStyles}
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={email.value}
            onChange={(e) => inputChange(e, setEmail)}
          />
          {email.isValid && email.value ? (
            <FontAwesomeIcon icon={faCheck} />
          ) : (
            <p className={`${styles.formMessage} small`}>
              {!email.isValid && "Format\u00a0: abc@domaine.com."}
            </p>
          )}
        </label>
      </div>

      <label htmlFor="message">
        <textarea
          style={inputStyle}
          name="message"
          id="message"
          placeholder="..."
          value={message.value}
          onChange={(e) => inputChange(e, setMessage)}
        ></textarea>
        {message.isValid && message.value ? (
          <FontAwesomeIcon icon={faCheck} />
        ) : (
          <p className={`${styles.formMessage} small`}>
            {!message.isValid && "Ce champ est obligatoire."}
          </p>
        )}
      </label>

      <button
        style={formIsDisabled ? inactiveButtonStyle : activeButtonStyle}
        type="submit"
        disabled={formIsDisabled}
        className={formIsDisabled ? styles.disabled : ""}
      >
        Valider
      </button>

      <div className={confirmationMessage.formIsSent ? "greenTxt" : "redTxt"}>
        {confirmationMessage.formIsSent !== undefined && (
          <FontAwesomeIcon
            icon={
              confirmationMessage.formIsSent ? faCircleCheck : faCircleXmark
            }
          />
        )}
        <p>{confirmationMessage.message}</p>
      </div>

      <p className="small">
        (*) Tous les champs sont obligatoires. Pour en savoir plus sur la
        protection de vos donn&eacute;es personnelles,{" "}
        <a href="https://www.cnil.fr/fr" target="_blank">
          consultez le site internet de la CNIL.{" "}
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
        </a>
      </p>
    </form>
  );
};

export default ContactForm;

const parseStyleToCSS = (customStyle) => {
  const response = {
    inputStyle: {},
    defaultButtonStyle: {},
    activeButtonStyle: {},
    inactiveButtonStyle: {},
  };

  response.inputStyle = {
    borderColor: customStyle.mainColor,
    fontFamily: customStyle.defaultFont
      .substring(0, customStyle.defaultFont.indexOf("("))
      .trim(),
  };

  response.activeButtonStyle = {
    borderColor: customStyle.mainColor,
    backgroundColor: customStyle.mainColor,
    color: customStyle.secondaryColor,
  };

  response.inactiveButtonStyle = {
    borderColor: customStyle.mainColor,
    color: customStyle.mainColor,
    backgroundColor: customStyle.secondaryColor,
  };

  return response;
};
