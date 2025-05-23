import { Canvas } from '@antv/f-engine';

function convertTouches(touches) {
  if (!touches) return touches;
  touches.forEach((touch) => {
    touch.clientX = touch.x;
    touch.clientY = touch.y;
  });
  return touches;
}

function dispatchEvent(el, event, type) {
  if (!el || !event) return;
  if (!event.preventDefault) {
    event.preventDefault = function() {};
  }
  event.type = type;
  event.target = el;
  const { touches, changedTouches, detail } = event;
  event.touches = convertTouches(touches);
  event.changedTouches = convertTouches(changedTouches);
  if (detail) {
    event.clientX = detail.x;
    event.clientY = detail.y;
  }
  el.dispatchEvent(event);
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    theme: {
      type: Object,
      value: {},
    },
    onRender: {
      type: null,
      value: () => {},
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  ready() {
    const query = wx.createSelectorQuery().in(this);
    query
      .select('.f-canvas')
      .fields({
        node: true,
        size: true,
      })
      .exec((res) => {
        const { node, width, height } = res[0];
        const { requestAnimationFrame, cancelAnimationFrame } = node;

        const context = node.getContext('2d');
        const pixelRatio = wx.getSystemInfoSync().pixelRatio;
        // 高清设置
        node.width = width * pixelRatio;
        node.height = height * pixelRatio;
        const { theme } = this.data;
        const children = this.data.onRender(this.data);
        const canvas = new Canvas({
          pixelRatio,
          width,
          height,
          theme,
          context,
          children,
          // @ts-ignore
          offscreenCanvas: wx.createOffscreenCanvas({ type: '2d' }),
          createImage: () => {
            // 必须使用 node.createImage， 不能解构，否则会报错,
            // https://github.com/antvis/F2/issues/1838
            return node.createImage();
          },
          requestAnimationFrame,
          cancelAnimationFrame,
          isTouchEvent: (e) => e.type.startsWith('touch'),
          isMouseEvent: (e) => e.type.startsWith('mouse'),
        });
        this.canvas = canvas;
        this.canvasEl = canvas.getCanvasEl();
        canvas.render();
      });
  },

  observers: {
    // 处理 update
    '**': function() {
      const { canvas, data } = this;
      if (!canvas) return;
      const { theme } = data;
      const children = data.onRender(data);
      canvas.update({
        theme,
        children,
      });
    },
  },

  lifetimes: {
    detached() {
      const { canvas } = this;
      if (!canvas) return;
      canvas.destroy();
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    click(e) {
      dispatchEvent(this.canvasEl, e, 'click');
    },
    touchStart(e) {
      dispatchEvent(this.canvasEl, e, 'touchstart');
    },
    touchMove(e) {
      dispatchEvent(this.canvasEl, e, 'touchmove');
    },
    touchEnd(e) {
      dispatchEvent(this.canvasEl, e, 'touchend');
    },
  },
});
