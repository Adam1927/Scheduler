<template>
    <div class="background">
      <div >
        <img class="back-button-position" scr='client\src\views\assets\Arrow 1.png'>
      </div>
      <div class="logo-position">
        <h1 class="logo">
          Meeting Scheduler
        </h1>
      </div>
      <div class="field-spacing">
        <div class="input-field-position">
          <label class="input-field-label" for="Name">Username:</label>
          <input class="input-field" type="text" id="Name" inputtedUsername="Name" placeholder="JaneDoe123">
        </div>
        <div class="input-field-position">
          <label class="input-field-label" for="Password">Password:</label>
          <input class="input-field" type="text" id="Password" inputtedPassword="Password" placeholder="Password1234">
        </div>
        <div class="log-in-button">
          <div class="button-format">
            <button onclick="verifyCreds(document.getElementById('Name'),document.getElementById('Password'))">Log In</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script>
  export default {
    methods: {
      verifyCreds(username, password) {
        /*
        TO IMPLEMENT
        if (true) {
          //terrible in terms of security
          //needs set cookies
          window.location.href = 'http://localhost:3000/mainpage'
        } else {
          //
        }
      }
      */
      }
    }
  }
  </script>
  <style scoped>
  .background {
    background-color: #232425;
    max-width: 1440px;
    height: 100vh;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  
  .field-spacing {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .input-field-position {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }
  
  .input-field-label {
    font-family: "Istok Web-Regular", Helvetica;
    font-weight: 400;
    color: #cff4f4;
    font-size: 20px;
    letter-spacing: 0;
    line-height: normal;
    margin-bottom: 5px;
  }
  
  .input-field {
    font-family: "Istok Web-Regular", Helvetica;
    font-weight: 400;
    color: #2325269c;
    background-color: #cff4f4;
    font-size: 20px;
    letter-spacing: 0;
    line-height: normal;
    padding: 10px;
  }
  
  .log-in-button {
    width: 207px;
    height: 57px;
    background-color: #0e817a;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .button-format {
    font-family: "Istok Web-Regular", Helvetica;
    font-weight: 400;
    color: #cff4f4;
    background-color: transparent;
    font-size: 30px;
    letter-spacing: 0;
    line-height: normal;
    line-height: normal;
    cursor: pointer;
    border: none;
    outline: none;
  }
  
  .back-button-position{
    position: fixed;
    width: 75px;
    height: 50px;
    top: 0;
    left: 0;
  }
  
  .logo-position {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    height: 100vh;
  }
  
  .logo {
    width: 132px;
    font-family: "Istok Web-Regular", Helvetica;
    font-weight: 400;
    color: #ffffff;
    font-size: 55px;
    letter-spacing: 0;
    line-height: normal;
    white-space: nowrap;
    margin-top: 20px;
  }
  
  </style>
  