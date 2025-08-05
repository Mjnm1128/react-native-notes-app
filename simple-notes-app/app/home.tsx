// HomeScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
// Navigation and state management
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
// Auth and Notes actions from Redux slices
import { logout } from './store/authSlice';
import { addNote, deleteNote, updateNote, togglePinNote, Note } from './store/notesSlice';
import { RootState } from './store';
import { v4 as uuidv4 } from 'uuid'; // UUID utility for generating unique IDs for each note

export default function HomeScreen() {
  const dispatch = useDispatch(); // For dispatching Redux actions
  const router = useRouter();
  const notes = useSelector((state: RootState) => state.notes.notes);

  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDesc, setNoteDesc] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

// Logs the user out and redirects to login screen
  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
  };
 // Adds a new note to the Redux store
  const handleAddNote = () => {
    if (!noteTitle || !noteDesc) {
      Alert.alert('Both fields are required');
      return;
    }

    const newNote: Note = {
      id: uuidv4(),
      title: noteTitle,
      description: noteDesc,
      createdAt: new Date().toISOString(), // Timestamp
      pinned: false,
    };

    dispatch(addNote(newNote));
    setNoteTitle('');
    setNoteDesc('');
    setModalVisible(false);
  };
 // Deletes a note based on its ID
  const handleDeleteNote = (id: string) => {
    dispatch(deleteNote(id));
    setViewModalVisible(false);
  };
// Updates an existing note
  const handleUpdateNote = () => {
    if (selectedNote) {
      dispatch(updateNote({ ...selectedNote }));
      setEditMode(false);
      setViewModalVisible(false);
    }
  };
 // Toggle pin/unpin state of a note
  const togglePin = (id: string) => {
    dispatch(togglePinNote(id));
  };
  // Opens view/edit modal and loads the selected note
  const openViewModal = (note: Note) => {
    setSelectedNote({ ...note });
    setEditMode(false);
    setViewModalVisible(true);
  };
