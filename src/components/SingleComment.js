import '../views/css/comment.scss'
import { Card } from 'react-bootstrap'
import { formatTime, formatMonth } from '../utils/utils'
import { getProfileImageUrl } from '../utils/image'

function SingleComment(props) {

    const url = getProfileImageUrl(props.comment.profileImg)

    return (
        <Card className='comment-card'>
            <img className='comment-card-image my-cursor-pointer' src={url} onClick={props.handleDisplayProfile}></img>
            <Card.Body className='comment-body'>
                <Card.Title>
                    <span className='username'>{props.comment.username}</span>
                    {" "}
                    <span className='time'>{formatTime(props.comment.date)}</span>
                    {" "}
                    <span className='date'>{formatMonth(props.comment.date)}</span>
                </Card.Title>
                <Card.Text className='comment-text'>
                    {props.comment.text}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default SingleComment