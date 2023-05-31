import './css/community.scss'
import CommunityPostCards from '../components/CommunityPostCards'
import CreateMessageModal from '../components/CreateMessageModal'
import AddPostModal from '../components/AddPostModal'
import { Row, Col, Form, Button, Card } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import CommunityService from '../services/communityService'
import UserProfileService from '../services/userProfileService'
import { getProfileImageUrl } from '../utils/image'
import { ReactComponent as Message } from '../images/message.svg'
import { ReactComponent as Add } from '../images/plus.svg'
import ContactService from "../services/contactService";
import MessageService from '../services/messageService'
import Select from '../components/Select'

// Data
import locationOpts from "../data/geoRegions.json" ;

function Community(props) {
	const [posts, changePosts] = useState([])
	const [userSearchResults, changeUserSearchResults] = useState([])
	const [writingMessageTo, changeWritingMessageTo] = useState(null) ; // (null = not-writing, undefined = writing to any)
	const [isSendingMessage, changeIsSendingMessage] = useState(false) ;

	const communityService = new CommunityService(props.viewCommon.net);
	const userProfileService = new UserProfileService(props.viewCommon.net);
	const contactService = new ContactService(props.viewCommon.net);
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

	// User-search form fields
	const [formValues, changeFormValues] = useState({
		userNameSubString: "",
		userLocation: ""
	});

	const addPostHandler = () => {
		setShow(true)
	}

	function handleUserSearchFieldChange(e) {
		const newFormValues = {...formValues, [e.target.name]: e.target.value} ;
		changeFormValues(newFormValues) ;
		changeUserSearchResults([]) ;
		
		if (newFormValues.userNameSubString.length > 0 && newFormValues.userNameSubString.length < 3) return ;
		if (newFormValues.userNameSubString === "" && newFormValues.userLocation === "") return ;

		handleUserSearch(newFormValues.userNameSubString, newFormValues.userLocation) ;
	}

	const handleUserSearch = async (userNameSubString, userLocation) => {
		const searchResults = await communityService.findUsers({userNameSubString, userLocation}) ;
		changeUserSearchResults(searchResults) ;
	}

	function handleSendContactRequest(addContactUserName) {
		contactService.createRequest(addContactUserName).then(() => {
			const newUserSearchResults = userSearchResults.map((user) => 
				(user.userName === addContactUserName) ? {...user, isPendingContact: true} : user) ;
			changeUserSearchResults(newUserSearchResults) ;
			props.changeConfirmationModalData({
				title: 'Contact Request',
				message: `Contact Request was successfully sent to ${addContactUserName}`
			}) ;
		}) ;
	}

	function sendMessageTo(userName) {
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

	const displayUserSearchResults = () => {
		return userSearchResults.map((user) => {
			const url = getProfileImageUrl(user.imageUrl)
			return (
				<Card className='user-card' key={user.userName}>
					<Card.Img className='user-card-img' onClick={() => handleDisplayProfile(user.userName)} variant="top" src={url} />
					<Card.Body>
						<Card.Title className='user-card-username'>{user.userName}</Card.Title>
						<Card.Text>
						</Card.Text>
						<div className='icons'>
						{(user.isContact && user.userName !== props.currentUserName) && 
							<Message onClick={() => sendMessageTo(user.userName)} className='message-icon' />
						}
						{(!user.isContact && user.userName !== props.currentUserName) && 
							<Add onClick={() => handleSendContactRequest(user.userName)}
							 	className={'add-icon ' + ((user.isPendingContact) ? 'my-svg-disabled' : '')}
							/>
						}
						</div>
					</Card.Body>
				</Card>
			)
		});
	}

	function handleDisplayProfile(userName) {
		userProfileService.getProfile(userName).then((data) => {
			props.changeUserProfileDisplay(data);
		});
	}

	locationOpts[0] = {"value": "", "displayName": "- Any Location -"} ;

	return (
		<>
			<CreateMessageModal
				writingMessageTo={writingMessageTo}
				inputsDisabled={isSendingMessage}
				handleClose={handleCloseSendMessageModal}
				handleSubmit={handleSendMessageSubmit}
			/>

			<Row className='community-container'>
				<Col lg={6} className='community-left-panel'>
					<h2>User Search</h2>
					<Form id="user_search_form" className='form-search'>
						<Form.Control
							name="userNameSubString"
							placeholder="Username"
							className="mb-1"
							onChange={handleUserSearchFieldChange}
							isInvalid={formValues.userNameSubString.length > 0 && formValues.userNameSubString.length < 3}
						/>
						<Select id='userLocation' opts={locationOpts} onChange={handleUserSearchFieldChange} />
					</Form>
					<div className="user-cards">
						{displayUserSearchResults()}
					</div>

					<AddPostModal
						show={show}
						handleClose={() => setShow(false)}
						posts={posts}
						changePosts={changePosts}
						viewCommon={props.viewCommon}
					/>
				</Col>

				<Col className='community-right-panel'>
					<Button onClick={addPostHandler} variant="primary" size="lg" className="m-auto mb-4"> Create Post </Button>
					<CommunityPostCards
						viewCommon={props.viewCommon}
						posts={posts}
						changeCurrentPost={props.changeCurrentPost}
						handleDisplayProfile={handleDisplayProfile}
					/>
				</Col>
			</Row>
		</>
	)
}

export default Community