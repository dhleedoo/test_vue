import { createRouter, createWebHistory } from 'vue-router'
import BoardList from '../components/BoardList.vue'
import BoardCreate from '../components/BoardCreate.vue'
import BoardDetail from '../components/BoardDetail.vue'
import BoardEdit from '../components/BoardEdit.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: BoardList
    },
    {
      path: '/create',
      name: 'create',
      component: BoardCreate
    },
    {
      path: '/board/:id',
      name: 'detail',
      component: BoardDetail
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: BoardEdit
    }
  ]
})

export default router