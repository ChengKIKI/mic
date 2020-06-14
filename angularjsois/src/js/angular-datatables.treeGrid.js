/*!
 * angular-datatables - v0.6.4
 * https://github.com/l-lin/angular-datatables
 * License: MIT
 */
if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = 'datatables.treegrid';
}
(function(window, document, $, angular) {

    'use strict';

    // See https://datatables.net/extensions/fixedheader/
    angular.module('datatables.treegrid', ['datatables'])
        .config(dtTreeGridConfig)
        .run(initTreeGridPlugin);

    /* @ngInject */
    function dtTreeGridConfig($provide) {
        $provide.decorator('DTOptionsBuilder', dtOptionsBuilderDecorator);

        function dtOptionsBuilderDecorator($delegate) {
            var newOptions = $delegate.newOptions;
            var fromSource = $delegate.fromSource;
            var fromFnPromise = $delegate.fromFnPromise;

            $delegate.newOptions = function() {
                return _decorateOptions(newOptions);
            };
            $delegate.fromSource = function(ajax) {
                return _decorateOptions(fromSource, ajax);
            };
            $delegate.fromFnPromise = function(fnPromise) {
                return _decorateOptions(fromFnPromise, fnPromise);
            };

            return $delegate;

            function _decorateOptions(fn, params) {
                var options = fn(params);
                options.withTreeGrid = withTreeGrid;
                return options;

                /**
                 * Add fixed header support
                 * @param fixedHeaderOptions the plugin options
                 * @returns {DTOptions} the options
                 */
                function withTreeGrid(treeGridOptions) {
                    options.hasTreeGrid = true;
                    if (treeGridOptions) {
                        options.treeGridOptions = treeGridOptions;
                    }
                    return options;
                }
            }
        }
        dtOptionsBuilderDecorator.$inject = ['$delegate'];
    }
    dtTreeGridConfig.$inject = ['$provide'];

    /* @ngInject */
    function initTreeGridPlugin(DTRendererService) {
        var treeGridPlugin = {
            postRender: postRender
        };
        DTRendererService.registerPlugin(treeGridPlugin);

        function postRender(options, result) {
            if (options && options.hasTreeGrid) {
                new $.fn.dataTable.TreeGrid(result.DataTable, options.treeGridOptions);
            }
        }
    }
    initTreeGridPlugin.$inject = ['DTRendererService'];


})(window, document, jQuery, angular);
