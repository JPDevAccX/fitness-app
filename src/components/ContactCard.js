import "./css/contactCard.scss"
import { Button, Card } from "react-bootstrap";
import { getProfileImageUrl } from "../utils/image";

export default function ContactCard({data: {imageUrl, userName}, handleSendMessage, handleRemoveContact, handleDisplayProfile}) {
  return (
    <Card className="component-contact-card half-width-lg text-center">
			<Card.Body className="p-2">
				<div className="d-flex align-items-center gap-2">
					<div className={'contact-card-image my-link-pointer'} onClick={handleDisplayProfile}>
						<img src={getProfileImageUrl(imageUrl)} alt="" />
					</div>
					<Card.Title className="fs-6">{userName}</Card.Title>
				</div>
      </Card.Body>

			<Card.Footer className="d-flex justify-content-evenly">
				<Button variant="primary" onClick={handleSendMessage}>Send Message</Button>
				<Button variant="danger" onClick={handleRemoveContact}>Remove</Button>
			</Card.Footer>
    </Card>
  );
}