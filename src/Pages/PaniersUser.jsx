import styled from "@emotion/styled";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/user/Navbar";
import { testSession } from "../Helpers/Helper";
const Container = styled.div`
    .container{
        // display:flex;
        // flex-flow: row-wrap;
    }
    .container .panier{
        margin:0 30px 30px 0;
        padding:30px;
        border: 1px solid black;
        border-radius: 10px;
    }
    .inventaires{
        padding: 10px;
    }
    .inventaire{
        display:grid;
        grid-template-columns: 30% 20% 30% 20%;
        border-top: 1px solid;
        margin-bottom:15px;
    }
    .recette{
        display:grid;
        grid-template-columns: 30% 20% 30% 20%;
        border-top: 1px solid;
        margin-bottom:15px;
    }
    .validerPanier{
        bottom:0;
    }
    .panier{
        min-width:450px;
    }
    .bouttonViderRecette:hover{
        cursor: pointer;
    }
    .detailsRecette div{
        display: grid;
        grid-template-columns: 90% 10%;
    }
    .nomInventaire{
        font-size: 20px;
    }
`
const PaniersUser = () => {
    const navigate = useNavigate()
    const [idUser, setIdUser] = useState(null)

    const [paniers, setPaniers] = useState(null)
    const [isLoadingPaniers, setIsLoadingPaniers] = useState(true)
    const [errPaniers, setErrPaniers] = useState(false)

    const [montantTotalAPayer, setMontantTotalAPayer] = useState(0)

    useEffect(() => {
        if (!testSession()) {
            navigate("/login")
            return
        }
        setIdUser(localStorage.getItem("userId"))
    }, [navigate])

    useEffect(() => {
        const url = `http://localhost:3001/cart/user/${idUser}`
        fetch(url, {})
            .then(res => {
                return res.json()
            })
            .then(data => {
                if (data.error) {
                    setErrPaniers(true)
                    setIsLoadingPaniers(false)
                } else {
                    setPaniers(data)
                    setErrPaniers(false)
                    setIsLoadingPaniers(false)
                }
            })
            .catch(err => {
                setIsLoadingPaniers(false)
                setErrPaniers(true)
            })
    }, [idUser])

    const getMontantAPayer = (idCart) => {
        const url = `http://localhost:3001/cart/montantAPayer/${idCart}`
        fetch(url).then(res => {
            return res.json()
        }).then(data => {
            return data.total
        })
    }

    useEffect(() => {

    }, [])

    const handleRemoveInventaire = (panier, idInventaire) => {
        // console.log(panier)
        const inventaires = panier.inventaires
        let newInventaires = Array.from(inventaires).filter(inv => {
            return inv._id !== idInventaire
        })
        let newPanier = panier
        newPanier.inventaires = newInventaires

        fetch(`http://localhost:3001/cart/redoAndChange`, {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                cart: newPanier
            })
        }).then(res => {
            return res.json()
        }).then(data => {
            console.log(data)
            window.location.reload()
        }).catch(err => {
            console.log(err)
        })
    }
    const handleViderRecette = (panier) => {
        fetch(`http://localhost:3001/cart/clearRecettes/${panier._id}`, {
            method: "DELETE"
        })
            .then(res => {
                return res.json()
            })
            .then(data => {
                console.log(data)
                window.location.reload()
            })
            .catch(err => {
                console.log(err)
            })
    }
    const handlePaiement = (idPanier) => {
        navigate(`/PaiementPanier/${idPanier}`)
    }

    return (
        <>
            <Navbar />
            <Container style={{ marginTop: '5%' }}>
                {isLoadingPaniers && <>Loading ...</>}
                {errPaniers && <span style={{ color: 'red' }}>An error occured while fetching the datas ... </span>}
                <div className="container">
                    {paniers && paniers.length <= 0 &&
                        <h1>
                            Aucun panier ..
                        </h1>
                    }
                    {paniers && paniers.length > 0 &&
                        paniers.map((panier, index) => (
                            <div className="panier" key={index}>
                                <h1 style={{ fontWeight: 'bold' }}>{panier.nom}</h1>
                                <div>
                                    id: {panier._id}
                                </div>
                                <div>
                                    <u>Nombre de produits</u>: x {panier.quantite}
                                </div>
                                <br />
                                <u style={{ fontSize: '17px', fontWeight: "bold" }}>
                                    Inventaires
                                </u>:
                                <div className="inventaires">
                                    {Array.from(panier.inventaires).map((inventaire, index) => (
                                        <div key={index} className="inventaire">
                                            <div className="nomInventaire">
                                                - {inventaire.nom}
                                            </div>
                                            <div className="quantiteInventaire">
                                                x {inventaire.quantite}
                                            </div>
                                            <div className="prixInventaire">
                                                PU: <span style={{ fontWeight: 'bolder' }}>{inventaire.prix} Ar</span>
                                            </div>
                                            <div>
                                                <button onClick={() => { handleRemoveInventaire(panier, inventaire._id) }} className="btn btn-danger">Remove</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <br />
                                <div>
                                    <u style={{ fontSize: '20px', fontWeight: "bold" }}>Recettes :</u> <button onClick={() => { handleViderRecette(panier) }} className="bouttonViderRecette">Vider</button>
                                    <br />
                                    <br />
                                    <div className="recettes">
                                        {Array.from(panier.recettes).map((recette, index) => (
                                            <div key={index} className="">
                                                <div className="recette">
                                                    <div style={{ fontSize: '17px', fontWeight: 'bold' }} className="nomRecette">
                                                        . {recette.nom} :
                                                    </div>
                                                    <div style={{ fontSize: '20px' }} className="quantite">
                                                        x {recette.quantite}
                                                    </div>
                                                    <div className="prixUnitaire">
                                                        PU: <span style={{ fontWeight: 'bolder' }}>{recette.prixUnitaire} Ar</span>
                                                    </div>
                                                </div>
                                                <div className="detailsRecette" style={{ marginLeft: '25px' }}>
                                                    <div>
                                                        <div>
                                                            - Valeur unitaire :
                                                        </div>
                                                        <div>
                                                            <b>{recette.valeurUnitaire} {recette.uniteDeValeur}</b>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div>
                                                            - Utilisé :
                                                        </div>
                                                        <div>
                                                            <b style={{ color: 'green' }}>{recette.valeurUtilisee} {recette.uniteDeValeur}</b>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div>
                                                            - Non utilisé :
                                                        </div>
                                                        <div>
                                                            <b style={{ color: 'red' }}>{recette.valeurNonUtilisee} {recette.uniteDeValeur}</b>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div>
                                                            - Valeur totale :
                                                        </div>
                                                        <div>
                                                            <b>{recette.valeurTotal} {recette.uniteDeValeur}</b>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* <div>
                                    <u style={{ fontSize: '20px', fontWeight: "bold" }}>Total à payer</u>
                                    <br />
                                    <span style={{ fontWeight: 'bold', fontSize: '25px' }}>{getMontantAPayer(panier._id)} Ar</span>
                                </div> */}
                                <br />
                                <div className="payementPanier">
                                    <button onClick={() => {
                                        handlePaiement(panier._id)
                                    }} className="btn" style={{ backgroundColor: "#333", color: 'white' }}>Proceder au paiement</button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </Container>
        </>
    );
}

export default PaniersUser;