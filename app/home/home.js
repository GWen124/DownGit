/***********************************************************
* Developer: Minhas Kamal (minhaskamal024@gmail.com)       *
* Website: https://github.com/MinhasKamal/DownGit          *
* License: MIT License                                     *
***********************************************************/

var homeModule = angular.module('homeModule', [
    'ngRoute',
    'downGitModule',
]);

homeModule.config([
    '$routeProvider',

    function ($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'app/home/home.html',
                controller: [
                '$scope',
                '$routeParams',
                '$location',
                'toastr',
                'downGitService',

                function($scope, $routeParams, $location, toastr, downGitService) {
                    $scope.downUrl = "";
                    $scope.url = "";
                    $scope.isProcessing = {val: false};
                    $scope.downloadedFiles = {val: 0};
                    $scope.totalFiles = {val: 0};

                    var templateUrl = "https?://github.com/.+/.+";
                    var downloadUrlInfix = "#/home?url=";
                    // 使用当前页面的 URL，这样部署到任何地方都可以工作
                    var downloadUrlPrefix = window.location.origin + window.location.pathname + downloadUrlInfix;

                    if ($routeParams.url) {
                        $scope.url = $routeParams.url;
                    }

                    if ($scope.url.match(templateUrl)) {
                        var parameter = {
                            url: $routeParams.url,
                            fileName: $routeParams.fileName,
                            rootDirectory: $routeParams.rootDirectory
                        };
                        var progress = {
                            isProcessing: $scope.isProcessing,
                            downloadedFiles: $scope.downloadedFiles,
                            totalFiles: $scope.totalFiles
                        };
                        downGitService.downloadZippedFiles(parameter, progress, toastr);

                    } else if ($scope.url != "") {
                        toastr.warning("Invalid URL!", {iconClass: 'toast-down'});
                    }

                    $scope.catchEnter = function(keyEvent) {
                        if (keyEvent.which == 13) {
                            $scope.download();
                        }
                    };

                    $scope.createDownLink = function() {
                        $scope.downUrl="";

                        if (!$scope.url) {
                            return;
                        }
                        
                        var targetUrl = $scope.url;
                        
                        // 检查是否输入的是 DownGit 完整链接
                        if ($scope.url.indexOf('#/home?url=') !== -1) {
                            // 如果已经是 DownGit 链接，直接显示
                            $scope.downUrl = $scope.url;
                            return;
                        }

                        if (targetUrl.match(templateUrl)) {
                            $scope.downUrl = downloadUrlPrefix + targetUrl;
                        } else {
                            toastr.warning("Invalid URL!", {iconClass: 'toast-down'});
                        }
                    };

                    $scope.download = function() {
                        if (!$scope.url) {
                            toastr.warning("请输入 GitHub URL!", {iconClass: 'toast-down'});
                            return;
                        }
                        
                        var targetUrl = $scope.url;
                        
                        // 检查是否输入的是 DownGit 完整链接
                        if ($scope.url.indexOf('#/home?url=') !== -1) {
                            // 提取其中的 GitHub URL
                            try {
                                var urlObj = new URL($scope.url);
                                var hash = urlObj.hash; // #/home?url=xxx
                                var params = new URLSearchParams(hash.split('?')[1]);
                                targetUrl = decodeURIComponent(params.get('url'));
                                console.log("从 DownGit 链接提取 GitHub URL:", targetUrl);
                            } catch (e) {
                                console.error("解析 URL 失败:", e);
                            }
                        }
                        
                        // 检查是否为有效的 GitHub URL
                        if (targetUrl.match(templateUrl)) {
                            window.location = downloadUrlInfix + targetUrl;
                        } else {
                            toastr.warning("Invalid URL!", {iconClass: 'toast-down'});
                        }
                    };

                }],
            });
    }
]);
