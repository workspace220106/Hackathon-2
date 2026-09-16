// Same helper @vitejs/plugin-vue injects for compiled SFCs: attaches
// __scopeId / render / etc. to a component definition object.
export const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) target[key] = val;
  return target;
};
