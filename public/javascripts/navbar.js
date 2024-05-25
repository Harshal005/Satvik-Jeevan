

// document.addEventListener('DOMContentLoaded', () => {
//     const menuIcon = document.getElementById('#menu-icon');
//     const navbar = document.querySelector('.navbar');

//     menuIcon.addEventListener('click', () => {
//       navbar.classList.toggle('open');
//     });
// });


// let menu = document.querySelector('#menu-icon');
//     let navbar = document.querySelector('.navbar');
  
//     menu.click = () =>{
//       menu.classList.toggle('bx-x');
//       navbar.classList.toggle('open');
//     }

function myFunction() {
    var x = document.getElementById("myNavbar");
    if (x.className === "navbar") {
        x.className += " responsive";
    } else {
        x.className = "navbar";
    }
}