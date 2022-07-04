import Navbar from "../Components/user/Navbar";
import { useState, useEffect } from "react";
import Inventaires from "../Components/user/Inventaires";
import { testSession } from '../Helpers/Helper'
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const Content = styled.div`
    .rechercheSection{
        margin-bottom:30px;
        background-color:black;
        padding:10px;
        color:white;
    }
`
const ContainerListeInventaires = styled.div`
*{
    text-align:start;
}
.listeInventaires{
    display:flex;
    // justify-content:center;
    // align-items:center;
}
.inventaire{
    margin-bottom: 10px;
    border: 1px solid;
    padding: 10px 10px 0 10px;
    // border-radius: 10px;
    margin:10px;
    min-height:250px;
    min-width: 200px;
}
.inventaire button{
    position:absolute;
    bottom:15px;
    text-align:center;
    font-size:12px;
    height:40px;
    width: 200px;
    background-color:#333;
    color:white;
}
.inventaire .nom{
    // font-weight:bold;
    font-size:1.5em;
}
.inventaire .prix{
    font-weight:bold;
    font-size:1em;
}
// style={{backgroundColor:"#333",color:'white'}}
`
const PageInventaire = () => {
    const navigate = useNavigate()
    const [categories, setCategories] = useState(null)
    const [inventaires, setInventaires] = useState(null)
    const [pageInfos, setPageInfos] = useState(null)
    const [error, setError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageLimit, setPageLimite] = useState(10)

    const [champDeRecherche, setChampDeRecherche] = useState("");
    const [categorie, setCategorie] = useState("");
    const [prixMin, setPrixMin] = useState(0);
    const [prixMax, setPrixMax] = useState(0);
    useEffect(() => {
        setCurrentPage(1)
    }, [categorie, pageLimit, champDeRecherche, prixMax, prixMin])

    //Get list of inventaires
    useEffect(() => {
        // const query = `http://localhost:3001/inventaire?page=${currentPage}`
        const query = `http://localhost:3001/inventaire/rechercheMulticritere?page=${currentPage}&categorie=${categorie}&search=${champDeRecherche}&prixMin=${prixMin}&prixMax=${prixMax}&limit=${pageLimit}`
        // console.log(query)
        fetch(query, {
            method: "GET",
            headers: {
                'content-type': 'application/json'
            }
        }).then(res => {
            return res.json()
        }).then(data => {
            setInventaires(data.docs);
            delete data.docs
            setPageInfos(data)
            setIsLoading(false)
            setError(false)
        }).catch(err => {
            setError(err.message)
            setIsLoading(false)
        });
    }, [categorie, currentPage, champDeRecherche, prixMax, prixMin, pageLimit])

    useEffect(() => {
        fetch("http://localhost:3001/categorie", {
            method: "GET",
            headers: {
                'content-type': 'application/json'
            }
        }).then(res => {
            return res.json()
        }).then(data => {
            setCategories(data)
        });
    }, [])

    const handleSearch = (q) => {

    }
    const handleChampDeRecherche = (e) => {
        setChampDeRecherche(e.target.value)
    }
    const handleCategorie = (e) => {
        setCategorie(e.target.value)
    }
    const handlePrixMin = (e) => {
        setPrixMin(e.target.value)
    }
    const handlePrixMax = (e) => {
        setPrixMax(e.target.value)
    }
    const handleChangePageLimit = (e) => {
        const page = e.target.value
        if(page!=="" || page <= 0){
            setPageLimite(e.target.value)
        }
        else{
            setPageLimite(10)
        }
    }
    const handleAddToCart = (id) => {
        if (testSession()) {
            navigate(`/detailsInventaire/${id}`)
        }
        else {
            navigate(`/guest/detailsInventaire/${id}`)
        }
    }
    const handlePagination = (i) => {
        setCurrentPage(i)
    }
    return (
        <>
            <Navbar />
            <Content style={{ marginTop: '5%' }}>
                <div className="rechercheSection">
                    Champ de recherche : <input onChange={handleChampDeRecherche} type="text" style={{ marginRight: '10px' }} />
                    Categorie :
                    <select onChange={handleCategorie} name="" id="">
                        <option value="">All</option>
                        {categories &&
                            categories.map((categorie, index) => (
                                <option key={index} value={categorie.nom}>{categorie.nom}</option>
                            ))
                        }
                    </select>
                    Prix min : <input onChange={handlePrixMin} type="number"></input> Prix max : <input onChange={handlePrixMax} type="number" /> Page limit: <input onChange={handleChangePageLimit} type="number" />
                </div>
                <div className="inventaires">
                    {isLoading && <>...Loading</>}
                    {error && <>....{error}</>}
                    {inventaires &&
                        <ContainerListeInventaires>
                            <div className=" row listeInventaires">
                                {inventaires &&
                                    inventaires.map((inventaire, index) => (
                                        <div className="inventaire col-md-2" key={index}>
                                            <div className="image">
                                                {inventaire._id}
                                            </div>
                                            <div className="nom">
                                                {inventaire.nom}
                                            </div>
                                            <div className="prix">
                                                {inventaire.prix} Ar
                                            </div>
                                            <div style={{ fontSize: '13px', marginTop: '10px' }} className="categories">
                                                {inventaire?.categories &&
                                                    <span style={{ color: 'white', backgroundColor: 'grey', padding: '2px', borderRadius: '5px' }}>{Array.from(inventaire.categories).join("-")}</span>
                                                }
                                            </div>
                                            <div>
                                                En stock {inventaire.quantite}
                                            </div>
                                            <div className="add">
                                                <button onClick={() => { handleAddToCart(inventaire._id) }} className='btn'>Ajouter au panier</button>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </ContainerListeInventaires>
                    }
                </div>
            </Content>
            <div className="pagination" style={{ marginTop: '25px' }}>
                {pageInfos &&
                    <>
                        {/* Total des items trouvés {pageInfos.totalDocs} <br />
                            Total page {pageInfos.totalPages} <br />
                            Page numero {pageInfos.page} <br /> */}
                        {pageInfos.totalDocs <= 0 &&
                            <span style={{ color: 'red' }}><h1>Aucun resultat...</h1></span>
                        }
                        {pageInfos.totalDocs > 0
                            &&
                            <div className="pages" style={{ width: '5px', display: 'flex', flexFlow: 'row-wrap' }}>
                                {Array.from(Array(pageInfos.totalPages), (e, i) => {
                                    return (
                                        <div key={i} onClick={() => {
                                            handlePagination(i + 1)
                                        }} className="btn btn-secondary" style={{ marginRight: '10px' }}>{i + 1}</div>
                                    )
                                })}
                            </div>
                        }
                        <br />
                    </>
                }
            </div>
        </>
    );
}

export default PageInventaire;