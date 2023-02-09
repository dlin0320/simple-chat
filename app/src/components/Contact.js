import React from "react"

function Contact({ contact, selectContact }) {
  function handleClick() {
    selectContact(contact)
  }

  return (
    <label onClick={handleClick}>{contact}</label>
  );
}

export default Contact;