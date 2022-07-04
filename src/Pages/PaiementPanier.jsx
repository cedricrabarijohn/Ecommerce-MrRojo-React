import styled from "@emotion/styled";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Components/user/Navbar"
import { testSession } from "../Helpers/Helper";

const Container = styled.div`
    *{
        font-size: 16px;
    }
    .content{
        display:grid;
        grid-template-columns: 50% auto;
    }
    .formulaire div{
        // margin-bottom: 20px;
    }
    
`

const PaiementPanier = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [total, setTotal] = useState(0)
    const { idPanier } = useParams()
    const [idUser, setIdUser] = useState(null)
    const [panier, setPanier] = useState(null)
    const [errPanier, setErrPanier] = useState(false)
    const [isLoadingPanier, setIsLoadingPanier] = useState(true)

    const [errPaiement, setErrPaiement] = useState(null)

    //Get the total
    useEffect(() => {
        const url = `http://localhost:3001/cart/montantAPayer/${idPanier}`
        fetch(url).then(res => {
            return res.json()
        }).then(data => {
            setTotal(data.total)
        })
    }, [idPanier])
    //Get the panier
    useEffect(() => {
        if (!testSession()) {
            navigate("/login");
            return
        }
        setIdUser(localStorage.getItem("userId"))
        const url = `http://localhost:3001/cart/${idPanier}`
        fetch(url, {
        })
            .then(res => {
                return res.json()
            })
            .then(data => {
                if (data.error) {
                    setErrPanier(true)
                    setIsLoadingPanier(false)
                } else {
                    setPanier(data)
                    setErrPanier(false)
                    setIsLoadingPanier(false)
                }
            }).catch(err => {
                setErrPanier(true)
                setIsLoadingPanier(false)
            })
    }, [idPanier, navigate]);
    useEffect(() => {
        const url2 = `http://localhost:3001/utilisateur/${localStorage.getItem("userId")}`
        fetch(url2).then(res => {
            return res.json()
        }).then(data => {
            setUser(data)
        }).catch(err => {
            console.log(err)
        })
    }, [idUser])

    const handlePaiement = () => {
        if (total >= user.portefeuille.montant) {
            setErrPaiement("Vous n'avez pas assez d'argent pour faire ce paiement !")
            return
        }
        else {
            const url = `http://localhost:3001/paiement`
            fetch(url, {
                method: "POST",
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    idUtilisateur: idUser,
                    cart: panier._id
                })
            }).then(res => {
                return res.json()
            }).then(data => {
                if(data.error){
                    alert(data.error.message)
                    return
                }
                alert("Paid successfully")
                window.location.reload()
            })
        }
    }
    return (
        <>
            <Navbar />
            <Container style={{ marginTop: '10%' }}>
                {isLoadingPanier && <>Loading ...</>}
                {errPanier && <span style={{ color: "red" }}>An error occured while fetching the datas...</span>}
                {panier &&
                    <>
                        <div className="content">
                            <div className="formulaire">
                                <h1 style={{ fontWeight: 'bold' }}><u>Paiement {panier.nom}</u></h1> id: {panier._id}
                                <br />
                                <p style={{ fontSize: '20px' }}> <u style={{fontWeight:'bold'}}>Montant dans votre portefeuille</u> :
                                    <span style={{ fontWeight: 'bold', color: 'green' }}>
                                        {user != null && user.portefeuille.montant} Ar
                                    </span></p>
                                <p>
                                    <button onClick={handlePaiement} style={{ width: "50%" }} className="btn btn-success">Payer</button>
                                </p>
                                {errPaiement &&
                                    <p style={{color:"red"}}>
                                        {errPaiement}
                                    </p>
                                }
                            </div>
                            <div className="previewPanier">
                                <h1 style={{fontWeight:"bold"}}>
                                    <u>Contenus du panier</u>
                                </h1>
                                <table>
                                    <thead></thead>
                                    <tbody>
                                        {Array.from(panier.inventaires, (inventaire, index) => {
                                            return (
                                                <tr key={index} className="inventaire">
                                                    <td>- {inventaire.nom}</td>
                                                    <td>x {inventaire.quantite}</td>
                                                    <td>Prix unitaire : {inventaire.prix} Ar</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                                <br />
                                <h2 style={{fontWeight:'bold'}}><u>Total à payer : </u></h2>
                                <span style={{ fontSize: '25px', color: 'red' }}>{total} Ar</span>
                            </div>
                        </div>
                    </>}
            </Container>
        </>
    );
}

export default PaiementPanier;