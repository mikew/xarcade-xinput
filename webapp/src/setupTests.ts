// This shim needs to be first to avoid React complaining about rAF:
// https://github.com/facebook/jest/issues/4545#issuecomment-342424086
(global as any).requestAnimationFrame = (callback) => {
  setTimeout(callback, 0)
}
;(global as any).localStorage = {
  // readonly length: number;
  clear: jest.fn(),
  getItem: jest.fn(),
  key: jest.fn(),
  removeItem: jest.fn(),
  setItem: jest.fn(),
  // [key: string]: any;
  // [index: number]: string;
}

// Needed for some components that use material-ui
// tslint:disable-next-line:max-line-length
// https://github.com/mui-org/material-ui/blob/c0afa64dbc7e331cbf13ab30ee58ffb71958c40b/test/utils/createDOM.js#L21-L28
;(global as any).document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
})

import * as Enzyme from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({
  adapter: new Adapter(),
})
