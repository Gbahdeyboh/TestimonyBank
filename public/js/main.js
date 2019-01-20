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


function ValidateSignUp(){
    this.name = document.querySelector('#signUpFullName'); 
    this.email = document.querySelector('#signUpEmail'); 
    this.number = document.querySelector('#signUpNumber'); 
    this.password = document.querySelector('#signUpPassword'); 
    this.passwordConfirm = document.querySelector('#signUpConfirmPassword');
    this.errors = document.querySelector('#signUpError');

    //make sure no input is empty
    this.checkEmpty = () => {
        return new Promise((resolve, reject) => {
            if(this.name.value === "" || this.email.value === "" || this.password.value === "" || this.passwordConfirm.value === ""){
                this.errors.style.display = "flex";
                reject(Error("All compulsory fields must be filled out!"))
            }
            else{
                resolve(true);
            }
        })
    }

    //make sure email contains an '@' and a '.'
    this.checkEmail = () => {
        return new Promise((resolve, reject) => {
            if(this.email.value.search(/@/gi) === -1 || this.email.value.search(/./gi) === -1 ){
                this.errors.style.display = "flex";
                this.email.style.borderColor = 'red';
                reject(Error("Invalid email format provided"));
            }
            else{
                this.email.style.borderColor = 'inherit';
                resolve(true);
            }
        });
    }

    //Validate password
    this.checkPassword = () => {
        console.log("Password is ", this.password.value);
        return new Promise((resolve, reject) => {
            if(this.password.value.length < 8){
                this.errors.style.display = "flex";
                this.password.style.borderColor = 'red';
                reject(Error("Password must be atleast 8 characters long"));
            }
            else if(this.password.value.charAt(0).search(/[A-B]/g) === -1){
                this.errors.style.display = "flex";
                this.password.style.borderColor = 'red';
                reject(Error("Password must start with an uppercase letter"));
                console.log("password is ", this.password.value);
                console.log("password is charAt(0) ", this.password.value.charAt(0));
                console.log("password is charAt(0).search  ", this.password.value.charAt(0).search(/[A-B]/g) === -1);
            }
            else if(this.password.value.search(/[0-9]/gi) === -1){
                this.errors.style.display = "flex";
                this.password.style.borderColor = 'red';
                reject(Error("Password must contain atleast a number"));
            }
            else{
                this.password.style.borderColor = 'inherit';
                resolve(true);
            }
        });
    }

    this.confirmPassword = () => {
        return new Promise((resolve, reject) => {
            if(this.password.value !== this.passwordConfirm.value){
                this.errors.style.display = "flex";
                this.password.style.borderColor = 'red';
                this.passwordConfirm.style.borderColor = 'red';
                reject(Error("Passwords do not match"));
            }
            else{
                resolve(true);
                this.password.style.borderColor = 'inherit';
                this.passwordConfirm.style.borderColor = 'inherit';
            }
        });
    }

    this.validateAll = () => {
        return Promise.all([this.checkEmpty(), this.checkEmail(), this.checkPassword(), this.confirmPassword()]);
    }

    this.signUp = () => {
        this.validateAll()
        .then(message => {
            this.errors.style.display = 'none';
            fetch('http://localhost:4000/api/signup', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify({
                    name: this.name.value,
                    email: this.email.value,
                    number: this.number.value,
                    password: this.passwordConfirm.value
                })
            })
            .then(data => {
                return data.json();
             })
            .then(data => {
                console.log(data);
                localStorage.setItem('t_b_tok', data.payload.token);
            })
            .catch(err => {
                console.log(err);
            });
        })
        .catch(err => {
            //convert the error to a string and then split it into an array to get error message
            this.errors.innerHTML = String(err).split(':')[1];
        })
    }
}


//Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const displayLoginBtn = document.querySelector('#loginButton');
    const displayCreateAccountBtn = document.querySelector('#createAccount');
    const closeLoginBtn = document.querySelector('#closeLogin');
    const closeAccountBtn = document.querySelector('#closeSignUp');
    const signUpBtn = document.querySelector('#signUpBtn');

    displayLoginBtn.addEventListener('click', () => displayLogin()); //display login conatner when login button is clicked
    closeLoginBtn.addEventListener('click', () => closeLoginDisplay()); //close the login container
    displayCreateAccountBtn.addEventListener('click', () => {
        closeLoginDisplay();
        displayAccountCreationContainer();
    });
    closeAccountBtn.addEventListener('click', () => {
        closeAccountDisplay();
    });

    signUpBtn.addEventListener('click', () => {
        const validate = new ValidateSignUp();
        validate.signUp();
    });
});
