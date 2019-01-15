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
