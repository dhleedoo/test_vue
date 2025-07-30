<template>
  <div class="board-list">
    <div class="header">
      <h2>게시판</h2>
      <div class="search-bar">
        <!-- 2025/07/28, Hanhee, SearchBar 컴포넌트 삽입, Start -->
        <SearchBar @search="handleSearch" />
        <!-- 2025/07/28, Hanhee, SearchBar 컴포넌트 삽입, End -->
      </div>

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
          <tr v-for="board in paginatedBoards" :key="board.BOARD_ID">
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

      <!-- 2025/07/29, Hanhee, Pagination 컴포넌트 삽입, Start -->
      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        @change-page="handlePageChange"
      />
      <!-- 2025/07/29, Hanhee, Pagination 컴포넌트 삽입, End -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { boardAPI, type Board } from '../services/api';
// 2025/07/28, Hanhee, SearchBar 컴포넌트 삽입, Start
import SearchBar from './SearchBar.vue';
// 2025/07/28, Hanhee, SearchBar 컴포넌트 삽입, End
// 2025/07/29, Hanhee, Pagination 컴포넌트 삽입, Start
import Pagination from './Pagination.vue';
// 2025/07/29, Hanhee, Pagination 컴포넌트 삽입, End

const boards = ref<Board[]>([]);
// 2025/07/28, Hanhee, 검색 관련 상태 변수 추가, Start
const filteredBoards = ref<Board[]>([]);
// 2025/07/28, Hanhee, 검색 관련 상태 변수 추가, End
const loading = ref(true);
const error = ref('');

// 2025/07/29, Hanhee, 페이지네이션 상태 변수 추가, Start
const currentPage = ref(1);
const itemsPerPage = 10;
// 2025/07/29, Hanhee, 페이지네이션 상태 변수 추가, End

// 2025/07/29, Hanhee, 페이지네이션 계산된 배열, Start
const totalPages = computed(() => Math.ceil(filteredBoards.value.length / itemsPerPage));

const paginatedBoards = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredBoards.value.slice(start, start + itemsPerPage);
});
// 2025/07/29, Hanhee, 페이지네이션 계산된 배열, End

// 2025-07-28: 검색 핸들러
const handleSearch = (keyword: string) => {
  currentPage.value = 1; // 검색시 페이지 초기화
  if (!keyword.trim()) {
    filteredBoards.value = boards.value;
  } else {
    filteredBoards.value = boards.value.filter(board =>
      board.TITLE.toLowerCase().includes(keyword.toLowerCase())
    );
  }
};

// 2025/07/29, Hanhee, 페이지 변경 핸들러, Start
const handlePageChange = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};
// 2025/07/29, Hanhee, 페이지 변경 핸들러, End

// 게시글 목록 조회
const fetchBoards = async () => {
  try {
    loading.value = true;
    error.value = '';
    const data = await boardAPI.getAllBoards();
    boards.value = data;
    filteredBoards.value = data; // 2025-07-28: 초기값 설정
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

/* 2025/07/29, Hanhee, Pagination 스타일 추가, Start */
.pagination {
  padding: 10px 16px;
  font-size: 16px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}
.pagination button {
  width: 40px;    
  height: 40px;   
  padding: 0;      
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  text-align: center;
}
.pagination button.active {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}
.pagination button:disabled {
  color: #aaa;
  cursor: not-allowed;
}
/* 2025/07/29, Hanhee, Pagination 스타일 추가, End */

/* 2025/07/28, Hanhee, SearchBar 스타일 추가, Start */
.search-bar {
  width: 600px;
  margin: 0 auto;
}
/* 2025/07/28, Hanhee, SearchBar 스타일 추가, End */
</style>