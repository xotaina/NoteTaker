const PATH_NOTES = '/notes';
const noteElements = {};

if (window.location.pathname === PATH_NOTES) {
  noteElements.noteTitle = document.querySelector('.note-title');
  noteElements.noteText = document.querySelector('.note-textarea');
  noteElements.saveNoteBtn = document.querySelector('.save-note');
  noteElements.newNoteBtn = document.querySelector('.new-note');
  noteElements.noteList = document.querySelectorAll('.list-container .list-group');
}

let activeNote = {};

const fetchOptions = (method, body) => ({
  method,
  headers: {
    'Content-Type': 'application/json',
  },
  body: body ? JSON.stringify(body) : undefined,
});

const fetchNotes = () => fetch('/api/notes', fetchOptions('GET'));
const postNote = note => fetch('/api/notes', fetchOptions('POST', note));
const deleteNoteRequest = id => fetch(`/api/notes/${id}`, fetchOptions('DELETE'));

const updateDisplay = (element, show) => element.style.display = show ? 'inline' : 'none';

const renderActiveNote = () => {
  updateDisplay(noteElements.saveNoteBtn, false);

  if (activeNote.id) {
    ['noteTitle', 'noteText'].forEach(elem => {
      noteElements[elem].setAttribute('readonly', true);
      noteElements[elem].value = activeNote[elem];
    });
  } else {
    ['noteTitle', 'noteText'].forEach(elem => {
      noteElements[elem].removeAttribute('readonly');
      noteElements[elem].value = '';
    });
  }
};

const handleNoteSave = async () => {
  const newNote = {
    title: noteElements.noteTitle.value,
    text: noteElements.noteText.value,
  };
  await postNote(newNote);
  await renderNotes();
  renderActiveNote();
};

const handleNoteDelete = async (e) => {
  e.stopPropagation();
  const noteId = JSON.parse(e.target.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  await deleteNoteRequest(noteId);
  await renderNotes();
  renderActiveNote();
};

const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

const handleNewNoteView = () => {
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!noteElements.noteTitle.value.trim() || !noteElements.noteText.value.trim()) {
    updateDisplay(noteElements.saveNoteBtn, false);
  } else {
    updateDisplay(noteElements.saveNoteBtn, true);
  }
};

const createNoteListItem = (text, withDeleteButton = true) => {
  const listItem = document.createElement('li');
  listItem.classList.add('list-group-item');

  const titleSpan = document.createElement('span');
  titleSpan.classList.add('list-item-title');
  titleSpan.innerText = text;
  titleSpan.addEventListener('click', handleNoteView);

  listItem.append(titleSpan);

  if (withDeleteButton) {
    const deleteBtn = document.createElement('i');
    deleteBtn.classList.add(
      'fas',
      'fa-trash-alt',
      'float-right',
      'text-danger',
      'delete-note'
    );
    deleteBtn.addEventListener('click', handleNoteDelete);

    listItem.append(deleteBtn);
  }

  return listItem;
};

const renderNoteList = async (notes) => {
  let noteItems = await notes.json();

  if (window.location.pathname === PATH_NOTES) {
    noteElements.noteList.forEach((el) => (el.innerHTML = ''));
  }

  if (!noteItems.length) {
    noteItems.push(createNoteListItem('No saved Notes', false));
  } else {
    noteItems = noteItems.map(note => {
      const listItem = createNoteListItem(note.title);
      listItem.dataset.note = JSON.stringify(note);
      return listItem;
    });
  }

  if (window.location.pathname === PATH_NOTES) {
    noteItems.forEach((note) => noteElements.noteList[0].append(note));
  }
};

const renderNotes = () => fetchNotes().then(renderNoteList);

if (window.location.pathname === PATH_NOTES) {
  noteElements.saveNoteBtn.addEventListener('click', handleNoteSave);
  noteElements.newNoteBtn.addEventListener('click', handleNewNoteView);
  noteElements.noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteElements.noteText.addEventListener('keyup', handleRenderSaveBtn);
}

renderNotes();
