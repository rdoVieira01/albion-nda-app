<template>
  <el-timeline-item class="timelineItem" :timestamp="computedTitle" placement="top">
    <el-card>
      <el-select v-model="selectedNodes" placeholder="Filter by change node" multiple class="select">
        <el-option
          v-for="item in allNodes"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-collapse v-model="activeNodes">
        <el-collapse>
          <template v-for="(changeNode, mainIndex) in allNodes" :key="mainIndex">
            <el-collapse-item class="mainNode" :title="changeNode" :name="changeNode">
              <template v-for="(change, index) in groupedChanges[changeNode]" :key="index">
                <el-collapse-item class="subNode" :title="change.subNode" :name="change._d">
                  <p v-for="(desc, dI) in change.changes" :key="dI" class="description">
                    {{ desc }}
                  </p>
                </el-collapse-item>
              </template>
            </el-collapse-item>
          </template>
        </el-collapse>
      </el-collapse>
    </el-card>
  </el-timeline-item>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import _ from 'lodash';
import dayjs from 'dayjs';
import { Post } from '@/genql';

export default defineComponent({
  props: {
    post: {
      type: Object as () => Post,
      required: true,
    },
  },
  setup(props) {
    const activeNodes = ref([]);
    const selectedNodes = ref([]);

    const { post } = props;

    const allNodes = _.uniq(post.changes?.map((change) => change.mainNode)).sort();
    const filteredChanges = computed(() => {
      if (!selectedNodes.value.length) {
        return post.changes;
      }
      return post.changes?.filter((change) => selectedNodes.value.includes(change?.mainNode));
    });
    const groupData = (data: any) => _.groupBy(data, 'mainNode');

    const groupedChanges = computed(() => groupData(_.sortBy(filteredChanges.value, ['mainNode', 'subNode'])));

    const computedTitle = computed(() => `${dayjs(post.createdAt).format('DD/MM/YYYY')} - ${post.postId}`);

    return {
      activeNodes,
      groupedChanges,
      allNodes,
      selectedNodes,
      computedTitle,
    };
  },
});
</script>

<style scoped>
.select {
  margin-bottom: 24px;
  margin-right: 10px
}

.timelineItem {
  margin-left: 25%;
  @media screen and (max-width: 840px) {
    margin-left: 0%;
  }

}

.el-card{
  max-width: 60%;
  @media screen and (max-width: 840px) {
    max-width: 100%;
    width: auto;
  }
}

@media screen and (max-width: 840px) {
   * {
    --el-collapse-header-height: auto !important;
  }
}

</style>
