import {BrowserRouter, Routes, Route} from "react-router-dom"
import useToken from "../components/useToken";
import Auth from "../components/Auth";
import Home from "./Home";
import Recipe from "./Recipe"
import Collection from "./Collection"
import ShopList from "./ShopList"
import RecipeInfo from "./RecipeInfo";

function Pages() {
    const { token, setToken, removeToken } = useToken();

    if(!token) {
        return <Auth setToken={setToken} />
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home removeToken={removeToken}/>} />
                <Route path="/recipes" element={<Recipe removeToken={removeToken} />} />
                <Route path="/recipes/:id" element={<RecipeInfo removeToken={removeToken} />} />
                <Route path="/collections" element={<Collection removeToken={removeToken} />} />
                <Route path="/shop-list" element={<ShopList removeToken={removeToken} />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Pages