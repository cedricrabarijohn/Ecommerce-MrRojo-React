import styled from '@emotion/styled';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { testSession } from '../../Helpers/Helper';
const Container = styled.div`
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
    font-weight:bold;
    font-size:1.5em;
}
.inventaire .prix{
    font-weight:bold;
    font-size:1em;
}
`
const Inventaires = (props) => {
    const navigate = useNavigate()

    const [pageInfos, setPageInfos] = useState(null)
    const [inventaires, setInventaires] = useState(null)
    useEffect(() => {
        setInventaires(props.inventaires)
        setPageInfos(props.pageInfos)
    }, [])

    const handleAddToCart = (id) => {
        if (testSession()) {
            navigate(`/detailsInventaire/${id}`)
        }
        else {
            navigate(`/guest/detailsInventaire/${id}`)
        }
    }
    return (
        <>
            <Container>
                <div className=" row listeInventaires">
                    {inventaires &&
                        inventaires.map((inventaire, index) => (
                            <div className="inventaire col-md-2" key={index}>
                                <div className="image">
                                    Image
                                </div>
                                <div className="nom">
                                    {inventaire.nom}
                                </div>
                                <div className="prix">
                                    {inventaire.prix} Ar
                                </div>
                                <div style={{ fontSize: '13px', marginTop: '10px' }} className="categories">
                                    {inventaire?.categories &&
                                        <span style={{ backgroundColor: 'grey', padding: '2px', borderRadius: '5px' }}>{Array.from(inventaire.categories).join("-")}</span>
                                    }
                                </div>
                                <div>
                                    En stock {inventaire.quantite}
                                </div>
                                <div className="add">
                                    <button className='btn' onClick={() => { handleAddToCart(inventaire._id) }}>Ajouter au panier</button>
                                </div>
                            </div>
                        ))
                    }
                </div>

            </Container>
        </>
    );
}

export default Inventaires;