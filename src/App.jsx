import React, { useState, useEffect, useRef } from 'react';
import Note from './components/Note';
import Theme from './components/Theme'; 
import { fetchNotes, addNote, deleteNote, updateNote } from './services/api';
import Search from './components/Search';
import Filter from './components/Filter';
import NewNoteButton from './components/NewNoteButton';
import NewNoteModal from './components/NewNoteModal';
import EditModal from './components/EditModal';
import Spinner from './components/Loading';
import Empty from './components/Empty';
import Undo from "./components/Undo";

function App() {
  const [notes, setNotes] = useState([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [editNote, setEditNote] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isUndo, setIsUndo] = useState(false);
  const [deletedNote, setDeletedNote] = useState(null);
  const deleteTimerRef = useRef(null);

  const normalizedSearch = searchTerm.toLowerCase();

  const searchNotes = notes.filter((note) => {
    if (normalizedSearch === '') return note;
    if (note.note_text.toLowerCase().includes(normalizedSearch)) return note;
  });

  const filteredNotes = searchNotes.filter((note) => {
    if (filter === "complete") return note.completed;
    if (filter === "incomplete") return !note.completed;
    return true;
  });

  useEffect(() => {
    fetchNotes(setNotes, setIsLoading, setIsEmpty);
  }, []);

  const handleAddNote = async () => {
    if (newNoteText.trim() === '') return;
    await addNote(newNoteText, setNotes);
    setNewNoteText('');
    closeAddModal();
  };

  const changeNote = (e) => {
    setNewNoteText(e.target.value);
  };

  const handleDeleteNote = (id) => {
    const noteToDelete = notes.find(note => note.id === id);
    setNotes(prev => prev.filter(note => note.id !== id));
    setDeletedNote(noteToDelete);
    setIsUndo(true);

    deleteTimerRef.current = setTimeout(() => {
      if (noteToDelete) {
        deleteNote(noteToDelete.id);
      }
      setIsUndo(false);
      setDeletedNote(null);
    }, 5000);
  };

  const handleUndo = () => {
    if (deleteTimerRef.current) {
      clearTimeout(deleteTimerRef.current);
      deleteTimerRef.current = null;
    }
    if (deletedNote) {
      setNotes(prev => [...prev, deletedNote]);
    }
    setIsUndo(false);
    setDeletedNote(null);
  };

  const handleToggleComplete = (note) => {
    updateNote(note.id, { completed: !note.completed, note_text: note.note_text }, setNotes);
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

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNewNoteText("");
  };

  const openEditModal = (note) => {
    setEditNote({ ...note });
    setIsEditModalOpen(true);
    setNewNoteText(note.note_text);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const themeHandler = () => {
    if (theme === 'light') setTheme('dark');
    else setTheme('light');
  };

  return (
    <div className='container' data-theme={theme}>
      <div className="content">
        <h1 className="title">TODO LIST</h1>
        <div className="search">
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <div className='column-div'>
            <Filter setFilter={setFilter} />
            <Theme themeState={themeHandler} />
          </div>
        </div>

        <div className="all-notes" id="all-notes">
          {isLoading ? (
            <Spinner />
          ) : filteredNotes.length === 0 ? (
            <Empty isEmpty={isEmpty} />
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

        <NewNoteModal
          isOpen={isAddModalOpen}
          closeModal={closeAddModal}
          addNote={handleAddNote}
          noteText={newNoteText}
          setnewNoteText={changeNote}
        />

        <EditModal
          isOpen={isEditModalOpen}
          onCancel={closeEditModal}
          note={editNote}
          editNote={(updatedNote) => {
            handleUpdateNote(updatedNote);
          }}
        />
      </div>

      <NewNoteButton openModal={openAddModal} />
      <Undo isUndo={isUndo} handleUndo={handleUndo} />
    </div>
  );
}

export default App;
