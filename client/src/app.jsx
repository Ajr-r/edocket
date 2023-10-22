import React from "react"
import  ReactDOM  from "react-dom/client"
import { BrowserRouter,Route,Routes } from "react-router-dom"
import {Home} from './components/home.jsx'
import {Createdocket} from './components/createdocket.jsx'
import {Viewdocket} from './components/viewdocket.jsx'
import {Submitted} from './components/submitted.jsx'
import './styles/main.css'

const root=ReactDOM.createRoot(document.getElementById('root'))
root.render(
   <BrowserRouter>
   <Routes>
    <Route path="/*" element={<Home/>}/>
    <Route path="createdocket" element={<Createdocket/>}/>
    <Route path="viewdocket" element={<Viewdocket/>}/>
    <Route path="sub" element={<Submitted/>}/>
   </Routes>
   
   </BrowserRouter>
)