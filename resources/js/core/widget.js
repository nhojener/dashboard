define(["jquery", "rtgraph", "switch", "slider", "gauge"], function($, RealtimeGraph, Switch, Slider, Gauge) {
    function Widget() {
        var _id_, _type_, _widget_, _start_ = false, _template_ = "<li id='{widget_id}' style='padding: 0px 5px 0px 5px'>{widget}<a style='margin-left: 10px; float:right;' class='ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all ui-mini'></a></li>";

        this.type = function() {
            return {
                Switch: "switch",
                Slider: "slider",
                RealtimeGraph: "rtgraph",
                Gauge: "gauge"
            };
        };

        this.get = function(widget) {
            this.init(null, widget, {});

            return _widget_;
        };

        this.init = function(id, type, config) {
            _id_ = id;
            _type_ = type;

            if (_type_ === "switch") {
                _widget_ = new Switch(config);
            } else if (_type_ === "rtgraph") {
                _widget_ = new RealtimeGraph(config);
            } else if (_type_ === "slider") {
                _widget_ = new Slider(config);
            } else if (_type_ === "gauge") {
                _widget_ = new Gauge(config);
            }
        };

        this.create = function(page, pane) {
            $("body").find("#" + page + "[data-role='page'] .pane[id='" + pane + "']")
                    .append(_template_.replace("{widget_id}", _id_).replace("{widget}", _widget_.widget())).listview("refresh");

            _widget_.render($("body").find("#" + page + "[data-role='page'] .pane[id='" + pane + "'] > li[id='" + _id_ + "']"));
        };

        this.run = function() {
            if (!_start_) {
                _widget_.read();
                console.log("Widget [" + _id_ + "] has been started.");
            }
            _start_ = true;
        };

        this.stop = function() {
            if (_start_) {
                _widget_.stop();
                console.log("Widget [" + _id_ + "] has been stopped.");
            }
            _start_ = false;
        };

        this.delete = function(page, pane, id) {
            delete _widget_.destroy();
            $("body").find("#" + page + "[data-role='page'] #" + pane + "[data-role='listview'] #" + id).remove();
        };
    }

    return Widget;
});