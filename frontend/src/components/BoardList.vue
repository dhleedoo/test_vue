<template>
  <div class="board-list">
    <div class="header">
      <h2>게시판</h2>
      <router-link to="/create" class="btn btn-primary">글 작성</router-link>
    </div>

    <div v-if="loading" class="loading">로딩 중...</div>

    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else>
      <table class="board-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성일</th>
            <th>수정일</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="board in boards" :key="board.BOARD_ID">
            <td>{{ board.BOARD_ID }}</td>
            <td>
              <router-link 
                :to="`/board/${board.BOARD_ID}`" 
                class="title-link"
              >
                {{ board.TITLE }}
              </router-link>
            </td>
            <td>{{ formatDate(board.CREATED_AT) }}</td>
            <td>{{ formatDate(board.UPDATED_AT) }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="boards.length === 0" class="no-data">
        등록된 게시글이 없습니다.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { boardAPI, type Board } from '../services/api';

const boards = ref<Board[]>([]);
const loading = ref(true);
const error = ref('');

// 게시글 목록 조회
const fetchBoards = async () => {
  try {
    loading.value = true;
    error.value = '';
    boards.value = await boardAPI.getAllBoards();
  } catch (err) {
    error.value = '게시글을 불러오는데 실패했습니다.';
    console.error('게시글 조회 오류:', err);
  } finally {
    loading.value = false;
  }
};

// 날짜 포맷 함수
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR') + ' ' + date.toLocaleTimeString('ko-KR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

onMounted(() => {
  fetchBoards();
});
</script>

<style scoped>
.board-list {
  width: 100%;
  margin: 0;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}


.board-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
}

.board-table th,
.board-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.board-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.board-table tr:hover {
  background-color: #f5f5f5;
}

.title-link {
  color: #007bff;
  text-decoration: none;
}

.title-link:hover {
  text-decoration: underline;
}
</style>