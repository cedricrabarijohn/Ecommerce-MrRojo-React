import styled from "@emotion/styled";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Container = styled.div`
    .login{
        // min-height:100vh;
        display:flex;
        flex-flow:column;
        justify-content:center;
        align-items:center;
    }
    .login table{
        margin-left:auto;
        margin-right:auto;
    }
    table tr td{
        padding: 10px;
    }
    .hide{
        display:none;
    }
    .show{
        display: block;
    }
`
const Login = () => {
    const DISPLAY = {
        SHOW: 'show',
        HIDE: 'hide'
    }

    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(false)
    const handleChangeEmail = (e) => {
        setEmail(e.target.value)
    }
    const [display, setDisplay] = useState(DISPLAY.SHOW)
    const [displayAdmin, setDisplayAdmin] = useState(DISPLAY.HIDE)

    const handleChangePassword = (e) => {
        setPassword(e.target.value)
    }
    const handleSubmit = () => {
        fetch(`http://localhost:3001/utilisateur/login`, {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                motDePasse: password
            })
        }).then(res => {
            return res.json()
        }).then(data => {
            if (!data.error) {
                setError(false)
                localStorage.setItem("userId", data._id);
                navigate("/");
            }else{
                setError(true)
            }
        }).catch(err=>{
            setError(err.message)
        })
    }
    const handleSubmitLogginAdmin = () => {
        if (email === 'admin@gmail.com' && password === '1234') {
            setError(false)
            localStorage.setItem("adminId", "62b07aea65ca43d9411ed663");
            navigate("/admin");
        }
        else {
            setError(true);
        }
    }
    const handleToggleLogin = () => {
        if (display === DISPLAY.SHOW) {
            setDisplay(DISPLAY.HIDE)
            setDisplayAdmin(DISPLAY.SHOW)
        }
        else if (display === DISPLAY.HIDE) {
            setDisplay(DISPLAY.SHOW)
            setDisplayAdmin(DISPLAY.HIDE)
        }
        else {
            setDisplay(DISPLAY.SHOW)
            setDisplayAdmin(DISPLAY.HIDE)
        }
    }
    return (
        <Container>
            <div className={`login ${display}`}>
                <br />
                <table>
                    <thead>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ textAlign: 'center' }} colSpan={3}><h1>Login UTILISATEUR</h1></td>
                        </tr>
                        <tr>
                            <td>
                                Email :
                            </td>
                            <td>
                                <input placeholder="cedric@gmail.com" onChange={handleChangeEmail} type="text" />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Password :
                            </td>
                            <td>
                                <input placeholder="1234" onChange={handleChangePassword} type="password" />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <button onClick={handleSubmit} style={{ width: '100%' }} className="btn btn-primary">Se connecter</button>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <button className="btn btn-primary" onClick={handleToggleLogin} style={{ backgroundColor: "#333", textAlign: 'center', color: 'white', width: '100%' }}>
                                    En tant qu'admin
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <Link to="/inscription">
                                    Inscription
                                </Link>
                            </td>
                        </tr>
                        {error &&
                            <tr>
                                <td colSpan={2}>
                                    <span style={{ color: 'red' }}>Email and password don't match</span>
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
            <div className={`login ${displayAdmin}`}>
                <br />
                <table>
                    <thead>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ textAlign: 'center' }} colSpan={3}><h1>Login ADMIN</h1></td>
                        </tr>
                        <tr>
                            <td>
                                Email :
                            </td>
                            <td>
                                <input placeholder="admin@gmail.com" onChange={handleChangeEmail} type="text" />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Password :
                            </td>
                            <td>
                                <input placeholder="1234" onChange={handleChangePassword} type="password" />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <button onClick={handleSubmitLogginAdmin} style={{ width: '100%' }} className="btn btn-primary">Se connecter</button>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <button className="btn btn-primary" onClick={handleToggleLogin} style={{ backgroundColor: "#333", textAlign: 'center', color: 'white', width: '100%' }}>
                                    En tant qu'utilisateur
                                </button>
                            </td>
                        </tr>
                        {error &&
                            <tr>
                                <td colSpan={2}>
                                    <span style={{ color: 'red' }}>Email and password don't match</span>
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </Container>
    );
}

export default Login;