// Filter notes based on search query and sort pinned notes first
  const filteredNotes = notes
    .filter(
      (note) =>
        note.title.toLowerCase().includes(searchText.toLowerCase()) ||
        note.description.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));
 // Apply appropriate theme styles
  const themeStyles = darkMode ? darkStyles : styles;

  return (
    <View style={themeStyles.container}>
      <Text style={themeStyles.appTitle}>📝 Simple Notes App</Text>

      <View style={themeStyles.header}>
        <TextInput
          placeholder="Search notes..."
          value={searchText}
          onChangeText={setSearchText}
          style={themeStyles.searchInput}
          placeholderTextColor={darkMode ? '#ccc' : undefined}
        />
        <Pressable onPress={() => setModalVisible(true)} style={themeStyles.addButton}>
          <Text style={themeStyles.addButtonText}>＋</Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 }}>
        <Text style={{ marginRight: 8, color: darkMode ? '#ccc' : '#333' }}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>

      {filteredNotes.length === 0 ? (
        <View style={themeStyles.emptyContainer}>
          <Text style={themeStyles.emptyText}>No notes yet</Text>
          <Pressable onPress={() => setModalVisible(true)} style={themeStyles.modalButton}>
            <Text>Add Note</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable onPress={() => openViewModal(item)} style={themeStyles.noteItem}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={themeStyles.noteTitle}>{item.title}</Text>
                <Pressable onPress={() => togglePin(item.id)}>
                  <Text>{item.pinned ? '📌' : '📍'}</Text>
                </Pressable>
              </View>
              <Text numberOfLines={1} style={{ color: darkMode ? '#ddd' : '#333' }}>
                {item.description}
              </Text>
              <Text style={{ fontSize: 12, color: darkMode ? '#aaa' : '#555' }}>
                Created: {new Date(item.createdAt).toLocaleString()}
              </Text>
            </Pressable>
          )}
        />
      )}

      <Pressable onPress={handleLogout} style={themeStyles.logoutButton}>
        <Text style={themeStyles.logoutText}>Logout</Text>
      </Pressable>

      {/* Add Note Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={themeStyles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={themeStyles.modalContainer}
          >
            <View style={themeStyles.modalContent}>
              <Text style={themeStyles.modalTitle}>Add Note</Text>

              <TextInput
                placeholder="Note Title"
                value={noteTitle}
                onChangeText={setNoteTitle}
                style={themeStyles.input}
              />
              <TextInput
                placeholder="Note Description"
                value={noteDesc}
                onChangeText={setNoteDesc}
                style={[themeStyles.input, { height: 80 }]}
                multiline
              />

              <View style={themeStyles.modalButtons}>
                <Pressable onPress={() => setModalVisible(false)} style={themeStyles.modalButton}>
                  <Text>Cancel</Text>
                </Pressable>
                <Pressable onPress={handleAddNote} style={themeStyles.modalButton}>
                  <Text>Confirm</Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* View/Edit Modal */}
      <Modal visible={viewModalVisible} animationType="slide" transparent>
        <View style={themeStyles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={themeStyles.modalContainer}
          >
            <View style={themeStyles.modalContent}>
              <Text style={themeStyles.modalTitle}>
                {editMode ? 'Edit Note' : 'View Note'}
              </Text>

              <TextInput
                value={selectedNote?.title}
                editable={editMode}
                onChangeText={(text) =>
                  setSelectedNote((prev) => (prev ? { ...prev, title: text } : null))
                }
                style={themeStyles.input}
              />
              <TextInput
                value={selectedNote?.description}
                editable={editMode}
                onChangeText={(text) =>
                  setSelectedNote((prev) => (prev ? { ...prev, description: text } : null))
                }
                style={[themeStyles.input, { height: 80 }]}
                multiline
              />
              {!editMode && selectedNote && (
                <Text style={{ marginTop: 8, color: darkMode ? '#ccc' : '#777' }}>
                  Created: {new Date(selectedNote.createdAt).toLocaleString()}
                </Text>
              )}

              <View style={themeStyles.modalButtons}>
                <Pressable
                  onPress={() =>
                    editMode ? setEditMode(false) : setViewModalVisible(false)
                  }
                  style={themeStyles.modalButton}
                >
                  <Text>{editMode ? 'Cancel Edit' : 'Close'}</Text>
                </Pressable>

                {editMode ? (
                  <Pressable onPress={handleUpdateNote} style={themeStyles.modalButton}>
                    <Text>Save</Text>
                  </Pressable>
                ) : (
                  <>
                    <Pressable
                      onPress={() => setEditMode(true)}
                      style={themeStyles.modalButton}
                    >
                      <Text>Edit</Text>
                    </Pressable>
                    <Pressable
                      onPress={() =>
                        selectedNote && handleDeleteNote(selectedNote.id)
                      }
                      style={[themeStyles.modalButton, { backgroundColor: '#f8d7da' }]}
                    >
                      <Text style={{ color: '#c0392b' }}>Delete</Text>
                    </Pressable>
                  </>
                )}
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  appTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  header: { flexDirection: 'row', marginBottom: 10, gap: 10 },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    backgroundColor: '#2e86de',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: { color: 'white', fontSize: 20 },
  noteItem: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  noteTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  logoutButton: {
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: '#d63031',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  logoutText: { color: 'white', fontWeight: 'bold' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 16, marginBottom: 10 },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: { width: '90%' },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    gap: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    flexWrap: 'wrap',
    gap: 10,
  },
  modalButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
  },
});

const darkStyles = StyleSheet.create({
  ...styles,
  container: { ...styles.container, backgroundColor: '#121212' },
  appTitle: { ...styles.appTitle, color: '#fff' },
  searchInput: {
    ...styles.searchInput,
    backgroundColor: '#1e1e1e',
    borderColor: '#444',
    color: '#fff',
  },
  noteItem: { ...styles.noteItem, backgroundColor: '#1e1e1e' },
  noteTitle: { ...styles.noteTitle, color: '#fff' },
  logoutText: { ...styles.logoutText, color: '#fff' },
});
