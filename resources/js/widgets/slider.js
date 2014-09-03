define(["jquery"], function($) {
    function Slider(config) {
        var _slider_ = null,
                _read_xhr_ = null,
                _read_interval_ = null,
                that = this,
                _template_ = "<div style='width: {width}px; display: inline-block; margin: 10px 0px 10px 0px;'>"
                + "<label style=''>{name}</label>"
                + "<input class='ui-shadow-inset ui-body-inherit ui-corner-all ui-slider-input' type='number' value='{init_value}' min='{min_value}' max='{max_value}' step='{step_inc}' data-highlight='true'/>"
                + "</div>",
                _config_ = {
                    name: "Slider",
                    refresh: 1000,
                    read_url: "",
                    datasource: "",
                    write_url: "",
                    var_name: "slider",
                    min_value: 0,
                    max_value: 100,
                    init_value: 0,
                    step_inc: 1,
                    width: 500
                };

        $.extend(_config_, config);

        this.widget = function() {
            return _template_.replace("{name}", _config_.name)
                    .replace("{init_value}", _config_.init_value)
                    .replace("{min_value}", _config_.min_value)
                    .replace("{max_value}", _config_.max_value)
                    .replace("{step_inc}", _config_.step_inc)
                    .replace("{width}", _config_.width);
        };

        this.form = function() {
            return "<table style='width: 600px;'>"
                    + "<tr>"
                    + "<td><input name='name' type='text' placeholder='name'></td>"
                    + "<td><input name='var_name' type='text' placeholder='variable-name [type: string, default: " + _config_.var_name + "]'></td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td colspan='2'><input name='read_url' type='text' placeholder='read-url'></td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td colspan='2'><input class='datasource read_url' name='datasource' type='text' placeholder='datasource'></td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td colspan='2'><input name='write_url' type='text' placeholder='write-url'></td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td><input name='refresh' type='text' placeholder='refresh-interval [type: milliseconds, default: " + _config_.refresh + "]'></td>"
                    + "<td><input name='width' type='text' placeholder='width [type: integer, default: " + _config_.width + "]'></td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td><input name='init_value' type='text' placeholder='init-value [type: integer, default: " + _config_.init_value + "]'></td>"
                    + "<td><input name='step_inc' type='text' placeholder='step-increment [type: integer, default: " + _config_.step_inc + "]'></td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td><input name='min_value' type='text' placeholder='min-value [type: integer, default: " + _config_.min_value + "]'></td>"
                    + "<td><input name='max_value' type='text' placeholder='max-value [type: integer, default: " + _config_.max_value + "]'></td>"
                    + "</tr>"
                    + "</table>";
        };

        this.render = function(widget) {
            _slider_ = $(widget).find("input[type='number']");
            _slider_.slider();
            _slider_.on("change", that.write);
        };

        this.write = function() {
            if (_config_.write_url !== "") {
                $.ajax({
                    type: "POST",
                    url: _config_.write_url,
                    data: _config_.var_name + "=" + _slider_.val(),
                    beforeSend: function() {
                        clearInterval(_read_interval_);
                        _read_xhr_.abort();
                    },
                    success: function(data) {
                        console.log(data);
                    },
                    complete: that.read
                });
            }
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

                            _slider_.off("change");
                            
                            _slider_.val(parseFloat(response));

                            _slider_.slider("refresh").on("change", that.write);
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
        };

        this.destroy = function() {
            this.stop();
            
            if(_slider_ !== null){
                _slider_.slider("destroy");
            }
            
            return this;
        };
    }

    return Slider;
});