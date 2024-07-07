
const profileForm = document.querySelector('form');
const profileNameInput = document.getElementById('profileName');
const profileEmailInput = document.getElementById('profileEmail');
const profilePhoneInput = document.getElementById('profilePhone');
const listGroup = document.querySelector('.list-group');
const paginationDiv = document.querySelector('#pagination');

let currentPage = 1;
const itemsPerPage = 3;
const backendHost = 'localhost';

async function fetchProfiles(page = 1) {
    try {
        const token = localStorage.getItem('token');
        const { data: { profiles, ...pageData } } = await axios.get(`http://${backendHost}:4000/profile/get-profiles?page=${page}`, { headers: { "Authorization": token } });
        showProfiles(pageData.data);
        updatePagination(pageData.lastPage, pageData.currentPage);
    } catch (error) {
        console.log(error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const token = localStorage.getItem('token');
        paginationDiv.innerHTML = '';
        profileForm.style.display = 'block';
        fetchProfiles(1);
    } catch (error) {
        console.log(error);
    }
});

profileForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const profileName = profileNameInput.value;
    const profileEmail = profileEmailInput.value;
    const profilePhone = profilePhoneInput.value;
    const token = localStorage.getItem('token');
    const profileData = { profileName, profileEmail, profilePhone };

    try {
        const response = await axios.post(`http://${backendHost}:4000/profile/add-profile`, profileData, { headers: { "Authorization": token } });
        profileForm.style.display = 'block';
        addProfileToList(response.data);
        profileForm.reset();
        fetchProfiles(currentPage);
    } catch (error) {
        console.log(error);
    }
});

function showProfiles(profiles) {
    listGroup.innerHTML = '';
    profiles.forEach(profile => addProfileToList(profile));
}

function addProfileToList(profile) {
    const { profileName, profileEmail, profilePhone, id } = profile;
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

    const itemText = document.createElement('p');
    itemText.textContent = `${profileName} - ${profileEmail} - ${profilePhone}`;

    const buttonGroup = document.createElement('div');

    const editButton = document.createElement('button');
    editButton.className = 'btn btn-warning btn-sm me-2';
    editButton.textContent = 'Edit';

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-danger btn-sm';
    deleteButton.textContent = 'Delete';

    buttonGroup.appendChild(editButton);
    buttonGroup.appendChild(deleteButton);
    listItem.appendChild(itemText);
    listItem.appendChild(buttonGroup);
    listGroup.appendChild(listItem);

    editButton.addEventListener('click', () => {
        profileNameInput.value = profileName;
        profileEmailInput.value = profileEmail;
        profilePhoneInput.value = profilePhone;
        axios.delete(`http://${backendHost}:4000/profile/delete/${id}`, { headers: { "Authorization": token } });
        listGroup.removeChild(listItem);
    });

    deleteButton.addEventListener('click', () => {
        axios.delete(`http://${backendHost}:4000/profile/delete/${id}`, { headers: { "Authorization": token } });
        listGroup.removeChild(listItem);
    });
}

function updatePagination(totalPages, currentPage) {
    paginationDiv.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Prev';
    prevButton.className = 'btn btn-secondary btn-sm me-2 prev-page';
    prevButton.disabled = Number(currentPage) === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchProfiles(currentPage);
        }
    });

    const currentButton = document.createElement('button');
    currentButton.textContent = currentPage;
    currentButton.className = 'btn btn-primary btn-sm me-2 current-page';
    currentButton.disabled = true;

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.className = 'btn btn-secondary btn-sm me-2 next-page';
    nextButton.disabled = Number(currentPage) === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchProfiles(currentPage);
        }
    });

    paginationDiv.appendChild(prevButton);
    paginationDiv.appendChild(currentButton);
    paginationDiv.appendChild(nextButton);
}
