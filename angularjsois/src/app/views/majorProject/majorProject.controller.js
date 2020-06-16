'use strict';

class majorProjectCtrl {
    constructor($state, $compile, $scope, majorService, DTOptionsBuilder, DTColumnBuilder) {
        var vm = this;
        vm.majorService = majorService;
        vm.$state = $state;

        vm.isDisplay = isDisplay;//tab页切换

        /*tab页切换*/
        function isDisplay(num) {
            vm.detailShow = num;
            if (num === 1) {
                // queryExtraWork();
            } else if (num === 2) {
                // queryExtraWork();//审批记录
            }
        }

        vm.seachData = {};//保存查询条件
        vm.majorProjectTable = [];
        vm.dtInstance = {};

        //初始化列表绑定model
        vm.dtOptions = null;
        vm.dtColumns = [];

        $state.current.onExit = function () {
            vm.dtInstance.DataTable.fixedHeader.disable();
        }
        vm.showBus = false;


        vm.showBusiness = showBusiness;//切换查询条件显示/隐藏
        vm.seachDataChange = seachDataChange;//查询条件校验
        vm.queryMajorProject = queryMajorProject;//加载重点项目表格条件查询
        vm.resetQuery = resetQuery;//重点项目表格重置
        // vm.queryDictionariesGrid = queryDictionariesGrid;//数据字典查询
        // vm.queryDictionariesGrid();
        vm.queryMajorProjectTable = queryMajorProjectTable;//加载重点项目表格信息
        vm.queryMajorProjectTable();
        vm.selectRelevanceProject = selectRelevanceProject;//查询关联项目
        vm.addMajorProject = addMajorProject;//添加/编辑重点项目
        vm.deleteMajorProject = deleteMajorProject;//删除重点项目
        vm.queryMajorProjectDetail = queryMajorProjectDetail;//查询重点项目
        vm.queryRiskManageTable = queryRiskManageTable;//风险管理页面
        vm.queryCoorManageTable = queryCoorManageTable;//待协调项页面
        vm.queryBriefManageTable = queryBriefManageTable;//简报页面

        function showBusiness() {
            $("#startTime").val(" ");
            $("#endTime").val(" ");
            vm.showBus = !vm.showBus;
        }

        //查询条件校验
        function seachDataChange() {

        }

        //加载重点项目表格信息
        function queryMajorProjectTable() {
            vm.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('ajax', {
                    url: '../../../jsonData/majorData.json',
                    // beforeSend: function (xhr) {
                    //     xhr.setRequestHeader("Authorization", "Bearer " + getAccessToken());
                    // },
                    type: 'GET',
                    // data: function (d) {
                    //     vm.pageIndex = d.start / d.length + 1;
                    //     vm.pageSize = d.length;
                    //     d = pageParse(d);
                    //     return d;
                    // },
                    dataSrc: function (json) {
                        // if (json.successful) {
                            vm.majorProjectTable = json.data;
                            return vm.majorProjectTable;
                        // } else {
                        //     tableError(json);
                        // }
                    }
                })
                .withOption('processing', true)
                .withOption('serverSide', true)
                .withDisplayLength(10)
                .withOption('lengthMenu', [[10, 15, 25, 100], [10, 15, 25, 100]])
                .withOption('ordering', false)
                .withDOM('Trt<"bottom"lip>')
                .withOption('createdRow', function (row, data, dataIndex) {
                    $compile(angular.element(row).contents())($scope);
                })
                .withOption('headerCallback', function (header) {
                    $compile(angular.element(header).contents())($scope);
                });

            vm.dtColumns = [
                DTColumnBuilder.newColumn('index', '序号').withClass('center-align'),
                DTColumnBuilder.newColumn('projectCode').withTitle('项目编号').withClass('center-align').withOption('width', '8%'),
                DTColumnBuilder.newColumn('majorProjectName').withTitle('项目名称'),
                DTColumnBuilder.newColumn('projectType').withTitle('项目类型').withOption('width', '8%').withClass('center-align'),
                DTColumnBuilder.newColumn('manageLevel').withTitle('管理级别').withOption('width', '8%').withClass('center-align'),
                DTColumnBuilder.newColumn('projectRelevanceUnit').withTitle('牵头单位').withOption('width', '16%').withClass('center-align'),
                DTColumnBuilder.newColumn('manageDepartment').withTitle('管理部门').withOption('width', '8%').withClass('center-align'),
                DTColumnBuilder.newColumn('buildType').withTitle('建设形式').withOption('width', '8%').withClass('center-align'),
                DTColumnBuilder.newColumn('createDate').withTitle('立项时间').withOption('width', '8%').withClass('center-align'),
                DTColumnBuilder.newColumn('costStart').withTitle('成本状态').withOption('width', '6%').withClass('center-align'),
                DTColumnBuilder.newColumn(null).withTitle('操作').withClass('center-align')
                    .renderWith(actionsHtml).withOption('width', '6%')
            ];

            vm.dtColumns.forEach(function (item) {
                item.show = true;
            })
            vm.hideColumn = function (item) {
                var _index = -1;
                vm.dtColumns.forEach(function (oa, index) {
                    if (oa.mData == item.mData) {
                        _index = index;
                    }
                })
                vm.hidColumn(vm.dtInstance.DataTable, _index)
            }
            vm.hidColumn = function (jTable, colNum) {
                var column = jTable.column(colNum);
                column.visible(!column.visible());
            }

            function actionsHtml(data, type, full, meta) {
                var actionHtml = "--";
                var btnGroup = "";
                var operation = {};
                operation = operationPower(data, type, full, meta);
                if (meta.row >= (meta.settings._iDisplayLength - 3)) {
                    btnGroup = '<div class="btn-group dropup" uib-dropdown>';
                } else {
                    btnGroup = '<div class="btn-group" uib-dropdown>';
                }
                var operationDivider = '<li class="divider"></li>';

                var html = "";
                html += operation.editOperation + operationDivider
                
                html += operation.delOperation + operationDivider
                
                html += operation.riskManage + operationDivider
                
                html += operation.contactManage + operationDivider
                
                html += operation.briefManage + operationDivider
                
                actionHtml = btnGroup +
                    '<button type="button" class="btn btn-w-m btn-link btn-xs" style="width: 100%;" uib-dropdown-toggle>' +
                    '请选择操作 <span class="caret"></span>' +
                    '</button> <ul role="menu" uib-dropdown-menu="">' +
                    html +
                    '</ul></div>';
                return actionHtml;
            }

            function operationPower(data, type, full, meta) {
                var editOperation = '<li user-access="PM_09_01_FUN_02"><a ng-click="ctrl.addMajorProject(ctrl.majorProjectTable[' + meta.row + '],2,null)">编辑</a></li>';
                var delOperation = '<li user-access="PM_09_01_FUN_03"><a ng-click="ctrl.deleteMajorProject(ctrl.majorProjectTable[' + meta.row + '])">删除</a></li>';
                var riskManage = '<li user-access="PM_09_01_FUN_04"><a ng-click="ctrl.queryRiskManageTable(ctrl.majorProjectTable[' + meta.row + '])">风险管理</a></li>';
                var contactManage = '<li user-access="PM_09_01_FUN_05"><a ng-click="ctrl.queryCoorManageTable(ctrl.majorProjectTable[' + meta.row + '])">待协调项</a></li>';
                var briefManage = '<li user-access="PM_09_01_FUN_06"><a ng-click="ctrl.queryBriefManageTable(ctrl.majorProjectTable[' + meta.row + '])">简报</a></li>';

                var actionHtml = {
                    "editOperation": "",
                    "delOperation": "",
                    "riskManage": "",
                    "contactManage": "",
                    "briefManage": ""
                };

                return actionHtml;
            }


        }

        //加载重点项目表格条件查询
        function queryMajorProject(bool) {
                vm.seachData.startTime = moment(vm.seachData.startTime).format('YYYY-MM-DD')
            
                vm.seachData.endTime = moment(vm.seachData.endTime).format('YYYY-MM-DD')
            
            var bo = bool || false
            vm.dtInstance.reloadData(function (re) {
            }, bo);
        }

        //重点项目表格重置
        function resetQuery() {
            vm.seachData = {};
            vm.queryMajorProject();
        }

        //查询关联项目
        function selectRelevanceProject() {
            var options = {
                ariaLabelledBy: 'modal-relevanceSubproject-title',
                ariaDescribedBy: 'modal-relevanceSubproject-body',
                templateUrl: 'ois/pm/views/majorProject/majorProjectTable/editMajorProject/selectSubproject.html',
                controller: 'selectSubprojectCtrl',
                controllerAs: 'ctrl',
                size: 'xl',
                windowClass: 'modal-top-spr',
                backdrop: false,
                resolve: {
                    subProjectData: function () {
                        return null;
                    }
                }
            };
            var modalInstance = $uibModal.open(options);
            modalInstance.result.then(function (data) {
                vm.addMajorProject(null,1,data);
            }, function () {
            });
        }

        function addMajorProject(majorProjectData,infoType,subProject) {
            var options = {
                ariaLabelledBy: 'modal-majorProject-title',
                ariaDescribedBy: 'modal-majorProject-body',
                templateUrl: 'ois/pm/views/majorProject/majorProjectTable/editMajorProject/editMajorProject.html',
                controller: 'editMajorProjectCtrl',
                controllerAs: 'ctrl',
                size: 'max modal-drop-wrap modal-max-wrap',
                backdrop: false,
                resolve: {
                    majorProjectData: function () {
                        return majorProjectData;
                    },
                    infoType: function () {
                        return infoType;
                    },
                    subProject: function () {
                        return subProject;
                    }
                }
            };
            var modalInstance = $uibModal.open(options);
            modalInstance.result.then(function (data) {
                vm.queryMajorProject();
            }, function () {
            });
        }

        //删除重点项目
        function deleteMajorProject(majorProjectData) {
            SweetAlert.swal({
                    title: "确认要删除吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnConfirm: true,
                    showLoaderOnConfirm: true
                },
                function (isConfirm) {
                    if (isConfirm) {
                        var urlPath = Constant.pmURL + "/majorProject/deleteMajorProject";
                        var jsonData = {"id": majorProjectData.id};
                        $http.post(urlPath, jsonData).success(function (data) {
                            if (data.successful) {
                                successToaster(toaster, data.resultHint);
                                sendMsg(majorProjectData);
                                vm.queryMajorProject();
                            } else {
                                errorToaster(toaster, data.resultHint);
                            }
                        })
                    }
                })
        }

        function sendMsg(majorProjectData) {
            var urlPath = Constant.pmURL + "/majorProject/sendMsg";
            var jsonData = {"type": "删除重点项目", "projectName": majorProjectData.majorProjectName};
            $http.post(urlPath, jsonData).success(function (res) {
            });
        }

        //查询重点项目
        function queryMajorProjectDetail(projectId) {
            var options = {
                ariaLabelledBy: 'modal-majorProjectDetail-title',
                ariaDescribedBy: 'modal-majorProjectDetail-body',
                templateUrl: 'ois/pm/views/majorProject/majorProjectTable/queryMajorProject/queryMajorProject.html',
                controller: 'queryMajorProjectCtrl',
                controllerAs: 'ctrl',
                size: 'max modal-drop-wrap modal-max-wrap',
                backdrop: false,
                resolve: {
                    projectId: function () {
                        return projectId;
                    }
                }
            };
            var modalInstance = $uibModal.open(options);
            modalInstance.result.then(function (data) {
            }, function () {
            });
        }

        //风险管理页面
        function queryRiskManageTable(majorProjectData) {
            var options = {
                ariaLabelledBy: 'modal-risk-title',
                ariaDescribedBy: 'modal-risk-body',
                templateUrl: 'ois/pm/views/majorProject/majorProjectTable/majorProjectManage/riskManage.html',
                controller: 'queryRiskManageTableCtrl',
                controllerAs: 'ctrl',
                size: 'max modal-drop-wrap modal-max-wrap',
                backdrop: false,
                resolve: {
                    majorProjectData: function () {
                        return majorProjectData;
                    }
                }
            };
            var modalInstance = $uibModal.open(options);
            modalInstance.result.then(function (data) {
            }, function () {
            });
        }

        //待协调项页面
        function queryCoorManageTable(majorProjectData) {
            var options = {
                ariaLabelledBy: 'modal-risk-title',
                ariaDescribedBy: 'modal-risk-body',
                templateUrl: 'ois/pm/views/majorProject/majorProjectTable/majorProjectManage/coorManage.html',
                controller: 'queryCoordinateTableCtrl',
                controllerAs: 'ctrl',
                size: 'max modal-drop-wrap modal-max-wrap',
                backdrop: false,
                resolve: {
                    majorProjectData: function () {
                        return majorProjectData;
                    }
                }
            };
            var modalInstance = $uibModal.open(options);
            modalInstance.result.then(function (data) {
            }, function () {
            });
        }

        //简报页面
        function queryBriefManageTable(majorProjectData) {
            var options = {
                ariaLabelledBy: 'modal-brief-title',
                ariaDescribedBy: 'modal-brief-body',
                templateUrl: 'ois/pm/views/majorProject/majorProjectTable/majorProjectManage/briefManage.html',
                controller: 'projectBriefTableCtrl',
                controllerAs: 'ctrl',
                size: 'max modal-drop-wrap modal-max-wrap',
                backdrop: false,
                resolve: {
                    majorProjectData: function () {
                        return majorProjectData;
                    }
                }
            };
            var modalInstance = $uibModal.open(options);
            modalInstance.result.then(function (data) {
            }, function () {
            });
        }
    }
}

majorProjectCtrl.$inject = ['$state', '$compile', '$scope', 'majorService', 'DTOptionsBuilder', 'DTColumnBuilder'];

export function majorControllerFunc(ngModule) {
    ngModule.controller('majorProjectCtrl', majorProjectCtrl);
}


