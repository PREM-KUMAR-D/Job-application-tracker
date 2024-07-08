const addProfileBtn = document.getElementById('add-profile-btn');
const profileDropdown = document.querySelector('.dropdown-container');
const profileDropdownButton = document.querySelector('#profileDropdown');
const profileList = document.getElementById('profileList');
const applyBtn = document.getElementById('apply-btn');
const addCompanyBtn = document.getElementById('company-btn');
const applicationForm = document.getElementById('applicationForm');
const companyForm = document.getElementById('companyForm');

const apiUrl = 'http://localhost:3000/profile/get-profiles';
const token = localStorage.getItem('token');
const profile = localStorage.getItem('selectedProfile');
const profileId = localStorage.getItem('selectedProfileId');

document.addEventListener('DOMContentLoaded', async () => {
    if (!token) {
        alert('No token found in localStorage');
        return;
    }

    if (profile) {
        profileDropdownButton.textContent = profile;
    }
    applicationForm.style.display='none';
    addProfileBtn.addEventListener('click', fetchProfiles);
    await fetchProfiles();
});

companyForm.addEventListener('submit', async (event)=>{
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
        notes: notes
        
    }





})




addProfileBtn.addEventListener('click', async ()=>{
    window.location.href='../profile/profile.html'
});

applyBtn.addEventListener('click', async()=>{
    companyForm.style.display='none';

    if(applicationForm.style.display === 'none'){
        applicationForm.style.display='block';
        setButton(applyBtn);
        unsetButton(addCompanyBtn);
    }else{
        applicationForm.style.display='none';
    }

})

addCompanyBtn.addEventListener('click', async()=>{
    applicationForm.style.display='none';
    if(companyForm.style.display === 'none'){
        companyForm.style.display='block';
        setButton(addCompanyBtn);
        unsetButton(applyBtn);
    }else{
        companyForm.style.display='none';
    }

})




async function fetchProfiles() {
    try {
        const response = await axios.get(apiUrl, {
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
            setProfile(profile.name , profile.id);
        });
        profileList.appendChild(profileItem);
    });
}

function setProfile(profileName,profileId) {
    profileDropdownButton.textContent = profileName; 
    localStorage.setItem('selectedProfile', profileName);
    localStorage.setItem('selectedProfileId',profileId) ;
}




function setButton(btn){
    if(btn.classList.contains('btn-secondary')){
        btn.classList.remove('btn-secondary');
        btn.classList.add('btn-primary');
    }
}

function unsetButton(btn){
    if (btn.classList.contains('btn-primary')) {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary');
        
    }
}
