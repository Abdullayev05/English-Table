document.addEventListener("DOMContentLoaded", function() {
    const addInput = document.getElementById('addInput');
    const searchInput = document.getElementById('searchInput');
    const wordsTableBody = document.getElementById('wordsBody');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageNumbers = document.getElementById('pageNumbers');

    const wordsPerPage = 100;
    let words = JSON.parse(localStorage.getItem('words')) || [];
    let currentPage = 1;
    let editingIndex = null;

    function renderTable() {
        wordsTableBody.innerHTML = '';
        const start = (currentPage - 1) * wordsPerPage;
        const end = start + wordsPerPage;
        const pageWords = words.slice(start, end);

        pageWords.forEach((word, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${start + index + 1}</td>
                <td>
                    ${word} 
                    <i class="fa-solid fa-pen-to-square" data-index="${start + index}"></i>
                    <i class="fa-solid fa-trash" data-index="${start + index}"></i>
                </td>
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

        document.querySelectorAll('.fa-pen-to-square').forEach(icon => {
            icon.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                editingIndex = index;
                addInput.value = words[index];
                addInput.focus();
                addInput.classList.add('editing');
            });
        });

        updatePagination();
    }

    function updatePagination() {
        const totalPages = Math.ceil(words.length / wordsPerPage);
        pageNumbers.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.innerHTML += `<button data-page="${i}">${i}</button>`;
        }

        document.querySelectorAll('.pagination button[data-page]').forEach(button => {
            button.addEventListener('click', function() {
                currentPage = parseInt(this.getAttribute('data-page'));
                renderTable();
            });
        });

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(words.length / wordsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });

    addInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const word = addInput.value.trim();
            if (word) {
                if (editingIndex !== null) {
                    words[editingIndex] = word;
                    editingIndex = null;
                    addInput.classList.remove('editing');
                } else if (words.includes(word)) {
                    alert("Bu söz artıq istifadə olunub!");
                } else {
                    words.push(word);
                    localStorage.setItem('words', JSON.stringify(words));
                    
                    if (words.length > currentPage * wordsPerPage) {
                        currentPage = Math.ceil(words.length / wordsPerPage);
                    }
                }

                localStorage.setItem('words', JSON.stringify(words));
                renderTable();
                addInput.value = '';
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
                <td>${highlightedWord} <i class="fa-solid fa-pen-to-square"></i> <i class="fa-solid fa-trash"></i></td>
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

        document.querySelectorAll('.fa-pen-to-square').forEach(icon => {
            icon.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                addInput.value = words[index];
                editingIndex = index;
                addInput.focus();
                addInput.classList.add('editing');
            });
        });
    });

    renderTable();
});
