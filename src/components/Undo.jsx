import React from "react";

const Undo = ({isUndo,handleUndo})=>{
    if(!isUndo) return null;
    return(
        <button className="undo-button" onClick={handleUndo}>Undo</button>
    );
}

export default Undo;