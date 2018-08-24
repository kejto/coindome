import React from 'react';
import ReactDom from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import App from './components/Start';
import registerServiceWorker from './registerServiceWorker';
import 'style-loader!react-select/scss/default.scss';
import '!style-loader!css-loader!react-toastify/dist/ReactToastify.css';

ReactDom.render((
  <HashRouter>
    <App />
  </HashRouter>
), document.getElementById('react-app'));

registerServiceWorker(toast);