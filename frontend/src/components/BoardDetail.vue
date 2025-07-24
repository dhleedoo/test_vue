<template>
  <div class="board-detail">
    <div v-if="loading" class="loading">로딩 중...</div>

    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else-if="board" class="content">
      <div class="header">
        <h2>{{ board.TITLE }}</h2>
        <div class="meta">
          <span>작성일: {{ formatDate(board.CREATED_AT) }}</span>
          <span v-if="board.UPDATED_AT !== board.CREATED_AT">
            수정일: {{ formatDate(board.UPDATED_AT) }}
          </span>
        </div>
      </div>

      <div class="body">
        <div class="content-text">{{ board.CONTENT }}</div>
      </div>

      <div class="actions">
        <router-link to="/" class="btn btn-secondary">목록</router-link>
        <router-link 
          :to="`/edit/${board.BOARD_ID}`" 
          class="btn btn-primary"
        >
          수정
        </router-link>
        <button 
          @click="confirmDelete"
          class="btn btn-danger"
          :disabled="deleting"
        >
          {{ deleting ? '삭제 중...' : '삭제' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { boardAPI, type Board } from '../services/api';

const route = useRoute();
const router = useRouter();

const board = ref<Board | null>(null);
const loading = ref(true);
const error = ref('');
const deleting = ref(false);

// 게시글 조회
const fetchBoard = async () => {
  try {
    loading.value = true;
    error.value = '';
    const id = parseInt(route.params.id as string);
    board.value = await boardAPI.getBoardById(id);
  } catch (err) {
    error.value = '게시글을 불러오는데 실패했습니다.';
    console.error('게시글 조회 오류:', err);
  } finally {
    loading.value = false;
  }
};

// 게시글 삭제 확인
const confirmDelete = () => {
  if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
    deleteBoard();
  }
};

// 게시글 삭제
const deleteBoard = async () => {
  if (!board.value) return;

  try {
    deleting.value = true;
    await boardAPI.deleteBoard(board.value.BOARD_ID);
    alert('게시글이 삭제되었습니다.');
    router.push('/');
  } catch (err) {
    alert('게시글 삭제에 실패했습니다.');
    console.error('게시글 삭제 오류:', err);
  } finally {
    deleting.value = false;
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
  fetchBoard();
});
</script>

<style scoped>
.board-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 16px;
}

.error {
  color: #dc3545;
}

.content {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
}

.header h2 {
  margin: 0 0 10px 0;
  color: #333;
}

.meta {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #666;
}

.body {
  padding: 30px;
}

.content-text {
  line-height: 1.6;
  font-size: 16px;
  color: #333;
  white-space: pre-wrap;
  min-height: 200px;
}

.actions {
  padding: 20px;
  border-top: 1px solid #eee;
  background: #f8f9fa;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  text-decoration: none;
  display: inline-block;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #c82333;
}

.btn-danger:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}
</style>