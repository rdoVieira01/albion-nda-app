<template>
  <div>
    <el-timeline>
      <TimelineItem v-for="(post, index) in loadedPosts" :key="index" :post="post" />
    </el-timeline>
    <el-button :loading="loading" @click="loadPosts">
      Load more
    </el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import _ from 'lodash';
import Promise from 'bluebird';
import gqlClient from '@/graphql';
import { type Post } from '@/graphql/genql';

export default defineComponent({
  props: {
    posts: {
      type: Array as () => Post[],
      required: true,
    },
  },
  setup(props) {
    const { posts } = props;
    const sortedPosts = computed(() => _.orderBy(posts, 'createdAt', 'desc'));

    const loadedPosts = ref([]);
    const loading = ref(false);

    const loadPost = async(post: Post) => {
      if (!post.postId) { return; }
      const { changesByPostId: changes } = await gqlClient.query({
        changesByPostId: {
          __scalar: true,
          changes: 1,
          __args: {
            postId: post.postId,
          },
        },
      });
      post.changes = changes;
      return post;
    };

    const loadPosts = async() => {
      if (loading.value) {
        return;
      }
      loading.value = true;
      const lastPost = _.last(loadedPosts.value);
      let lastPostIndex = 0;
      if (lastPost) {
        lastPostIndex = _.findIndex(sortedPosts.value, (post: Post) => post.postId === lastPost.postId) + 1;
      }
      const nextPosts = sortedPosts.value.slice(lastPostIndex, lastPostIndex + 6);

      const loadedNextPosts = await Promise.map(nextPosts, async(post: Post) => {
        await loadPost(post);
        return post;
      }, { concurrency: 5 });
      loadedPosts.value.push(...loadedNextPosts);
      loadedPosts.value = _.orderBy(loadedPosts.value, 'createdAt', 'desc');

      loading.value = false;
    };

    onMounted(async() => {
      await loadPosts();
    });

    return {
      loadedPosts,
      loadPosts,
      loading,
    };
  },
});
</script>

<style scoped>
.el-button {
  margin-left: 30%;
  @media screen and (max-width: 840px) {
    margin-left: 25%;
  }
}
</style>
