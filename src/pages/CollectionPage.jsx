import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function CollectionPage({ removeToken }) {
    const [collections, setCollections] = useState({});
    let { id } = useParams();


    // MORA DA SE NAPRAVI /page/id RUTA 
    const getCollections = async () => {
        const response = await fetch(`https://functions-cloud1-onlypans.harperdbcloud.com/local-api/collections/page/${id}`)
        const newCollections = await response.json();
        setCollections(newCollections);
    };

    useEffect(() => {
        // getCollections();
    }, []);

    return (
        <div>
            <Navbar active={'collection'} removeToken={removeToken} />
            <h1>WELCOME TO COLLECTION PAGE</h1>
        </div>
    )
}
export default CollectionPage