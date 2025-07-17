/*eslint-disable*/

import {login} from "./login"
import {logout} from "./login"
import '@babel/polyfill'
//this file is more from getting the data from the user interface 

const logoutBtn = document.querySelector('.nav__el--logout');
const loginForm = document.querySelector('.form');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutBtn) {
  console.log("Logout button found, attaching listener."); // Check this log on load
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Stop link navigation
    console.log('Logout button CLICKED!'); // <-- CHECK THIS LOG WHEN YOU CLICK
    logout(); // Call your imported logout function
  });
} else {
  console.log("Logout button NOT found.");
}