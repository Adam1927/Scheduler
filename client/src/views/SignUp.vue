<template>
    <div class="background">
      <div >
          <button onclick="history.back()">
              <img class="back-button" scr='client\src\views\assets\Arrow 1.png'>
          </button>
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
          <input class="input-field" type="text" id="Password" Password="Password" placeholder="Password1234">
        </div>
        <div class="input-field-position">
          <label class="input-field-label" for="repeatPassword">Confirm Password:</label>
          <input class="input-field" type="text" id="repeatPassword" repeatPassword="Password" placeholder="Password1234">
        </div>
        <div class="sign-up-button">
          <div class="sigh-up-format">
            <button onclick="createUser(document.getElementById('Name'),document.getElementById('Password'),document.getElementById('repeatPassword'))">Sign up</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script>
  export default {
    methods: {
      verifyCreds(username, password, repeatPassword) {
        /*
        TO IMPLEMENT
        - throw exceptions if not allowed or not strong enough
        - add user to database
        - log in user
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
  
  .sign-up-button {
    width: 207px;
    height: 57px;
    background-color: #0e817a;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .sigh-up-format {
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
  
  .back-button{
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
  