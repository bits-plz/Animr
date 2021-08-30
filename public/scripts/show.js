function debounce(func,wait=20,immediate=true){
    var timeout;
    return function(){
        var context=this,args=arguments;
        var later=function(){
            timeout=null;
            if(!immediate) func.apply(context,args);
        }
        var callnow=immediate && !timeout;
        clearTimeout(timeout);
        timeout=setTimeout(later,wait);
        if(callnow) func.apply(context,args);
    }
}
slidImages=document.querySelectorAll('.image')
function checkslide(e){
    slidImages.forEach(slid=>{
    var position = $(slid).position().top;
    const slidInAt=window.scrollY+window.innerHeight-slid.scrollHeight/2;
    const imageBottom=position+slid.scrollHeight;
    const isHalfShown=slidInAt>position;
    const isNotscrolpast=window.scrollY<imageBottom;
    if(isHalfShown && isNotscrolpast){
        slid.classList.add('active');
    }else{slid.classList.remove('active');}          
})
};
var ugot=document.querySelectorAll('#ugot')
ugot.forEach((elem)=>{
    elem.addEventListener('click',()=>{
        document.getElementById('maincon').src=elem.src;
        var gp=elem.parentElement.parentElement.lastElementChild;
        document.getElementById('titleA').innerHTML=gp.children[0].textContent;
        if(gp.children[1].innerHTML.trim().substring(0,5)==='MAL_ID'){
            document.getElementById('mal_idA').innerHTML=gp.children[1].textContent;
        }
        else{
            document.getElementById('mal_idA').innerHTML=gp.children[2].textContent;
        }
        document.getElementById('desc').innerHTML=gp.children[3].children[0].textContent.substring(0,gp.children[3].children[0].textContent-3)+gp.children[3].children[1].textContent;

    })
})






window.addEventListener('scroll',debounce(checkslide,10));
