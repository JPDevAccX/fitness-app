import NetService from "../netService";

export default class CommunityService extends NetService {
    addCommunityPost(data) {
        return this.post('post', data);
    }

    getCommunityPosts() {
        return this.get('posts');
    }

    getCommentsForPost(postId) {
        return this.get(`comments/${postId}`);
    }

    addCommentToPost(postId, data) {
        return this.post(`comment/${postId}`, data);
    }

    getCommentById(CommentId) {
        return this.get(`comment/${CommentId}`);
    }

    getPostById(postId) {
        return this.get(`post/${postId}`);
    }

    getLikesCount(postId) {
        return this.get(`likes/${postId}`);
    }

    getLolsCount(postId) {
        return this.get(`lols/${postId}`);
    }

    getCommentCount(postId) {
        return this.get(`commentarray/${postId}`);
    }

    addLikeToPost(postId) {
        return this.post(`like/${postId}`, {});
    }

    addLolToPost(postId) {
        return this.post(`lol/${postId}`, {});
    }

		findUsers(searchArgs) {
			const url = 'findUsers/' +
				encodeURIComponent(searchArgs.userNameSubString || '_') + '/' +
				encodeURIComponent(searchArgs.userLocation || '_') + '/' +
				encodeURIComponent(searchArgs.userAge || '_') ;
			return this.get(url) ;
		}
}