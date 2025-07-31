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
        
        <!-- 스프레드JS 컴포넌트 (읽기 전용) -->
        <div v-if="board.EXCEL_DATA" class="spreadsheet-section">
          <SpreadsheetViewer 
            ref="spreadsheetViewer"
            mode="view"
            :readonly="true"
            height="500px"
          />
        </div>
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
import SpreadsheetViewer from './SpreadsheetViewer.vue';
// 스프레드JS 기능을 위한 필수 import
import "@mescius/spread-sheets/styles/gc.spread.sheets.excel2016colorful.css";

const route = useRoute();
const router = useRouter();

const board = ref<Board | null>(null);
const loading = ref(true);
const error = ref('');
const deleting = ref(false);

// 스프레드JS 컴포넌트 참조
const spreadsheetViewer = ref<InstanceType<typeof SpreadsheetViewer> | null>(null);

// 게시글 조회
const fetchBoard = async () => {
  try {
    loading.value = true;
    error.value = '';
    const id = parseInt(route.params.id as string);
    board.value = await boardAPI.getBoardById(id);
    
    // Excel 데이터가 있으면 스프레드JS에 로드 (컴포넌트가 마운트된 후)
    if (board.value?.EXCEL_DATA) {
      setTimeout(() => {
        if (spreadsheetViewer.value && board.value?.EXCEL_DATA) {
          spreadsheetViewer.value.setData(board.value.EXCEL_DATA);
        }
      }, 100);
    }
  } catch {
    error.value = '게시글을 불러오는데 실패했습니다.';
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
  } catch {
    alert('게시글 삭제에 실패했습니다.');
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
  width: 100%;
  margin: 0;
  padding: 20px;
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


.spreadsheet-section {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid #eee;
}

.spreadsheet-section h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 18px;
}
</style>