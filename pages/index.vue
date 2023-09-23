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
import Promise from 'bluebird';
import { createClient, everything } from '@/genql';

const client = createClient({
  url: 'https://rpzuwamfrh.execute-api.us-east-1.amazonaws.com/dev/graphql',
});

export default defineComponent({
  async setup() {
    const timelineView = ref(true);

    const { posts: allPosts } = await client.query({
      posts: {
        postId: 1,
        createdAt: 1,
        changes: { __scalar: true },
      },
    });

    await Promise.map(allPosts, async(post) => {
      const { changesByPostId: changes } = await client.query({
        changesByPostId: {
          __scalar: true,
          changes: 1,
          __args: {
            postId: post.postId,
          },
        },
      });
      post.changes = changes;
    }, { concurrency: 25 });

    return {
      allPosts,
      timelineView,
    };
  },
});

</script>
