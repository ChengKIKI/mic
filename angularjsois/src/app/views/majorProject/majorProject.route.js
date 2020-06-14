'use strict';


import angular from "angular";

appRun.$inject = ['routerHelper'];

/* @ngInject */
export function appRun(routerHelper) {
    routerHelper.configureStates(majorProjectStates());
}

function majorProjectStates($stateProvider) {
    return [
        {
            state: 'majorProject',
            //重点项目
            config: {
                url: "/majorProject",
                //templateUrl: "./pmApp/views/majorProject/majorProject.html",
                controller: 'majorProjectCtrl',
                controllerAs: 'ctrl',
                title: '重点项目',
                /*template: require('./choose.html'),*/
                templateProvider: ['$q', ($q)=> {
                    let defer = $q.defer();
                    require.ensure(['./majorProject.html'], ()=> {
                        let template = require('./majorProject.html');
                        defer.resolve(template);
                    });
                    return defer.promise;
                }],
                resolve: {
                    deps: ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                        let defer = $q.defer();
                        require.ensure([], () => {
                            let module = require('./majorProject.module').majorProjectModule(angular);
                            console.log(module)
                            $ocLazyLoad.load({
                                name: 'majorProject'
                            });
                            defer.resolve(module);
                        });
                        return defer.promise;
                    }],
                }
            }
        }
    ]
        
}

export function majorProjectRun(ngModule) {
    ngModule.run(appRun);
}
