import React from 'react'
import Axios from "axios"
import { useEffect, useState } from 'react'
const SignUp = () => {
    const [email, setEmail] = useState('')
    const [userName, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const signup = () => {
        Axios.post('http://localhost:3001/api/signup', {
            email: email,
            username: userName,
            password: password
        }).then(() => {
            alert('signup worked')
        })
    }
    return (
        <div>
        <div className="form">
            <h3>Register Into Your Account </h3>
            <form action="">

                <p>
                    <label htmlFor="email">Enter Email Address:</label>
                </p>
                <input type="email" id="email" onChange={(e) => {
                    setEmail(e.target.value)
                }} required />
                <p>
                    <label htmlFor="user">Enter Username: </label>
                </p>
                <input type="text" id="user" onChange={(e) => {
                    setUsername(e.target.value)
                }} required />

                <p>
                    <label htmlFor="pass">Enter Password: </label>
                </p>
                <input type="password" id="pass" onChange={(e) => {
                    setPassword(e.target.value)
                }} required />

                <p>
                    <button onClick={signup}>Sign Up</button>
                </p>
            </form>
            </div>
        </div>
    )
}

export default SignUp

