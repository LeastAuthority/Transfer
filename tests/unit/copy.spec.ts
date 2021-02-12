import { shallowMount } from '@vue/test-utils'
import CopyButton from '@/components/HelloWorld.vue'

describe('CopyButton.vue', () => {
  it('copies the receive code link to the system clipboard when clicked', async () => {
    const code = '7-guitarist-revenge'
    const wrapper = shallowMount(CopyButton, {
      props: { code }
    })
    await wrapper.trigger('click');
    expect(wrapper.text()).toMatch(msg)
  })
})
