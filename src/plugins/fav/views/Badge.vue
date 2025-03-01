<script setup>
import { EditOutlined } from '@ant-design/icons-vue';
import { templateModal, messageModal } from '@/components/modal';
import DisplayTag from '@/components/tag/DisplayTag.vue';
import dateUtil from '@/utils/dateUtil';
import { view as viewApi } from '@/service/bilibili/api/video';
import Info from './template/Info.vue';

const props = defineProps([
  'bvid',
  'pic',
  'title',
  'desc',
  'remark',
  'tags',
  'ctime',
  'mtime',
]);
const emits = defineEmits(['change']);

const handleChange = (record) => {
  emits('change', record);
};
const showModal = () => {
  viewApi(
    props.bvid,
    (result) => {
      const { pic = props.pic, title = props.title, desc = props.desc } = result || {};
      const close = templateModal({
        title: '备注信息',
        template: Info,
        templateProps: {
          ...props,
          pic,
          title,
          desc,
          onChange: handleChange,
          onClose: () => close(),
        },
      });
    },
    (message) => {
      messageModal({ title: '提示', message, type: 'warning' });
    }
  );
};
</script>

<template>
  <a-popover
    v-if="remark || tags"
    placement="topRight"
    arrowPointAtCenter
    destroyTooltipOnHide
    :overlayInnerStyle="{
      width: '380px',
      boxShadow: '0px 0px 20px 5px rgba(0, 0, 0, 0.5)',
    }"
  >
    <template #content>
      <p v-if="remark">{{ remark }}</p>
      <a-divider v-if="remark && tags" dashed style="margin: 12px 0" />
      <p v-if="tags" style="text-align: right"><DisplayTag :tags="tags || ''" /></p>
      <a-row v-if="ctime || mtime" justify="space-between" class="custom-row-time">
        <a-col v-if="ctime" :span="12" class="custom-col-time">
          创建时间：{{ dateUtil.timestampToDate[1](ctime) }}
        </a-col>
        <a-col v-if="mtime" :span="12" class="custom-col-time">
          修改时间：{{ dateUtil.timestampToDate[1](mtime) }}
        </a-col>
      </a-row>
    </template>
    <div title="点击编辑备注" @click="showModal" class="ribbon">
      <EditOutlined />
    </div>
  </a-popover>
  <div v-else title="点击编辑备注" @click="showModal" class="ribbon ribbon-new">
    <EditOutlined />
  </div>
</template>

<style scoped>
.ribbon {
  margin: 0px;
  font-size: 12px;
  line-height: 16px;
  color: #fff;
  text-align: center;
  width: 20px;
  height: 18px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), transparent) #ea3447;
  background-blend-mode: soft-light;
  display: inline-block;
  border-radius: 12px 0 0 12px;
  position: relative;
  border: 1px solid #fff;
  cursor: pointer;
}
.ribbon::after {
  position: absolute;
  content: '';
  clip-path: polygon(0 0, 100% 0, 0 100%);
  width: 4px;
  height: 4px;
  right: 0;
  bottom: -4px;
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3));
  background-color: inherit;
}
.ribbon-new {
  background-color: dimgray;
}
.custom-row-time {
  margin-top: 8px;
}
.custom-col-time {
  font-size: 12px;
  color: #bbbbbb;
}
</style>
