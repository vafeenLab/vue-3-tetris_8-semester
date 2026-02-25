import { createWebHistory, createRouter } from 'vue-router'

import IndexPage from './../components/pages/IndexPage.vue'
import ExamplePage from './../components/pages/ExamplePage.vue'
import DemoPage from './../components/pages/DemoPage.vue'
import TetrisPage from './../components/pages/TetrisPage.vue'

export const ROUTES = {
  EXAMPLE: 'EXAMPLE',
  INDEX: 'INDEX',
  DEMO: 'DEMO',
  TETRIS: 'TETRIS',
}

const routes = [
  {
    name: ROUTES.EXAMPLE,
    path: '/example',
    component: ExamplePage
  },
  {
    name: ROUTES.INDEX,
    path: '/',
    component: IndexPage
  },
  {
    name: ROUTES.DEMO,
    path: '/demo',
    component: DemoPage
  },
  {
    name: ROUTES.TETRIS,
    path: '/tetris',
    component: TetrisPage
  },
]

export const router = createRouter({
  history: createWebHistory('/'),
  routes,
})