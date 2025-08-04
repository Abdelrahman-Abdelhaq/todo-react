import React from "react";
import image from "../assets/spinner.svg"

const Spinner = ()=>{
    return (
        <div>
            <img src={image} alt="loading" className="loading"/>
        </div>
    );
}

export default Spinner;