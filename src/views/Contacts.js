// CSS
import "./css/contacts.scss"

// React and other packages
import React, { useEffect, useRef } from "react";

// React-bootstrap components
import { Button, Form } from "react-bootstrap";

// Network services
import ContactService from "../services/contactService";
import MessageService from "../services/messageService";
import UserProfileService from "../services/userProfileService";

// Our components
import ContactCard from "../components/ContactCard" ;
import CreateMessageModal from "../components/CreateMessageModal";

// Contexts (global data)
import { UserContext } from "../contexts/User"

// ==============================================================================

export default function Contacts({viewCommon, changeUserProfileDisplay, changeConfirmationModalData}) {
	const contactService = new ContactService(viewCommon.net);
	const messageService = new MessageService(viewCommon.net);
	const userProfileService = new UserProfileService(viewCommon.net);

	const [ userDataState, userDataDispatch ] = React.useContext(UserContext) ;
	const contacts = userDataState.contacts ;
	const [ addContactUserName, changeAddContactUserName ] = React.useState("") ;
	const [ writingMessageTo, changeWritingMessageTo ] = React.useState(null) ;
	const [ isSendingMessage, changeIsSendingMessage ] = React.useState(false) ;

	const timerRef = useRef(null);

	// === Retrieve contacts ===
	function getContacts(isAuto = false) {
		contactService.retrieveContacts(isAuto).then((contacts) => {
			userDataDispatch({ type: "setContacts", data: contacts});
		}) ;
	}

	// Start/stop polling for updates to contacts list
	useEffect(() => {
		getContacts() ;
		timerRef.current = setInterval(() => getContacts(true), 10000);

		return () => {
			clearInterval(timerRef.current); // Stop update timer when user leaves the page
		} ;
	}, []);

	function handleSendMessage(userName) {
		changeWritingMessageTo(userName) ;
	}

	function handleCloseSendMessageModal() {
		changeWritingMessageTo(null) ;
	}

	function handleSendMessageSubmit({messageRecipient, messageSubject, messageContent}) {
		const messageData = {messageSubject, messageContent} ;
		changeIsSendingMessage(true) ;
		messageService.sendMessage(messageRecipient, messageData).finally(() => {
			changeWritingMessageTo(null) ;
			changeIsSendingMessage(false) ;
		}) ;
	}

	function handleSendContactRequest(e) {
		e.preventDefault() ;
		contactService.createRequest(addContactUserName).then(() => {
			changeConfirmationModalData({
				title: 'Contact Request',
				message: `Contact Request was successfully sent to ${addContactUserName}`
			}) ;
		}).finally(() => changeAddContactUserName("")) ;
	}

	function handleRemoveContact(userName) {
		contactService.removeContact(userName).then(() => {
			const newContactsData = contacts.filter((contact) => contact.userName !== userName) ;
			userDataDispatch({ type: "setContacts", data: newContactsData });
		}) ;
	}

	function handleDisplayProfile(userName) {
		userProfileService.getProfile(userName).then((data) => {
			changeUserProfileDisplay(data) ;
		}) ;
	}

	return (
		<>
			<div className="page-contacts">
				<h1 className="page-title">Contacts</h1>

				<Form id="form" className="d-flex p-3 justify-content-center" onSubmit={handleSendContactRequest}>
					<Form.Group controlId="add_contact_username">
						<Form.Control
						name="add_contact_username"
						value={addContactUserName}
						onChange={(e) => changeAddContactUserName(e.target.value)}
						placeholder="Contact Username" />
					</Form.Group>

					<Button variant="secondary" type="submit" disabled={!addContactUserName}>Add</Button>
				</Form>

				<div className="d-flex flex-wrap gap-2 justify-content-center">
				{
					contacts.map((contact) => 
						<ContactCard
							key={contact._id} data={contact} ///
							handleSendMessage={() => handleSendMessage(contact.userName)}
							handleRemoveContact={() => handleRemoveContact(contact.userName)}
							handleDisplayProfile={() => handleDisplayProfile(contact.userName)}
					/>)
				}
				</div>

				<CreateMessageModal
					contacts={contacts}
					writingMessageTo={writingMessageTo}
					inputsDisabled={isSendingMessage}
					handleClose={handleCloseSendMessageModal}
					handleSubmit={handleSendMessageSubmit}
				/>
			</div>
		</>
  )
}