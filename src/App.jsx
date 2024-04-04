import { BrowserRouter, Routes, Route } from "react-router-dom";
import Calculadora from "./page/calculadora";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Calculadora/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App;