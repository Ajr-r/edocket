import React from "react";
import { useNavigate } from "react-router";
export function Submitted(){
    const nav=useNavigate()

    return(
        <div className="sub">
            <div style={{border:'1px solid black',height:'100px',marginTop:'100px',padding:'20px',display:'flex',
            flexDirection:'column', alignItems:'center',justifyContent:'center',borderRadius:'5px'
        }}>

            <h1>Docket submitted successfully</h1>
            <button style={{marginTop:'20px'}} onClick={()=>nav('/')}>Home</button>
            </div>

        </div>
    )
}