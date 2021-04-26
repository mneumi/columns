<template>
  <div class="more">加载更多</div>
</template>

<script lang="ts">
import { ref, reactive, computed, defineComponent } from "vue";
import { request } from "@/request";
import { createMessage } from "../message/Message.vue";

export default defineComponent({
  name: "More",
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function useMore<T>(url: string, initPage = 1, initSize = 3) {
  const _size = ref<number>(initSize);
  const _page = ref<number>(initPage);
  const _total = ref<number>(0);
  const list = reactive<T[]>([]);

  const hasMore = computed(() => {
    return _page.value * _size.value < _total.value;
  });

  const fetchData = () => {
    request
      .get(url, {
        params: {
          size: _size.value,
          page: _page.value,
        },
      })
      .then((res) => {
        const { size, page, total } = res.data.pagination;
        _size.value = size;
        _page.value = page;
        _total.value = total;

        const resultList = res.data.list as [];
        list.push(...resultList);
      })
      .catch((err) => {
        createMessage(err.data.message, "error");
      });
  };

  fetchData();

  const getMore = () => {
    _page.value++;
    fetchData();
  };

  return { list, hasMore, getMore };
}

export { useMore };
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/mixins.scss";

.more {
  width: 1.2rem;
  height: 0.5rem;
  background-color: $primary-color;
  margin: 0.2rem 0;
  color: $white-color;
  border-radius: 0.1rem;
  @include center;
  &:hover {
    cursor: pointer;
  }
}
</style>