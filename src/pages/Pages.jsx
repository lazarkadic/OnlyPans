import { BrowserRouter, Routes, Route } from "react-router-dom"
import useToken from "../components/useToken";
import Auth from "../components/Auth";
import Home from "./Home";
import Recipe from "./Recipe"
import Collection from "./Collection"
import CollectionPage from "./CollectionPage"
import ShopList from "./ShopList"

function Pages() {
    const { token, setToken, removeToken } = useToken();

    // if (!token) {
    //     return <Auth setToken={setToken} />
    // }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home removeToken={removeToken} />} />
                {!token ? <>
                    <Route path="/recipes" element={<Auth setToken={setToken} />} />
                    <Route path="/collections" element={<Auth setToken={setToken} />} />
                    <Route path="/collections/page/:id" element={<Auth setToken={setToken} />} />
                    <Route path="/shop-list" element={<Auth setToken={setToken} />} />
                </> : <>
                    <Route path="/recipes" element={<Recipe removeToken={removeToken} />} />
                    <Route path="/collections" element={<Collection removeToken={removeToken} />} />
                    <Route path="/collections/page/:id" element={<CollectionPage removeToken={removeToken} />} />
                    <Route path="/shop-list" element={<ShopList removeToken={removeToken} />} />
                </>
                }
            </Routes>
        </BrowserRouter>
    )
}

export default Pages