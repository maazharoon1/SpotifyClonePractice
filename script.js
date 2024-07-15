let hover=document.getElementsByClassName("hover")
// console.log(hover)

Array.from(hover).forEach(element => {
    element.addEventListener("mouseleave", function(){
        let style=element.style
        style.textDecoration = 'underline';

        setTimeout(() => {
        style.textDecoration = 'none';
    hover[1].style.color='grey'
       }, 400);
    })
});
 
let cardContainer = document.getElementById("cardContainer");
let cards = cardContainer.children;

for (const card of cards) {
    let display = card.getElementsByClassName("display")[0]; // Get the display element within the card

    card.addEventListener('mouseover', function() {
        display.style.display = "block";
        card.style.backgroundColor ="#4343439e";
        // display.style.top = "48%";4343439e

    });

    card.addEventListener('mouseout', function() {
        display.style.display = "none";
        card.style.backgroundColor ="#2525257a";

    });
}

let left =document.querySelector('.left')
let right=document.querySelector('.right')
let more=document.getElementById('more')

more.addEventListener('click',()=>{
    left.style.display='inline-block'
})

document.querySelector('.close').addEventListener('click',()=>{
    
    left.style.display='none'

})   
