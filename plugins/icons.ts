import { defineNuxtPlugin } from '#app'
import VideoIcon from '~/components/icons/VideoIcon.vue'
import PhotoIcon from '~/components/icons/PhotoIcon.vue'
import ArticleIcon from '~/components/icons/ArticleIcon.vue'
import UserIcon from '~/components/icons/UserIcon.vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('VideoIcon', VideoIcon)
  nuxtApp.vueApp.component('PhotoIcon', PhotoIcon)
  nuxtApp.vueApp.component('ArticleIcon', ArticleIcon)
  nuxtApp.vueApp.component('UserIcon', UserIcon)
}) 