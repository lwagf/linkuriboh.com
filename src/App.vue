<template>
  <nav class="navbar navbar-expand navbar-dark bg-primary">
    <img height="50" width="50" alt="Linkuriboh logo" src="./assets/logo.png">
    <a class="navbar-brand" href="#">Linkuriboh</a>
    <div class="navbar-nav">
      <router-link class="nav-item nav-link" to="/">Home</router-link>
      <router-link class="nav-item nav-link" to="/about">About</router-link>
    </div>
  </nav>
  <div class="app-container">
    <router-view/>
  </div>
</template>
