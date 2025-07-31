<template>
  <div class="board-create">
    <div class="header">
      <h2>게시글 작성</h2>
    </div>

    <form @submit.prevent="submitForm" class="form">
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

      <!-- 스프레드JS 컴포넌트 -->
      <SpreadsheetViewer 
        ref="spreadsheetViewer"
        mode="create"
        :readonly="false"
        height="500px"
      />

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
          :disabled="loading"
          class="btn btn-primary"
        >
          {{ loading ? '저장 중...' : '저장' }}
        </button>
      </div>
    </form>

    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { boardAPI } from '../services/api';
import SpreadsheetViewer from './SpreadsheetViewer.vue';
// 스프레드JS 기능을 위한 필수 import
import "@mescius/spread-sheets/styles/gc.spread.sheets.excel2016colorful.css";

const router = useRouter();

const form = reactive({
  title: '',
  content: ''
});

const loading = ref(false);
const error = ref('');

// 스프레드JS 컴포넌트 참조
const spreadsheetViewer = ref<InstanceType<typeof SpreadsheetViewer> | null>(null);

// 폼 제출
const submitForm = async () => {
  try {
    loading.value = true;
    error.value = '';

    // 스프레드JS 데이터 추출
    const excelData = spreadsheetViewer.value?.getData() || null;

    await boardAPI.createBoard({
      title: form.title,
      content: form.content,
      excelData: excelData
    });

    // 성공 시 목록으로 이동
    router.push('/');
  } catch {
    error.value = '게시글 작성에 실패했습니다.';
  } finally {
    loading.value = false;
  }
};

// 뒤로가기
const goBack = () => {
  router.back();
};
</script>

<style scoped>
.board-create {
  width: 100%;
  margin: 0;
  padding: 20px;
}

.header {
  margin-bottom: 30px;
}

.form {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 8px;
  border: 1px solid #ddd;
}


.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 30px;
}

</style>