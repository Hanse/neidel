import { Post } from './types';
import fetchJSON from '../utils/fetchJSON';

const url = 'http://localhost:3000/api';

export function fetchPosts(path) {
  return (dispatch, getState) => {
    dispatch({ type: Post.FETCH_BEGIN });
    return fetchJSON(`${url}/posts${path}`, {
      headers: {
        plebtoken: getState().auth.get('token') || ''
      }
    }).then(
        result => dispatch({ type: Post.FETCH_SUCCESS, posts: result.posts }),
        error => dispatch({ type: Post.FETCH_FAILURE, error })
      );
  };
}

export function savePost(message) {
  return (dispatch, getState) => {
    if (!message) return;
    dispatch({ type: Post.SAVE_BEGIN, message });

    fetchJSON(`${url}/posts`, {
      method: 'post',
      headers: {
        plebtoken: getState().auth.get('token') || '',
      },
      body: JSON.stringify({
        message,
        location: getState().auth.getIn(['locations', getState().auth.get('currentLocation')]).toJS()
      })
    }).then(
        result => (
          dispatch(fetchPosts(getState().router.location.pathname)),
          dispatch({ type: Post.SAVE_SUCCESS, result })
        ),
        error => dispatch({ type: Post.SAVE_FAILURE, error })
      );
  };
}

export function upvote(postId) {
  return (dispatch) => {
    dispatch({ type: Post.UPVOTE_BEGIN, postId });
    return fetchJSON(`${url}/posts/${postId}/upvote`, { method: 'post' })
      .then(
        () => dispatch({ type: Post.UPVOTE_SUCCESS, postId }),
        error => dispatch({ type: Post.UPVOTE_FAILURE, error })
      );
  };
}

export function downvote(postId) {
  return (dispatch) => {
    dispatch({ type: Post.DOWNVOTE_BEGIN, postId });
    return fetchJSON(`${url}/posts/${postId}/downvote`, { method: 'post' })
      .then(
        () => dispatch({ type: Post.DOWNVOTE_SUCCESS, postId }),
        error => dispatch({ type: Post.DOWNVOTE_FAILURE, error })
      );
  };
}

export function kill() {}
export function star() {}
