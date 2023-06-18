import React from 'react'
import Axios from "axios"
import { useEffect, useState } from 'react'

const LoginForm = () => {
    const [userName, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const login = () => {
        Axios.post('http://localhost:3001/api/login', {
            username: userName,
            password: password
        }).then(() => {
            alert('login worked')
        })
    }

    //Trying to get user information in the database by making API request to the backend. NOT WORKING YET
    const validate = () => {
        Axios.get('http://localhost:3001/api/content').then((response) => {
            console.log(response)
        })
    }
    return (
        <div>
        <div class="form">
            <h3>Login To Your Account</h3>
            <form action="search">
                <p>
                    <label htmlFor="user">Enter Username: </label>
                </p>
                <input type="text" id="user" onChange={(e) => {
                        setUsername(e.target.value)
                    }} />

                <p>
                    <label htmlFor="pass">Enter Password: </label>
                </p>
                <input type="password" id="pass" onChange={(e) => {
                        setPassword(e.target.value)
                    }} />

                <p>
                    <button onClick={() => { login(); validate() }}>Login</button>
                </p>
            </form>
            </div>
        </div>
    )
}

export default LoginForm
