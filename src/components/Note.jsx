import React from 'react';

function Note({ note, onDelete, onEdit, onToggleComplete }) {
  return (
    <div className="note" data-id={note.id}>
      <label className="custom-checkbox">
        <input 
          type="checkbox" 
          checked={note.completed}
          onChange={() => onToggleComplete(note)}
        />
        <span className="checkmark"></span>
      </label>
      <p className={`user-note ${note.completed ? 'completed' : ''}`}>
        {note.note_text}
      </p>
      <div className="notesB">
        <button className="editB" onClick={() => onEdit(note)}></button>
        <button className="deleteB" onClick={() => onDelete(note.id)}></button>
      </div>
    </div>
  );
}

export default Note;