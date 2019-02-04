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
class DisplayStuffs{
    constructor(){
        this.flex = "flex";
        this.block = "block";
        this.none = "none";
    }
    displayStuff(stuff){
        stuff.style.display = this.block;
    }
    displayFlexStuff(stuff){
        stuff.style.display = this.flex;
    }
    hideStuff(stuff){
        stuff.style.display = this.none;
    }
}