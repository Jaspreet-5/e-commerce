import { useState } from 'react';
import styles from './Form.module.css'
import useAuth from '../useAuth';

import { Link, useNavigate } from 'react-router-dom';

const LoginForm = () => {

    const {login , loading } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [response, setResponse] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setResponse("");

        try {
            await login({
                email,
                password
            })
            
            navigate('/' , {replace: true})
        }
        catch (err) {
            setResponse(err.message)
            console.log(err);
        }

    }

    return (
        <div className={styles.container}>

            <form className={styles.form} onSubmit={handleSubmit}>

                <h1>Login</h1>

                <div className={styles.formField}>

                    <label htmlFor="login">Email</label>
                    <input
                        className={styles.inputField}
                        type="email"
                        id='login'
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
                        loading ? "Logging in..." : "Login"
                    }
                </button>

            </form>

            <p>
                Don't have an Account?{""}
                <Link to={"/signup"}>
                    Signup
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

export default LoginForm;
