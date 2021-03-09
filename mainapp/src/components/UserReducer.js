import React, { useReducer } from 'react'


const reducer = (state, action) => {
    switch (action.type) {
        case 'logout':
            return {username: 'Guest', is_authenticated: false};
        case 'login':
            return action
        case 'create':
            return action
        default:
            throw new Error();
    }
}

const userReducer = (state) => useReducer(reducer, state)






export default userReducer