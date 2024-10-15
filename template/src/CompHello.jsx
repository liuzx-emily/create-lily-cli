export default {
  props: {
    name: { type: String, default: "mike" },
  },
  setup(props) {
    return function () {
      return <div>Hello {props.name}</div>;
    };
  },
};
