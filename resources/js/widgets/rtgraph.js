define(["jquery", "highchart"], function($) {
    function RealtimeGraph(config) {
        var _graph_ = null,
                _read_xhr_ = null,
                _read_interval_ = null,
                _container_,
                _template_ = "<div class='rtgraph' style='min-width:{width}px; height:{height}px; display: inline-block;'></div>",
                _config_ = {
                    name: "Real-time Graph",
                    type: "spline",
                    refresh: 1000,
                    init_data: "",
                    read_url: "",
                    datasource: "",
                    width: 500,
                    height: 300,
                    y_axis_title: "y-axis title",
                    x_axis_title: "x-axis title",
                    x_axis_tick_interval: 5,
                    data_buffer: 10,
                    auto_shift: "off"
                };

        $.extend(_config_, config);

        this.type = function() {
            return {
                Line: "line",
                Spline: "spline",
                Area: "area",
                AreaSpline: "areaspline",
                Bar: "bar",
                Column: "column"
            };
        };

        this.widget = function() {
            return _template_.replace("{width}", _config_.width).replace("{height}", _config_.height);
        };

        this.form = function() {
            var option = "<option>Graph type...</option>";

            $.each(this.type(), function(key, value) {
                option += "<option value='" + value + "'>" + key + "</option>";
            });

            return "<table style='width: 650px;'>"
                    + "<tr>"
                    + "<td><input name='name' type='text' placeholder='name'></td>"
                    + "<td><select name='type' data-native-menu='false' value=''>" + option + "</td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td colspan='2'><input name='init_data' type='text' placeholder='initial-data-url'></td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td><input name='read_url' type='text' placeholder='read-url'></td>"
                    + "<td><input name='refresh' type='text' placeholder='refresh-interval [type: milliseconds, default: " + _config_.refresh + "]'></td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td colspan='2'>"
                    + "<table>"
                    + "<tr>"
                    + "<td style='width: 473px'><input class='datasource read_url' name='datasource' type='text' placeholder='datasource'></td>"
                    + "<td><label style='font-size: 11pt; font-weight: bold; display: inline-block; margin: 0px 10px 0px 10px;'>AutoShift</label><input name='auto_shift' type='checkbox' data-role='flipswitch' data-on-text='ON' data-off-text='OFF'></td>"
                    + "</tr>"
                    + "</table>"
                    + "</td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td><input name='height' type='text' placeholder='height [type: integer, default: " + _config_.height + "]'></td>"
                    + "<td><input name='width' type='text' placeholder='width [type: integer, default: " + _config_.width + "]'></td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td><input name='y_axis_title' type='text' placeholder='y-axis [type: string, default: " + _config_.y_axis_title + "]'></td>"
                    + "<td><input name='x_axis_title' type='text' placeholder='x-axis [type: string, default: " + _config_.x_axis_title + "]'></td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td><input name='x_axis_tick_interval' type='text' placeholder='tick-interval [type: seconds, default: " + _config_.x_axis_tick_interval + "]'></td>"
                    + "<td><input name='data_buffer' type='text' placeholder='data-buffer [type: integer, default: " + _config_.data_buffer + "]'></td>"
                    + "</tr>"
                    + "</table>";
        };

        this.render = function(widget) {
            _container_ = $(widget).find("div[class='rtgraph']");
            var config = {
                credits: {
                    enabled: false
                },
                chart: {
                    type: _config_.type,
                    animation: Highcharts.svg,
                    marginRight: 10,
                    zoomType: 'x'
                },
                title: {
                    text: _config_.name
                },
                xAxis: {
                    type: 'datetime',
                    tickInterval: 1000 * parseFloat(_config_.x_axis_tick_interval),
                    title: {
                        text: _config_.x_axis_title
                    }
                },
                yAxis: {
                    title: {
                        text: _config_.y_axis_title
                    },
                    opposite: false
                },
                tooltip: {
                    formatter: function() {
                        return '<b>' + _config_.x_axis_title + '</b>'
                                + '<br/>'
                                + Highcharts.dateFormat('%H:%M:%S', this.x)
                                + '<br/>'
                                + '<b>' + _config_.y_axis_title + '</b>'
                                + '<br/>'
                                + Highcharts.numberFormat(this.y, 2);
                    }
                },
                legend: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                navigator: {
                    enabled: true
                },
                rangeSelector: {
                    enabled: true,
                    inputEnabled: true,
                    selected: 0
                },
                plotOptions: {
                    series: {
                        pointStart: new Date().getTime(),
                        marker: {
                            enabled: true
                        }
                    }
                },
                series: []
            };

            if (_config_.auto_shift === "on") {
                config.navigator.enabled = false;
                config.rangeSelector.enabled = false;
            } else {
                delete config.xAxis.title;
                delete config.yAxis.title;
                config.xAxis.tickInterval = null;
            }

            if (_config_.init_data !== "") {
                $.getJSON(_config_.init_data, function(data) {
                    config.series.push({data: data});
                });
            }

            Highcharts.setOptions({
                global: {
                    useUTC: false
                }
            });

            _graph_ = $(_container_).highcharts("StockChart", config).highcharts();
        };

        this.read = function() {
            var response = null, shift = false;

            if (_config_.read_url !== "") {
                _read_interval_ = setInterval(function() {
                    _read_xhr_ = $.ajax({
                        url: _config_.read_url,
                        dataType: "JSON",
                        success: function(data) {
                            response = data;
                        },
                        complete: function() {
                            var nodes = _config_.datasource.split(".").clean("");

                            for (var i = 0; i < nodes.length; i++) {
                                response = response[nodes[i]];
                            }

                            if (_graph_.series.length === 0) {
                                _graph_.addSeries({data: []}, true);
                            }

                            if ((_config_.auto_shift === "on") && (_graph_.series[0].data.length > _config_.data_buffer - 1)) {
                                shift = true;
                            }

                            _graph_.series[0].addPoint([new Date().getTime(), parseFloat(response)], true, shift);
                        }
                    });
                }, parseFloat(_config_.refresh));
            }
        };

        this.stop = function() {
            if (_read_interval_ !== null) {
                clearInterval(_read_interval_);
            }

            if (_read_xhr_ !== null) {
                _read_xhr_.abort();
            }

            if (typeof _graph_.series[0] !== "undefined") {
                _graph_.series[0].remove();
            }
        };

        this.destroy = function() {
            this.stop();

            if (_graph_ !== null) {
                _graph_.destroy();
            }

            return this;
        };
    }

    return RealtimeGraph;
});