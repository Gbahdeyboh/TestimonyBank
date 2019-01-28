function displayHeaderOptions(){
    const headerOption = document.querySelector('#headerOptionBody');
    headerOption.style.display = "block";
}

function closeHeaderOptions(){
    const headerOption = document.querySelector('#headerOptionBody');
    headerOption.style.display = "none";    
}

function logout(){
    if(localStorage.getItem('t_b_tok') === null){
        //user is logged out
    }
    else{
        //Log user out
        localStorage.removeItem('t_b_tok');
        localStorage.removeItem('t_b_data');
    }
    window.location.assign('./index.html');
}


//when user is logged in, display user details i.e name, email etc
window.onload = () => {
    localStorage.getItem('t_b_tok') === null ? window.location.assign('./index.html') : loadUserData();
}

function loadUserData(){
    const data = JSON.parse(localStorage.getItem('t_b_data'));
    const name = data.payload.data.name;
    const email = data.payload.data.email;
    const number = data.payload.data.number;
    document.querySelector('#userName').innerHTML = name.substr(0, 10) + '.....';
    document.querySelector('#userDetailName').innerHTML = name;
    document.querySelector('#userEmail').innerHTML = email;
}


//Load all testimonies in batch
(function loadTestimonies(){
    const token = localStorage.getItem('t_b_tok');
    fetch('http://localhost:5000/api/getTestimony', {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    .then(data => {
        return data.json();
    })
    .then(data => {
        document.addEventListener('DOMContentLoaded', () => {
            let testimonyWrapper = document.querySelector('#testimonies');
            const testimonies = data.payload.data;
            for(let i = 0; i < testimonies.length; i++){
                const extractDateDetails = testimonies[i].datePosted.split('T').shift().split('-');
                const dt = new Date(extractDateDetails);
                const datePosted = dt.toGMTString().split('00:00:00 GMT')[0];
                console.log(datePosted);
                testimonyWrapper.innerHTML += `
                        <div class="testimonyBody z-depth-2">
                        <div class="testimonyHead fullWidth displayFlex pad">${testimonies[i].title}</div>
                        <div class="testimonyStory">
                                ${testimonies[i].testimony.substr(0, 350)}
                                (Read More....)
                        </div>
                        <div class="testimonyOwner row">
                            <div class="col s3 m3 l3 fullHeight displayFlex">
                                <img src="images/istock-881959374-960x526 (1).jpg" class="testimonyImage"/>
                            </div>
                            <div class="col s9 m9 l9 fullHeight">
                                <div class="halfHeight displayFlexLeft">
                                    Bello Gbadebo
                                </div>
                                <div class="halfHeight datePosted">Posted on ${datePosted}</div>
                            </div>
                        </div>
                        <div class="testimonyAction row">
                            <div class="col s4 m4 l4 fullHeight displayFlex"> 
                                <i class="icon_heart_alt fa-2x testimonyIcon" title="like"></i>
                                <span class="testimonyIconNumbers">${testimonies[i].likes}</span>
                            </div>
                            <div class="col s4 m4 l4 fullHeight displayFlex">
                                    <i class="icon_comment_alt fa-2x testimonyIcon" title="comment"></i>
                                    <span class="testimonyIconNumbers">${testimonies[i].comments}</span>
                            </div>
                            <div class="col s4 m4 l4 fullHeight displayFlex">
                                <i class="fas fa-share fa-2x testimonyIcon" title="share"></i>
                                <span class="testimonyIconNumbers">${testimonies[i].shares}</span>
                            </div>
                        </div>
                    </div>
                `;
            }
        });
    })
    .catch(err => {
        console.log("Could not fetch testimonies : ", err);
    })
})();



document.addEventListener('DOMContentLoaded', () => {
    const headerOptionButton = document.querySelector('#iconBody');
    const closeHeaderOptionButton = document.querySelector('#headerOptionsClose');

    //Display the header Option when the menu option is clicked
    headerOptionButton.addEventListener('click', () => {
        displayHeaderOptions();
    });

    //close the header option

    closeHeaderOptionButton.addEventListener('click', () => {
        closeHeaderOptions();
    });
});

var a = `What shall we then say to these things? If God be for us, who can be against us?
When our back was against the wall and it looked like all was over, menopause came knocking, when doctors said No, at the age of 54, then You God appeared and gave us twins (A boy and Girl).

Here is a glaring evidence, to lay credence to the fact that when God shows, the incredulous is inevitable.

The God that fetches water with basket just to disgrace the bucket, The One so big that he made the earth his footstool yet so small that he lives in the heart of men. Aja ma fi ti’bon se, Oba ajidara, Olugbeja, agbada gbururu, odogwu akataka, Ekwueme, Onye Ukwu, Osimiri atata, ebube dike na’ha, Omena mma’du, Ekwueme,
akiikitan, agbanilagbatan, alagbadaina, Ogbeninijakeruobonija,Apataidigbolu, gbani gbani, arogund’ade, Ariroala , kiki ola, kiki Ogo, we worship you Lord.
To everyone reading this testimony and expecting a miracle from God, The Lord shall suddenly come into His Temple and grant answers to your prayers in Jesus name, Amen.`

console.log(a);
