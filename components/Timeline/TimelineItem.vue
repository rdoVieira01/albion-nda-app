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
      <el-collapse>
        <el-collapse>
          <template v-for="(changeNode, mainIndex) in filteredNodes" :key="mainIndex">
            <el-collapse-item class="mainNode" :name="changeNode">
              <template #title>
                <span> {{ changeNode }} </span>
              </template>
              <template v-for="(change, index) in groupedChanges[changeNode]" :key="index">
                <el-collapse-item class="subNode" :name="change._d">
                  <template #title>
                    {{ change.subNode }}
                  </template>
                  <el-row v-for="(desc, dI) in change.changes" :key="dI" class="description">
                    <el-col :span="22">
                      <el-tooltip placement="left">
                        <template #content>
                          {{ getPercentage(desc) }}%
                        </template>
                        {{ desc }}
                      </el-tooltip>
                    </el-col>
                  </el-row>
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
import { type Change, type Post } from '~/graphql/genql';

export default defineComponent({
  props: {
    post: {
      type: Object as () => Post,
      required: true,
    },
  },
  setup(props) {
    const changePercentages: Record<string, number> = {};

    const getPercentage = (str: string) => {
      if (changePercentages[str]) {
        return changePercentages[str];
      }

      const regex = /(?!\d.*->).\d.*($|\D)/i;
      const matches = str.match(regex);
      if (!matches) {
        return 0;
      }
      const [match] = matches;

      const valueChanges = match.split('->');
      const [before] = valueChanges;
      const [after] = valueChanges.slice(-1);

      const cleanBefore = parseFloat(before?.trim());
      const cleanAfter = parseFloat(after?.trim());

      const rawChange = cleanAfter - cleanBefore;
      let percentualChange: number = parseFloat(((rawChange / cleanBefore) * 100).toFixed(2));

      if (!Number.isFinite(percentualChange)) {
        percentualChange = 0;
      }

      changePercentages[str] = percentualChange;
      return percentualChange;
    };
    const activeNodes = ref([]);
    const selectedNodes = ref([]);

    const { post } = props;

    const getChangeNodes = (changes: Change[]) => _.uniq(changes.map((change) => change.mainNode)).sort();
    const filteredChanges = computed(() => {
      if (!selectedNodes.value.length) {
        return post.changes;
      }
      return post.changes?.filter((change: Change) => selectedNodes.value.includes(change?.mainNode));
    });
    const groupData = (data: any) => _.groupBy(data, 'mainNode');

    const groupedChanges = computed(() => groupData(_.sortBy(filteredChanges.value, ['mainNode', 'subNode'])));

    const computedTitle = computed(() => `${dayjs(post.createdAt).format('DD/MM/YYYY')} - ${post.postId}`);

    const allNodes = getChangeNodes(post.changes);
    const filteredNodes = computed(() => getChangeNodes(filteredChanges.value));
    return {
      activeNodes,
      groupedChanges,
      allNodes,
      filteredNodes,
      selectedNodes,
      computedTitle,
      getPercentage,
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
