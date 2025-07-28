import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 스프레드JS 기능을 위한 GrapeCity SpreadJS 컴포넌트
import {
  GcSpreadSheets,
  GcWorksheet,
  GcColumn,
} from "@mescius/spread-sheets-vue"

const app = createApp(App)

app.use(createPinia())
app.use(router)

// SpreadJS 컴포넌트를 전역으로 등록
app.component("gc-spread-sheets", GcSpreadSheets)
app.component("gc-worksheet", GcWorksheet)
app.component("gc-column", GcColumn)

app.mount('#app')
