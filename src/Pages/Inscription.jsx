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
    const [nom, setNom] = useState(null)
    const [prenom, setPrenom] = useState(null)

    const handleChangePassword = (e) => {
        setPassword(e.target.value)
    }
    const handleSubmit = () => {
        fetch(`http://localhost:3001/utilisateur`, {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                nom: nom,
                prenom: prenom,
                motDePasse: password
            })
        }).then(res => {
            return res.json()
        }).then(data => {
            if (data) {
                alert('created successfully')
                navigate('/login')
            }
        })
    }
    const handleChangeNom = (e) => {
        setNom(e.target.value)
    }
    const handleChangePrenom = (e) => {
        setPrenom(e.target.value)
    }
    const handleSubmitLogginAdmin = () => {

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
            <div className={`login`}>
                <br />
                <table>
                    <thead>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ textAlign: 'center' }} colSpan={3}><h1>Inscription UTILISATEUR</h1></td>
                        </tr>
                        <tr>
                            <td>
                                Email :
                            </td>
                            <td>
                                <input onChange={handleChangeEmail} type="text" />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                nom :
                            </td>
                            <td>
                                <input onChange={handleChangeNom} type="text" />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                prenom :
                            </td>
                            <td>
                                <input onChange={handleChangePrenom} type="text" />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Password :
                            </td>
                            <td>
                                <input onChange={handleChangePassword} type="password" />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <button onClick={handleSubmit} style={{ width: '100%' }} className="btn btn-primary">Inscription</button>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <Link to="/login">
                                    Login
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
        </Container>
    );
}

export default Login;