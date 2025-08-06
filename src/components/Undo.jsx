import React from "react";

const Undo = ({isUndo})=>{
    if(!isUndo) return null;
    return(
        <button className="undo-button">Undo</button>
    );
}

export default Undo;