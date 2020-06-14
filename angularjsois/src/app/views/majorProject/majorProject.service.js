/**
 * Created by fanqifeng on 16-12-2.
 */
'use strict';

class majorService {
    constructor($http) {
        this.$http = $http;
    }
}

majorService.$inject = ['$http'];

export function majorServiceFunc(ngModule) {
    ngModule.service('majorService', majorService);
}
