import { Card, Button } from 'react-bootstrap'
import { ReactComponent as Heart } from "../images/redheart.svg"
import { ReactComponent as Comments } from "../images/comments.svg"
import { ReactComponent as LolFace } from "../images/lol2.svg"
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import CommunityService from '../services/communityService'
import UserProfileService from '../services/userProfileService'
import { getProfileImageUrl } from '../utils/image'

function SinglePost(props) {

    const url = getProfileImageUrl(props.post.profileImg)

    const [likeCounter, changeLikeCounter] = useState(0)
    const [lolCounter, changeLolCounter] = useState(0)
    const [commentCounter, changeCommentCounter] = useState(0)


    const communityService = new CommunityService(props.viewCommon.net);
		const userProfileService = new UserProfileService(props.viewCommon.net);

    const updateLikes = async () => {
        const likes = await communityService.getLikesCount(props.post._id)
        changeLikeCounter(likes)
    }

    const updateLols = async () => {
        const lols = await communityService.getLolsCount(props.post._id)
        changeLolCounter(lols)
    }

    const updateComments = async () => {
        const comments = await communityService.getCommentCount(props.post._id)
        changeCommentCounter(comments)
    }

    useEffect(() => {
        const updateThings = () => {
            updateLikes()
            updateLols()
            updateComments()
        }
        updateThings()
    }, [])

    const likePost = async () => {
        await communityService.addLikeToPost(props.post._id)
        updateLikes()
    }

    const lolPost = async () => {
        await communityService.addLolToPost(props.post._id)
				updateLols()
    }

    const navigate = useNavigate();

		const handleCardClick = (e) => {
			// Ignore clicks that were on a child element
			if (e.target === e.currentTarget) navigateToPostView() ;
		}

    const navigateToPostView = () => {
        props.changeCurrentPost(props.post)
        navigate(`/postview`)
    }
    return (
        <>
            <Card className='post-card'>
                <Card.Body className='post-card-body' onClick={handleCardClick}>
                    <img onClick={props.handleDisplayProfile} className='post-card-image' src={url}></img>
                    <div className='post-username'>
                        <Card.Title className="my-cursor-pointer" onClick={props.handleDisplayProfile}>{props.post.username}</Card.Title>
                        <Card.Text onClick={handleCardClick}>{props.post.title}</Card.Text>
                    </div>
                    <div className='post-icon-wrapper' >
                        <div className='post-card-icons'>
                            <Heart onClick={likePost} className='heart' />
                            <LolFace onClick={lolPost} className='lol' />
                            <Comments className='comments' />
                        </div>
                        <div className='post-card-numbers'>
                            <label className='likes-count'>{likeCounter}</label>
                            <label className='lols-count'>{lolCounter}</label>
                            <label className='comments-count'>{commentCounter}</label>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </>
    )
}

export default SinglePost