const addProfileBtn = document.getElementById('add-profile-btn');
const profileDropdown = document.querySelector('.dropdown-container');
const profileDropdownButton = document.querySelector('#profileDropdown');
const profileList = document.getElementById('profileList');
const apiUrl = 'http://localhost:3000/profile/get-profiles';
const token = localStorage.getItem('token');
const profile = localStorage.getItem('selectedProfile');

document.addEventListener('DOMContentLoaded', async () => {
    if (!token) {
        alert('No token found in localStorage');
        return;
    }

    if (profile) {
        profileDropdownButton.textContent = profile;
    }

    addProfileBtn.addEventListener('click', fetchProfiles);
    await fetchProfiles();
});

async function fetchProfiles() {
    try {
        const response = await axios.get(apiUrl, {
            headers: {
                'Authorization': ` ${token}`
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
            setProfile(profile.name);
        });
        profileList.appendChild(profileItem);
    });
}

function setProfile(profileName) {
    profileDropdownButton.textContent = profileName; 
    localStorage.setItem('selectedProfile', profileName); 
}
