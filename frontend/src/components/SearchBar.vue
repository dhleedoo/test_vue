<template>
    <div class="search-bar">
      <input
        v-model="internalKeyword"
        type="text"
        placeholder="제목 검색"
        @keyup.enter="handleSearch"
      />
      <button class="btn btn-primary" @click="handleSearch">검색</button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, defineProps, defineEmits } from 'vue';
  
  const props = defineProps<{
    keyword?: string;
  }>();
  
  const emit = defineEmits<{
    (e: 'search', keyword: string): void;
  }>();
  
  const internalKeyword = ref(props.keyword || '');
  
  // 부모가 keyword를 prop으로 전달해줄 경우 반영
  watch(() => props.keyword, (newVal) => {
    if (newVal !== undefined) internalKeyword.value = newVal;
  });
  
  // 검색 실행
  const handleSearch = () => {
    emit('search', internalKeyword.value.trim());
  };
  </script>
  
<style scoped>
.search-bar {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
}

.search-bar input {
  height: 40px;
  width: 600px;
  padding: 0 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  font-size: 14px;
  margin-right: 6px;
  box-sizing: border-box;
}

/* ✅ 검색 버튼 스타일 수정 */
.search-bar .btn {
  height: 40px;
  padding: 0 16px;
  white-space: nowrap;         /* 줄바꿈 방지 */
  min-width: 60px;             /* 버튼 최소 너비 */
  font-weight: bold;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-bar .btn:hover {
  background-color: #0056b3;
}
</style>
  