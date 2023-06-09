// CSS
import "./css/messages.scss"

// React and other packages
import React, { useEffect, useRef } from "react";
import { useParams } from 'react-router';

// React-bootstrap components
import { Button } from "react-bootstrap";

// Network services
import ContactService from "../services/contactService";
import MessageService from "../services/messageService";
import UserProfileService from "../services/userProfileService";

// Our components
import MessageCard from "../components/MessageCard" ;
import CreateMessageModal from "../components/CreateMessageModal";

// Contexts (global data)
import { UserContext } from "../contexts/User"

// ==============================================================================

export default function Messages({viewCommon, changeUserProfileDisplay}) {
	let { id } = useParams();
	const hasScrolled = useRef(false) ;

	const contactService = new ContactService(viewCommon.net);
	const messageService = new MessageService(viewCommon.net);
	const userProfileService = new UserProfileService(viewCommon.net);

	const [ userDataState, userDataDispatch ] = React.useContext(UserContext) ;
	const contacts = userDataState.contacts ;
	const messageMetas = userDataState.messageMetas ;
	const [ writingMessageTo, changeWritingMessageTo ] = React.useState(null) ; // (null = not-writing, undefined = writing to any)
	const [ isSendingMessage, changeIsSendingMessage ] = React.useState(false) ;
	const [ messageContentTable, changeMessageContentTable ] = React.useState({}) ;

	const timerRef = useRef(null);

	// === Retrieve contacts and message metadata ===
	function getContacts(isAuto = false) {
		contactService.retrieveContacts(isAuto).then((contacts) => {
			userDataDispatch({ type: "setContacts", data: contacts});
		}) ;
	}
	function getMessageMetas(isAuto = false) {
		messageService.retrieveMessageMetas(isAuto).then((messageMetas) => {
			userDataDispatch({ type: "setMessageMetas", data: messageMetas});
		}) ;
	}

	useEffect(() => {
		// Scroll to the message if an ID was specified and we haven't already done so
		if (id && !hasScrolled.current) {
			// Schedule the scroll after React has a chance to render the element
			setTimeout(() => {
				if (document.getElementById(id)) {
					document.getElementById(id).scrollIntoView() ;
					hasScrolled.current = true ;
				}
			}, 0) ;
		}
	}, [messageMetas])

	// Start/stop polling for updates to contacts list
	useEffect(() => {
		getContacts() ;
		getMessageMetas() ;
		timerRef.current = setInterval(() => {
			getContacts(true) ;
			getMessageMetas(true) ;
		}, 10000);

		return () => {
			clearInterval(timerRef.current); // Stop update timer when user leaves the page
		} ;
	}, []);

	function sendMessageTo(userName) {
		changeWritingMessageTo(userName) ;
	}

	function handleRemoveMessage(messageId) {
		messageService.removeMessage(messageId).then(() => {
			const newMessageMetasData = messageMetas.filter((messageMeta) => messageMeta._id !== messageId) ;
			userDataDispatch({ type: "setMessageMetas", data: newMessageMetasData });
		}) ;
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

	function getFullMessage(messageId) {
		messageService.retrieveMessageContent(messageId).then((messageContent) => {
			changeMessageContentTable(state => ({...state, [messageId]: messageContent}))
		}) ;
	}

	function handleDisplayProfile(userName) {
		userProfileService.getProfile(userName).then((data) => {
			changeUserProfileDisplay(data) ;
		}) ;
	}

	return (
		<>
			<div className="page-messages">
				<h1 className="page-title">Messages</h1>
					<div className="my-compose-button-container text-center p-3">
						<Button variant="outline-primary" onClick={() => changeWritingMessageTo(undefined)}>Compose Message</Button>
					</div>

				<div className="my-messages">
				{
					messageMetas.map((messageMeta) => 
						<MessageCard
							key={messageMeta._id} id={messageMeta._id} data={{...messageMeta, messageContent: messageContentTable[messageMeta._id]}}
							getFullMessage={() => getFullMessage(messageMeta._id)}
							handleReplyToMessage={() => sendMessageTo(messageMeta.sourceUserName)}
							handleRemoveMessage={() => handleRemoveMessage(messageMeta._id)}
							handleDisplayProfile={() => handleDisplayProfile(messageMeta.sourceUserName)}
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