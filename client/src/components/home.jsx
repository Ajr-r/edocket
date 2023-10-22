import React from "react";
import { Link, useNavigate } from "react-router-dom";
export function Home() {
    const nav = useNavigate()
    function handleNavigation(e) {
        e.target.name == 'create' ? nav('createdocket') : nav('viewdocket')
    }
    return (
        <div className="home">
            <h1><b>EDOCKET</b></h1>
            <div>
            <button onClick={handleNavigation} name="create">Create docket</button>
            <button onClick={handleNavigation} name="view">View dockets</button>
            </div>
        </div>
    )
}