import './App.less'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/Login.tsx";

function App() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login/>} />
            </Routes>

        </BrowserRouter>
    )
}

export default App
