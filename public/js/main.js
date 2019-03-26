/**!
* Testimony Bank by @Gbahdeyboh - "web link"
* Licence - 
*/

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



/**
 * @param {Object} AuthDisplay - displays stuffs on the main page
 * @property {String} overlay - grabs the overlay DOM
 * @property {String} loginContainer - grabs the loginContainer DOM
 * @property {String} accountCreateContainer - grabs the accountCreateContainer DOM
 * @param {methods} [displayLogin, displayAccountCreationContainer] - display the specified DOM Object 
 */

class AuthDisplay extends DisplayStuffs{
    constructor(){
        super();
        this.overlay = document.querySelector('#pageOverlay');
        this.loginContainer = document.querySelector('#loginContainer');
        this.accountCreateContainer = document.querySelector('#signUpContainer');
    }
    displayLogin(){
        this.displayStuff(this.overlay);
        this.displayFlexStuff(this.loginContainer);
    }
    closeLoginDisplay(){
        this.hideStuff(this.overlay);
        this.hideStuff(this.loginContainer);
    }
    displayAccountCreationContainer(){
        this.closeLoginDisplay(); //make sure login display has been closed first
        this.displayStuff(this.overlay);
        this.displayFlexStuff(this.accountCreateContainer);
    }
    closeAccountDisplay(){
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
    const viewMoreTesimonies = document.querySelector('#viewMoreTesimonies');

    const AuthDisp = new AuthDisplay();

    displayLoginBtn.addEventListener('click', () => AuthDisp.displayLogin()); //display login conatner when login button is clicked
    shareTestimonyBtn.addEventListener('click', () => AuthDisp.displayLogin()); //display login conatner when login button is clicked
    viewMoreTesimonies.addEventListener('click', () => AuthDisp.displayLogin()); //display login conatner when login button is clicked
    closeLoginBtn.addEventListener('click', () => AuthDisp.closeLoginDisplay()); //close the login container
    displayCreateAccountBtn.addEventListener('click', () => {AuthDisp.displayAccountCreationContainer();});
    closeAccountBtn.addEventListener('click', () => {AuthDisp.closeAccountDisplay()});
});