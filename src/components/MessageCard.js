import "./css/messageCard.scss"
import { Button, Card } from "react-bootstrap";
import { getProfileImageUrl } from "../utils/image";
import { formatMonth, formatTime } from "../utils/utils";
import { useState } from "react";

export default function MessageCard({data: {sourceImageUrl, sourceUserName, messageSubject, messageSummary, messageContent, dateTime}, 
	id, getFullMessage, handleReplyToMessage, handleRemoveMessage, handleDisplayProfile}) {

	const [showFullMessage, changeShowFullMessage] = useState(false) ;

	let messageType ;
	if (showFullMessage && messageContent) messageType = 'full' ;
	else if (messageSummary.length <= 64) messageType = 'short' ;
	else messageType = 'truncated' ;

	const messageText = (messageType === 'full') ? messageContent : messageSummary ;

	function toggleSummary() {
		if (messageType === 'truncated' && !messageContent) getFullMessage() ;
		changeShowFullMessage(messageType !== 'full') ;
	}

  return (
    <Card id={id} className="component-message-card wide text-center">
			<Card.Body className="p-2">
				<div className="d-flex justify-content-between">
					<div className="d-flex align-items-center gap-2">
						<div className='message-card-image my-link-pointer' onClick={handleDisplayProfile}>
							<img src={getProfileImageUrl(sourceImageUrl)} alt="" />
						</div>
						<span className="fs-6">{sourceUserName}</span>
					</div>
					<div>
						{formatTime(dateTime)}
						{" "}
						{formatMonth(dateTime)}
					</div>
				</div>
				<Card.Text className='fs-3'>{messageSubject}</Card.Text>
				<Card.Text className="fs-6">{messageText}</Card.Text>
				{(messageType !== 'short') && <Button variant="outline-secondary" className="fs-3 my-ellipsis" onClick={toggleSummary}>&#8230;</Button>}
      </Card.Body>

			<Card.Footer className="d-flex justify-content-evenly">
				<Button onClick={handleReplyToMessage}>Reply</Button>
				<Button variant="danger" onClick={handleRemoveMessage}>Remove</Button>
			</Card.Footer>
    </Card>
  );
}