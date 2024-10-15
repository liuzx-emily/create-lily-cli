<script lang="jsx">
import { ref } from "vue";
export default {
  props: {
    start: { type: Number, required: true },
  },
  setup(props) {
    const count = ref(props.start);
    function increment() {
      count.value++;
    }
    return function () {
      return (
        <div class="counter">
          {count.value}
          <input type="button" value="+1" onClick={increment} />
        </div>
      );
    };
  },
};
</script>
<style lang="scss" scoped>
div.counter {
  background-color: #eee;
  input[type="button"] {
    margin-left: 5px;
    cursor: pointer;
  }
}
</style>
