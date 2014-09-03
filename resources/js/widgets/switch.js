define(["jquery"], function($) {
    function Switch(config) {
        var _switch_ = null,
                _read_xhr_ = null,
                _read_interval_ = null,
                that = this,
                _template_ = "<label style='display: inline-block; margin-right: 10px;' for='flip-checkbox-1'>{name}</label>"
                + "<input style='display: inline-block;' type='checkbox' data-role='flipswitch' data-on-text='{on_text}' data-off-text='{off_text}' >",
                _config_ = {
                    name: "Switch",
                    refresh: 1000,
                    read_url: "",
                    datasource: "",
                    write_url: "",
                    var_name: "switch",
                    off_text: "OFF",
                    on_text: "ON"
                };

        $.extend(_config_, config);

        this.widget = function() {
            return _template_.replace("{name}", _config_.name).replace("{on_text}", _config_.on_text).replace("{off_text}", _config_.off_text);
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
                    + "<td colspan='2'><input name='refresh' type='text' placeholder='refresh-interval [type: milliseconds, default: " + _config_.refresh + "]'></td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td><input name='on_text' type='text' placeholder='on-text [type: string, default: " + _config_.on_text + "]'></td>"
                    + "<td><input name='off_text' type='text' placeholder='off-text [type: string, default: " + _config_.off_text + "]'></td>"
                    + "</tr>"
                    + "</table>";
        };
        
        this.state = function() {
            return {
                "ON": 1,
                "OFF": 0
            };
        };

        this.render = function(widget) {
            _switch_ = $(widget).find("input[data-role='flipswitch']");
            _switch_.flipswitch();
            _switch_.on("change", that.write);
        };

        this.write = function() {
            if (_config_.write_url !== "") {
                $.ajax({
                    type: "POST",
                    url: _config_.write_url,
                    data: _config_.var_name + "=" + (_switch_.prop("checked") ? 1 : 0),
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
                            
                            for(var i = 0; i < nodes.length; i++){
                                response = response[nodes[i]];
                            }

                            _switch_.off("change");

                            if (parseInt(response) === 1) {
                                _switch_.prop("checked", true);
                            } else {
                                _switch_.prop("checked", false);
                            }

                            _switch_.flipswitch("refresh").on("change", that.write);
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
            
            return this;
        };
    }

    return Switch;
});