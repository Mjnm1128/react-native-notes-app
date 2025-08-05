// app/store/notesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Type definition for a single note
export interface Note {
  id: string;             // Unique identifier for the note
  title: string;          // Note title
  description: string;    // Note content/body
  createdAt: string;      // Timestamp of when the note was created
  pinned: boolean;        // Indicates if the note is pinned to the top
}

// Interface for the state that stores an array of notes
interface NotesState {
  notes: Note[];
}

// Initial state with an empty notes array
const initialState: NotesState = {
  notes: [],
};

// Create a Redux slice for note-related state and reducers
const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    // Adds a new note to the state
    addNote: (state, action: PayloadAction<Note>) => {
      state.notes.push(action.payload);
    },

    // Deletes a note by ID
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter(note => note.id !== action.payload);
    },

    // Updates an existing note by ID
    updateNote: (state, action: PayloadAction<Note>) => {
      const index = state.notes.findIndex(note => note.id === action.payload.id);
      if (index !== -1) {
        state.notes[index] = action.payload;
      }
    },

    // Toggles the pinned state of a note by ID
    togglePinNote: (state, action: PayloadAction<string>) => {
      const note = state.notes.find(note => note.id === action.payload);
      if (note) {
        note.pinned = !note.pinned;
      }
    },
  },
});

// Export all actions for use in components
export const {
  addNote,
  deleteNote,
  updateNote,
  togglePinNote, // Handles pin/unpin toggle
} = notesSlice.actions;

// Export the reducer to be included in the store
export default notesSlice.reducer;
