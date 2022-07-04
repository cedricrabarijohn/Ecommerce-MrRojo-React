import styled from "@emotion/styled";
import { useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Components/user/Navbar";
import { testSession } from "../../Helpers/Helper";

const Container = styled.div`
    .detailsInventaire div{
        margin:10px 0 10px 0;
    }
    .container{
        display:grid;
        grid-template-columns: 50% auto;
    }
    .hide{
        visibility:hidden;
    }  
    .show{
        visibility:show;
    }
    table tr td{
        text-align:end;
        padding:10px;
    }
    table tr .start{
        text-align:start;
    }
`
const DetailsInventaire = () => {
    const navigate = useNavigate()
    const { idInventaire } = useParams();

    const [inventaire, setInventaire] = useState(null);
    const [err, setErr] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [cart, setCart] = useState(null)
    const [cartErr, setCartErr] = useState(false)
    const [isLoadingCart, setIsLoadingCart] = useState(true)

    const [quantiteAAjouter, setQuantiteAAjouter] = useState(0)
    const [errQuantite, setErrQuantite] = useState(false)

    const etat = {
        SHOW: 'show',
        HIDE: 'hide'
    }
    //**** get the inventaire infos ****/
    useEffect(() => {
        const url = `http://localhost:3001/inventaire/${idInventaire}`
        fetch(url, {})
            .then(res => {
                return res.json()
            })
            .then(data => {
                if (data.error) {
                    setErr(data.error)
                    setIsLoading(false)
                } else {
                    setInventaire(data)
                    setIsLoading(false)
                    setErr(false)
                }
            })
            .catch(err => {
                setErr(err.message)
                setIsLoading(false)
            })
    }, [idInventaire])

    const handleChangeQuantite = (e) => {
        if (parseInt(e.target.value) <= inventaire.quantite) {
            setErrQuantite(false)
            setQuantiteAAjouter(e.target.value)
        } else if (parseInt(e.target.value) > inventaire.quantite) {
            setErrQuantite(true)
        }
    }
    const handleAjoutRecettePanier = () => {
        console.log('ajout recette')
        fetch(`http://localhost:3001/cart/inventaire/ingredients/${inventaire._id}`,{})
        .then(res => {
            return res.json()
        }).then(data=>{
            console.log(data)
        })
    }
    const handleAjoutPanier = () => {
        if (quantiteAAjouter == null || quantiteAAjouter === "" || quantiteAAjouter <= 0) {
            alert(`Il y a une erreur, veuillez reessayer ulterieurement`)
            return
        }
        try {
            const panierActuelle = JSON.parse(localStorage.getItem("panier"))
            var estDansLePanier = false;
            const newInventaires = Array.from(panierActuelle.inventaires).map(inventaire => {
                if (inventaire._id === idInventaire) {
                    estDansLePanier = true;
                    inventaire.quantite = parseInt(inventaire.quantite) + parseInt(quantiteAAjouter)
                    panierActuelle.total += inventaire.prix * quantiteAAjouter
                }
                return inventaire
            })
            if (!estDansLePanier) {
                inventaire.quantite = parseInt(quantiteAAjouter)
                panierActuelle.inventaires.push(...[inventaire])
                panierActuelle.quantite = parseInt(panierActuelle.quantite) + parseInt(quantiteAAjouter)
                panierActuelle.total = parseInt(panierActuelle.total) + (parseInt(quantiteAAjouter) * inventaire.prix)
                console.log(panierActuelle.total)
            } else {
                panierActuelle.inventaires = newInventaires;
            }
            // console.log(panierActuelle)
            localStorage.setItem("panier", JSON.stringify(panierActuelle))
            alert("Bien ajouté au panier")
            window.location.reload()
        } catch (err) {
            alert(err.message)
        }
    }
    return (
        <>
            <Navbar />
            <Container style={{ marginTop: '5%' }}>
                {isLoading && <>Loading ...</>}
                {err && <span style={{ color: 'red' }}>An error occured while fetching the datas...</span>}
                {inventaire &&
                    <>
                        <div className="container">
                            <div className="detailsInventaire">
                                <h2>Details {inventaire.nom}</h2>
                                <br />
                                <table>
                                    <thead>

                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="start">
                                                Id
                                            </td>
                                            <td>
                                                {inventaire._id}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="start">
                                                Prix
                                            </td>
                                            <td>
                                                {inventaire.prix} Ar
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="start">
                                                Description
                                            </td>
                                            <td>
                                                {inventaire.description}
                                            </td>
                                        </tr>
                                        {Array.from(inventaire.categories).includes("recette") &&
                                            <tr>
                                                <td className="start">
                                                    Liste d'ingredients
                                                </td>
                                                <td>
                                                    {Array.from(inventaire.ingredients).map((ingredient,index) => (
                                                        <span key={index} style={{ backgroundColor: 'grey', borderRadius: '5px', margin: "0 0 0 2px", color: 'white', padding: '10px', fontSize: '12px' }}>
                                                            {ingredient.nom}</span>
                                                    ))}
                                                </td>
                                            </tr>
                                        }
                                        <tr>
                                            <td className="start">
                                                Quantite restant en stock
                                            </td>
                                            <td>
                                                {inventaire.quantite}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="start">
                                                Quantite a ajouter au panier
                                            </td>
                                            <td>
                                                <input onChange={handleChangeQuantite} type="number" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                {errQuantite &&
                                    <span style={{ color: 'red' }}> Ne peut pas exceder une quantite de {inventaire.quantite}</span>}
                                <div>
                                </div>
                                <div className="valider" style={{ marginTop: '20px' }}>
                                    {inventaire.categories && Array.from(inventaire.categories).includes("recette") ?
                                        <button onClick={handleAjoutRecettePanier} className="btn" style={{ width:'100%',backgroundColor: "#333", color: "white", fontSize: '14px' }}>Ajouter au panier</button>
                                        :
                                        <button onClick={handleAjoutPanier} className="btn" style={{ width:'100%',backgroundColor: "#333", color: "white", fontSize: '14px' }}>Ajouter au panier</button>
                                    }
                                </div>
                            </div>
                        </div>
                    </>
                }
            </Container>
        </>
    );
}
export default DetailsInventaire;