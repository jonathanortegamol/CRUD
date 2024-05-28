document.addEventListener('DOMContentLoaded', () => {
    let id = 0;
    const form = document.getElementById('person-form');
    const nameInput = document.getElementById('name');
    const ageInput = document.getElementById('age');
    const localPersonList = document.getElementById('local-person-list');
    const sessionPersonList = document.getElementById('session-person-list');

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const loadPeople = () => {
        const localPeople = JSON.parse(localStorage.getItem('people')) || [];
        const sessionPeople = JSON.parse(sessionStorage.getItem('people')) || [];

        localPersonList.innerHTML = '';
        sessionPersonList.innerHTML = '';

        localPeople.forEach(person => addPersonToDOMLocal(person, localPersonList));
        sessionPeople.forEach(person => addPersonToDOMSession(person, sessionPersonList));
    };

    const addPersonToDOMLocal = (person, list) => {
        const form = document.createElement('form');
        form.innerHTML = `
            <input type="text" id="name${person.id}" value="${person.name}" required>
            <input type="number" id="age${person.id}" value="${person.age}" required>
            <button type="button" onclick="removePerson(${person.id})">Eliminar</button>
            <button type="button" onclick="updatePerson(${person.id})">Actualizar</button>
        `;
        list.appendChild(form);
    };

    const addPersonToDOMSession = (person, list) => {
        const form = document.createElement('form');
        form.innerHTML = `
            <input type="text" id="name${person.id}" value="${person.name}" disabled>
            <input type="number" id="age${person.id}" value="${person.age}" disabled>
        `;
        list.appendChild(form);
    };

    const updatePerson = (id) => {
        const nameIn = document.getElementById('name' + id);
        const ageIn = document.getElementById('age' + id);
        const name = nameIn.value.trim();
        const age = ageIn.value.trim();

        if (name && age) {
            removePerson(id);
            const person = { id, name, age };
            savePerson(person);
            addPersonToDOMLocal(person, localPersonList);
            addPersonToDOMSession(person, sessionPersonList);
        }
    };

    const savePerson = (person) => {
        const localPeople = JSON.parse(localStorage.getItem('people')) || [];
        const sessionPeople = JSON.parse(sessionStorage.getItem('people')) || [];
        localPeople.push(person);
        sessionPeople.push(person);
        localStorage.setItem('people', JSON.stringify(localPeople));
        sessionStorage.setItem('people', JSON.stringify(sessionPeople));
    };

    const removePerson = (id) => {
        let localPeople = JSON.parse(localStorage.getItem('people')) || [];
        let sessionPeople = JSON.parse(sessionStorage.getItem('people')) || [];
        localPeople = localPeople.filter(person => person.id !== id);
        sessionPeople = sessionPeople.filter(person => person.id !== id);
        localStorage.setItem('people', JSON.stringify(localPeople));
        sessionStorage.setItem('people', JSON.stringify(sessionPeople));
        loadPeople();
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = nameInput.value.trim();
        const age = ageInput.value.trim();

        if (name && age) {
            id = getRandomInt(10, 1000);
            const person = { id, name, age };
            savePerson(person);
            addPersonToDOMLocal(person, localPersonList);
            addPersonToDOMSession(person, sessionPersonList);
            nameInput.value = '';
            ageInput.value = '';
        }
    });

    window.removePerson = removePerson; // Hacer la función accesible globalmente para el botón de eliminación
    window.updatePerson = updatePerson;

    loadPeople();
});