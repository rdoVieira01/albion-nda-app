<template>
  <div>
    <!-- <el-row>
      Change view <el-switch class="ml-6" v-model="timelineView" />
    </el-row> -->
    <TimelineView v-if="timelineView" :posts="allPosts" />
    <TableView v-else :posts="allPosts" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import gqlClient from '@/graphql';

export default defineComponent({
  async setup() {
    const timelineView = ref(true);

    const { posts: allPosts } = await gqlClient.query({
      posts: {
        postId: 1,
        createdAt: 1,
        changes: { __scalar: true },
      },
    });

    return {
      allPosts,
      timelineView,
    };
  },
});

</script>
