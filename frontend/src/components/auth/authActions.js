import Action, { resource, updateError, updateSuccess, navToMain, navToOut, apiUrl } from '../../actions'

import { fetchFollowers } from '../main/followingActions'
import { fetchArticles } from '../article/articleActions'
import { fetchProfile, validateProfile } from '../profile/profileActions'

const fbRedirectUrl = 'https://shrouded-citadel-55552.herokuapp.com/login/facebook'
const ggredirectUrl = 'https://shrouded-citadel-55552.herokuapp.com/login/google'

export function initialVisit() {
    return (dispatch) => {
        // try to log in
        resource('GET', 'headlines').then((response) => {
            dispatch(navToMain())
            dispatch({type: Action.UPDATE_HEADLINE,
                username: response.headlines[0].username,
                headline: response.headlines[0].headline
            })
            dispatch(fetchProfile())
            dispatch(fetchFollowers())
            dispatch(fetchArticles())
        }).catch((err) => {
            // that's okay
        })
    }
}

export function localLogin(username, password) {
    return (dispatch) => {
        resource('POST', 'login', { username, password })
        .then((response) => {
            dispatch({type: Action.LOGIN_LOCAL, username: response.username})
            dispatch(initialVisit())
        }).catch((err) => {
            dispatch(updateError(`There was an error logging in as ${username}`))
        })
    }
}

export function fbLogin() {
    return (dispatch) => {
        window.top.location = fbRedirectUrl;
    }
}

export function ggLogin() {
    return (dispatch) => {
        window.top.location = ggredirectUrl;
    }
}

export function logout() {
    return (dispatch) => {
        resource('PUT', 'logout')
        .then(dispatch({type:'NAV_OUT'}))
        .catch((err) => {
            dispatch({type: Action.LOGIN_LOCAL, username: undefined})
            dispatch(navToOut())
        })
    }
}

export function register({username, email, phone, birth, zipcode, password, pwconf}) {
    return (dispatch) => {
        if (!username || !email || !phone || !birth || !zipcode || !password || !pwconf) {
            return dispatch(updateError('All fields must be supplied'))
        }

        const err = validateProfile({username, email, phone, birth, zipcode, password, pwconf})
        if (err.length > 0) {
            return dispatch(updateError(err))
        }

        resource('POST', 'register', {username, email, phone, birth, zipcode, password})
        .then((response) => {
            return dispatch(updateSuccess(`Success!  You create a user named "${response.username}". And you can login in now`))
        }).catch((err) => {
            return dispatch(updateError("There was an error registering, perhaps your username is already taken?"))
        })
    }
}



/** WEBPACK FOOTER **
 ** ./src/components/auth/authActions.js
 **/