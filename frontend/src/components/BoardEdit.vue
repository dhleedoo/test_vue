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

      <!-- 스프레드JS 컴포넌트 -->
      <SpreadsheetViewer 
        ref="spreadsheetViewer"
        mode="edit"
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
import SpreadsheetViewer from './SpreadsheetViewer.vue';
// 스프레드JS 기능을 위한 필수 import
import "@mescius/spread-sheets/styles/gc.spread.sheets.excel2016colorful.css";

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

// 스프레드JS 컴포넌트 참조
const spreadsheetViewer = ref<InstanceType<typeof SpreadsheetViewer> | null>(null);

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
    
    // Excel 데이터가 있으면 스프레드JS에 로드 (컴포넌트가 마운트된 후)
    if (board.EXCEL_DATA) {
      setTimeout(() => {
        if (spreadsheetViewer.value) {
          spreadsheetViewer.value.setData(board.EXCEL_DATA);
        }
      }, 100);
    }
  } catch {
    error.value = '게시글을 불러오는데 실패했습니다.';
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

    // 스프레드JS 데이터 추출
    const excelData = spreadsheetViewer.value?.getData() || null;

    await boardAPI.updateBoard(id, {
      title: form.title,
      content: form.content,
      excelData: excelData
    });

    // 성공 시 상세보기로 이동
    router.push(`/board/${id}`);
  } catch {
    saveError.value = '게시글 수정에 실패했습니다.';
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