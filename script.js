let notes = [
    {
        id: 1,
        title: "Project Ideas",
        content: "142.2 dans llaun alny\nMueen Q4",
        category: "Fromt texs",
        date: "20.10.10 · 21"
    },
    {
        id: 2,
        title: "Stros Ideas",
        content: "62 2 in oetate tae stes alred\n17 het is",
        category: "Fromt texs",
        date: "20:21 10 · 24"
    },
    {
        id: 3,
        title: "Meeting Minutes - Q4",
        content: "#4 Key Teakawes\n• QQrevenue targets discussed\n• New marketing campaign planned.",
        category: "Fromt ters",
        date: "20.10.10 · 22"
    },
    {
        id: 4,
        title: "Sualoing",
        content: "642 1 oains ting targes discussed\n11 hoed",
        category: "Fromt ters",
        date: "20.16.10 · 22"
    },
    {
        id: 5,
        title: "Grocery List",
        content: "6434 insr ting tines alky\n11 hes is",
        category: "Fromt texs",
        date: "20:21 30 · 27"
    },
    {
        id: 6,
        title: "Grocery List",
        content: "Follow with design team\n21 hecd",
        category: "Fromt texs",
        date: "20:21 30 · 27"
    }
];

let currentNoteId = 3;
let currentView = 'all';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    renderNotes();
    loadNote(currentNoteId);
    setupEventListeners();
});

function setupEventListeners() {
    // New note button
    document.getElementById('newNoteBtn').addEventListener('click', createNewNote);
    
    // Search
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // Note title and content
    document.getElementById('noteTitle').addEventListener('input', saveCurrentNote);
    document.getElementById('editorContent').addEventListener('input', saveCurrentNote);
    
    // Toolbar buttons
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', () => handleToolbarAction(btn.dataset.action));
    });
    
    // Footer buttons
    document.getElementById('deleteBtn').addEventListener('click', deleteCurrentNote);
    document.getElementById('duplicateBtn').addEventListener('click', duplicateCurrentNote);
    document.getElementById('exportBtn').addEventListener('click', exportCurrentNote);
    document.getElementById('shareBtn').addEventListener('click', shareCurrentNote);
    
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            currentView = item.dataset.view;
            renderNotes();
        });
    });
}

function renderNotes() {
    const container = document.getElementById('notesList');
    container.innerHTML = '';
    
    const filteredNotes = filterNotes();
    
    filteredNotes.forEach(note => {
        const noteEl = document.createElement('div');
        noteEl.className = `note-item ${note.id === currentNoteId ? 'active' : ''}`;
        noteEl.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content.substring(0, 60)}...</p>
            <div class="note-meta">${note.category}<br>${note.date}</div>
        `;
        noteEl.addEventListener('click', () => loadNote(note.id));
        container.appendChild(noteEl);
    });
}

function filterNotes() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    return notes.filter(note => 
        note.title.toLowerCase().includes(searchTerm) || 
        note.content.toLowerCase().includes(searchTerm)
    );
}

function loadNote(id) {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    
    currentNoteId = id;
    document.getElementById('noteTitle').value = note.title;
    document.getElementById('editorContent').innerHTML = note.content.replace(/\n/g, '<br>');
    renderNotes();
}

function saveCurrentNote() {
    const note = notes.find(n => n.id === currentNoteId);
    if (!note) return;
    
    note.title = document.getElementById('noteTitle').value;
    note.content = document.getElementById('editorContent').innerText;
    note.date = new Date().toLocaleString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    }).replace(',', ' ·');
    
    renderNotes();
}

function createNewNote() {
    const newNote = {
        id: Date.now(),
        title: "New Note",
        content: "Start typing...",
        category: "Fromt texs",
        date: new Date().toLocaleString('en-GB', { 
            hour: '2-digit', 
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        }).replace(',', ' ·')
    };
    
    notes.unshift(newNote);
    currentNoteId = newNote.id;
    renderNotes();
    loadNote(newNote.id);
}

function deleteCurrentNote() {
    if (confirm('Delete this note?')) {
        notes = notes.filter(n => n.id !== currentNoteId);
        if (notes.length > 0) {
            currentNoteId = notes[0].id;
            loadNote(currentNoteId);
        } else {
            document.getElementById('noteTitle').value = '';
            document.getElementById('editorContent').innerHTML = '';
        }
        renderNotes();
    }
}

function duplicateCurrentNote() {
    const note = notes.find(n => n.id === currentNoteId);
    if (!note) return;
    
    const duplicate = {
        ...note,
        id: Date.now(),
        title: note.title + ' (Copy)',
        date: new Date().toLocaleString('en-GB', { 
            hour: '2-digit', 
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        }).replace(',', ' ·')
    };
    
    notes.unshift(duplicate);
    currentNoteId = duplicate.id;
    renderNotes();
    loadNote(duplicate.id);
}

function exportCurrentNote() {
    const note = notes.find(n => n.id === currentNoteId);
    if (!note) return;
    
    const blob = new Blob([`${note.title}\n\n${note.content}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

function shareCurrentNote() {
    const note = notes.find(n => n.id === currentNoteId);
    if (!note) return;
    
    if (navigator.share) {
        navigator.share({
            title: note.title,
            text: note.content
        });
    } else {
        alert('Share functionality not supported in this browser');
    }
}

function handleSearch(e) {
    renderNotes();
}

function handleToolbarAction(action) {
    const editor = document.getElementById('editorContent');
    
    // Toggle active state
    event.target.classList.toggle('active');
    
    switch(action) {
        case 'bold':
            document.execCommand('bold', false, null);
            break;
        case 'strikethrough':
            document.execCommand('strikeThrough', false, null);
            break;
        case 'link':
            const url = prompt('Enter URL:');
            if (url) document.execCommand('createLink', false, url);
            break;
        case 'clear':
            if (confirm('Clear all formatting?')) {
                document.execCommand('removeFormat', false, null);
            }
            break;
        case 'emoji':
            const emoji = prompt('Enter emoji:');
            if (emoji) document.execCommand('insertText', false, emoji);
            break;
        case 'style':
            const style = prompt('Choose style: h1, h2, h3, or p', 'h2');
            if (style) document.execCommand('formatBlock', false, `<${style}>`);
            break;
    }
    
    saveCurrentNote();
}
