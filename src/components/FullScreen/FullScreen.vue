<template>
  <SvgIcon
    name="全屏"
    :size="props.size"
    class="cursor-pointer"
    @click="fullScreen"
  />
</template>

<script lang="ts" setup>
import { withDefaults, defineProps } from 'vue';
import screenfull from 'screenfull';
import SvgIcon from '../SvgIcon/index.vue';

interface Props{
  size:string
}
const props = withDefaults(defineProps<Props>(), {
  size: '28',
});
function fullScreen() {
  if (screenfull.isEnabled) {
    screenfull.request();
  }
}
</script>

<style scoped>
</style>
