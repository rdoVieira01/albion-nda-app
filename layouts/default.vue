<template>
  <div class="common-layout">
    <el-container>
      <el-header />
      <el-main>
        <slot />
      </el-main>
      <el-footer />
    </el-container>
  </div>
</template>

<script lang="ts">
import { useDark } from '@vueuse/core';
useDark();

export default defineComponent({});
</script>

<style>
 @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}
</style>
