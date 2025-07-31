import { ref } from 'vue';
import * as GC from "@mescius/spread-sheets";
import "@mescius/spread-sheets-io";
import { saveAs } from "file-saver";

export interface SpreadsheetOptions {
  mode?: 'view' | 'edit' | 'create';
  readonly?: boolean;
  initialData?: unknown;
}

export function useSpreadsheet(options: SpreadsheetOptions = {}) {
  const { mode = 'edit', readonly = false, initialData = null } = options;

  // 스프레드JS 상태
  const spread = ref<unknown>(null);
  const importExcelFile = ref<File | null>(null);
  const exportFileName = ref('export.xlsx');
  const revenueCount = ref(8);
  const newRowIndex = ref(11);
  const savedExcelData = ref<unknown>(initialData);

  // JSON 모달 관련
  const showJsonModal = ref(false);
  const jsonOutput = ref('');

  // 스프레드JS 초기화
  const initSpread = (spreadInstance: unknown) => {
    spread.value = spreadInstance;
    revenueCount.value = 8;
    newRowIndex.value = 11;
    
    // 저장된 Excel 데이터가 있으면 로드
    if (savedExcelData.value) {
      loadExcelDataToSpread();
    }
  };

  // 저장된 Excel 데이터를 스프레드JS에 로드
  const loadExcelDataToSpread = () => {
    if (!spread.value || !savedExcelData.value) return;
    
    try {
      spread.value.fromJSON(savedExcelData.value);
      // console.log('저장된 Excel 데이터 로드 성공');
    } catch {
      // console.error('스프레드JS 데이터 로드 오류');
    }
  };

  // 현재 스프레드JS 데이터를 JSON으로 추출
  const getSpreadsheetData = () => {
    if (!spread.value) return null;
    
    try {
      return spread.value.toJSON();
    } catch {
      // console.error('스프레드JS 데이터 추출 오류');
      return null;
    }
  };

  // Excel 데이터 설정 (외부에서 데이터 로드용)
  const setExcelData = (data: unknown) => {
    savedExcelData.value = data;
    if (spread.value) {
      loadExcelDataToSpread();
    }
  };

  // 파일 선택 변경 처리
  const changeFileDemo = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      importExcelFile.value = target.files[0];
    }
  };

  // 내보낼 파일명 변경 처리
  const changeExportFileName = (e: Event) => {
    const target = e.target as HTMLInputElement;
    exportFileName.value = target.value;
  };

  // Excel 파일 로드
  const loadExcel = () => {
    if (!spread.value || !importExcelFile.value) return;
    
    const options = {
      fileType: GC.Spread.Sheets.FileType.excel,
    };
    
    // Import an existing Excel file to Vue spreadsheet
    spread.value.import(
      importExcelFile.value,
      () => {
        console.log("Excel 가져오기 성공");
      },
      (e: unknown) => {
        console.error("Excel 가져오기 오류:", e);
        alert("Excel 파일을 가져오는 중 오류가 발생했습니다. 파일 형식을 확인해주세요.");
      },
      options
    );
  };

  // Excel 데이터 수정 (수익 추가)
  const modifyExcel = () => {
    if (!spread.value) return;
    
    const sheet = spread.value.getActiveSheet();
    
    // 새 행 추가
    sheet.addRows(newRowIndex.value, 1);
    
    // 기존 행에서 스타일 복사
    sheet.copyTo(10, 1, newRowIndex.value, 1, 1, 29, GC.Spread.Sheets.CopyToOptions.style);
    
    // 수익 라벨 설정
    const cellText = `Revenue ${revenueCount.value++}`;
    sheet.setValue(newRowIndex.value, 1, cellText);
    
    // 랜덤 수익 데이터 채우기
    for (let c = 3; c < 15; c++) {
      sheet.setValue(newRowIndex.value, c, Math.floor(Math.random() * 200) + 10);
    }
    
    // 스파크라인 차트 추가
    const data = new GC.Spread.Sheets.Range(newRowIndex.value, 3, 1, 12);
    const setting = new GC.Spread.Sheets.Sparklines.SparklineSetting();
    setting.options.seriesColor = "Text 2";
    setting.options.lineWeight = 1;
    setting.options.showLow = true;
    setting.options.showHigh = true;
    setting.options.lowMarkerColor = "Text 2";
    setting.options.highMarkerColor = "Text 1";
    sheet.setSparkline(newRowIndex.value, 2, data, GC.Spread.Sheets.Sparklines.DataOrientation.horizontal, GC.Spread.Sheets.Sparklines.SparklineType.line, setting);
    
    // 합계 공식 추가
    sheet.setFormula(newRowIndex.value, 15, "=SUM([@[Jan]:[Dec]])");
    
    // 다음 행으로 이동
    newRowIndex.value++;
    
    // 고정값 설정
    sheet.setValue(newRowIndex.value, 16, 0.15);
    
    // 공식 설정 복사
    sheet.copyTo(10, 17, newRowIndex.value, 17, 1, 13, GC.Spread.Sheets.CopyToOptions.formula);
  };

  // Excel 파일 저장
  const saveExcel = () => {
    if (!spread.value) return;
    
    const fileName = exportFileName.value || "Excel_Export.xlsx";
    
    // Save Vue spreadsheet to local Excel XLSX file
    spread.value.export(
      (blob: Blob) => {
        // save blob to a file
        saveAs(blob, fileName);
        console.log("Excel 저장 성공");
      },
      (e: unknown) => {
        console.error("Excel 저장 오류:", e);
        alert("Excel 파일 저장 중 오류가 발생했습니다.");
      },
      {
        fileType: GC.Spread.Sheets.FileType.excel,
      }
    );
  };

  // JSON 변환 및 출력
  const exportToJSON = () => {
    if (!spread.value) return;
    
    const jsonData = spread.value.toJSON();
    const jsonStr = JSON.stringify(jsonData, null, 2);
    jsonOutput.value = jsonStr;
    showJsonModal.value = true;
  };

  // JSON 모달 닫기
  const closeJsonModal = () => {
    showJsonModal.value = false;
    jsonOutput.value = '';
  };

  // 클립보드에 복사
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonOutput.value);
      alert('클립보드에 복사되었습니다!');
    } catch {
      alert('클립보드 복사에 실패했습니다. 텍스트를 선택했으니 Ctrl+C로 복사해주세요.');
    }
  };

  return {
    // 상태
    spread,
    importExcelFile,
    exportFileName,
    revenueCount,
    newRowIndex,
    savedExcelData,
    showJsonModal,
    jsonOutput,
    mode,
    readonly,

    // 메서드
    initSpread,
    loadExcelDataToSpread,
    getSpreadsheetData,
    setExcelData,
    changeFileDemo,
    changeExportFileName,
    loadExcel,
    modifyExcel,
    saveExcel,
    exportToJSON,
    closeJsonModal,
    copyToClipboard
  };
}