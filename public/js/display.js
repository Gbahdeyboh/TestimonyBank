/**
* Testimony Bank by @Gbahdeyboh - "web link"
* Licence - 


* @param {Object} DisplayStuffs - class to dsiplay stuffs in the DOM
* @property {String} flex
* @property {String} block
* @property {String} none
* @param {method} displayStuff - set the stuffs display to `block`
* @param {method} displayFlexStuff - set's the stuffs display to `flex`
* @param {method} hideStuff - set's the stuffs display to `none`
* @param {mixed} stuff - the DOM Object to be displayed
*/
class DisplayStuffs {
    constructor() {
        this.flex = "flex";
        this.block = "block";
        this.none = "none";
    }
    displayStuff(stuff) {
        stuff.style.display = this.block;
        document.body.style.overflow = 'hidden'; //Disable scrolling on the main body
    }
    displayFlexStuff(stuff) {
        stuff.style.display = this.flex;
        document.body.style.overflow = 'hidden'; //Disable scrolling on the main body
    }
    hideStuff(stuff) {
        stuff.style.display = this.none;
        document.body.style.overflow = 'scroll'; //Disable scrolling on the main body
    }
}

// const api = 'https://testimony-bank.herokuapp.com';
const api = "http://localhost:8500";