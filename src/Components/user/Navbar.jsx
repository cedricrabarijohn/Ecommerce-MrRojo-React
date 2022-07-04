import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { testSession } from '../../Helpers/Helper'
const Content = styled.div`
    *{
        display:block;
        margin:0;
        padding:0;
        color:white;
    }
    .barre{
        position:fixed;
        top:0;
        left:0;
        right:0;
        height:50px;
        background-color:black;
    }
    .logo{
        display:flex;
        position:fixed;
        top:10px;
        left:20px;
        font-size:25px;
        font-weight:bolder;
    }
    ul{
        list-style-type: none;
        display:flex;
        position:fixed;
        top:20px;
        right:75px;
    }
    ul li{
        font-size:.9em;
        margin-left:50px;
    }
    ul li .link{
        color: white;
    }
    .portefeuille:hover{
        cursor:pointer;
    }
    .hide{
        display:none;
    }
    .show{
        display:block;
    }
    .optionPortefeuille{
        
    }
`
const Navbar = () => {
    const DISPLAY = {
        HIDE: 'hide',
        SHOW: 'show'
    }
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [displayPortefeuille, setDisplayPortefeuille] = useState(DISPLAY.HIDE)
    const [montant, setMontant] = useState(0)
    useEffect(() => {
        if (testSession()) {
            const userId = localStorage.getItem("userId")
            fetch(`http://localhost:3001/utilisateur/${userId}`)
                .then(res => {
                    return res.json()
                })
                .then(data => {
                    setUser(data)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [])

    const handleChangeMontant = (e) => {
        setMontant(parseInt(e.target.value))
    }
    const handleValidateMontant = () => {
        fetch(`http://localhost:3001/utilisateur/portefeuille/demande/${user._id}`, {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                montant: montant
            })
        }).then(res => {
            return res.json()
        }).then(data => {
            if (data?.error) {
                alert("Failed.")
                return
            }
            window.location.reload()
        }).catch(err => {
            console.log(err)
        })

    }
    const handleDeconnexion = () => {
        localStorage.removeItem("userId")
        navigate("/login")
    }
    const handleDisplayPortefeuille = () => {
        if (displayPortefeuille === DISPLAY.HIDE) {
            setDisplayPortefeuille(DISPLAY.SHOW)
        } else if (displayPortefeuille === DISPLAY.SHOW) {
            setDisplayPortefeuille(DISPLAY.HIDE)
        } else {
            setDisplayPortefeuille(DISPLAY.HIDE)
        }
    }
    return (
        <Content>
            <div className="barre"></div>
            <nav className="navDesktop">
                <div className="logo">
                    <Link to="/">Shop</Link>
                </div>
                <ul>
                    <li><Link className="link" to="/">Accueil</Link></li>
                    <li><Link className="link" to="/inventaires">Inventaires / Produits</Link></li>
                    {testSession() ?
                        <li><Link className="link" to="/paniers">Paniers</Link></li>
                        :
                        <li><Link className="link" to="/guest/paniers">Paniers</Link></li>
                    }
                    {
                        user ?
                            <>
                                <li className="portefeuille" style={{ fontSize: '15px', borderRadius: '5px',padding: '0 20px 0 20px', backgroundColor: '#333' }}>
                                    <span onClick={handleDisplayPortefeuille}>Montant en portefeuille : {user.portefeuille.montant} Ar</span>
                                    <div className={`optionPortefeuille ${displayPortefeuille}`}>
                                        <br />
                                        <span style={{ fontSize: '17px' }}>Montant à ajouter : </span><p></p>
                                        <input style={{ color: 'black' }} onChange={handleChangeMontant} type="number" />
                                        <button onClick={handleValidateMontant} className="btn" style={{ fontWeight: 'bold', margin: '5px 0', color: 'black', width: "50%", textAlign: 'center' }}>
                                            Valider
                                        </button>
                                    </div>
                                </li>
                                <li>
                                    <p style={{ fontWeight:'bold',color: "red" }}>En attente de confirmation : {user.portefeuille.montantNonConfirme} Ar</p>
                                </li>
                                <li><button onClick={handleDeconnexion} style={{ padding: "0 10px 0 10px" }} className="btn btn-danger">
                                    Deconnexion
                                </button></li>
                            </>
                            :
                            <>
                                <li><Link style={{ padding: "0 10px 0 10px", fontSize: "1em" }} className="link btn btn-success" to="/login">Connexion</Link></li>
                            </>
                    }
                </ul>
            </nav>
        </Content>
    );
}

export default Navbar;