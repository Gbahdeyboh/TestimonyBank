//After first page has been scrolled, change the class of the header to change how its displayed
function headerScroll(){
    let firstPageBodyHead = document.querySelector('#firstPageBodyHead');
    if(document.documentElement.scrollTop > 600 || document.body.scrollTop > 600){
        firstPageBodyHead.classList.add('headerScrolled');
    }
    else{
        firstPageBodyHead.classList.remove('headerScrolled'); 
    }
} 
window.onscroll = () => {headerScroll();}

function displayLogin(){
    //display login container 
    const loginContainer = document.querySelector('#loginContainer');
    const pageOverlay = document.querySelector('#pageOverlay');
    pageOverlay.style.display = "block";
    loginContainer.style.display = "flex";
}

function displayAccountCreationContainer(){
    ///display account creation container
    const accountCreateContainer = document.querySelector('#signUpContainer');
    const pageOverlay = document.querySelector('#pageOverlay');
    pageOverlay.style.display = "block";
    accountCreateContainer.style.display = "flex";
}

function closeLoginDisplay(){
    //close login container
    const loginContainer = document.querySelector('#loginContainer');
    const pageOverlay = document.querySelector('#pageOverlay');
    pageOverlay.style.display = 'none';
    loginContainer.style.display = 'none';
}

function closeAccountDisplay(){
    //close account display container
    const accountCreateContainer = document.querySelector('#signUpContainer');
    const pageOverlay = document.querySelector('#pageOverlay');
    pageOverlay.style.display = "none";
    accountCreateContainer.style.display = "none";
}





//Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const displayLoginBtn = document.querySelector('#loginButton');
    const displayCreateAccountBtn = document.querySelector('#createAccount');
    const closeLoginBtn = document.querySelector('#closeLogin');
    const closeAccountBtn = document.querySelector('#closeSignUp');

    displayLoginBtn.addEventListener('click', () => displayLogin()); //display login conatner when login button is clicked
    closeLoginBtn.addEventListener('click', () => closeLoginDisplay()); //close the login container
    displayCreateAccountBtn.addEventListener('click', () => {
        closeLoginDisplay();
        displayAccountCreationContainer();
    });
    closeAccountBtn.addEventListener('click', () => {
        closeAccountDisplay();
    });
});