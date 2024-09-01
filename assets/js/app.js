document.addEventListener("DOMContentLoaded", function() {
    const addInput = document.getElementById('addInput');
    const searchInput = document.getElementById('searchInput');
    const wordsTableBody = document.getElementById('wordsBody');

    let words = JSON.parse(localStorage.getItem('words')) || [];

    function renderTable() {
        wordsTableBody.innerHTML = '';
        words.forEach((word, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${word} <i class="fa-solid fa-trash" data-index="${index}"></i></td>
            `;
            wordsTableBody.appendChild(row);
        });

        document.querySelectorAll('.fa-trash').forEach(icon => {
            icon.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                words.splice(index, 1);
                localStorage.setItem('words', JSON.stringify(words));
                renderTable();
            });
        });
    }

    addInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const word = addInput.value.trim();
            if (word) {
                if (words.includes(word)) {
                    alert("Bu söz artıq istifadə olunub!");
                } else {
                    words.push(word);
                    localStorage.setItem('words', JSON.stringify(words));
                    renderTable();
                    addInput.value = '';
                }
            }
        }
    });

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredWords = words.filter(word => word.toLowerCase().includes(searchTerm));
        
        wordsTableBody.innerHTML = '';
        filteredWords.forEach((word, index) => {
            const highlightedWord = word.replace(new RegExp(searchTerm, 'gi'), match => `<span style="background-color: yellow;">${match}</span>`);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${highlightedWord} <i class="fa-solid fa-trash" data-index="${index}"></i></td>
            `;
            wordsTableBody.appendChild(row);
        });

        document.querySelectorAll('.fa-trash').forEach(icon => {
            icon.addEventListener('click', function() {
                const wordToDelete = icon.closest('tr').children[1].textContent.trim();
                words = words.filter(word => word !== wordToDelete);
                localStorage.setItem('words', JSON.stringify(words));
                renderTable();
            });
        });
    });

    renderTable();
});
