<template>
  <div class="board-list">
    <div class="header">
      <h2>게시판</h2>
      
      <div class="search-bar">
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="제목 검색"
          @keyup.enter="onSearch"
        />
        <button class="btn btn-primary" @click="onSearch">검색</button>
      </div>

      <div class="actions">
        <router-link to="/create" class="btn btn-primary">글 작성</router-link>
      </div>
    </div>

    <div v-if="loading" class="loading">로딩 중...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else>
      <table class="board-table" v-if="boards.length > 0">
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

      <div v-else class="no-data">등록된 게시글이 없습니다.</div>

      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        @change-page="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { boardAPI, type Board } from '../services/api';
// @ts-ignore
import Pagination from './Pagination.vue';

const boards = ref<Board[]>([]);
const loading = ref(false);
const error = ref('');

const currentPage = ref(1);
const totalPages = ref(1);
const searchKeyword = ref('');  // 검색어 상태 추가

const fetchBoards = async (page: number, keyword = '') => {
  try {
    loading.value = true;
    error.value = '';
    // API 호출 시 검색어 전달
    const response = await boardAPI.getBoardsByPage(page, keyword);
    boards.value = response.data;
    totalPages.value = response.pagination.totalPages;
    currentPage.value = page;
  } catch (err) {
    error.value = '게시글을 불러오는데 실패했습니다.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return (
    date.toLocaleDateString('ko-KR') +
    ' ' +
    date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  );
};

const handlePageChange = (page: number) => {
  fetchBoards(page, searchKeyword.value);
};

const onSearch = () => {
  fetchBoards(1, searchKeyword.value); // 검색 시 1페이지부터 조회
};

onMounted(() => {
  fetchBoards(currentPage.value);
});
</script>

<style scoped>
.board-list {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn {
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.loading, .error, .no-data {
  text-align: center;
  padding: 40px;
  font-size: 16px;
}

.error {
  color: #dc3545;
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

/* 검색바는 가운데 정렬 위해 위치 조정 */
.search-bar {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
}

.search-bar input {
  height: 40px;          /* 버튼과 같은 높이 지정 */
  width: 600px;          /* 너비 600px */
  padding: 0 12px;       /* 좌우 여백 조절 (위아래 패딩 대신 height로 높이 조절) */
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  font-size: 14px;
  margin-right: 6px;
  box-sizing: border-box; /* 패딩과 border 포함 너비에 포함 */
}
</style>
