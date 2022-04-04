import PopoverExample from './PopoverExample.vue';

export default {
  title: 'Example/PopoverExample',
  component: PopoverExample,
};

const Template = (args) => ({
  components: { PopoverExample },
  template: `<PopoverExample />`,
});

export const Primary = Template.bind({});
Primary.args = {};
