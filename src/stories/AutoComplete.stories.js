import AutoComplete from "@/components/AutoComplete.vue";

export default {
  title: "Example/AutoComplete",
  component: AutoComplete,
  argTypes: {
    suggestedWord: { type: "string" },
  },
};

const Template = (args) => ({
  components: { AutoComplete },
  setup() {
    return { args };
  },
  template: '<AutoComplete v-bind="args" />',
});

export const Example = Template.bind({});
Example.args = {
  suggestedWord: "guitarist",
};
