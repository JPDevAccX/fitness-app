import './css/postPage.scss'
import { useState, useEffect } from 'react'
import { ReactComponent as Heart } from '../images/redheart.svg'
import { ReactComponent as Comments } from '../images/comments.svg'
import { ReactComponent as LolFace } from '../images/lol2.svg'
import { Card, Button, Col, Row } from 'react-bootstrap';
import SingleComment from '../components/SingleComment'
import CommunityService from '../services/communityService'
import { formatTime, formatMonth } from '../utils/utils'
import { getProfileImageUrl } from '../utils/image'

function PostPage(props) {
		const [comments, changeComments] = useState([]);
		const [likeCounter, changeLikeCounter] = useState(0)
		const [lolCounter, changeLolCounter] = useState(0)
		const [commentCounter, changeCommentCounter] = useState(0)

    const url = getProfileImageUrl(props.currentPost.profileImg)

    const updateLikes = async () => {
        const likes = await communityService.getLikesCount(props.currentPost._id)
        changeLikeCounter(likes)
    }

    const updateLols = async () => {
        const lols = await communityService.getLolsCount(props.currentPost._id)
        changeLolCounter(lols)
    }

    const updateComments = async () => {
        const comments = await communityService.getCommentCount(props.currentPost._id)
        changeCommentCounter(comments)
    }

    useEffect(() => {
        updateLikes()
        updateLols()
        updateComments()
    }, [])

    useEffect(() => {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }, [])

    const likePost = async () => {
        await communityService.addLikeToPost(props.currentPost._id)
				updateLikes()
    }

    const lolPost = async () => {
        await communityService.addLolToPost(props.currentPost._id)
        updateLols()
    }

    const communityService = new CommunityService(props.viewCommon.net)

    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        communityService.getCommentsForPost(props.currentPost._id)
            .then(data => {
                changeComments(data)
            })
            .catch(error => {
                console.log(error)
            })
    }, [])

    const getComment = async (commentId) => {
        return await communityService.getCommentById(commentId);
    }

    const addCommentHandler = async () => {

        const text = document.getElementById('add-comm').value
        setInputValue('')

        try {
            const commentId = await communityService.addCommentToPost(props.currentPost._id, { text });
            const comment = await getComment(commentId)
            changeComments([...comments, comment]);
            updateComments()
        } catch (error) {
            console.log(error)
        }
    }

    const showComments = () => {
        return comments?.map((comment) =>
            <SingleComment
                key={comment._id}
                comment={comment}
            />
        )
    }

    return (
        <>
            <Row className='post-page-container'>
                <Col lg={6} className='post-page-left-panel'>
                    <Card style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Text>
                                <img className='post-page-user-image' src={url} alt='' />
                                <span className='username'>{props.currentPost.username}</span>
                                <span className='time'>{formatTime(props.currentPost.date)}</span>
                                {" "}
                                <span className='date'>{formatMonth(props.currentPost.date)}</span>
                            </Card.Text>
                            <Card.Img variant="top" src={props.currentPost.imageUrl} />
                            <Card.Title>{props.currentPost.title}</Card.Title>
                            <Card.Text>
                                {props.currentPost.description}
                            </Card.Text>
                            <div className='post-page-icons'>
                                <Heart onClick={likePost} className='heart' />
                                <span>{likeCounter} </span><span> </span>
                                <LolFace onClick={lolPost} className='lol' />
                                <span className='lol'>{lolCounter} </span><span> </span>
                                <Comments />
                                <span>{commentCounter} </span><span> </span>
                            </div>
                        </Card.Body>
                        <div className='add-comment'>
                            <input
                                id='add-comm'
                                className='comment-input'
                                type='text'
                                placeholder='Add a comment...'
                                value={inputValue}
                                onChange={(event) => setInputValue(event.target.value)}
                            />
                        </div>
                        <div className='bottom-wrapper'>
                            <Button onClick={addCommentHandler} className='btn-orange' variant="primary">Comment</Button>
                        </div>
                    </Card>
                </Col>
                <Col lg={6} className='post-page-right-panel'>
                    {showComments()}
                </Col>
            </Row>
        </>
    )
}

export default PostPage