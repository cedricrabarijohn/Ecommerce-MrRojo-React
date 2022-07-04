import styled from "@emotion/styled";
import Navbar from "../Components/user/Navbar";
import Inventaires from '../Components/user/Inventaires'
import { useEffect } from "react";
import { useState } from "react";
import { Link } from 'react-router-dom'
const Content = styled.div`
    *{
        text-align:start;
    }
    .body{
        margin-top:5%;
    }
    .inventaires{
    }
    .barre{
        left:0;
        right:0;
        height:1px;
        background-color:black;
    }
`
const Home = () => {
    const [inventaires, setInventaire] = useState(null)
    const [pageInfos, setPageInfos] = useState(null)
    const [error, setError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        fetch("http://localhost:3001/inventaire", {
            method: "GET",
            headers: {
                'content-type': 'application/json'
            }
        }).then(res => {
            return res.json()
        }).then(data => {
            setInventaire(data.docs);
            delete data.docs
            setPageInfos(data)
            setIsLoading(false)
            setError(false)
        }).catch(err => {
            setError(err.message)
            setIsLoading(false)
        })
    }, [])
    return (
        <>
            <Navbar />
            <Content>
                <section className="body">
                    <h1 style={{ fontSize:"30px", textAlign: 'center' }}>Produits à la une</h1>
                    <br />
                    <div className="barre"></div>
                    <br />
                    <div className="inventaires">
                        {isLoading && <>...Loading</>}
                        {error && <>....{error}</>}
                        {inventaires &&
                            <Inventaires inventaires={inventaires} pageInfos={pageInfos} />
                        }
                    </div>
                    <br />
                    <div className="barre"></div>
                    <br />
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Link to="inventaires" style={{ fontSize: '30px', fontWeight: 'bolder' }}>Voir tous les produits</Link>
                    </div>
                </section>
            </Content>
        </>
    );
}

export default Home;