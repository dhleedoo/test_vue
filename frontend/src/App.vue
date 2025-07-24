<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-brand">
          BOARD TEST
        </router-link>
        <div class="nav-links">
          <router-link to="/" class="nav-link">홈</router-link>
          <router-link to="/create" class="nav-link">글 작성</router-link>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer">
      <div class="footer-content">
        <p>&copy; BOARD TEST. Vue 3 + TypeScript + Node.js + Oracle</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// 기본 설정만 필요
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background-color: #343a40;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: white;
}

.nav-brand:hover {
  color: #007bff;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active {
  background-color: #007bff;
}

.main-content {
  flex: 1;
  padding: 20px 0;
}

.footer {
  background-color: #343a40;
  color: white;
  padding: 20px 0;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 10px;
  }
  
  .nav-links {
    gap: 10px;
  }
  
  .main-content {
    padding: 10px;
  }
}
</style>