import './css/communityPosts.scss'
import SinglePost from './SinglePost'

function CommunityPosts(props) {

    const showPosts = () => {

        return props.posts?.map((post) =>
            <SinglePost
                key={post._id}
								viewCommon={props.viewCommon}
                post={post}
                changeCurrentPost={props.changeCurrentPost}
                handleDisplayProfile={() => props.handleDisplayProfile(post.username)}
            />
        )
    }

    return (
        <>
            <div className='posts-wrapper'>
                {showPosts()}
            </div>
        </>
    )
}

export default CommunityPosts