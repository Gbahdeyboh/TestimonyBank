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
class DisplayTestimonyStuffs extends DisplayStuffs {
    constructor() {
        super();
        this.overlay = document.querySelector('#overlay');
        this.profileOverlay = document.querySelector('#profileOverlay');
        this.headerOption = document.querySelector('#headerOptionBody');
        this.testifyContainer = document.querySelector('#postTestimonyContainer');
        this.testimonyLoader = document.querySelector('#testimonyLoader');
        this.profileContainer = document.querySelector('#profileContainer');
    }
    displayHeaderOptions() {
        this.displayStuff(this.headerOption);
    }
    closeHeaderOptions() {
        this.hideStuff(this.headerOption);
    }
    displayTestifyPrompt() {
        this.displayFlexStuff(this.testifyContainer);
        this.displayStuff(overlay);
    }
    closeTestifyPrompt() {
        this.hideStuff(this.testifyContainer);
        this.hideStuff(overlay);
    }
    displayProfile() {
        this.displayFlexStuff(this.profileContainer);
        this.displayStuff(profileOverlay);
        document.querySelector('#testimonyContainerActive').style.display = "none";
    }
    closeProfile() {
        this.hideStuff(this.profileContainer);
        this.hideStuff(profileOverlay);
        this.hideStuff(overlay);
    }
}


//check if user is logged in, if not redirect user
document.addEventListener('DOMContentLoaded', () => {
    localStorage.getItem('t_b_tok') === null ? window.location.assign('./index.html') : loadUserData();
})
//when user is logged in, display user details i.e name, email etc
function loadUserData() {
    const data = JSON.parse(localStorage.getItem('t_b_data'));
    const name = data.payload.data.name;
    const email = data.payload.data.email;
    const number = data.payload.data.number;
    document.querySelector('#userName').innerHTML = name.substr(0, 10) + '.....';
    document.querySelector('#userDetailName').innerHTML = name;
    document.querySelector('#userEmail').innerHTML = email;
}


/**
 * @desc Load all the testimonies in batches as the user scrolls
 * @param {Number} page - Gives the number of times data has been loaded 
 * or the number of pages that has been loaded from the server
 */
