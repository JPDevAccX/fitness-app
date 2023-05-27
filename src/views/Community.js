import './css/community.scss'
import CommunityPosts from '../components/CommunityPosts'
import AddPostModal from '../components/AddPostModal'
import { Row, Col, Form, Button, Card } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import CommunityService from '../services/communityService'
import UserProfileService from '../services/userProfileService'
import { getProfileImageUrl } from '../utils/image'
import { ReactComponent as Message } from '../images/message.svg'
import { ReactComponent as Add } from '../images/plus.svg'
import MessageService from '../services/messageService'

function Community(props) {
    const [posts, changePosts] = useState([])
    const [user, changeUser] = useState()

    const communityService = new CommunityService(props.viewCommon.net);
		const userProfileService = new UserProfileService(props.viewCommon.net);
    const messageService = new MessageService(props.viewCommon.net);

    useEffect(() => {
        communityService.getCommunityPosts()
            .then(data => {
                changePosts(data)
            })
            .catch(error => {
                console.log(error)
            })
    }, [])

    const [show, setShow] = useState(false);

    const addPostHandler = () => {
        setShow(true)
    }

    const findUser = async (data) => {
        return await userProfileService.getProfile(data)
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        const data = e.target[0].value
        const userProfile = await findUser(data)
        changeUser(userProfile)
    }

    const sendmessage = async () => {
    }

    const displayUsercard = (user = null) => {
        if (user) {
            const url = getProfileImageUrl(user.imageUrl)
            return (
                <Card className='user-card'>
                    <Card.Img className='user-card-img' onClick={() => handleDisplayProfile(user.userName)} variant="top" src={url} />
                    <Card.Body>
                        <Card.Title className='user-card-username'>{user.userName}</Card.Title>
                        <Card.Text>
                        </Card.Text>
                        <div className='icons'>
                            <Message onClick={sendmessage} className='message-icon' />
                            <Add className='add-icon' />
                        </div>
                    </Card.Body>
                </Card>
            )
        }
    }

	function handleDisplayProfile(userName) {
		userProfileService.getProfile(userName).then((data) => {
			props.changeUserProfileDisplay(data) ;
		}) ;
	}

    return (
        <>
            <Row className='community-container'>
                <Col lg={5} className='community-left-panel'>
                    <div className='community-left-panel-wrapper'>
                        <Button onClick={addPostHandler} variant="primary" size="lg"> Create Post </Button>
                        <br />
                        <Form className='form-search' onSubmit={submitHandler}>
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Control type="text" placeholder="Search for users..." />
                            </Form.Group>
                            <Button className='search-btn' variant="primary" type="submit">Search</Button>
                        </Form>
                        {displayUsercard(user)}
                    </div>
                    <AddPostModal
                        show={show}
                        handleClose={() => setShow(false)}
                        posts={posts}
                        changePosts={changePosts}
                        viewCommon={props.viewCommon}
                    />
                </Col>
                <Col className='right-panel-wrapper' lg={6} >
                    <div className='community-right-panel'>
                        <CommunityPosts
                            viewCommon={props.viewCommon}
                            posts={posts}
                            changeCurrentPost={props.changeCurrentPost}
                            handleDisplayProfile={handleDisplayProfile}
                        />
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default Community