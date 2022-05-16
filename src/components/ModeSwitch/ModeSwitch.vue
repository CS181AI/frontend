<template>
  <div
    class="svg-container"
    @click="switchMode()"
  >
    <SvgIcon
      v-if="isDark"
      name="太阳"
      :size="props.size"
    />
    <SvgIcon
      v-else
      name="月亮"
      :size="props.size"
    />
  </div>
</template>

<script lang="ts" setup>
import { isDark, switchMode } from '@/util/switchMode';
import { withDefaults, defineProps } from 'vue';
import SvgIcon from '../SvgIcon/index.vue';

interface Props{
  size:string
}
const props = withDefaults(defineProps<Props>(), {
  size: '28',
});
</script>

<style scoped>
.svg-container{
  cursor:pointer;
  height: 100%;
  display: flex;
  align-items: center;
}
</style>
