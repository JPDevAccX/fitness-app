import { Modal } from 'react-bootstrap'
import ProfileInfo from './ProfileInfo'

export default function ProfileModal(props) {

	return (
		<Modal
			size="lg"
			show={props.show}
			onHide={() => props.onHide(false)}
			aria-labelledby="example-modal-sizes-title-lg"
		>
			<Modal.Header closeButton>
				{/* (url below relies on us using hashrouter!) */}
				<a href={`/#/showProfile/${props.userProfile?.userName}`} target="_blank" rel="noreferrer">
					<Modal.Title id="example-modal-sizes-title-lg">
						{props.userProfile?.userName}
					</Modal.Title>
				</a>
			</Modal.Header>
			<Modal.Body>
				<ProfileInfo userProfile={props.userProfile} />
			</Modal.Body>
		</Modal>
	)
}