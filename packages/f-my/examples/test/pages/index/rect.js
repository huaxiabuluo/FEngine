import { Component } from '@antv/f-engine';
import { jsx as _jsx, jsxs as _jsxs } from "@antv/f-engine/jsx-runtime";
class Rect extends Component {
  render() {
    const {
      index,
      width = 0
    } = this.props;
    return _jsxs("group", {
      style: {
        display: 'flex'
      },
      children: [_jsx("text", {
        style: {
          text: `${index}`,
          fill: '#000',
          fontSize: '30px'
        }
      }), _jsx("rect", {
        style: {
          fill: 'red',
          width,
          height: '40px'
        },
        animation: {
          appear: {
            easing: 'linear',
            duration: 300,
            property: ['width'],
            start: {
              width: 0
            },
            end: {}
          },
          update: {
            easing: 'linear',
            duration: 300,
            property: ['width']
          }
        },
        onClick: e => {
          console.log('click', e);
        },
        onTouchStart: e => {
          console.log('onTouchStart', e);
        },
        onTouchMove: e => {
          console.log('onTouchMove', e);
        },
        onTouchEnd: e => {
          console.log('onTouchEnd', e);
        }
      }), _jsx("image", {
        style: {
          width: 32,
          height: 32,
          src: 'https://f2.antv.antgroup.com/favicon-32x32.png'
        }
      })]
    });
  }
}
export default Rect;