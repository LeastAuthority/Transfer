import ReceiveDefault from "@/components/receive/ReceiveDefault.vue";
import store from "@/store/index";
import { app } from "@storybook/vue3";

app.use(store);

export default {
  title: "Example/ReceiveDefault",
  component: ReceiveDefault,
  argTypes: {
    active: { type: "boolean" },
  },
};

const Template = (args) => ({
  components: { ReceiveDefault },
  setup() {
    return { args };
  },
  template: '<ReceiveDefault v-bind="args" />',
});

export const Example = Template.bind({});
Example.args = {
  active: true,
};
