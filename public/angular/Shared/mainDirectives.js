/* DIRECTIVES */
var mainDirectives = angular.module('Main-Directives', ['Main-ContentManager']); //
mainDirectives.directive("hudStyles", function (ConfigurableItems) {
    return {
        restrict: 'E',
        templateUrl: "public/angular/Shared/mainStyles.html",
        link: function (s, e, a) {
            s.Theme = ConfigurableItems;

        }
    }
});
mainDirectives.directive("mySetter", function () {
    return {
        restrict: 'A',
        scope: {
            heightInPercent: '=',
            widthInPercent: '=',
            minHeightInPercent: '=',
            minWidthInPercent: '=',
            fontInPercent: '=',
            margin: '=',
            padding: '=',
            marginRight: '=',
            widthInPx: '=',
            paddingTopPercentage: '=',
            paddingBottomPercentage: '='
        },
        replace: true,
        link: function (scope, element, attrs) {
            if (scope.heightInPercent !== undefined) {
                $(element[0]).css("height", scope.heightInPercent.toString() + "%");
            }
            if (scope.widthInPercent !== undefined) {
                $(element[0]).css("width", scope.widthInPercent.toString() + "%");
            }
            if (scope.minheightInPercent !== undefined) {
                $(element[0]).css("min-height", scope.minheightInPercent.toString() + "%");
            }
            if (scope.minwidthInPercent !== undefined) {
                $(element[0]).css("min-width", scope.minwidthInPercent.toString() + "%");
            }
            if (scope.fontInPercent !== undefined) {
                $(element[0]).css("font-size", scope.fontInPercent.toString() + "%");
            }
            if (scope.margin !== undefined) {
                $(element[0]).css("margin", scope.margin);
            }
            if (scope.padding !== undefined) {
                $(element[0]).css("padding", scope.padding);
            }
            if (scope.marginRight != undefined){
                $(element[0]).css("margin-right", scope.marginRight.toString() + "px");
            }
            if (scope.widthInPx != undefined){
                $(element[0]).css("width", scope.widthInPx.toString() + "px");
            }
            if (scope.paddingTopPercentage != undefined){
                $(element[0]).css("padding-top", scope.paddingTopPercentage.toString() + "%");
            }
            if (scope.paddingBottomPercentage != undefined){
                $(element[0]).css("padding-bottom",scope.paddingBottomPercentage.toString() + "%");
            }
        }
    }

});