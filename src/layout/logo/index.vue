<script setup>
defineProps({
  collapsed: {
    type: Boolean,
  },
})
</script>

<template>
  <div class="logo">
    <img src="~@/assets/images/logo.png" alt="">
  </div>
</template>

<style lang="less" scoped>
  .logo {
  @apply flex overflow-hidden whitespace-nowrap items-center;

  height: 64px;
  line-height: 64px;
  justify-content: center;

  img {
    height: 64px;
    margin-right: 8px;
  }

  .title {
    @apply mb-0 text-xl;

    color: var(--app-primary-color);
  }
}
</style>
