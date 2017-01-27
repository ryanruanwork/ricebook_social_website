import Promise from 'bluebird'
import fetch from 'isomorphic-fetch'

const isLocal = false
export const apiUrl = isLocal ? 'http://localhost:3000' : 'https://shrouded-citadel-55552.herokuapp.com'

const Action = {

     ADD_ARTICLE: 'ADD_ARTICLE'
    ,UPDATE_ARTICLES: 'UPDATE_ARTICLES'
    ,EDIT_ARTICLE: 'EDIT_ARTICLE'
    ,SEARCH_KEYWORD: 'SEARCH_KEYWORD'
    ,UPDATE_AVATARS: 'UPDATE_AVATARS'

    ,UPDATE_HEADLINE: 'UPDATE_HEADLINE'
    ,UPDATE_PROFILE: 'UPDATE_PROFILE'

    ,FOLLOWER_UPDATE: 'FOLLOWER_UPDATE'

    ,ERROR: 'ERROR'
    ,SUCCESS: 'SUCCESS'

    ,NAV_PROFILE: 'NAV_PROFILE'
    ,NAV_MAIN: 'NAV_MAIN'
    ,NAV_OUT: 'NAV_OUT'

    ,LOGIN_LOCAL: 'LOGIN_LOCAL'

}

export default Action

export function updateError(error) { return { type: Action.ERROR, error }}
export function updateSuccess(success) { return { type: Action.SUCCESS, success }}
export function navToProfile() { return { type: Action.NAV_PROFILE }}
export function navToMain() { return { type: Action.NAV_MAIN }}
export function navToOut() { return { type: Action.NAV_OUT }}

export function resource(method, endpoint, payload, submitJson = true) {
    const options = {credentials: 'include', method}
    if (submitJson) options.headers = {'Content-Type': 'application/json'}
    if (payload) {
        options.body = submitJson ? JSON.stringify(payload) : payload
    }
    return fetch(`${apiUrl}/${endpoint}`, options)
    .then((response) => {
        if (response.status == 401) {
            const message = `Error in ${method} ${endpoint} ${JSON.stringify(response.json())}`
            throw new Error(message)
        } else {
            return response.json()
        }
    })
}

export function ErrorMsg(msg){
    return {type: Action.ERROR, errorMsg: msg};
}

export function SuccessMsg(msg){
    return {type: Action.SUCCESS, successMsg: msg};
}


/** WEBPACK FOOTER **
 ** ./src/actions.js
 **/