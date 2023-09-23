<template>
  <el-row>
    TableView
  </el-row>
  <el-table :default-sort="{ prop: 'createdAt', order: 'descending' }" :data="sortedPosts" style="width: 100%">
    <el-table-column type="expand">
      <template #default="props">
        <div m="4">
          <p v-for="(desc, dI) in props.row.changes" :key="dI" m="t-0 b-2" class="description">
            {{ desc }}
          </p>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Date" sortable prop="createdAt" />
    <el-table-column label="Main Node" sortable prop="mainNode" :filters="allUniqNodes" :filter-method="filterHandler" column-key="mainNode" />
    <el-table-column label="Sub Node" sortable prop="subNode" />
  </el-table>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import _ from 'lodash';

export default defineComponent({
  props: {
    posts: {
      type: Object,
      required: true,
    },
  },

  setup(props) {
    const flatPosts = ref(props.posts.map((post) => post.changes.map((change) => ({
      createdAt: post.createdAt,
      mainNode: change.mainNode,
      subNode: change.subNode,
      changes: change.changes,
    }))).flat());

    const sortedPosts = _.sortBy(flatPosts.value, ['createdAt', 'mainNode']);

    const allUniqNodes = _.uniq(flatPosts.value.map((change) => change.mainNode)).map((node) => {
      return {
        text: node,
        value: node,
      };
    });
    // console.log(allUniqNodes);

    const filterHandler = (
      value: string,
      row,
      column,
    ) => {
      const property = column.property;
      return row[property] === value;
    };

    return {
      flatPosts,
      sortedPosts,
      allUniqNodes,
      filterHandler,
    };
  },
});

</script>
