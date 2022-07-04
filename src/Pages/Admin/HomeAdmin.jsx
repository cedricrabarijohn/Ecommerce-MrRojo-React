import styled from "@emotion/styled";
import Navbar from "../../Components/admin/NavbarAdmin";
import { useState, useEffect } from "react";
const Container = styled.div`
    *{
        font-Size:15px;
    }
    .utilisateur{
        margin-bottom: 20px;
        // font-size:18px;
    }

`
const HomeAdmin = () => {
    const [users, setUsers] = useState(null)
    const [recettes, setRecettes] = useState(null)

    useEffect(() => {
        fetch(`http://localhost:3001/utilisateur`)
            .then(res => {
                return res.json()
            })
            .then(data => {
                setUsers(data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])
    useEffect(() => {
        fetch(`http://localhost:3001/inventaire/recettes`)
            .then(res => {
                return res.json()
            })
            .then(data => {
                setRecettes(data)
            })
            .catch(err => {
                console.log(err)
            })
    })
    const handleValiderRecharge = (userId) => {
        const url = `http://localhost:3001/admin/validerDemandePortefeuille/${userId}`
        fetch(url, {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            }
        }).then(res => {
            return res.json()
        }).then(data => {
            window.location.reload()
        }).catch(err => {
            console.log(err)
        })
    }
    return (
        <>
            <Navbar />
            <Container style={{ marginTop: "5%" }}>
                <h1>
                    <u style={{ fontSize: '16px' }}>Liste des demandes de recharge :</u>
                </h1>
                <div className="utilisateurs">
                    <ul>
                        <table className="table">
                            <tbody>
                                {users &&
                                    users.map((user, index) => (
                                        <tr>
                                            <td>
                                                {user.nom} {user.prenom}:
                                            </td>
                                            <td>
                                                <span style={{ color: "red" }}>{user.portefeuille.montantNonConfirme} Ar</span>
                                            </td>
                                            <td>
                                                {user.portefeuille.montantNonConfirme > 0
                                                    && <button onClick={() => { handleValiderRecharge(user._id) }} style={{ fontSize: '13px' }} className="btn btn-success">Valider la recharge</button>
                                                }
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </ul>
                </div>
                <br />
                <h1>
                    <u>Gestion des recettes</u>:
                </h1>
                <div className="recettes">
                    <table className="table">
                        <thead>
                            <th>Nom</th>
                            <th>Ingredients</th>
                        </thead>
                        <tbody>
                            {recettes &&
                                recettes.map((recette, index) => (
                                    <tr key={index} className="recette">
                                        <td style={{ fontSize: '18px' }}>{recette.nom}</td>
                                        <td>
                                            {recette.ingredients.map((ingredient, ind) => (
                                                <span style={{ padding: "5px 20px 5px 20px", margin: "0 10px 0 10px", backgroundColor: "#333", color: "white" }}>
                                                    {ingredient.quantite} {ingredient.unite} {ingredient.nom}
                                                </span>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                <br />
                <h1>
                    <u>Creer une recette</u>:
                </h1>
                <div className="creer">
                    <div>
                        Nom: <input type="text" />

                    </div>
                </div>
                <div className="stat">

                </div>
            </Container>
        </>
    );
}

export default HomeAdmin;