const initData = `
    <style>
        *, *::before, *::after{
            padding: 0;
            margin: 0;
            box-sizing: border-box;
        }
        .notes{
            position: fixed;
            right: 10px;
            bottom: 10px;
            width: 300px;
            border: 1px solid #888888;
            background: rgba(238, 238, 82, 0.7);
            border-radius: 2.5% 0 2.5% 2.5%;
            transition: 0.6s;
        }
        .notes__list{
            position: relative;
            height: 200px;
            overflow: auto;
            display: flex;
            flex-direction: column;
            gap: 3px;
        }
        .notes__list input{
            width: 95%;
            outline: 0;
            border: 0;
            border-bottom: 1px solid #888888;
            padding: 5px 5px 2px 5px;
        
        }
        .closed{
            transition: 0.6s;
            transform: scale(0.1);
            transform-origin: right bottom;
            cursor: pointer;
            .notes__block{
                pointer-events: none;
            }
            .notes__list input{
                -moz-text-security: circle; /* FireFox */
                -webkit-text-security: circle; /* Chrome/Safari  */
            }
        }
        .notes__buttons{
            opacity: 0;
            position: absolute;
            width: 100%;
            top: -28px;
            right: -1px;
            font-family: Verdana, Geneva, Tahoma, sans-serif;
            font-size: 18px;
            transition: 0.6s;
            text-align: right;
            border: 1px solid #888888;
            padding: 1px;
            width: max-content;
            border-radius: 5px 5px 0 0;
            background: rgba(238, 238, 82, 0.7);
        }
        .notes__buttons:hover{
            opacity: 1;
            transition: 0.6s;
        }
        .notes__buttons span{
            cursor: pointer;
            user-select: none;
        }
        .notes__block{
            padding: 5px;
        }
        .notes__add{         
           color: green;
        }
        .hidden-text{
            -webkit-text-security: circle;
        }
    </style>
    <div class="notes closed">
        <div class="notes__buttons">
            <span class="notes__close" title="Свернуть заметки">_</span>
            <span class="notes__add" title="Добавить заметку">&plus;</span>
            <span class="notes__hide" title="Скрыть содержимое">&#128274;</span>
        </div>
        <div class="notes__block">
            <div class="notes__list"></div>
        </div>
    </div>`

document.addEventListener('DOMContentLoaded', () => {
    const data = document.createElement('div')
    data.innerHTML = initData
    document.body.append(data)

    const notes = document.querySelector('.notes')
    const notesList = notes.querySelector('.notes__list')
    const notesClose = notes.querySelector('.notes__close')
    const noteHide = notes.querySelector('.notes__hide')
    const noteAdd = notes.querySelector('.notes__add')

    Object.entries(localStorage).sort().forEach(item => {
        const newField = document.createElement('input')
        newField.type = 'text'
        newField.id = item[0]
        newField.value = item[1]
        notesList.appendChild(newField)
    })

    notes.addEventListener('click', ({target: {classList}}) => {
        if(classList.contains('closed')){
            const localPassword = localStorage.getItem('notes_password')
            if(localPassword){
                const password = prompt('Введите пароль: ')
                if(password !== localPassword){
                    return alert('Неверный пароль!')
                }
                classList.remove('closed')
            }
            else{
                const password = prompt('Необходимо установить пароль')
                localStorage.setItem('notes_password', password)
                classList.remove('closed')
            }
        }
    })
    notesClose.addEventListener('click', () => notes.classList.add('closed'))
    noteAdd.addEventListener('click', () => {
        const newField = document.createElement('input')
        newField.type = 'text'
        newField.id = `note_${notesList.children.length + 1}`
        notesList.appendChild(newField)
    })
    noteHide.addEventListener('click', ({target: {classList}}) => {
        if(classList.contains('hidden')){
            notes.querySelectorAll('input').forEach(field => field.classList.remove('hidden-text'))
        }
        else{
            notes.querySelectorAll('input').forEach(field => field.classList.add('hidden-text'))
        }
        classList.toggle('hidden')
    })
    const updateLocalStorage = () => {
        const copyLocalStorage = [...Object.entries(localStorage)]
        localStorage.clear()
        copyLocalStorage.sort().forEach((item, index) => {
            localStorage.setItem(`note_${index + 1}`, item[1])
        })
    }
    const updateNotes = () => {
        Array.from(notesList.children).forEach((item, index) => {
            item.id = `note_${index + 1}`
        })
    }
    notesList.addEventListener('change', ({target}) => {
        if(!target.value){
            localStorage.removeItem(target.id)
            target.remove()
            updateLocalStorage()
            updateNotes()
        }
        else{
            localStorage.setItem(target.id, target.value)
        }
    })
})
