import React, { useState, useEffect, useRef } from 'react';
import Note from './components/Note';
import Theme from './components/Theme'; 
import { fetchNotes, addNote, deleteNote, updateNote } from './services/api';
import Search from './components/Search';
import Filter from './components/Filter';
import NewNoteButton from './components/NewNoteButton';
import NewNoteModal from './components/NewNoteModal';
import EditModal from './components/EditModal';
import {FadeLoader} from "react-spinners";
import Spinner from './components/Loading';


function App() {
  const [notes, setNotes] = useState([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [editNote, setEditNote] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [theme,setTheme] = useState('light');
  const [isLoading,setIsLoading] = useState(false);

  const normalizedSearch = searchTerm.toLowerCase();
  

  const searchNotes = notes.filter((note)=>{
    if( normalizedSearch ==='') return note
    if(note.note_text.toLowerCase().includes(normalizedSearch) ) return note
  })
const filteredNotes = searchNotes.filter((note) => {
  if (filter === "complete" ) return note.completed;
  if (filter === "incomplete") return !note.completed;
  return true; 
});


  useEffect(() => {
    fetchNotes(setNotes,setIsLoading);
  }, []);

 const handleAddNote = async () => {
  if (newNoteText.trim() === '') return;
  await addNote(newNoteText, setNotes); 
  setNewNoteText('');
  closeAddModal(); 
};

  const changeNote = (e)=>{
    setNewNoteText(e.target.value);
  }

  const handleDeleteNote = (id) => {
    deleteNote(id, setNotes);
  };

  const handleToggleComplete = (note) => {
    updateNote(note.id, { completed: !note.completed,note_text:note.note_text }, setNotes);
    console.log('Updating with:', { note_text: note.note_text, completed: !note.completed });

  };

  const handleEditNote = (note) => {
    setEditNote(note);
    setNewNoteText(note.note_text);
  };


const handleUpdateNote = (updatedNote) => {
  if (updatedNote.note_text.trim() !== '') {
    updateNote(
      updatedNote.id,
      { 
        note_text: updatedNote.note_text,
        completed: updatedNote.completed 
      },
      setNotes
    );
    closeEditModal();
  }
};


  const openAddModal = ()=>{
    setIsAddModalOpen(true);
  }
  const closeAddModal = ()=>{
    setIsAddModalOpen(false);
    setNewNoteText("");
  }

 const openEditModal = (note) => {
  setEditNote({...note}); 
  setIsEditModalOpen(true);
  setNewNoteText(note.note_text); 
};
  const closeEditModal = ()=> {
    setIsEditModalOpen(false);
  }

  const themeHandler = ()=>{
    if(theme == 'light') 
      setTheme('dark')
    if(theme == 'dark')
      setTheme('light')
  }

  return (
    <div className='container' data-theme={theme}>
      <div className="content">
      <h1 className="title">TODO LIST</h1>

      <div className="search">
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Filter setFilter={setFilter} />

        <Theme themeState={themeHandler}/>
      </div>

   <div className="all-notes" id="all-notes">
  { isLoading ? <Spinner/> : filteredNotes.length === 0 ? (
    <div className="empty-state">
      <div className="empty-pic"></div>
      <div className="empty-text">Empty</div>
    </div>
  ) : (
    filteredNotes.map((note) => (
      <Note
        key={note.id}
        note={note}
        onDelete={handleDeleteNote}
        onEdit={openEditModal}
        onToggleComplete={handleToggleComplete}
      />
    ))
  )}
</div>


    <div className='note-margin'></div>
     <NewNoteButton openModal={openAddModal}/>

      <NewNoteModal isOpen={isAddModalOpen} 
      closeModal={closeAddModal} 
      addNote={handleAddNote} 
      noteText={newNoteText} 
      setnewNoteText={changeNote} />
    <EditModal
       isOpen={isEditModalOpen}
       onCancel={closeEditModal}
       note={editNote}  
       editNote={(updatedNote) => {handleUpdateNote(updatedNote);}}/>

  </div>
  </div>

  );
}

export default App;
