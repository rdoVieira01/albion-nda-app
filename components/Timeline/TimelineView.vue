<template>
  <el-timeline>
    <TimelineItem v-for="(post, index) in posts" :key="index" :post="post" />
  </el-timeline>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import _ from 'lodash';
import { Post } from '@/genql';

export default defineComponent({
  props: {
    posts: {
      type: Array as () => Post[],
      required: true,
    },
  },
  setup() {
    return {};
  },
});
</script>
