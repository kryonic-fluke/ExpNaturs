/*eslint-disable*/
const login = async (email, password) => {

    try {
      const response = await fetch('http://127.0.0.1:4000/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if(data && data.status === 'success'){
        alert('logged in successfully!');
        window.setTimeout(()=>{
          location.assign('/');
        },1500);
      }
    } catch (error) {
      alert(error.message);
    }
  };

document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
