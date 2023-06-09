import { Modal, Button, Form } from 'react-bootstrap'
import CommunityService from '../services/communityService'

export default function AddPostModal(props) {

    const communityService = new CommunityService(props.viewCommon.net)

    const getPost = async (postId) => {
        return await communityService.getPostById(postId);
    }

    const addCommunityPost = async (data) => {

        try {

            const postId = await communityService.addCommunityPost(data)
            const post = await getPost(postId)
            props.changePosts([...props.posts, post])
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            title: document.getElementById('exampleForm.ControlTextarea1').value,
            description: document.getElementById('exampleForm.ControlTextarea2').value,
            imageUrl: document.getElementById('exampleForm.ControlTextarea3').value
        }
        addCommunityPost(data)
        props.handleClose();
    }

    return (
        <Modal className='post-modal' show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add a post</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control as="textarea" rows={2} placeholder="Header of the post" />
                    </Form.Group>
                    <br />
                    <Form.Group controlId="exampleForm.ControlTextarea2">
                        <Form.Control as="textarea" rows={5} placeholder="This is where you write" />
                    </Form.Group>
                    <br />
                    <Form.Group controlId="exampleForm.ControlTextarea3">
                        <Form.Control type="text" placeholder="Image URL" />
                        <br />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Close
                </Button>
                <Button className='orange-button' variant="primary" onClick={handleSubmit}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    )
}