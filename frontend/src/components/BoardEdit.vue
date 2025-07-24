<template>
  <div class="board-edit">
    <div class="header">
      <h2>게시글 수정</h2>
    </div>

    <div v-if="loading" class="loading">로딩 중...</div>

    <div v-else-if="error" class="error">{{ error }}</div>

    <form v-else @submit.prevent="submitForm" class="form">
      <div class="form-group">
        <label for="title">제목 *</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          class="form-control"
          placeholder="제목을 입력하세요"
          required
        />
      </div>

      <div class="form-group">
        <label for="content">내용 *</label>
        <textarea
          id="content"
          v-model="form.content"
          class="form-control"
          placeholder="내용을 입력하세요"
          rows="10"
          required
        ></textarea>
      </div>

      <div class="form-actions">
        <button 
          type="button" 
          @click="goBack"
          class="btn btn-secondary"
        >
          취소
        </button>
        <button 
          type="submit" 
          :disabled="saving"
          class="btn btn-primary"
        >
          {{ saving ? '저장 중...' : '수정' }}
        </button>
      </div>
    </form>

    <div v-if="saveError" class="error-message">{{ saveError }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { boardAPI } from '../services/api';

const route = useRoute();
const router = useRouter();

const form = reactive({
  title: '',
  content: ''
});

const loading = ref(true);
const saving = ref(false);
const error = ref('');
const saveError = ref('');

// 게시글 정보 조회
const fetchBoard = async () => {
  try {
    loading.value = true;
    error.value = '';
    const id = parseInt(route.params.id as string);
    const board = await boardAPI.getBoardById(id);
    
    // 폼에 기존 데이터 설정
    form.title = board.TITLE;
    form.content = board.CONTENT;
  } catch (err) {
    error.value = '게시글을 불러오는데 실패했습니다.';
    console.error('게시글 조회 오류:', err);
  } finally {
    loading.value = false;
  }
};

// 폼 제출
const submitForm = async () => {
  try {
    saving.value = true;
    saveError.value = '';
    const id = parseInt(route.params.id as string);

    await boardAPI.updateBoard(id, {
      title: form.title,
      content: form.content
    });

    // 성공 시 상세보기로 이동
    router.push(`/board/${id}`);
  } catch (err) {
    saveError.value = '게시글 수정에 실패했습니다.';
    console.error('게시글 수정 오류:', err);
  } finally {
    saving.value = false;
  }
};

// 뒤로가기
const goBack = () => {
  router.back();
};

onMounted(() => {
  fetchBoard();
});
</script>

<style scoped>
.board-edit {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  margin-bottom: 30px;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 16px;
}

.error {
  color: #dc3545;
}

.form {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

textarea.form-control {
  resize: vertical;
  min-height: 200px;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 30px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-primary:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}

.error-message {
  margin-top: 15px;
  padding: 10px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}
</style>