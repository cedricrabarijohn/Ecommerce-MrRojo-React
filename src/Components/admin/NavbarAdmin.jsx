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
        background-color:blue;
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
    const navigate = useNavigate()
    const [users, setUsers] = useState(null)
    useEffect(() => {
        fetch(`http://localhost:3001/utilisateur`)
            .then(res => {
                return res.json()
            })
            .then(data => {
                setUsers(data)
                console.log(data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])
    const handleValidateMontant = () => {

    }
    const handleDeconnexion = () => {
        localStorage.removeItem("adminId")
        navigate("/login")
    }
    return (
        <Content>
            <div className="barre"></div>
            <nav className="navDesktop">
                <div className="logo">
                    <Link to="/admin">Shop</Link>
                </div>
                <ul>
                    <li><Link className="link" to="/admin">Accueil</Link></li>
                    <li><Link className="link" to="/admin/inventaires">Inventaires / Produits</Link></li>
                    <li>
                        <button style={{ padding: "0 20px 0 20px" }} onClick={handleDeconnexion} className="btn btn-danger">
                            Deconnexion
                        </button>
                    </li>
                </ul>
            </nav>
        </Content>
    );
}

export default Navbar;