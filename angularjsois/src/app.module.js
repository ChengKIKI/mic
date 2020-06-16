
import './public-path'
require("babel-polyfill");
require('datatables');
import angular from 'angular';
require('angular-datatables');
require('angular-ui-bootstrap');
require('oclazyload');
import 'bootstrap';

import {config} from './app/config/config.module';
import {views} from "./app/views/views.module";
import 'styles/style.css';

export function main() {
    let webApp =  angular.module('webApp', [
        'oc.lazyLoad',
        'ui.bootstrap',
        'datatables',

        config,
        views
    ]);
    return webApp;
}

/**
 * Needed for hmr
 * in prod this is replace for document ready
 */
switch (document.readyState) {
    case 'loading':
        document.addEventListener('DOMContentLoaded', _domReadyHandler, false);
        break;
    case 'interactive':
    case 'complete':
    default:
        main();
}

function _domReadyHandler() {
    document.removeEventListener('DOMContentLoaded', _domReadyHandler, false);
    main();
}

  
export async function bootstrap() {
    console.log('[angularjsois] angularjs app bootstraped');
}

export async function mount(props) {
    console.log('[angularjsois] props from main framework', props);
    // render(props);
}

export async function unmount() {
    console.log('[angularjsois] angularjs app unmount');
    // instance.$destroy();
    // instance = null;
    // router = null;
}