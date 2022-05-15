<template>
  <div class="point point-flicker" />
</template>

<script lang="ts" setup>

</script>

<style scoped>
.point {
  width: 10px;
  height: 10px;
  background-color: rgba(0, 168, 253, 0.5);
  position: absolute;
  border-radius: 50%;
}

/* 设置动画前颜色 */
.point-flicker:after {
  background-color: rgba(0, 168, 253, 0.5)
}

/* 设置动画后颜色 */
.point-flicker:before {
  background-color: rgba(0, 168, 253, 0.2);
}

/* 设置动画 */
.point-flicker:before,
.point-flicker:after {
  content: '';
  width: 16px;
  height: 16px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -8px;
  margin-top: -8px;
  border-radius: 50%;
  animation: warn 1.2s ease-out 0s infinite;
}

@keyframes warn {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }

  30% {
    transform: scale(0.7);
    opacity: 1;
  }

  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}
</style>
