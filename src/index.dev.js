require('antd/lib/style/index.css');

import React from 'react';
import ReactDOM from 'react-dom';
import App from './app.dev';

if (module.hot){
  //实现热更新
  module.hot.accept();
}

ReactDOM.render(<App/>, document.getElementById('app'));