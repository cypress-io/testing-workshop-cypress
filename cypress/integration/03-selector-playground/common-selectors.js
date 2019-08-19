const tid = id => `[data-cy="${id}"]`;

const selectors = {
  todoInput: tid("input")
};

export { tid, selectors };
