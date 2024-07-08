const addProfileBtn = document.getElementById('add-profile-btn');
const profileDropdown = document.querySelector('.dropdown-container');
const profileDropdownButton = document.querySelector('#profileDropdown');
const profileList = document.getElementById('profileList');
const applyBtn = document.getElementById('apply-btn');
const addCompanyBtn = document.getElementById('company-btn');
const applicationForm = document.querySelector('#applicationForm');
const companyForm = document.querySelector('#companyForm');
const applicationList = document.getElementById('applicationList');

const token = localStorage.getItem('token');
const profile = localStorage.getItem('selectedProfile');
const profileId = localStorage.getItem('selectedProfileId');

const host = 'localhost';
const port = '3000';

document.addEventListener('DOMContentLoaded', async () => {
    if (!token) {
        alert('No token found in localStorage');
        return;
    }

    if (profile) {
        profileDropdownButton.textContent = profile;
    }
    applicationForm.style.display = 'none';
    addProfileBtn.addEventListener('click', fetchProfiles);
    await fetchProfiles();
});

companyForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const companyName = event.target.companyName.value;
    const email = event.target.email.value;
    const phone = event.target.phone.value;
    const companySize = event.target.companySize.value;
    const industry = event.target.industry.value;
    const notes = event.target.notes.value;

    const companyData = {
        name: companyName,
        email: email,
        phone: phone,
        companySize: companySize,
        industry: industry,
        notes: notes,
        profileId: profileId
    }

    try {
        const created = await axios.post(`http://${host}:${port}/company/add-company`, companyData, {
            headers: {
                'Authorization': `${token}`
            }
        });
        await displayCompanies(created.data.companies);
        companyForm.reset();

    } catch (error) {
        console.log(error);
    }










})




addProfileBtn.addEventListener('click', async () => {
    window.location.href = '../profile/profile.html'
});

applyBtn.addEventListener('click', async () => {
    companyForm.style.display = 'none';

    if (applicationForm.style.display === 'none') {
        applicationForm.style.display = 'block';
        setButton(applyBtn);
        unsetButton(addCompanyBtn);

    } else {
        applicationForm.style.display = 'none';
    }

})

addCompanyBtn.addEventListener('click', async () => {
    applicationForm.style.display = 'none';
    if (companyForm.style.display === 'none') {
        companyForm.style.display = 'block';
        setButton(addCompanyBtn);
        unsetButton(applyBtn);
        await displayCompanies();
    } else {
        companyForm.style.display = 'none';
    }

})




async function fetchProfiles() {
    try {
        const response = await axios.get(`http://${host}:${port}/profile/get-profiles`, {
            headers: {
                'Authorization': `${token}`
            }
        });

        if (response.status === 200) {
            const profiles = response.data.profiles;
            if (profiles.length > 0) {
                displayProfilesDropdown(profiles);
            } else {
                profileDropdown.style.display = 'none';
            }
        } else {
            throw new Error('Failed to fetch profiles');
        }

    } catch (error) {
        console.log(error);
    }
}

function displayProfilesDropdown(profiles) {
    profileDropdown.style.display = 'block';

    profileList.innerHTML = ''; // Clear previous profiles if any

    profiles.forEach(profile => {
        const profileItem = document.createElement('li');
        profileItem.innerHTML = `<a class="dropdown-item" href="#">${profile.name}</a>`;
        profileItem.addEventListener('click', () => {
            setProfile(profile.name, profile.id);
        });
        profileList.appendChild(profileItem);
    });
}

function setProfile(profileName, profileId) {
    profileDropdownButton.textContent = profileName;
    localStorage.setItem('selectedProfile', profileName);
    localStorage.setItem('selectedProfileId', profileId);
}




function setButton(btn) {
    if (btn.classList.contains('btn-secondary')) {
        btn.classList.remove('btn-secondary');
        btn.classList.add('btn-primary');
    }
}

function unsetButton(btn) {
    if (btn.classList.contains('btn-primary')) {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary');

    }
}


async function displayCompanies() {

    applicationList.innerHTML = '';

    const created = await axios.get(`http://${host}:${port}/company/get-companies/?profile=${profileId}`, {
        headers: {
            'Authorization': `${token}`
        }
    });


    const companyInput = companyForm.querySelector('#companyName');
    const emailInput = companyForm.querySelector('#email');
    const phoneInput = companyForm.querySelector('#phone');
    const companySizeInput = companyForm.querySelector('#companySize');
    const industryInput = companyForm.querySelector('#industry');
    const notesInput = companyForm.querySelector('#notes');



    const companies = created.data.companies;

    for (item of companies) {
        const name = item.name;
        const email = item.email;
        const phone = item.phone;
        const companySize = item.companySize;
        const industry = item.industry;
        const notes = item.notes;

        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        const itemText = document.createElement('p');
        itemText.textContent = `${name}`;

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

        applicationList.appendChild(listItem);



        editButton.addEventListener('click', async () => {

            companyInput.value = name;
            emailInput.value = email;
            phoneInput.value = phone;
            companySizeInput.value = companySize;
            industryInput.value = industry;
            notesInput.value = notes;

            
            applicationList.removeChild(listItem);
        });

        deleteButton.addEventListener('click', async () => {
            await axios.delete(`http://${host}:${port}/company/delete?profile=${profileId}&name=${name}`, { headers: { "Authorization": token } });
            applicationList.removeChild(listItem);
        });


    }



}


