const { extractComponentId } = require("../common/helper");

module.exports = {
  _handleWuliFieldChange(event) {
    const componentId = extractComponentId(event);
    event.componentId = componentId;

    if (this.handleWuliFieldChange) {
      return this.handleWuliFieldChange(event);
    }

    console.warn("页面缺少 handleWuliFieldChange 回调函数");
  },

  _handleWuliFieldFocus(event) {
    const componentId = extractComponentId(event);
    event.componentId = componentId;

    if (this.handleWuliFieldFocus) {
      return this.handleWuliFieldFocus(event);
    }
  },

  _handleWuliFieldBlur(event) {
    const componentId = extractComponentId(event);
    event.componentId = componentId;

    if (this.handleWuliFieldBlur) {
      return this.handleWuliFieldBlur(event);
    }
  }
};
