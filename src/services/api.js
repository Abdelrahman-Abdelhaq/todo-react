import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/notes`;

export const fetchNotes = async (setNotes) => {
  try {
    const res = await axios.get(API_URL);
    setNotes(res.data);
  } catch (err) {
    console.error("Error fetching notes:", err);
  }
};


export const addNote = async (noteText, setNotes) => {
  try {
    const res = await axios.post(API_URL, { note_text: noteText });
    setNotes(prev => [...prev, res.data]);
    return true; 
  } catch (err) {
    console.error("Error adding note:", err);
    return false; 
  }
};

export const deleteNote = async (id, setNotes) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    setNotes(prev => prev.filter(note => note.id !== id));
  } catch (err) {
    console.error("Error deleting note:", err);
  }
};

export const updateNote = async (id, updatedData, setNotes) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, updatedData); 
    setNotes(prev => prev.map(note => note.id === id ? res.data : note));
  } catch (err) {
    console.error("Error updating note:", err.response?.data || err.message);
  }
};

