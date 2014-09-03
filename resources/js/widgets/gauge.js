define(["jquery", "highchart", "highchart_more"], function($) {
    function Gauge(config) {
        var _gauge_ = null,
                _read_xhr_ = null,
                _read_interval_ = null,
                _container_,
                _template_ = "<div class='angular-gauge' style='width: 300px; height:300px; display: inline-block;'></div>",
                _config_ = {
                    name: "Gauge",
                    refresh: 1000,
                    read_url: "",
                    datasource: "",
                    min_value: 0,
                    max_value: 100,
                    tick_interval: "",
                    unit_label: "unit",
                    safe_level: 0,
                    safe_color: "#55BF3B",
                    warning_level: 50,
                    warning_color: "#DDDF0D",
                    critical_level: 80,
                    critical_color: "#DF5353"
                };

        $.extend(_config_, config);

        this.widget = function() {
            return _template_;
        };

        this.form = function() {
            return "<table style='width: 500px;'>"
                    + "<tr>"
                    + "<td colspan='2'><input name='name' type='text' placeholder='name' title='type: String, default: " + _config_.name + "'></td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td><input name='read_url' type='text' placeholder='read-url'></td>"
                    + "<td><input class='datasource read_url' name='datasource' type='text' placeholder='datasource'></td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td colspan='2'>"
                    + "<table style='width: 500px;'>"
                    + "<tr>"
                    + "<td><input name='min_value' type='text' placeholder='min-value' title='type: integer, default: " + _config_.min_value + "'></td>"
                    + "<td><input name='max_value' type='text' placeholder='max-value' title='type: integer, default: " + _config_.max_value + "'></td>"
                    + "<td><input name='tick_interval' type='text' placeholder='tick-interval' title='type: integer, default: " + _config_.tick_interval + "'></td>"
                    + "</tr>"
                    + "</table>"
                    + "</td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td><input name='unit_label' type='text' placeholder='unit-label' title='type: String, default: " + _config_.unit_label + "'></td>"
                    + "<td><input name='refresh' type='text' placeholder='refresh' title='type: integer, default: " + _config_.refresh + "'></td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td><input name='warning_level' type='text' placeholder='warning-level' title='type: integer, default: " + _config_.warning_level + "'></td>"
                    + "<td><input name='critical_level' type='text' placeholder='critical-level' title='type: integer, default: " + _config_.critical_level + "'></td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td colspan='2'>"
                    + "<table style='width: 500px; border-collapse: collapse;'>"
                    + "<tr>"
                    + "<td style='padding: 10px 0px 10px 20px;'><label style='display: inline-block; margin-right: 5px; font-weight: bold;'>Safe: </label><input name='safe_color' type='color' title='type: color(hex), default: " + _config_.safe_color + "' value='" + _config_.safe_color + "'></td>"
                    + "<td style='padding: 10px 0px 10px 20px;'><label style='display: inline-block; margin-right: 5px; font-weight: bold;'>Warning: </label><input name='warning_color' type='color' title='type: color(hex), default: " + _config_.warning_color + "' value='" + _config_.warning_color + "'></td>"
                    + "<td style='padding: 10px 0px 10px 20px;'><label style='display: inline-block; margin-right: 5px; font-weight: bold;'>Critical: </label><input name='critical_color' type='color' title='type: color(hex), default: " + _config_.critical_color + "' value='" + _config_.critical_color + "'></td>"
                    + "</tr>"
                    + "</table>"
                    + "</td>"
                    + "</tr>"
                    + "</table>";
        };

        this.render = function(widget) {
            _container_ = $(widget).find("div[class='angular-gauge']");

            _config_.min_value = parseFloat(_config_.min_value);
            _config_.max_value = parseFloat(_config_.max_value);
            _config_.warning_level = parseFloat(_config_.warning_level);
            _config_.critical_level = parseFloat(_config_.critical_level);

            var config = {
                credits: {
                    enabled: false
                },
                chart: {
                    type: 'gauge',
                    plotBackgroundColor: null,
                    plotBackgroundImage: null,
                    plotBorderWidth: 0,
                    plotShadow: false
                },
                title: {
                    text: _config_.name
                },
                pane: {
                    startAngle: -150,
                    endAngle: 150,
                    background: [{
                            backgroundColor: {
                                linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                                stops: [
                                    [0, '#FFF'],
                                    [1, '#333']
                                ]
                            },
                            borderWidth: 0,
                            outerRadius: '109%'
                        }, {
                            backgroundColor: {
                                linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                                stops: [
                                    [0, '#333'],
                                    [1, '#FFF']
                                ]
                            },
                            borderWidth: 1,
                            outerRadius: '107%'
                        }, {
                            // default background
                        }, {
                            backgroundColor: '#DDD',
                            borderWidth: 0,
                            outerRadius: '105%',
                            innerRadius: '103%'
                        }]
                },
                tooltip: {
                    formatter: function() {
                        return Highcharts.numberFormat(this.y, 2) + " " + _config_.unit_label;
                    }
                },
                yAxis: {
                    min: _config_.min_value,
                    max: _config_.max_value,
                    minorTickInterval: 'auto',
                    minorTickWidth: 1,
                    minorTickLength: 10,
                    minorTickPosition: 'inside',
                    minorTickColor: '#666',
                    tickInterval: (_config_.tick_interval === "" ? _config_.max_value * 0.10 : parseFloat(_config_.tick_interval)),
                    tickWidth: 2,
                    tickPosition: 'inside',
                    tickLength: 15,
                    tickColor: '#666',
                    labels: {
                        step: 2,
                        rotation: 'auto'
                    },
                    title: {
                        text: _config_.unit_label
                    },
                    plotBands: [{
                            from: _config_.min_value,
                            to: _config_.warning_level,
                            color: _config_.safe_color
                        }, {
                            from: _config_.warning_level,
                            to: _config_.critical_level,
                            color: _config_.warning_color
                        }, {
                            from: _config_.critical_level,
                            to: _config_.max_value,
                            color: _config_.critical_color
                        }]
                },
                series: [{data: [0]}]
            };

            _gauge_ = $(_container_).highcharts(config).highcharts();
        };

        this.read = function() {
            var response = null;

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

                            _gauge_.series[0].points[0].update(parseFloat(response));
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

            if (typeof _gauge_.series[0] !== "undefined") {
                _gauge_.series[0].remove();
            }
        };

        this.destroy = function() {
            this.stop();

            if (_gauge_ !== null) {
                _gauge_.destroy();
            }

            return this;
        };
    }

    return Gauge;
});