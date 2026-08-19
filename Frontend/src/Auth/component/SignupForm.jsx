// import React from 'react'
import styles from './Form.module.css'
import { signup } from '../auth.api'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const SignupForm = () => {

    const [username, setusername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [response, setResponse] = useState("")
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setResponse("");

        let data;
        try {
            data = await signup({
                username,
                email,
                password
            })

            setResponse(data.message);
            
        }
        catch (err) {
            // console.log(err , data);
            setResponse(err.message)
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.container}>

            <form className={styles.form} onSubmit={handleSubmit}>

                <h1>SignUp</h1>

                <div className={styles.formField}>
                    <label htmlFor="username">Username</label>
                    <input
                        className={styles.inputField}
                        type="text"
                        name="username"
                        id="username"
                        placeholder='Username'
                        required
                        value={username}
                        onChange={(event) => setusername(event.target.value)} />
                </div>

                <div className={styles.formField}>

                    <label htmlFor="email">Email</label>
                    <input
                        className={styles.inputField}
                        type="email"
                        id='email'
                        name='email'
                        placeholder='Email'
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required />
                </div>

                <div className={styles.formField}>

                    <label htmlFor="password">Password</label>
                    <input
                        className={styles.inputField}
                        type="password"
                        id='password'
                        name='password'
                        placeholder='Password'
                        value={password}
                        required
                        onChange={(event) => setPassword(event.target.value)} />
                </div>

                <button
                    className={styles.button}
                    type='submit'
                    disabled={loading}>
                    {
                        loading ? "Creating Account..." : "Sign Up"
                    }
                </button>

            </form>

            <p>
                Already have an Account?
                <Link to={"/login"}>
                    Login
                </Link>

            </p>
            <h1 className={styles.response}>
                {
                    response
                }
            </h1>

        </div>
    )
}

export default SignupForm
