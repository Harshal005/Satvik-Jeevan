const menubtn = document.querySelector(".menu-btn");
const sidebar = document.querySelector("#sidebar");
var mainContent = document.querySelector(".maincontent");
const welcomeadmin = document.getElementById("welcome-admin");
const table = document.querySelector(".tbl");

document.addEventListener("DOMContentLoaded", function () {
  
  console.log("dom loaded");
  
  

});

menubtn.addEventListener("click", sidebartoggle);
  function sidebartoggle() {
      console.log("clicked");
  
  const sidebarWidth = sidebar.offsetWidth;
  console.log(sidebarWidth);
  console.log(mainContent); // Get the width of the sidebar

  if (sidebar.style.width === "270px") {
    sidebar.style.width = "0px";
    mainContent.style.marginLeft = "1%";
    menubtn.style.left = "5px";
    welcomeadmin.style.marginLeft = "5%";
    const tableMarginLeft = window.getComputedStyle(table).marginLeft;
    if (tableMarginLeft === "0px") {
      mainContent.style.marginLeft = "1%";
    }
  } else {
    sidebar.style.width = "270px";
    mainContent.style.marginLeft = "272px"; // Adjust mainContent margin based on sidebar width
    menubtn.style.left = "230px";
    welcomeadmin.style.marginLeft = "22%";
  }
  };


// function sidebartoggle() {
//     console.log("clicked");
//     const tableMarginLeft = window.getComputedStyle(table).marginLeft;
//     console.log(table);
//   if (sidebar.style.width === "270px") {
//     sidebar.style.width = "0px";
//     mainContent.style.marginLeft = "10%";
//     menubtn.style.left = "5px";
//     welcomeadmin.style.marginLeft = "5%";

//     if (tableMarginLeft === "0px") {
//       mainContent.style.marginLeft = "5%";
//     }
//   } 
  
//   else {
//     sidebar.style.width = "270px";
//     mainContent.style.marginLeft = "272px";
//     menubtn.style.left = "230px";
//     welcomeadmin.style.marginLeft = "22%";
//   }
// }


