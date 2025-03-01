import { ref, shallowRef, createApp, h } from 'vue';
import Antd, { Modal } from 'ant-design-vue';

const titleRef = ref();
const templateRef = shallowRef();
const templatePropsRef = ref();
const openRef = ref(false);

createApp({
  render: () => {
    return h(
      Modal,
      {
        centered: true,
        destroyOnClose: true,
        footer: null,
        title: titleRef.value,
        open: openRef.value,
        width: '720px',
        zIndex: 99999,
        onCancel: () => {
          openRef.value = false;
        },
      },
      () => h(templateRef.value, { ...templatePropsRef.value })
    );
  },
})
  .use(Antd)
  .mount(
    (() => {
      const div = document.createElement('div');
      document.body.append(div);
      return div;
    })()
  );

export const templateModal = ({ title, template, templateProps }) => {
  openRef.value = true;
  titleRef.value = title;
  templateRef.value = template;
  templatePropsRef.value = templateProps;
  return () => {
    openRef.value = false;
  };
};

export const messageModal = ({ title, message, type = 'info' }) => {
  Modal[type]({
    title,
    content: message,
    autoFocusButton: null,
    okText: '确定',
    zIndex: 99999,
    style: { 'text-align': 'left' },
    onOk() {
      Modal.destroyAll();
    },
    onCancel() {
      Modal.destroyAll();
    },
  });
};
