import React from "react";
import Contact from "./Contact";

function ContactList({ contacts, selectContact }) {
  return (
    contacts.map((contact) => {
        return <Contact key={contact} contact={contact} selectContact={selectContact}/>
    })
  );
}

export default ContactList;