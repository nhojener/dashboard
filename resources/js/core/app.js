define(["jquery", "model", "widget", "jqmobile", "jgrowl", "jqtooltipster", "jqcolorpicker"], function($, Model, Widget) {
    var model = new Model(), widget_type = "<option>Choose widget...</option>";

    //Initialize components
    $("div[data-role='header'], div[data-role='footer']").toolbar();
    $("#leftpanel").panel();
    $("#menulist").listview();
    $("div[data-role='popup']").popup();
    $("form input[type='text']").textinput();

    $(document)
            //stop widget processes when page is hidden and start when page is show
            .on("pageshow", function(event, data) {
                $(".header .title .page").html(" > " + $.mobile.activePage.attr("title"));

                model.page().render(false, data.prevPage.attr("id"));
                model.page().render(true, $.mobile.activePage.attr("id"));
            })
            .delegate("#menulist .ui-icon-delete", "click", function() {
                model.page().del($(this).attr("title"));
            })
            .delegate("div[data-role='page'] .pane .ui-icon-delete", "click", function() {
                if ($(this).parents("li").data("role") === "list-divider") {
                    model.pane().del($.mobile.activePage.attr('id'), $(this).parents("ul").attr("id"));
                } else {
                    model.widget().del($.mobile.activePage.attr('id'), $(this).parents("ul").attr("id"), $(this).parents("li").attr("id"));
                }
            })
            .delegate("ul[data-role='listview'] a[data-rel='popup']", "click", function() {
                $("#widget[data-role='popup']").data("pane", $(this).parents("ul").attr("id"));
            });

    $(document.body)
            .show(2500, "swing", function() {
                $(this).find("div.header a").data("disabled", false).removeClass("ui-disabled");
            })
            .find("div.header a")
            .click(function(e) {
                if ($(this).data("disabled")) {
                    e.preventDefault();
                }
            });

    //Load widgets
    $.each((new Widget()).type(), function(key, value) {
        widget_type += "<option value='" + value + "'>" + key + "</option>";
    });

    $("form select[name='widget']")
            .html(widget_type)
            .change(function() {
                var json_data = null;

                $("#widget #widget-custom-form")
                        .html(new Widget().get($(this).val()).form())
                        .find("input[type='text']").textinput();

                $("#widget #widget-custom-form").find("select").selectmenu();

                $("#widget #widget-custom-form").find("input[data-role='flipswitch']").flipswitch();

                $("#widget #widget-custom-form").find("input[class~='datasource']").tooltipster({
                    content: "<ul>#content#</ul>",
                    contentAsHTML: true,
                    interactive: true,
                    trigger: "click",
                    onlyOne: true,
                    theme: "tooltipster-punk",
                    functionBefore: function(origin, continueTooltip) {
                        var inp_nodes, data = null, nodes_li = "",
                                inp_url = origin.prop("class").split(" ")[1],
                                _url_ = origin.parents("#widget #widget-custom-form").find("input[name='" + inp_url + "']").val();

                        if (json_data === null && _url_ !== "") {
                            $.ajax({
                                async: false,
                                type: "GET",
                                url: _url_,
                                dataType: "JSON",
                                success: function(response) {
                                    json_data = response;
                                }
                            });
                        }

                        data = json_data;

                        if (data !== null && origin.val() !== "") {
                            inp_nodes = origin.val().split(".").clean("");

                            for (var i = 0; i < inp_nodes.length; i++) {
                                data = data[inp_nodes[i]];
                            }
                        }

                        if (data !== null & typeof data === "object") {
                            $.each(data, function(key, value) {
                                nodes_li += "<li><a>" + key + (typeof value === "object" ? "." : "") + "</a></li>";
                            });

                            origin.tooltipster("content", origin.tooltipster("content").replace("#content#", nodes_li));

                            continueTooltip();
                        }
                    },
                    functionReady: function(origin, tooltip) {
                        tooltip.find("ul").prop("style", "list-style: none; margin: 0px; padding: 0px;")
                                .find("li").prop("style", "margin: 5px;")
                                .find("a").prop("style", "text-decoration: none; cursor: pointer;")
                                .click(function() {
                                    origin.val(origin.val() + $(this).html()).tooltipster("hide");
                                });
                    },
                    functionAfter: function(origin) {
                        origin.tooltipster("content", "<ul>#content#</ul>");
                    }
                });

                $(this).parents("#widget[data-role='popup']").popup("reposition", {positionTo: "window"});
            })
            .selectmenu();

    $("#page[data-role='popup'] #save")
            .click(function() {
                if (model.page().exist($("#page #page_id").val())) {
                    model.page().edit($("#page #page_id").val(), $("#page #page_title").val());

                    if ($.mobile.activePage.attr('id') === $("#page #page_id").val()) {
                        $(".header .title span").html(" > " + $.mobile.activePage.attr("title"));
                    }
                } else {
                    model.page().add($("#page #page_id").val(), $("#page #page_title").val());
                }

                $(this).parents("div[data-role='popup']").popup("close");
            });

    $("#pane[data-role='popup'] #save")
            .click(function() {
                var page = $.mobile.activePage.attr('id');

                if (page !== "default") {
                    if (model.pane().exist(page, $("#pane #pane_id").val())) {
                        model.pane().edit(page, $("#pane #pane_id").val(), $("#pane #pane_title").val());
                    } else {
                        model.pane().add(page, $("#pane #pane_id").val(), $("#pane #pane_title").val());
                    }
                }

                $(this).parents("div[data-role='popup']").popup("close");
            });

    $("#widget[data-role='popup'] #save")
            .click(function() {
                var widget = null, config = new Object(),
                        form_data = $(this).parents("#widget[data-role='popup']").find("form").serializeArray();

                $.each(form_data, function(index, item) {
                    if (item.name === "widget") {
                        widget = item.value;
                    } else if (item.value !== "") {
                        config[item.name] = item.value;
                    }
                });

                model.widget().add(
                        widget,
                        $.mobile.activePage.attr('id'),
                        $(this).parents("#widget[data-role='popup']").data("pane"),
                        config
                        );

                $(this).parents("div[data-role='popup']").popup("close");
            })
            .parents("#widget[data-role='popup']")
            .on("popupafteropen", function() {
                $(this).find("form select").selectmenu();
            })
            .on("popupafterclose", function() {
                $(this).find("form")[0].reset();
                $(this).find("#widget-custom-form").html("");
            });

    $("#saveModel[data-role='popup'] #save")
            .click(function() {
                var name = $("#saveModel input[name='filename']").val(), that = this;

                if (name !== "") {
                    $.ajax({
                        type: "POST",
                        url: site_url + "/model/save",
                        data: "name=" + name + "&data=" + model.serialize(),
                        dataType: "JSON",
                        success: function(data) {
                            if (data.success) {
                                $.jGrowl("Model has been saved.");
                                $(that).parents("div[data-role='popup']").popup("close");
                            } else {
                                $.jGrowl(data.message);
                            }
                        }
                    });
                } else {
                    $.jGrowl("Invalid name!");
                }
            });

    $("#loadModel table tbody")
            .delegate("a", "click", function() {
                var discard = true, that = this,
                        model_id = $(this).parents("tr").attr("id"),
                        model_name = $(this).parents("tr").children("td").first().html(),
                        model_data = $(this).parents("td").children("code").html();

                if ($(this).hasClass("ui-icon-grid")) {
                    if (!model.isEmpty()) {
                        discard = confirm("Changes to current model will be discarded.\nAre you sure you want to continue?");
                    }

                    if (discard) {
                        model.load(model_id, model_name, model_data);
                        $("div.header .title .model").html(model_name);
                    }

                } else if ($(this).hasClass("ui-icon-delete")) {
                    $.ajax({
                        url: site_url + "/model/delete?id=" + model_id,
                        dataType: "JSON",
                        beforeSend: function() {
                            return confirm("Are you sure you want to delete " + model_name + "?");
                        },
                        success: function(data) {
                            if (data.success) {
                                $(that).parents("tr[id='" + model_id + "']").remove();
                            } else {
                                $.jGrowl(data.message);
                            }

                            $(that).parents("table").table("rebuild");
                        }
                    });
                }
            });

    $("#loadModel[data-role='popup']").popup({
        beforeposition: function(event, ui) {
            //Load saved models
            $.ajax({
                async: false,
                url: site_url + "/model/load",
                dataType: "JSON",
                success: function(data) {
                    var content = "";

                    for (var i = 0; i < data.length; i++) {
                        content += "<tr id='" + data[i].id + "'>"
                                + "<td>" + data[i].name + "</td>"
                                + "<td>"
                                + "<code style='display: none;'>" + data[i].data + "</code>"
                                + "<a style='margin-left: 10px; float:right;' class='ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all ui-mini' title='Delete'></a>"
                                + "<a style='margin-left: 10px; float:right;' class='ui-btn ui-icon-grid ui-btn-icon-notext ui-corner-all ui-mini' title='Load'></a>"
                                + "</td>"
                                + "</tr>";

                    }

                    $("#loadModel table tbody").html(content);
                }
            });
        }
    });

    //clear all form input values before opening the popup
    $("#page[data-role='popup'], #pane[data-role='popup'], #widget[data-role='popup'], #saveModel[data-role='popup']").popup({
        beforeposition: function(event, ui) {
            $(this).find("input[type='text']").val("");
        }
    });

    //clear model
    $("#clear[data-rel='popup']")
            .click(function() {
                model.clear();
            });

});