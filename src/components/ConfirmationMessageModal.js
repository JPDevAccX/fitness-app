import { Modal, Button } from 'react-bootstrap'

export default function ConfirmationMessageModal({data, handleClose}) {
	return (
		<Modal show={data} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>{data?.title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>{data?.message}</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	)
}