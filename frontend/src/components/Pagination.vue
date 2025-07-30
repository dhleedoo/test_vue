<template>
    <div class="pagination">
      <button @click="$emit('change-page', currentPage - 1)" :disabled="currentPage === 1">이전</button>
  
      <button
        v-for="page in totalPages"
        :key="page"
        @click="$emit('change-page', page)"
        :class="{ active: page === currentPage }"
      >
        {{ page }}
      </button>
  
      <button @click="$emit('change-page', currentPage + 1)" :disabled="currentPage === totalPages">다음</button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      currentPage: Number,
      totalPages: Number,
    },
  };
  </script>
  
  <style scoped>
.pagination {
  display: flex;
  gap: 8px;
  justify-content: center;
  padding: 10px 0;
}

.pagination button {
  width: 40px;
  height: 40px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  padding: 0;
  text-align: center;
}

.pagination button.active {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

.pagination button:disabled {
  cursor: not-allowed;
  color: #aaa;
}
  </style>
  