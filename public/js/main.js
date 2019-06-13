/**!
 * Testimony Bank by @Gbahdeyboh - "web link"
 * Licence - 
 */

//After first page has been scrolled, change the class of the header to change how its displayed
function headerScroll() {
    let firstPageBodyHead = document.querySelector('#firstPageBodyHead');
    if (document.documentElement.scrollTop > 600 || document.body.scrollTop > 600) {
        firstPageBodyHead.classList.add('headerScrolled');
    } else {
        firstPageBodyHead.classList.remove('headerScrolled');
    }
}
window.onscroll = () => {
    headerScroll();
}
//If user is logged in, redirect to the testimony page
// if (localStorage.getItem('t_b_tok')) {
//     window.location.assign('./testimony.html');
// }



/**
 * @param {Object} AuthDisplay - displays stuffs on the main page
 * @property {String} overlay - grabs the overlay DOM
 * @property {String} loginContainer - grabs the loginContainer DOM
 * @property {String} accountCreateContainer - grabs the accountCreateContainer DOM
 * @param {methods} [displayLogin, displayAccountCreationContainer] - display the specified DOM Object 
 */

class AuthDisplay extends DisplayStuffs {
    constructor() {
        super();
        this.overlay = document.querySelector('#pageOverlay');
        this.loginContainer = document.querySelector('#loginContainer');
        this.accountCreateContainer = document.querySelector('#signUpContainer');
    }
    displayLogin() {
        this.displayStuff(this.overlay);
        this.displayFlexStuff(this.loginContainer);
    }
    closeLoginDisplay() {
        this.hideStuff(this.overlay);
        this.hideStuff(this.loginContainer);
    }
    displayAccountCreationContainer() {
        this.closeLoginDisplay(); //make sure login display has been closed first
        this.displayStuff(this.overlay);
        this.displayFlexStuff(this.accountCreateContainer);
    }
    closeAccountDisplay() {
        this.hideStuff(this.overlay);
        this.hideStuff(this.accountCreateContainer);
    }
}


//Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const displayLoginBtn = document.querySelector('#loginButton');
    const displayCreateAccountBtn = document.querySelector('#createAccount');
    const closeLoginBtn = document.querySelector('#closeLogin');
    const closeAccountBtn = document.querySelector('#closeSignUp');
    const shareTestimonyBtn = document.querySelector('#shareTestimonyBtn');

    const AuthDisp = new AuthDisplay();

    displayLoginBtn.addEventListener('click', () => {
        AuthDisp.displayLogin(); //display login container when login button is clicked
        authWithEnterBtn(true, false); //Allow user to submit with enter button
    });
    shareTestimonyBtn.addEventListener('click', () => AuthDisp.displayLogin()); //display login container when login button is clicked
    closeLoginBtn.addEventListener('click', () => AuthDisp.closeLoginDisplay()); //close the login container
    displayCreateAccountBtn.addEventListener('click', () => {
        AuthDisp.displayAccountCreationContainer();
        authWithEnterBtn(false, true); //allow user to submit with enter button
    });
    closeAccountBtn.addEventListener('click', () => {
        AuthDisp.closeAccountDisplay()
    });

    fetch(`${api}/api/testimony/get?page=1&&limit=7`)
        .then(data => {
            return data.json();
        })
        .then(testimony => {
            console.log(testimony);
            const testimonies = testimony.payload.data;
            const testimonyWrapper = document.querySelector('#testimonies');
            for (let i = 0; i < testimonies.length; i++) {
                //Format the date posted
                const extractDateDetails = testimonies[i].datePosted.split('T').shift().split('-');
                const dt = new Date(extractDateDetails);
                const datePosted = dt.toGMTString().split('00:00:00 GMT')[0];
                //Store the id in the single testimony prompt
                // document.querySelector('#likeIcon').dataset.id = testimonies[i]._id;
                const likers = testimonies[i].likes; //Number of likes
                // console.log("likers are ", likers);
                let likersList = '';
                likers.forEach(likedBy => {
                    if (likedBy !== 0) {
                        likersList += `<li>${likedBy}</li>`;
                    };
                })
                testimonyWrapper.innerHTML += `   
                    <div class="testimonyBody z-depth-2">
                    <img src="/static/images/liberated_woman.jpg" alt="testimony_img_here" id="testImg"/>
                    <div class="testimonyHead fullWidth displayFlex pad">${testimonies[i].title}</div>
                    <div class="testimonyStory" data-id="${testimonies[i]._id}">
                            ${testimonies[i].testimony.length > 180 ? testimonies[i].testimony.substr(0,180) + ' (Read More....)' : testimonies[i].testimony}
                    </div>
                    <div class="testimonyOwner row" data-id='${testimonies[i].postersId}')">
                        <div class="col s3 m3 l3 fullHeight displayFlex">
                            <img src="/static/images/istock-881959374-960x526 (1).jpg" class="testimonyImage"/>
                        </div>
                        <div class="col s9 m9 l9 fullHeight">
                            <div class="halfHeight displayFlexLeft">
                                ${testimonies[i].postersName}
                            </div>
                            <div class="halfHeight datePosted">Posted on ${datePosted}</div>
                        </div>
                    </div>
                    <div class="testimonyAction row">
                        <div class="col s4 m4 l4 fullHeight displayFlex"> 
                            <i class="icon_heart_alt fa-2x testimonyIcon" data-id="${testimonies[i]._id}" title="like"></i>
                            <span class="testimonyIconNumbers" id="likesNo">
                            <ul id="likesList" class="z-depth-1">
                                ${likersList}
                            </ul>
                                <span id="likess">${testimonies[i].likes.length - 1}</span>
                            </span>
                        </div>
                        <div class="col s4 m4 l4 fullHeight displayFlex">
                                <i class="icon_comment_alt fa-2x testimonyIcon" title="comment" data-id="${testimonies[i]._id}"></i>
                                <span class="testimonyIconNumbers">${testimonies[i].comments.length}</span>
                        </div>
                        <div class="col s4 m4 l4 fullHeight displayFlex">
                            <i class="fas fa-share fa-2x testimonyIcon" title="share"></i>
                            <span class="testimonyIconNumbers">${testimonies[i].shares}</span>
                        </div>
                    </div>
                </div>
            `;
                const loading = document.querySelector('#testimonyLoading');
                // new DisplayStuffs().hideStuff(loading);
            }
        })
        .then(more => {
            document.querySelector('#testimonies').innerHTML += `
        <div class="testimonyBody z-depth-2 displayFlexColumn" id="viewMoreTesimonies">
            <i class="fas fa-newspaper fa-5x"></i>
            <h4>View more testimonies</h4>
        </div>
        `;
            const viewMoreTesimonies = document.querySelector('#viewMoreTesimonies');
            viewMoreTesimonies.addEventListener('click', () => AuthDisp.displayLogin()); //display login container when login button is clicked
            const containers = ['testimonyOwner', 'testimonyStory', 'testimonyIcon']
            containers.forEach(contain => {
                document.querySelectorAll(`.${contain}`).forEach(item => {
                    item.addEventListener('click', () => {
                        console.log("the item is ", item);
                        AuthDisp.displayLogin();
                    })
                })
            })
        })
        .catch(err => {
            console.log(err);
        })

});