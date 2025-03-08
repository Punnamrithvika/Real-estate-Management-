import { BrowserRouter,Routes,Route } from "react-router-dom";
import Home from './pages/Home'
import About from './pages/About'
import Profile  from './pages/Profile'
import SignIn  from "./pages/Signin";
import SignUp from "./pages/SignUp";

export default function App(){
  return <BrowserRouter>
  <Routes>
    <Route path="/" element={<Home/>}></Route>
    <Route path="/sign-in" element={<SignIn/>}></Route>
    <Route path="/sign-up" element={<SignUp/>}></Route>
    <Route path="/about" element={<About/>}></Route>
    <Route path="/Profile" element={<Profile/>}></Route>
  </Routes>
  </BrowserRouter>
}