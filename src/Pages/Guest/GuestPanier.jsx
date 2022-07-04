import styled from "@emotion/styled";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/user/Navbar";
import { testSession } from "../../Helpers/Helper";
const Container = styled.div`
    .container{
        display:flex;
    }
    .container .panier{
        margin:0 30px 30px 0;
        padding:30px;
        border: 1px solid black;
        border-radius: 10px;
    }
    .inventaire{
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
`
const GuestPanier = () => {
    const navigate = useNavigate()

    const [panier, setPanier] = useState(null)

    useEffect(() => {
        const panier = JSON.parse(localStorage.getItem("panier"))
        fetch(`http://localhost:3001/cart/redo`,{
            method:'POST',
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify({
                cart: panier
            })
        }).then(res=>{
            return res.json()
        }).then(data=>{
            setPanier(data)
        }).catch(err=>{
            console.log(err.message)
        })
    }, [])

    const handleRemoveInventaire = (idInventaire) => {
        let newPanier = panier
        let newInventaire = []
        Array.from(newPanier.inventaires).forEach((inventaire, index)=>{
            if(inventaire._id !== idInventaire){
                newInventaire.push(inventaire)
            }
        })
        newPanier.inventaires = newInventaire
        localStorage.setItem("panier",JSON.stringify(newPanier))
        window.location.reload()
    }
    // console.log(panier)
    const handlePaiement = (idPanier) => {
        navigate(`/login`)
    }
    return (
        <>
            <Navbar />
            <Container style={{ marginTop: '5%' }}>
                <div className="container">
                    {panier &&
                        <div className="panier">
                            <h1 style={{ fontWeight: 'bold' }}>{panier.nom}</h1>
                            <div>
                                <u>Nombre de produits</u>: x {panier.quantite}
                            </div>
                            <br />
                            <u style={{ fontSize: '17px', fontWeight: "bold" }}>Inventaires</u>:
                            <div className="inventaires">
                                {Array.from(panier.inventaires).map((inventaire, index) => (
                                    <div key={index} className="inventaire">
                                        <div className="nomInventaire">
                                            . {inventaire.nom}
                                        </div>
                                        <div className="quantiteInventaire">
                                            x {inventaire.quantite}
                                        </div>
                                        <div className="prixInventaire">
                                            PU: <span style={{ fontWeight: 'bolder' }}>{inventaire.prix} Ar</span>
                                        </div>
                                        <div>
                                            <button onClick={()=>{handleRemoveInventaire(inventaire._id)}} className="btn btn-danger">Remove</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <br />
                            <div>
                                <u style={{ fontSize: '20px', fontWeight: "bold" }}>Total à payer</u>
                                <br />
                                <span style={{ fontWeight: 'bold', fontSize: '25px' }}>{panier.total} Ar</span>
                            </div>
                            <br />
                            <div className="payementPanier">
                                <button onClick={() => {
                                    handlePaiement(panier._id)
                                }} className="btn btn-success">Proceder au paiement</button>
                            </div>
                        </div>
                    }
                </div>
            </Container>
        </>
    );
}

export default GuestPanier;