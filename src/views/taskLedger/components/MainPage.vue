<script lang="ts" setup>
defineOptions({
  name: 'MainPage',
})
</script>

<template>
  <div class="main-page">
    <div class="main-page__header">
      <slot name="header" />
    </div>
    <div class="main-page__content">
      <slot name="content" />
    </div>
    <div v-if="$slots.footer" class="main-page__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style lang="less" scoped>
  @import '@/styles/theme.less';
.themeBgColor(main-page);
.main-page {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 16px;
  flex-direction: column;
  gap: 16px;
  .main-page__header {
    border-bottom: 1px dashed #f3f3f3;
    margin-bottom: 16px;
  }
  .main-page__content {
    min-height: 0;
    flex: 1;
  }
}
</style>
