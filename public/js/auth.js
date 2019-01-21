//Account creation and login validations
function ValidateSignUp(){
    this.name = document.querySelector('#signUpFullName'); 
    this.email = document.querySelector('#signUpEmail'); 
    this.number = document.querySelector('#signUpNumber'); 
    this.password = document.querySelector('#signUpPassword'); 
    this.passwordConfirm = document.querySelector('#signUpConfirmPassword');
    this.signUpBtn = document.querySelector('#signUpBtn');
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
            this.signUpBtn.disabled = true; //disable sign up button
            //Send request to create account
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
                console.log("data success is ", data.success);
                setTimeout(() => {
                    this.signUpBtn.disabled = false;
                    if(!data.success){
                        //display the error message
                        this.errors.style.display = "flex";
                        this.email.style.borderColor = 'red';
                        this.errors.innerHTML = `Error: ${data.error.message}`;
                    }
                    else{
                        //display the profile page
                        this.errors.style.display = "none";
                    }
                }, 1000); //enable sign up button button
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


function login(){

}

setTimeout(() => {
    const obj = new ValidateSignUp();
    const r = Object.assign({}, obj);
    console.log(r.email);
}, 1000)



document.addEventListener('DOMContentLoaded', () => {
    const signUpBtn = document.querySelector('#signUpBtn');

    //create account for user
    signUpBtn.addEventListener('click', () => {
        const validate = new ValidateSignUp();
        validate.signUp();
    });
});