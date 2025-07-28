<template>
  <div class="form-group">
    <label>SpreadJ - Excel</label>
    <div class="spreadsheet-container">
      <gc-spread-sheets 
        class="spread-host" 
        @workbookInitialized="spreadsheet.initSpread"
        :style="{ height: height }"
      />
      <div v-if="!readonly" class="options-container">
        <div class="option-row">
          <div class="inputContainer">
            <p>엑셀 파일 열기 (.xlsx)</p>
            <input 
              type="file" 
              id="fileDemo" 
              class="input" 
              @change="spreadsheet.changeFileDemo" 
            />
            <input 
              type="button" 
              id="loadExcel" 
              value="엑셀 열기" 
              class="button" 
              @click="spreadsheet.loadExcel" 
            />
            <p>엑셀 파일 저장 (.xlsx)</p>
            <input 
              :value="spreadsheet.exportFileName.value" 
              class="input" 
              @change="spreadsheet.changeExportFileName" 
            />
            <input 
              type="button" 
              id="saveExcel" 
              value="엑셀 저장" 
              class="button" 
              @click="spreadsheet.saveExcel" 
            />
            <p>JSON 변환</p>
            <input 
              type="button" 
              id="toJSON" 
              value="JSON 출력" 
              class="button" 
              @click="spreadsheet.exportToJSON" 
            />
          </div>
        </div>
      </div>
    </div>

    <!-- JSON 출력 모달 -->
    <div v-if="spreadsheet.showJsonModal.value" class="modal-overlay" @click="spreadsheet.closeJsonModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>스프레드JS JSON 데이터</h3>
          <button @click="spreadsheet.closeJsonModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <textarea 
            ref="jsonTextarea"
            :value="spreadsheet.jsonOutput.value" 
            readonly 
            class="json-textarea"
            @click="selectAllText"
          ></textarea>
        </div>
        <div class="modal-footer">
          <button @click="spreadsheet.copyToClipboard" class="btn btn-primary">클립보드에 복사</button>
          <button @click="spreadsheet.closeJsonModal" class="btn btn-secondary">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSpreadsheet, type SpreadsheetOptions } from '../composables/useSpreadsheet';

// Props 정의
interface Props {
  height?: string;
  readonly?: boolean;
  mode?: 'view' | 'edit' | 'create';
  initialData?: any;
}

const props = withDefaults(defineProps<Props>(), {
  height: '500px',
  readonly: false,
  mode: 'edit',
  initialData: null
});

// Emits 정의
const emit = defineEmits<{
  dataChange: [data: any];
}>();

// 스프레드JS composable 사용
const spreadsheet = useSpreadsheet({
  mode: props.mode,
  readonly: props.readonly,
  initialData: props.initialData
});

// JSON textarea 참조
const jsonTextarea = ref<HTMLTextAreaElement | null>(null);

// 텍스트 전체 선택
const selectAllText = () => {
  if (jsonTextarea.value) {
    jsonTextarea.value.select();
  }
};

// 외부에서 데이터 설정 (expose)
const setData = (data: any) => {
  spreadsheet.setExcelData(data);
};

// 현재 데이터 가져오기 (expose)
const getData = () => {
  return spreadsheet.getSpreadsheetData();
};

// 부모 컴포넌트에서 사용할 수 있도록 expose
defineExpose({
  setData,
  getData,
  spreadsheet
});

onMounted(() => {
  // 초기 데이터가 있으면 설정
  if (props.initialData) {
    spreadsheet.setExcelData(props.initialData);
  }
});
</script>

<style scoped>
/* 스프레드JS 컨테이너 스타일 */
.spreadsheet-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
}

.spread-host {
  flex-grow: 1;
  width: 80%;
  height: 500px;
}

.options-container {
  width: 18%;
  padding: 15px;
  background: #ddd;
}

.inputContainer {
  border: 1px solid #eee;
  padding: 15px;
  background-color: #f0f0f0;
  box-sizing: border-box;
  height: 500px;
}

/* 스프레드JS 내부 컨트롤 스타일 */
.inputContainer .input {
  width: 100%;
  margin-bottom: 10px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.inputContainer .button {
  width: 100%;
  margin-bottom: 15px;
  padding: 8px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.inputContainer .button:hover {
  background-color: #0056b3;
}

.inputContainer p {
  margin: 15px 0 5px 0;
  font-weight: bold;
  font-size: 14px;
}

/* JSON 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 80%;
  max-width: 800px;
  max-height: 80%;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
  flex-grow: 1;
  overflow: hidden;
}

.json-textarea {
  width: 100%;
  height: 400px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  resize: none;
  background-color: #f8f9fa;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #ddd;
}

</style>