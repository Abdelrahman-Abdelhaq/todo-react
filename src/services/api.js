import axiosClient from './axiosClient.js';

// ✅ Fetch notes
export const fetchNotes = async (setNotes) => {
  try {
    const res = await axiosClient.get('/notes');
    setNotes(res.data);
  } catch (err) {
    console.error("Error fetching notes:", err);
  }
};

// ✅ Add new note
export const addNote = async (noteText, setNotes) => {
  try {
    const res = await axiosClient.post('/notes', { note_text: noteText });
    setNotes(prev => [...prev, res.data]);
    return true; 
  } catch (err) {
    console.error("Error adding note:", err);
    return false; 
  }
};

// ✅ Delete note
export const deleteNote = async (id, setNotes) => {
  try {
    await axiosClient.delete(`/notes/${id}`);
    setNotes(prev => prev.filter(note => note.id !== id));
  } catch (err) {
    console.error("Error deleting note:", err);
  }
};

// ✅ Update note
export const updateNote = async (id, updatedData, setNotes) => {
  try {
    const res = await axiosClient.put(`/notes/${id}`, updatedData);
    setNotes(prev => prev.map(note => note.id === id ? res.data : note));
  } catch (err) {
    console.error("Error updating note:", err.response?.data || err.message);
  }
};