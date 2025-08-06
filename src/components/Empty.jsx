import React from "react";

const Empty = ({isEmpty})=>{
    if(!isEmpty) return null;
    return (
    <div className="empty-state" >
      <div className="empty-pic"></div>
      <div className="empty-text">Empty</div>
    </div>
    );
}

export default Empty;