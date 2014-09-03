requirejs.config({
    baseUrl: 'resources/js',
    paths: {
        application: "core/app",
        model: "core/model",
        page: "core/page",
        pane: "core/pane",
        widget: "core/widget",
        jquery: "lib/jquery/jquery-2.1.1.min",
        jqmobile: "lib/jquery/jquery.mobile-1.4.3",
        jgrowl: "lib/jquery/jquery.jgrowl.min",
        jqtooltipster: "lib/jquery/jquery.tooltipster.min",
        jqcolorpicker: "lib/jquery/colorpicker",
        underscore: "lib/underscore/underscore-min",
        highchart: "lib/highchart/highstock",
        highchart_more: "lib/highchart/highcharts-more",
        rtgraph: "widgets/rtgraph",
        switch : "widgets/switch",
        slider: "widgets/slider",
        gauge: "widgets/gauge"
    },
    shim: {
        "application": {
            deps: ["jquery"]
        },
        "jqmobile": {
            deps: ["jquery"]
        },
        "jgrowl": {
            deps: ["jquery"]
        },
        "jqtooltipster": {
            deps: ["jquery"]
        },
        "jqcolorpicker": {
            deps: ["jquery"]
        },
        "highchart": {
            export: "Highcharts",
            deps: ["jquery"]
        },
        "highchart_more": {
            deps: ["jquery", "highchart"]
        },
        "rtgraph": {
            deps: ["jquery", "highchart"]
        },
        "switch": {
            deps: ["jquery"]
        },
        "slider": {
            deps: ["jquery"]
        },
        "guage": {
            deps: ["jquery", "highchart", "highchart_more"]
        }
    }
});

requirejs(["application"], function() {
    Array.prototype.clean = function(deleteValue) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === deleteValue) {
                this.splice(i, 1);
                i--;
            }
        }
        return this;
    };
});