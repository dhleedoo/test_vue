<template>
  <div class="pagination">
    <button
      @click="prevGroup"
      :disabled="currentGroup === 1"
      aria-label="이전 페이지 그룹"
    >
      &lt;
    </button>

    <button
      v-for="page in visiblePages"
      :key="page"
      @click="changePage(page)"
      :class="{ active: page === currentPage }"
    >
      {{ page }}
    </button>

    <button
      @click="nextGroup"
      :disabled="currentGroup === totalGroups"
      aria-label="다음 페이지 그룹"
    >
      &gt;
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref, watch } from 'vue';

const props = defineProps<{
  currentPage: number;
  totalPages: number;
}>();

const emit = defineEmits<{
  (e: 'change-page', page: number): void;
}>();

const pagesPerGroup = 10;
const currentGroup = ref(Math.ceil(props.currentPage / pagesPerGroup));

watch(() => props.currentPage, (newPage) => {
  currentGroup.value = Math.ceil(newPage / pagesPerGroup);
});

const totalGroups = computed(() => Math.ceil(props.totalPages / pagesPerGroup));

const visiblePages = computed(() => {
  const start = (currentGroup.value - 1) * pagesPerGroup + 1;
  const end = Math.min(currentGroup.value * pagesPerGroup, props.totalPages);
  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

function changePage(page: number) {
  if (page !== props.currentPage) {
    emit('change-page', page);
  }
}

function prevGroup() {
  if (currentGroup.value > 1) {
    currentGroup.value--;
    // 그룹 변경 시 첫 페이지로 이동
    emit('change-page', (currentGroup.value - 1) * pagesPerGroup + 1);
  }
}

function nextGroup() {
  if (currentGroup.value < totalGroups.value) {
    currentGroup.value++;
    // 그룹 변경 시 첫 페이지로 이동
    emit('change-page', (currentGroup.value - 1) * pagesPerGroup + 1);
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  gap: 8px;
  justify-content: center;
  padding: 10px 0;
}

.pagination button {
  width: 40px;
  height: 40px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  padding: 0;
  text-align: center;
}

.pagination button.active {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

.pagination button:disabled {
  cursor: not-allowed;
  color: #aaa;
}
</style>
