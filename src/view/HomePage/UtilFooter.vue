<template>
  <div class="w-full flex flex-row justify-end">
    <n-popover trigger="hover">
      <template #trigger>
        <HoverContainer><ModeSwitch size="30" /></HoverContainer>
      </template>
      <span>{{ hint }}</span>
    </n-popover>
    <n-popover trigger="hover">
      <template #trigger>
        <HoverContainer><FullScreen size="26" /></HoverContainer>
      </template>
      <span>全屏</span>
    </n-popover>
  </div>
</template>

<script lang="ts" setup>
import ModeSwitch from '@/components/ModeSwitch/ModeSwitch.vue';
import HoverContainer from '@/components/HoverContainer/HoverContainer.vue';
import { computed } from 'vue';
import { isDark } from '@/util/switchMode';
import FullScreen from '@/components/FullScreen/FullScreen.vue';

const hint = computed(() => (isDark.value === true ? '切换白天模式' : '切换夜间模式'));
</script>

<style scoped>

</style>
