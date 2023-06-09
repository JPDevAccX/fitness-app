import "./css/notificationCard.scss"
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { formatMonth, formatTime } from "../utils/utils";

export default function NotificationCard({data:
	{imageUrl, title, dateTime, msgMain, msgMainLink, msgSub, cssClassName, acceptCallback, dismissCallback},
	handleSourceImageClick}) {
	const navigate = useNavigate() ;

	function handleNavigation(link) {
		if (link) navigate(link) ;
	}

  return (
    <Card className={"component-notification half-width-lg text-center " + cssClassName}>
			<Card.Body className="p-2">
				<div className="d-flex justify-content-between">
					<div className="d-flex align-items-center gap-2">
						<div className={handleSourceImageClick ? 'notification-image my-link-pointer' : 'notification-image'} onClick={handleSourceImageClick}>
							<img src={imageUrl} alt="" />
						</div>
						<Card.Title className="fs-6">{title}</Card.Title>
					</div>
					<div>
						{formatTime(dateTime)}
						{" "}
						{formatMonth(dateTime)}
					</div>
				</div>

        <Card.Text onClick={() => handleNavigation(msgMainLink)} className={msgMainLink ? 'link-primary my-link-pointer fs-3' : 'fs-3'}>{msgMain}</Card.Text>
				<Card.Text className="fs-6">{msgSub}</Card.Text>
      </Card.Body>

		{(acceptCallback || dismissCallback) &&
			<Card.Footer className="d-flex justify-content-evenly">
				{acceptCallback && <Button onClick={acceptCallback}>Accept</Button>}
				{dismissCallback && <Button onClick={dismissCallback}>Dismiss</Button>}
			</Card.Footer>}
    </Card>
  );
}