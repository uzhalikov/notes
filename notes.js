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
            bottom: 20px;
            width: 300px;
            border: 1px solid #888888;
            background: rgb(255 255 135);
            border-radius: 5px 0 5px 0;
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
        .notes input{
            width: 98%;
            outline: 0;
            border: 0;
            border-bottom: 1px solid #888888;
            padding: 5px 5px 2px 5px;
            border-radius: 5px 5px;
        }
        .notes input:hover, .notes input:focus, .notes input:active{
            box-shadow: none;
        }
        .closed{
            transition: 0.6s;
            transform: scale(0.15);
            transform-origin: right bottom;
            cursor: pointer;
            .notes__block, .notes__buttons{
                pointer-events: none;
                opacity: 0;
            }
        }
        .closed::after{
            content: 'Notes';
            font-size: 100px;
            position: fixed;
            font-weight: 900;
            bottom: 50px;
            left: 25px;
        }
        .notes__buttons{
            opacity: 0;
            position: absolute;
            top: -30px;
            right: -1px;
            font-family: Verdana, Geneva, Tahoma, sans-serif;
            font-size: 18px;
            transition: 0.6s;
            text-align: right;
            border: 1px solid #888888;
            border-bottom: 0;
            border-radius: 5px 5px 0 0;
            background: rgb(255 255 135);
            cursor: default;
            height: 29px;
            padding: 3px;
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
        .notes__list::-webkit-scrollbar {
            width: 10px;
        }
        .notes__list::-webkit-scrollbar-track {
            background: #fff;
        }
        .notes__list::-webkit-scrollbar-thumb {
            background: rgb(255 255 135);
            border: 3px solid #fff; 
            border-radius: 5px;
        }
        .check-container{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 5px;
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            z-index: 1000;
            background: rgb(255 255 135);
        }
        .check-container button, .check-container input{
            padding: 5px;
            border-radius: 5px;
            width: 150px;
            background: #fff;
        }
        .check-container span{
            color: red;
            font-size: 12px;
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
const setCheckContainer = (notesSecret) => {
    const container = document.createElement('div')
    container.className = 'check-container'
    container.innerHTML = `
        <label for="check-password">${notesSecret ? "Введите пароль:" : "Необходимо задать пароль:"}</label>
        <input name="check-password"/>
        <button>Ок</button>
        <span id="password-errors"></span>`
    return container
}
const updateLocalStorage = () => {
    const currentNotes = localStorage.getItem('notes')
    if(currentNotes){
        const copyLocalStorage = [...Object.entries(JSON.parse(currentNotes))]
        localStorage.removeItem('notes')
        const newNotes = {}
        copyLocalStorage.sort().forEach((item, index) => {
            newNotes[`note_${index + 1}`] = item[1]
        })
        localStorage.setItem('notes', JSON.stringify(newNotes))
    }
}
const deleteAllData = () => {
    localStorage.removeItem('notes')
    localStorage.removeItem('notes_secret')
    Array.from(document.querySelector('.notes__list').children).forEach(item => item.remove())
}
const updateNotes = () => {
    Array.from(document.querySelector('.notes__list').children).forEach((item, index) => {
        item.id = `note_${index + 1}`
    })
}
const addNote = (target) => {
    const currentNotes = localStorage.getItem('notes')
    if(currentNotes){
        const parseNotes = JSON.parse(currentNotes)
        parseNotes[target.id] = target.value
        localStorage.setItem('notes', JSON.stringify(parseNotes))
    }
    else{
        localStorage.setItem('notes', JSON.stringify({[target.id]: target.value}))
    }
}
const removeNote = (target) => {
    const currentNotes = localStorage.getItem('notes')
    const parseNotes = JSON.parse(currentNotes)
    delete parseNotes[target.id]
    localStorage.setItem('notes', JSON.stringify(parseNotes))
    target.remove()
    updateLocalStorage()
    updateNotes()
}
const initNotes = () => {
    const data = document.createElement('div')
    data.innerHTML = initData
    document.body.append(data)
    const currentNotes = localStorage.getItem('notes')
    if(currentNotes){
        Object.entries(JSON.parse(currentNotes)).sort().forEach(item => {
            const newField = document.createElement('input')
            newField.type = 'text'
            newField.id = item[0]
            newField.value = item[1]
            document.querySelector('.notes__list').appendChild(newField)
        })
    }
}
const parseJson = (obj) => {
    try{
        return JSON.parse(obj)
    } catch(e){
        console.log(e)
    }
}
document.addEventListener('DOMContentLoaded', () => {
    initNotes()
    
    const notes = document.querySelector('.notes')
    const notesList = notes.querySelector('.notes__list')
    const notesClose = notes.querySelector('.notes__close')
    const noteHide = notes.querySelector('.notes__hide')
    const noteAdd = notes.querySelector('.notes__add')

    notes.addEventListener('click', ({target: {classList}}) => {
        if(classList.contains('closed')){
            let notesSecret = localStorage.getItem('notes_secret')
            const checkContainer = setCheckContainer(notesSecret)
            notes.appendChild(checkContainer)
            classList.remove('closed')
            checkContainer.querySelector('input').focus()
            checkContainer.querySelector('button').addEventListener('click', () => {
                notesSecret = localStorage.getItem('notes_secret')
                const password = checkContainer.querySelector('input').value
                if(notesSecret){
                    const parseSecret = parseJson(notesSecret)
                    if(password && password !== parseSecret.password){
                        if(parseSecret.counts === 3){
                            deleteAllData()
                            checkContainer.remove()
                            classList.add('closed')
                            return
                        }
                        parseSecret.counts += 1
                        localStorage.setItem('notes_secret', JSON.stringify(parseSecret))
                        checkContainer.querySelector('#password-errors').textContent = `Неверный пароль! Осталось попыток: ${4 - parseSecret.counts}`
                    }
                    else if(password === parseSecret.password){
                        checkContainer.remove()
                    }
                }
                else{
                    if(password){
                        localStorage.setItem('notes_secret', JSON.stringify({'password': password, 'counts': 0}))
                        checkContainer.remove()
                    }
                }
            })
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
        if(classList.contains('hide-lock')){
            notes.querySelectorAll('input').forEach(field => field.classList.remove('hidden-text'))
        }
        else{
            notes.querySelectorAll('input').forEach(field => field.classList.add('hidden-text'))
        }
        classList.toggle('hide-lock')
    })

    notesList.addEventListener('keydown', (event) => {
        if(event.target.value && event.key === 'Enter'){
            addNote(event.target)
            event.target.blur()
        }
    })
    notesList.addEventListener('change', ({target}) => {
        if(!target.value){
            removeNote(target)
        }
        else{
            addNote(target)
        }
    })
})
