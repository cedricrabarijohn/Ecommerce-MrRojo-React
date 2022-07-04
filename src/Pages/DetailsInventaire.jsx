import styled from "@emotion/styled";
import { useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../Components/user/Navbar";
import { testSession } from "../Helpers/Helper";

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

    const [idUser, setIdUser] = useState(null)
    const [inventaire, setInventaire] = useState(null);
    const [err, setErr] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const [carts, setCarts] = useState(null)
    const [cartErr, setCartErr] = useState(false)
    const [isLoadingCart, setIsLoadingCart] = useState(true)

    const [idCart, setIdCart] = useState("")
    const [quantiteAAjouter, setQuantiteAAjouter] = useState(0)

    const [errQuantite, setErrQuantite] = useState(false)

    const [nomNouveauPanier, setNomNouveauPanier] = useState("")

    const etat = {
        SHOW: 'show',
        HIDE: 'hide'
    }

    const [displayCreationPanier, setDisplayCreationPanier] = useState(etat.HIDE)

    const handleDisplayAjouterPanier = () => {
        if (displayCreationPanier === etat.HIDE) {
            setDisplayCreationPanier(etat.SHOW)
        } else if (displayCreationPanier === etat.HIDE) {
            setDisplayCreationPanier(etat.HIDE)
        } else {
            setDisplayCreationPanier(etat.HIDE)
        }
    }
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
            .then(datas => {
                setCarts(datas)
                setCartErr(false)
                setIsLoadingCart(false)
            })
            .catch(err => {
                setCartErr(err)
                setIsLoadingCart(false)
            })
    }, [idUser])

    //Get the inventaire
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
    const handleChangeCart = (e) => {
        setIdCart(e.target.value)
    }
    const handleAjoutPanier = () => {
        if (errQuantite || quantiteAAjouter <= 0 || idCart === "" || idCart === null) {
            alert('Un probleme est survenu , veuillez reessayer plus tard.')
            return
        }
        else {
            // console.log(`Quantite : ${quantiteAAjouter} , Panier ${idCart}`)
            const url = `http://localhost:3001/cart/inventaire/${idCart}`
            fetch(url, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    idInventaire: idInventaire,
                    quantite: quantiteAAjouter
                })
            })
                .then(res => {
                    return res.json()
                })
                .then(data => {
                    if (data.error) {
                        console.log(data.error)
                    } else {
                        alert('mety')
                        setTimeout(() => {
                            window.location.reload()
                        }, 100)
                    }
                })
                .catch(err => {
                    console.log(err.message)
                    alert(err.message)
                })
        }
    }
    const handleAjoutRecettePanier = () => {
        const url = `http://localhost:3001/cart/inventaire/ingredients/${idInventaire}`
        fetch(url, {})
            .then(res => {
                return res.json()
            })
            .then(data => {
                console.log(data)
                fetch(`http://localhost:3001/cart/addRecette/${idCart}`, {
                    method: "POST",
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        ingredients: data
                    })
                })
                    .then(res => {
                        return res.json()
                    })
                    .then(data2 => {
                        console.log(data2)
                        alert('bien ajouté au panier des recettes')
                        window.location.reload()
                    })
                    .catch(err => {
                        alert(err.message)
                    })
            })
            .catch(err => {
                alert(err.message)
            })
    }
    const handleChangeNomNouveauPanier = (e) => {
        setNomNouveauPanier(e.target.value)
    }
    const handleSubmitNouveauPanier = () => {
        if (nomNouveauPanier != null && nomNouveauPanier !== "") {
            fetch(`http://localhost:3001/cart`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    nom: nomNouveauPanier,
                    userId: idUser
                })
            })
                .then(res => {
                    return res.json()
                })
                .then(data => {
                    if (data.error) {
                        console.log(data.error)
                        alert(data.error.message)
                    } else {
                        alert('success')
                        setTimeout(() => {
                            window.location.reload()
                        }, 100)
                    }
                })
        } else {
            alert("Une erreur s'est produite")
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
                                                <u>Id</u>
                                            </td>
                                            <td>
                                                {inventaire._id}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="start">
                                                <u>Prix</u>
                                            </td>
                                            <td>
                                                {inventaire.prix} Ar
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="start">
                                                <u>Description</u>
                                            </td>
                                            <td>
                                                {inventaire.description}
                                            </td>
                                        </tr>
                                        {Array.from(inventaire.categories).includes("recette") &&
                                            <tr>
                                                <td className="start">
                                                    <u>Liste d'ingredients</u>
                                                </td>
                                                <td>
                                                    {Array.from(inventaire.ingredients).map((ingredient, index) => (
                                                        <span key={index} style={{ fontWeight: 'bold', backgroundColor: 'grey', borderRadius: '5px', margin: "0 0 0 2px", color: 'white', padding: '1px', fontSize: '10px' }}>
                                                            {ingredient.quantite}{ingredient.unite} {ingredient.nom}</span>
                                                    ))}
                                                </td>
                                            </tr>
                                        }
                                        <tr>
                                            <td className="start">
                                                <u>Valeur unitaire</u>
                                            </td>
                                            <td>
                                                {inventaire.valeurUnitaire} {inventaire.unite}
                                            </td>
                                        </tr>
                                        {Array.from(inventaire.categories).includes("recette") ?
                                            <></>
                                            :
                                            <>
                                                <tr>
                                                    <td className="start">
                                                        <u>Quantite restant en stock</u>
                                                    </td>
                                                    <td>
                                                        {inventaire.quantite}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="start">
                                                        <u>Quantite a ajouter au panier</u>
                                                    </td>
                                                    <td>
                                                        <input onChange={handleChangeQuantite} type="number" />
                                                    </td>
                                                </tr>
                                            </>
                                        }
                                        <tr>
                                            <td className="start">
                                                <u>Choisir le panier:</u>
                                            </td>
                                            <td>
                                                <select onChange={handleChangeCart}>
                                                    <option value="">Choisir un panier</option>
                                                    {carts &&
                                                        carts.map((cart, index) => (
                                                            <option key={index} value={cart._id}>{cart.nom}</option>
                                                        ))
                                                    }
                                                </select>
                                                <span style={{ marginLeft: '10px' }}>
                                                    <button onClick={handleDisplayAjouterPanier} className="btn btn-primary">+</button>
                                                </span>
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
                                        <button onClick={handleAjoutRecettePanier} className="btn" style={{ width: '50%', backgroundColor: "#333", color: "white", fontSize: '14px' }}>Ajouter la recette au panier</button>
                                        :
                                        <button onClick={handleAjoutPanier} className="btn" style={{ width: '50%', backgroundColor: "#333", color: "white", fontSize: '14px' }}>
                                            Ajouter le produit au panier
                                        </button>
                                    }
                                </div>
                            </div>
                            <div style={{ color: 'white', padding: '50px', backgroundColor: '#999' }} className={`creationPanier ${displayCreationPanier}`}>
                                <h1 style={{ fontSize: '25px' }}>
                                    <u>Nouveau panier :</u>
                                </h1>
                                <br />
                                <span style={{ color: "black" }}>Nom du panier :</span> <input onChange={handleChangeNomNouveauPanier} type="text" />
                                <br />
                                <br />
                                <button onClick={handleSubmitNouveauPanier} style={{ width: '100%' }} className="btn btn-primary">Valider</button>
                                <br />
                                <br />
                                <button onClick={handleDisplayAjouterPanier} className="btn btn-danger">Fermer</button>
                            </div>
                        </div>
                    </>
                }
            </Container>
        </>
    );
}
export default DetailsInventaire;