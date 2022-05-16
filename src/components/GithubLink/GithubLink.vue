<template>
  <SvgIcon
    name="github"
    :size="props.size"
    class="cursor-pointer"
    @click="toGithub"
  />
</template>

<script lang="ts" setup>
import { withDefaults, defineProps } from 'vue';
import SvgIcon from '../SvgIcon/index.vue';

interface Props{
  size:string
}
const props = withDefaults(defineProps<Props>(), {
  size: '28',
});
function toGithub() {
  const href = 'https://github.com/CS181AI'; // 网站链接
  window.open(href, '_blank');
}
</script>

<style scoped>
</style>
