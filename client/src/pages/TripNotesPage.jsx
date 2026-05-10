import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import Sidebar from '../components/common/Sidebar';
import toast from 'react-hot-toast';

export default function TripNotesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const fetchNotes = () => api.get(`/trips/${id}/notes`).then(r => setNotes(r.data)).catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { fetchNotes(); }, [id]);

  const handleAdd = async () => {
    if (!newNote.trim()) return;
    setAdding(true);
    try {
      await api.post(`/trips/${id}/notes`, { content: newNote });
      setNewNote('');
      fetchNotes();
      toast.success('Note saved!');
    } catch {
      toast.error('Failed to save note');
    } finally {
      setAdding(false);
    }
  };

  const handleEdit = async (noteId) => {
    try {
      await api.put(`/trips/${id}/notes/${noteId}`, { content: editContent });
      setEditingId(null);
      fetchNotes();
      toast.success('Note updated!');
    } catch {
      toast.error('Failed to update note');
    }
  };

  const handleDelete = async (noteId) => {
    if (!confirm('Delete this note?')) return;
    try {
      await api.delete(`/trips/${id}/notes/${noteId}`);
      setNotes(prev => prev.filter(n => n.id !== noteId));
      toast.success('Note deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="layout-with-sidebar">
      <Sidebar />
      <main className="main-with-sidebar pb-20 md:pb-0">
        <div className="page-content max-w-3xl">
          <button onClick={() => navigate(`/trips/${id}/builder`)} className="text-cream-500 hover:text-cream-700 text-sm font-medium mb-4 flex items-center gap-1.5">
            ← Back to Builder
          </button>
          <div className="mb-8">
            <h1 className="page-title">Trip Notes</h1>
            <p className="page-subtitle">Jot down reminders, ideas, and important details.</p>
          </div>

          {/* Add note */}
          <div className="bg-white rounded-2xl shadow-card p-5 mb-6">
            <label className="label">New Note</label>
            <textarea
              className="input-field resize-none mb-3"
              rows={4}
              placeholder="Write your note here... hotel check-in info, contact numbers, local tips..."
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
            />
            <div className="flex justify-end">
              <button onClick={handleAdd} disabled={adding || !newNote.trim()} className="btn-primary disabled:opacity-60 flex items-center gap-2">
                {adding ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                Save Note 📝
              </button>
            </div>
          </div>

          {/* Notes list */}
          {loading ? (
            <div className="text-center py-8 text-cream-400">Loading notes...</div>
          ) : notes.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-cream-300 p-12 text-center">
              <div className="text-4xl mb-3">📝</div>
              <p className="font-display font-semibold text-mint-800 mb-2">No notes yet</p>
              <p className="text-cream-500 text-sm">Start writing to keep track of important details.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map(note => (
                <div key={note.id} className="bg-white rounded-2xl shadow-card p-5 group">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0 mt-0.5">
                      📝
                    </div>
                    <div className="flex-1 min-w-0">
                      {editingId === note.id ? (
                        <>
                          <textarea
                            className="input-field resize-none mb-3 w-full"
                            rows={4}
                            value={editContent}
                            onChange={e => setEditContent(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(note.id)} className="btn-primary text-sm px-4 py-2">Save</button>
                            <button onClick={() => setEditingId(null)} className="btn-secondary text-sm px-4 py-2">Cancel</button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-cream-800 text-sm leading-relaxed whitespace-pre-wrap">{note.content}</p>
                          <p className="text-cream-400 text-xs mt-2">
                            {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </>
                      )}
                    </div>
                    {editingId !== note.id && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingId(note.id); setEditContent(note.content); }}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-mint-50 text-mint-500 text-sm transition-colors">
                          ✏️
                        </button>
                        <button onClick={() => handleDelete(note.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-blush-50 text-blush-500 text-sm transition-colors">
                          🗑
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}