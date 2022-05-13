<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from '@/view/HomePage/HomePage.vue';
import NaiveProvider from './layout/components/NaiveProvider/NaiveProvider.vue';
</script>

<template>
  <naive-provider>
    <HelloWorld />
  </naive-provider>
</template>

<style>
</style>
