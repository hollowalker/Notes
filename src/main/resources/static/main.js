const NOTES_API_BASE_URL = "/api/v1/notes";

async function getNotes(url) {
    const response = await fetch(url, {
        Method: 'GET',
        Headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        Cache: 'default'
    });
    return response.json();
}
async function createNote(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(data),
    });
    return response.json();
}
async function updateNote(url, data) {
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(data),
    });
    return response.json();
}
async function deleteNote(url, data) {
    await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(data),
    });
}

document.addEventListener('DOMContentLoaded', function() {
    function editNoteClick(){
        let noteId = this.getAttribute("data-id");
        let note = document.querySelectorAll('.note__row[data-note="'+noteId+'"]')[0];
        let name = note.getElementsByClassName("note__row__header__item")[0].textContent;
        let text = note.getElementsByClassName("note__row__text")[0].textContent;

        document.getElementsByName("id")[0].value = parseInt(noteId);
        document.getElementsByName("name")[0].value = name;
        document.getElementsByName("text")[0].value = text;

        document.getElementsByClassName('note__redactor__overlay')[0].style.display = 'block';
        document.getElementsByClassName('note__redactor')[0].style.display = 'flex';
    }
    function editNote() {
        console.log("editNotes init");
        let edits = document.getElementsByClassName("edit");
        for (let i = 0; i < edits.length; i++) {
            edits[i].removeEventListener('click', editNoteClick);
            edits[i].addEventListener('click', editNoteClick);
        }
    }
    function deleteNoteClick() {
        let noteId = this.getAttribute("data-id");
        deleteNote(NOTES_API_BASE_URL + "/" + noteId, {
            "id":noteId
        });
        document.querySelectorAll('.note__row[data-note="'+noteId+'"]')[0].remove();
    }
    function deleteNoteHtml() {
        console.log("deleteNote init");
        let deletes = document.getElementsByClassName("delete");
        for (let i = 0; i < deletes.length; i++) {
            deletes[i].removeEventListener('click', deleteNoteClick);
            deletes[i].addEventListener('click', deleteNoteClick);
        }
    }
    getNotes(NOTES_API_BASE_URL).then((notes) => {
        notes.forEach(note => {
            let note_html = `<div class="note__row" data-note="` + note.id + `">
                <div class="note__row__header">
                    <div class="note__row__header__item">` + note.name + `</div>
                    <div class="note__row__header__tools">
                        <div class="note__row__header__tool edit" data-id="` + note.id + `">edit</div>
                        <div class="note__row__header__tool delete" data-id="` + note.id + `">delete</div>
                    </div>
                </div>
                <div class="note__row__text">` + note.text + `</div>
            </div>`;
            document.getElementsByClassName("note__table")[0].innerHTML += note_html;
        });
        editNote();
        deleteNoteHtml();
    });

    document.getElementById("add-note").addEventListener('click', function() {
        document.getElementsByName("id")[0].value = '';
        document.getElementsByName("name")[0].value = '';
        document.getElementsByName("text")[0].value = '';

        document.getElementsByClassName('note__redactor__overlay')[0].style.display = 'block';
        document.getElementsByClassName('note__redactor')[0].style.display = 'flex';
    });
    document.getElementsByClassName("save_redactor")[0].addEventListener('click', function() {
        if (document.getElementsByName("id")[0].value.length > 0) {
            let noteId = document.getElementsByName("id")[0].value;
            let noteName = document.getElementsByName("name")[0].value;
            let noteText = document.getElementsByName("text")[0].value;
            updateNote(NOTES_API_BASE_URL+"/"+noteId, {
                "id":noteId,
                "name":noteName,
                "text":noteText
            }).then((note) => {
                let note_html = document.querySelectorAll('.note__row[data-note="'+note.id+'"]')[0];
                note_html.getElementsByClassName("note__row__header__item")[0].textContent = note.name;
                note_html.getElementsByClassName("note__row__text")[0].textContent = note.text;
                document.getElementsByName("id")[0].value = '';
                document.getElementsByName("name")[0].value = '';
                document.getElementsByName("text")[0].value = '';
                document.getElementsByClassName('note__redactor__overlay')[0].style.display = 'none';
                document.getElementsByClassName('note__redactor')[0].style.display = 'none';
            });
        } else {
            let noteName = document.getElementsByName("name")[0].value;
            let noteText = document.getElementsByName("text")[0].value;
            createNote(NOTES_API_BASE_URL, {
                "name": noteName,
                "text": noteText
            }).then((note) => {
                let note_html = `<div class="note__row" data-note="` + note.id + `">
                    <div class="note__row__header">
                        <div class="note__row__header__item">` + note.name + `</div>
                        <div class="note__row__header__tools">
                            <div class="note__row__header__tool edit" data-id="` + note.id + `">edit</div>
                            <div class="note__row__header__tool delete" data-id="` + note.id + `">delete</div>
                        </div>
                    </div>
                    <div class="note__row__text">` + note.text + `</div>
                </div>`;
                document.getElementsByClassName("note__table")[0].innerHTML += note_html;
                editNote();
                deleteNoteHtml();
            });
            document.getElementsByName("id")[0].value = '';
            document.getElementsByName("name")[0].value = '';
            document.getElementsByName("text")[0].value = '';
            document.getElementsByClassName('note__redactor__overlay')[0].style.display = 'none';
            document.getElementsByClassName('note__redactor')[0].style.display = 'none';
        }
    });
    document.getElementsByClassName("close_redactor")[0].addEventListener('click', function() {
        document.getElementsByClassName('note__redactor__overlay')[0].style.display = 'none';
        document.getElementsByClassName('note__redactor')[0].style.display = 'none';
    });
});
