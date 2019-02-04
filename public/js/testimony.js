/**!
* Testimony Bank by @Gbahdeyboh - "web link"
* Licence - 
*/


/**
 * @param {Object} DisplayTestimonyStuffs - displays stuffs on the testimony page
 * @property {String} overlay - grabs the overlay DOM
 * @property {String} headerOptionBody - grabs the headerOptionBody DOM
 * @property {String} postTestimonyContainer - grabs the postTestimonyContainer DOM
 * @param {methods} [displayHeaderOptions, displayTestifyPrompt] - display the specified DOM Object 
 */
class DisplayTestimonyStuffs extends DisplayStuffs{
    constructor(){
        super();
        this.overlay = document.querySelector('#overlay');
        this.headerOption = document.querySelector('#headerOptionBody');
        this.testifyContainer = document.querySelector('#postTestimonyContainer');
        this.testimonyLoader = document.querySelector('#testimonyLoader');
    }
    displayHeaderOptions(){
        this.displayStuff(this.headerOption);
    }
    closeHeaderOptions(){
        this.hideStuff(this.headerOption);
    }
    displayTestifyPrompt(){
        this.displayFlexStuff(this.testifyContainer);
        this.displayStuff(overlay);
    }
    closeTestifyPrompt(){
        this.hideStuff(this.testifyContainer);
        this.hideStuff(overlay);
    }
}

//check if user is logged in, if not redirect user
document.addEventListener('DOMContentLoaded', () => {
    localStorage.getItem('t_b_tok') === null ? window.location.assign('./index.html') : loadUserData();
})
//when user is logged in, display user details i.e name, email etc
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
window.onload = () => {
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
                    <div class="testimonyStory" data-id="${testimonies[i]._id}"  onclick="viewTestimonyDetails(this)">
                            ${testimonies[i].testimony.length > 300 ? testimonies[i].testimony.substr(0, 300) + ' (Read More....)' : testimonies[i].testimony}
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
            const loading = document.querySelector('#testimonyLoading');
            new DisplayStuffs().hideStuff(loading);
        }
    })
    .catch(err => {
        console.log("Could not fetch testimonies : ", err);
    })
};

function closeTestifyPrompt(){
    const TestimonyDisp = new DisplayTestimonyStuffs();
    TestimonyDisp.closeTestifyPrompt();
}

function logout(){
    localStorage.getItem('t_b_tok') === null ? true /*User isn't logged in*/ : (() => {
        //Log user out
        localStorage.removeItem('t_b_tok');
        localStorage.removeItem('t_b_data');
        window.location.assign('./index.html'); //redirect user to homepage
    })();
}


function testify(){
    const data = JSON.parse(localStorage.getItem('t_b_data')); //users data
    const token = data.payload.token;
    const postersId = data.payload.data._id;
    const postersName = data.payload.data.name;
    const title = document.querySelector('#testimonyTitleInput');
    const testimony = document.querySelector('#testimonyContentInput');
    const errorContainer = document.querySelector('#testimonyError');
    console.log("hellllooooooo");
    title.value === "" || testimony.value === "" ? new DisplayStuffs().displayFlexStuff(errorContainer) : fetch('http://localhost:5000/api/addTestimony', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            postersName: postersName,
            postersId: postersId,
            title: title.value,
            testimony: testimony.value
        })
    })
    .then(response => {
        return response.json();
    })
    .then(response => {
        new DisplayStuffs().hideStuff(errorContainer);
        title.value = "";
        testimony.value = "";
        if(response.success){
            const testimonyLoader = document.querySelector('#testimonyLoader');
            new DisplayStuffs().displayFlexStuff(testimonyLoader);
            setTimeout(() => {
                new DisplayStuffs().hideStuff(testimonyLoader);
                new DisplayTestimonyStuffs().closeTestifyPrompt();
            }, 4000);
        }
        console.log(response);
    })
    .catch(err => {
        console.log(err);
    });
}


function viewTestimonyDetails(dom){
    const postersId = dom.dataset.id;
    const disp = new DisplayStuffs();
    const testimonyDetailContainer = document.querySelector('#testimonyContainerActive');
    const overlay = document.querySelector('#overlay');
    disp.displayFlexStuff(testimonyDetailContainer);
    disp.displayFlexStuff(overlay);
}


function closeTestimonyDetails(){
    const overlay = document.querySelector('#overlay');
    const testimonyDetailContainer = document.querySelector('#testimonyContainerActive');
    new DisplayStuffs().hideStuff(testimonyDetailContainer);
    new DisplayStuffs().hideStuff(overlay);
}


document.addEventListener('DOMContentLoaded', () => {
    const headerOptionButton = document.querySelector('#iconBody');
    const closeHeaderOptionButton = document.querySelector('#headerOptionsClose');
    const shareTestimony = document.querySelector('#shareTestimony');

    const TestimonyDisp = new DisplayTestimonyStuffs();

    //Display the header Option when the menu option is clicked
    headerOptionButton.addEventListener('click', () => {
        TestimonyDisp.displayHeaderOptions();
    });

    //close the header option
    closeHeaderOptionButton.addEventListener('click', () => {
        TestimonyDisp.closeHeaderOptions();
    });

    //display prompt to post new testimony
    testifyBtn.addEventListener('click', () => {
        TestimonyDisp.displayTestifyPrompt();
    });

    //share testimony
    shareTestimony.addEventListener('click', () => {
        testify();
    });
});

