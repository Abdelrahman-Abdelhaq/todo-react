import React, { useState } from "react";

const Undo = ({isUndo,handleUndo,counter})=>{
    


    if(!isUndo) return null;
    return(
        <button className="undo-button" onClick={handleUndo}>
            <p className="undo-counter">{counter}</p>
            <p className="undo-text">Undo</p>
        </button>
    );
}

export default Undo;