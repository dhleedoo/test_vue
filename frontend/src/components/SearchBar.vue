<template>
    <div class="search-bar">
      <input
        type="text"
        v-model="searchTerm"
        @keyup.enter="handleSearch"
        placeholder="검색어를 입력하세요"
      />
      <button @click="handleSearch">검색</button>
    </div>
  </template>
  
  <script>
  export default {
    name: "SearchBar",
    data() {
      return {
        searchTerm: ""
      };
    },
    methods: {
      handleSearch() {
        // 검색어를 상위 컴포넌트에 emit
        this.$emit("search", this.searchTerm);
      }
    }
  };
  </script>

<style>
.search-bar {
  width: 600px;
  margin: 0 auto;
  display: flex;
  gap: 4px; /* 공백 줄임, 필요 없으면 0으로 해도 됨 */
}

.search-bar input {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  min-width: 0;
}

.search-bar button {
  width: 80px; /* 버튼 너비 좀 줄임 */
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px; /* 글자 크기 조금 작게 */
  padding: 8px 0;
  transition: background-color 0.3s;
}

.search-bar button:hover {
  background-color: #0056b3;
}

</style>
  