function loadTestimonyData(page) {
    document.querySelector('#testimonyObserver').style.display = 'flex'; //Display the testimony observer loader
    const token = localStorage.getItem('t_b_tok');
    document.querySelector('#testimonyObserver').innerHTML = `
        <div class="preloader-wrapper big active">
            <div class="spinner-layer spinner-red-only">
                <div class="circle-clipper left">
                    <div class="circle"></div>
                    </div><div class="gap-patch">
                    <div class="circle"></div>
                    </div><div class="circle-clipper right">
                    <div class="circle"></div>
                </div>
            </div>
        </div>
    `; //show loading animation
    fetch(`${api}/api/testimony/get?page=${page}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(data => {
            return data.json();
        })
        .then(data => {
            if (!data.success) {
                console.log("No more data to load");
                document.querySelector('#testimonyObserver').innerHTML = '';
                return;
            }
            let testimonyWrapper = document.querySelector('#testimonies');
            console.log("here's the datas", data);
            const testimonies = data.payload.data;
            for (let i = 0; i < testimonies.length; i++) {
                //Format the date posted
                const extractDateDetails = testimonies[i].datePosted.split('T').shift().split('-');
                const dt = new Date(extractDateDetails);
                const datePosted = dt.toGMTString().split('00:00:00 GMT')[0];
                //Store the id in the single testimony prompt
                document.querySelector('#likeIcon').dataset.id = testimonies[i]._id;
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
                    <div class="testimonyStory" data-id="${testimonies[i]._id}"  onclick="viewTestimonyDetails(this)">
                            ${testimonies[i].testimony.length > 180 ? testimonies[i].testimony.substr(0,180) + ' (Read More....)' : testimonies[i].testimony}
                    </div>
                    <div class="testimonyOwner row" data-id='${testimonies[i].postersId}' onclick="viewOtherProfile(this)">
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
                            <i class="icon_heart_alt fa-2x testimonyIcon" data-id="${testimonies[i]._id}" title="like" onclick="likeTestimony(this)"></i>
                            <span class="testimonyIconNumbers" id="likesNo">
                            <ul id="likesList" class="z-depth-1">
                                ${likersList}
                            </ul>
                                <span id="likess">${testimonies[i].likes.length - 1}</span>
                            </span>
                        </div>
                        <div class="col s4 m4 l4 fullHeight displayFlex">
                                <i class="icon_comment_alt fa-2x testimonyIcon" title="comment" data-id="${testimonies[i]._id}" onclick="newComment(this)"></i>
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
                new DisplayStuffs().hideStuff(loading);
            }
        })
        .catch(err => {
            console.log("Could not fetch testimonies : ", err);
        })
};

function closeTestifyPrompt() {
    const TestimonyDisp = new DisplayTestimonyStuffs();
    TestimonyDisp.closeTestifyPrompt();
}

//View the profile of the currently logged in user
function viewProfile(Id, Name, Email, Num, DateCreated) {
    const TestimonyDisp = new DisplayTestimonyStuffs();
    TestimonyDisp.displayProfile();
    document.querySelector('#uploadProfileBody').style.display = 'flex';
    const data = JSON.parse(localStorage.getItem('t_b_data')); //The current users data
    console.log("The idddd is ", Id);
    const id = Id || data.payload.data._id;
    const name = Name || data.payload.data.name;
    const email = Email || data.payload.data.email;
    const number = Num || data.payload.data.number;
    const dateCreated = DateCreated || data.payload.data.created;
    const extractDateDetails = dateCreated.split('T').shift().split('-');
    const dt = new Date(extractDateDetails);
    const datePosted = dt.toGMTString().split('00:00:00 GMT')[0]
    //Render the data to the DOM 
    document.querySelector('#profileName').innerHTML = name;
    document.querySelector('#profileEmail').innerHTML = email;
    document.querySelector('#profileNumber').innerHTML = number;
    document.querySelector('#profileCreationDate').innerHTML = datePosted;
    const token = data.payload.token;
    //Load the posted testimonies of the viewed users profile
    fetch(`${api}/api/testimony/get?postersId=${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(data => {
            return data.json();
        })
        .then(response => {
            //save the gotten response in a session
            sessionStorage.setItem('userTestimonies', JSON.stringify(response));
            //render the response to the DOM
            const tempStorage = sessionStorage.getItem('userTestimonies');
            if (tempStorage) {
                //render the data to the DOM
                const data = JSON.parse(tempStorage);
                const parent = document.querySelector('#profileTestimoniesList');
                document.querySelector('#profileTestimoniesHead').querySelector('h5').innerHTML = "Testimonies" + `(${data.payload.length})`;
                for (i in data.payload) {
                    parent.innerHTML = '';
                    parent.innerHTML += `
                    <li data-index='${i}' data-id='${data.payload[i]._id}'>${data.payload[i].title}</li>
                `
                }
                //When any testimony title is clicked, display the full comment
                parent.querySelectorAll('li').forEach(list => {
                    list.addEventListener('click', () => {
                        viewTestimonyDetails(list, isNewComment = false, isList = true);
                    })
                })
            }
        })
        .catch(err => {
            console.log("The error is ", err);
        })
}
//View profile for othe rusers listed on the page
function viewOtherProfile(dom) {
    const userId = dom.dataset.id;
    console.log(userId);
    //Get the users data 
    fetch(`${api}/api/users/${userId}`)
        .then(data => {
            return data.json();
        })
        .then(user => {
            //Store the gotten data temporarily in a session
            sessionStorage.setItem('userProfile', JSON.stringify(user.payload.data));
            const data = JSON.parse(sessionStorage.getItem('userProfile'));
            if (data) {
                //View the users profile
                viewProfile(data._id, data.name, data.email, data.number, data.created);
                document.querySelector('#uploadProfileBody').style.display = 'none';
            }
        })
        .catch(err => {
            console.log(err);
        })
}

function closeProfile() {
    const TestimonyDisp = new DisplayTestimonyStuffs();
    TestimonyDisp.closeProfile();
}

function logout() {
    localStorage.getItem('t_b_tok') === null ? true /*User isn't logged in*/ : (() => {
        //Log user out
        localStorage.removeItem('t_b_tok');
        localStorage.removeItem('t_b_data');
        window.location.assign('./index.html'); //redirect user to homepage
    })();
}


function testify() {
    const data = JSON.parse(localStorage.getItem('t_b_data')); //users data
    const token = data.payload.token;
    const postersId = data.payload.data._id;
    const postersName = data.payload.data.name;
    const title = document.querySelector('#testimonyTitleInput');
    const testimony = document.querySelector('#testimonyContentInput');
    const errorContainer = document.querySelector('#testimonyError');
    console.log("hellllooooooo");
    title.value === "" || testimony.value === "" ? new DisplayStuffs().displayFlexStuff(errorContainer) : fetch(`${api}/api/testimony/add`, {
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
            if (response.success) {
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


/**
 * @param {Object} dom - The html object element that was clicked
 * @param {Boolean} isNewComment - Checks if the user wants to add a new comment or just view the testimony
 */

function viewTestimonyDetails(dom, isNewComment = false, isList = false) {
    const testimonyId = dom.dataset.id; //get the testimony id
    localStorage.setItem('t_b_id', testimonyId); //Store the viewed testiomonies Id
    const data = JSON.parse(localStorage.getItem('t_b_data')); //users data
    const token = data.payload.token;
    //display the testimony prompt
    const disp = new DisplayStuffs();
    const testimonyDetailContainer = document.querySelector('#testimonyContainerActive');
    const overlay = document.querySelector('#overlay');
    const loader = document.querySelector('#testimonyActiveLoader');
    const dataBody = document.querySelector('#testimonyBodyActive');
    disp.displayStuff(testimonyDetailContainer);
    document.body.style.overflow = 'hidden'; //Disable scrolling on the main body
    disp.displayFlexStuff(overlay);
    loader.style.display = 'flex';
    dataBody.style.display = 'none';
    //Fetch the testimony from the api
    fetch(`${api}/api/testimony/get/${testimonyId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(data => {
            return data.json();
        })
        .then(testimony => {
            console.log("testimony is ", testimony);
            const head = document.querySelector('#testimonyActiveHead');
            const story = document.querySelector('#testimonyStoryActive');
            const name = document.querySelector('#testimonyActiveName');
            const likes = document.querySelector('#likes');
            const likersBody = document.querySelector('#likesList2');
            const likers = testimony.payload.data.likes;
            const comments = document.querySelector('#comments');
            const shares = document.querySelector('#shares');
            //Format date to a readable format
            const datePosted = document.querySelector('#tADatePosted');
            const dt = new Date(testimony.payload.data.datePosted.split('T').shift().split('-'));
            const date = dt.toGMTString().split('00:00:00 GMT')[0];
            //Render the data
            head.innerHTML = testimony.payload.data.title;
            story.innerHTML = testimony.payload.data.testimony;
            name.innerHTML = testimony.payload.data.postersName;
            datePosted.innerHTML = `Posted on ${date}`;
            likes.innerHTML = testimony.payload.data.likes.length - 1;
            comments.innerHTML = testimony.payload.data.comments.length;
            shares.innerHTML = testimony.payload.data.shares;
            // console.log("dom is ", dom.parentNode.querySelector('.testimonyOwner').dataset.id);
            if (isList) {
                document.querySelector('#viewTestimony').dataset.id = dom.dataset.id;
                console.log("hjvh : ", dom.parentNode);
            } else {
                document.querySelector('#viewTestimony').dataset.id = dom.parentNode.querySelector('.testimonyOwner').dataset.id;
                console.log("hjvh2 : ", dom);
            }
            // likes.innerHTML = dom.parentNode.querySelector('.testimonyAction').querySelector('div').querySelector('#likesNo').querySelector('#likess').innerHTML;
            // comments.innerHTML = dom.parentNode.querySelector('.testimonyAction').querySelectorAll('div')[1].querySelector('.testimonyIconNumbers').innerHTML;
            // shares.innerHTML = dom.parentNode.querySelector('.testimonyAction').querySelectorAll('div')[2].querySelector('.testimonyIconNumbers').innerHTML;
            //People who liked this testimony
            likers.forEach(likedBy => {
                if (likedBy !== 0) {
                    console.log("likers are ", likers);
                    document.querySelector('#likesList2').innerHTML += `<li>${likedBy}</li>`;
                };
            })
            //display the data
            loader.style.display = 'none';
            dataBody.style.display = 'block';
            //load all the testimony comments
            loadComments(testimonyId);
            //If comment icon is clicked, scroll to the comment section
            if (isNewComment) {
                window.location.assign('#commentInput');
            }
        })
        .catch(err => {
            console.log("The error is ", err);
        })
}

//Like testimonies
function likeTestimony(dom) {
    const data = JSON.parse(localStorage.getItem('t_b_data')); //users data
    const token = data.payload.token;
    const likerId = data.payload.data.name;
    const testimonyId = dom.dataset.id;
    console.log("The testimony Id is ", testimonyId);
    fetch(`${api}/api/testimony/like`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                testimonyId,
                likerId
            })
        })
        .then(data => {
            return data.json();
        })
        .then(data => {
            //If testimony was liked successfully
            if (data.success) {
                liked(dom);
            }
            console.log(data);
        })
        .catch(err => {
            console.log(err);
        })
}

function liked(dom) {
    //When testimony has bee liked, change its style
    dom.classList.replace('icon_heart_alt', 'icon_heart');
    dom.classList.add('liked');
    //increment the number of likes
    dom.parentNode.querySelector('.testimonyIconNumbers').querySelector('#likess') !== null ?
        dom.parentNode.querySelector('.testimonyIconNumbers').querySelector('#likess').innerHTML++ :
        dom.parentNode.querySelector('.testimonyIconNumbers').querySelector('#likes').innerHTML++;
}


function comment() {
    const testimonyId = localStorage.getItem('t_b_id');
    const data = JSON.parse(localStorage.getItem('t_b_data'));
    const commentersId = data.payload.data._id;
    const commentersName = data.payload.data.name;
    const token = data.payload.token;
    const comment = document.querySelector('#commentInput');
    comment.value === "" ? /*Don't send comment when empty*/ false : fetch(`${api}/api/testimony/comment/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                testimonyId,
                commentersId,
                commentersName,
                comment: comment.value
            })
        })
        .then(data => {
            return data.json();
        })
        .then(response => {
            console.log("Success", response);
            comment.value = "";
            //Create a node to be inserted at the top of all comments when a new comment is made 
            const commentBody = document.createElement('div'); //parent node
            commentBody.setAttribute("class", "commentBody glow row");
            const imgBody = document.createElement('div'); //subNode
            imgBody.setAttribute('class', 'col s4 m2 l2 fullHeight displayFlex');
            const img = document.createElement('img');
            img.setAttribute('src', '/static//images/liberation.jpg');
            img.setAttribute('alt', 'profile_image');
            img.setAttribute('class', 'circle profileImage');
            imgBody.appendChild(img);
            const commentersBody = document.createElement('div'); //sub Node
            commentersBody.setAttribute('class', 'col s8 m10 l10 fullHeight');
            const commentersNameBody = document.createElement('div');
            commentersNameBody.setAttribute('class', 'commentersName fullWidth displayFlexLeft');
            const commentersName = document.createTextNode(response.payload.data.commentersName);
            commentersNameBody.appendChild(commentersName);
            const commentersCommentBody = document.createElement('div');
            commentersCommentBody.setAttribute('class', 'commentersComment displayFlexLeft');
            const commentersComment = document.createTextNode(response.payload.data.comment);
            commentersCommentBody.appendChild(commentersComment);
            commentersBody.appendChild(commentersNameBody);
            commentersBody.appendChild(commentersCommentBody);
            commentBody.appendChild(imgBody);
            commentBody.appendChild(commentersBody);
            //Insert node as a new comment
            document.querySelector('#commentsBody').insertBefore(commentBody, document.querySelectorAll('.commentBody')[0]);
        })
        .catch(err => {
            console.log("Error", err);
        });
}


async function newComment(dom) {
    //get the dom of the story which is used to view the selected testimony detail
    const storyDom = await dom.parentNode.parentNode.parentNode.querySelector('.testimonyStory');
    await viewTestimonyDetails(storyDom, true);
}

function loadComments(testimonyId) {
    const data = JSON.parse(localStorage.getItem('t_b_data')); //users data
    const token = data.payload.token;
    fetch(`${api}/api/testimony/comment/get/${testimonyId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(data => {
            return data.json();
        })
        .then(response => {
            document.querySelector('#commentsBody').innerHTML = "";
            for (let i = 0; i < response.payload.data.length; i++) {
                renderComment(response.payload.data[i].commentersName, response.payload.data[i].comment);
            }
        })
        .catch(err => {
            console.log("The comment error is ", err);
        })
}

function renderComment(name, comment, glow) {
    document.querySelector('#commentsBody').innerHTML += `
        <div class="commentBody ${glow} row">
            <div class="col s4 m2 l2 fullHeight displayFlex">
                <img src="/static/images/liberation.jpg" alt="profile_image" class="circle profileImage" />
            </div>
            <div class="col s8 m10 l10 fullHeight">
                <div class="commentersName fullWidth displayFlexLeft">${name}</div>
                <div class="commentersComment displayFlexLeft">
                    ${comment}
                </div>
            </div>
        </div>
        `
}

function closeTestimonyDetails() {
    const overlay = document.querySelector('#overlay');
    const testimonyDetailContainer = document.querySelector('#testimonyContainerActive');
    document.body.style.overflowY = 'scroll';
    new DisplayStuffs().hideStuff(testimonyDetailContainer);
    new DisplayStuffs().hideStuff(overlay);
}


function searchTestimony() {
    const searchInput = document.querySelector('#searchInput');
    const searchResults = document.querySelector('#searchResults');
    if (searchInput.value.length < 1 || searchInput.value.split('')[0] === ' ') {
        //Don't send request when no input is made
        //Hide the result nav also
        searchResults.style.display = 'none';
    } else {
        const data = JSON.parse(localStorage.getItem('t_b_data')); //users data
        const token = data.payload.token;
        fetch(`${api}/api/testimony/search?q=${searchInput.value}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(data => {
                return data.json();
            })
            .then(response => {
                console.log("response is ", response.payload.data);
                searchResults.style.display = 'flex'; //Display the search result 
                const searchResultBody = document.querySelector('#searchResultBody');
                searchResultBody.innerHTML = `
            <div class="fullWidth displayFlex" id="searchHeader">
                <h5>Found ${response.payload.data.length} testimonies related to "${searchInput.value}" </h5>
            </div>
            `;
                response.payload.data.forEach(data => {
                    searchResultBody.innerHTML += `
                <div class="searchResult fullWidth">
                    <div class="searchTitle displayFlexLeft padLeft">${data.title}</div>
                    <div class="searchName displayFlexLeft padLeft"> @${data.postersName}</div>
                </div>
                `
                });
            })
            .catch(err => {
                console.log("err ", err);
            });
    }
}


let page = 1; //Icreases as more testimonies data are rendered to the viewport
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

    /**
     * @desc Testimony Observer for loading more dynamic content has user scrolls
     * @param {Number} page - The page currently loaded into the viewport
     */
    // Don't show the observer loader until data has been fetched
    document.querySelector('#testimonyObserver').style.display = 'none';
    loadTestimonyData(page);
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.intersectionRatio > 0) {
                console.log("entered viewport\n");
                //call a function that loads dynamic data
                page++;
                console.log(page);
                loadTestimonyData(page);
            }
        })
    });

    observer.observe(document.querySelector('#testimonyObserver'));

    // /*For testing, to be deleted*/
    // //display the testimony prompt
    // const disp = new DisplayStuffs();
    // const testimonyDetailContainer = document.querySelector('#testimonyContainerActive');
    // const overlay = document.querySelector('#overlay');
    // const loader = document.querySelector('#testimonyActiveLoader');
    // const dataBody = document.querySelector('#testimonyBodyActive');
    // disp.displayStuff(testimonyDetailContainer);
    // document.body.style.overflow = 'hidden'; //Disable scrolling on the main body
    // disp.displayFlexStuff(overlay);
    // loader.style.display = 'none';
    // dataBody.style.display = 'block';
});