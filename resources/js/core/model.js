define(["jquery", "underscore", "page", "pane", "widget"], function($, _, Page, Pane, Widget) {
    function Model() {
        var id = null, name = null, data = {}, that = this;

        this.page = function() {
            return {
                init: function() {
                    data["pages"] = new Object();
                },
                exist: function(id) {
                    var pages = false, page = false;

                    if (typeof data.pages !== "undefined") {
                        pages = true;

                        if (typeof id === "undefined" || typeof data.pages[id] !== "undefined") {
                            page = true;
                        }
                    }

                    return pages && page;
                },
                add: function(id, title) {
                    if (!this.exist()) {
                        this.init();
                    }

                    data.pages[id] = {
                        id: id,
                        title: title
                    };

                    this.trigger("create", id);
                },
                edit: function(id, title) {
                    if (this.exist(id)) {
                        data.pages[id] = {
                            id: id,
                            title: title
                        };

                        this.trigger("update", id);
                    }
                },
                deleteAll: function() {
                    if (this.exist()) {
                        $.each(data.pages, function(id) {
                            that.page().del(id);
                        });
                    }
                },
                del: function(id) {
                    if (this.exist(id)) {
                        that.pane().deleteAll(id);
                        this.trigger("delete", id);
                        delete(data.pages[id]);
                    }
                },
                render: function(start, page) {
                    if (this.exist(page) && that.pane().exist(page)) {
                        $.each(data.pages[page].panes, function(pane, pane_data) {
                            if (that.pane().exist(page, pane) && that.widget().exist(page, pane)) {
                                $.each(data.pages[page].panes[pane].widgets, function(widget, widget_data) {
                                    that.widget().render(start, page, pane, widget);
                                });
                            }
                        });
                    }
                },
                trigger: function(action, id) {
                    if (action === "create") {
                        Page.create(id, data.pages[id].title);

                        console.log("Page [" + data.pages[id].title + "] has been created.");
                    } else if (action === "update") {
                        Page.update(id, data.pages[id].title);

                        console.log("Page [" + data.pages[id].title + "] has been updated.");
                    } else if (action === "delete") {
                        Page.delete(id);

                        console.log("Page [" + data.pages[id].title + "] has been deleted.");
                    }
                }
            };
        };

        this.pane = function() {
            return {
                init: function(page) {
                    data.pages[page]["panes"] = new Object();
                },
                exist: function(page, id) {
                    var panes = false, pane = false;

                    if (typeof data.pages[page].panes !== "undefined") {
                        panes = true;

                        if (typeof id === "undefined" || typeof data.pages[page].panes[id] !== "undefined") {
                            pane = true;
                        }
                    }

                    return panes && pane;
                },
                add: function(page, id, title) {
                    if (!this.exist(page)) {
                        this.init(page);
                    }

                    data.pages[page].panes[id] = {
                        id: id,
                        title: title
                    };

                    this.trigger("create", id, page);
                },
                edit: function(page, id, title) {
                    if (this.exist(page, id)) {
                        data.pages[page].panes[id] = {
                            id: id,
                            title: title
                        };

                        this.trigger("update", id, page);
                    }
                },
                deleteAll: function(page) {
                    if (this.exist(page)) {
                        $.each(data.pages[page].panes, function(id, pane) {
                            that.pane().del(page, id);
                        });
                    }
                },
                del: function(page, id) {
                    if (this.exist(page, id)) {
                        that.widget().deleteAll(page, id);
                        this.trigger("delete", id, page);
                        delete(data.pages[page].panes[id]);
                    }
                },
                trigger: function(action, id, page) {
                    if (action === "create") {
                        Pane.create(page, data.pages[page].panes[id].id, data.pages[page].panes[id].title);

                        console.log("Pane [" + data.pages[page].panes[id].title + "] has been created.");
                    } else if (action === "update") {
                        Pane.update(page, data.pages[page].panes[id].id, data.pages[page].panes[id].title);

                        console.log("Pane [" + data.pages[page].panes[id].title + "] has been updated.");
                    } else if (action === "delete") {
                        Pane.delete(page, id);

                        console.log("Pane [" + data.pages[page].panes[id].title + "] has been deleted.");
                    }
                }
            };
        };

        this.widget = function() {
            return {
                init: function(page, pane) {
                    data.pages[page].panes[pane]["widgets"] = new Object();
                },
                exist: function(page, pane, id) {
                    var widgets = false, widget = false;

                    if (typeof data.pages[page].panes[pane].widgets !== "undefined") {
                        widgets = true;

                        if (typeof id === "undefined" || typeof data.pages[page].panes[pane].widgets[id] !== "undefined") {
                            widget = true;
                        }
                    }

                    return widgets && widget;
                },
                add: function(type, page, pane, config, id) {
                    var widget_id = ((typeof id === "undefined") ? (type + "_" + (new Date()).getTime()) : id);

                    if (!this.exist(page, pane)) {
                        this.init(page, pane);
                    }

                    data.pages[page].panes[pane].widgets[widget_id] = {
                        type: type,
                        config: config,
                        widget: new Widget()
                    };

                    this.trigger("create", page, pane, widget_id);
                },
                deleteAll: function(page, pane) {
                    if (this.exist(page, pane)) {
                        $.each(data.pages[page].panes[pane].widgets, function(id, widget) {
                            that.widget().del(page, pane, id);
                        });
                    }
                },
                del: function(page, pane, id) {
                    if (this.exist(page, pane, id)) {
                        this.trigger("delete", page, pane, id);

                        delete(data.pages[page].panes[pane].widgets[id]);
                    }
                },
                render: function(start, page, pane, id) {
                    if (this.exist(page, pane, id) && start) {
                        data.pages[page].panes[pane].widgets[id].widget.run();
                    } else {
                        data.pages[page].panes[pane].widgets[id].widget.stop();
                    }
                },
                trigger: function(action, page, pane, id) {
                    if (action === "create") {
                        data.pages[page].panes[pane].widgets[id].widget.init(id, data.pages[page].panes[pane].widgets[id].type, data.pages[page].panes[pane].widgets[id].config);
                        data.pages[page].panes[pane].widgets[id].widget.create(page, pane);
                        console.log("Widget [" + id + "] has been created.");
                        that.widget().render(true, page, pane, id);
                    } else if (action === "delete") {
                        data.pages[page].panes[pane].widgets[id].widget.delete(page, pane, id);

                        console.log("Widget [" + id + "] has been deleted.");
                    }
                }
            };
        };

        this.serialize = function() {
            var model = JSON.parse(JSON.stringify(data));

            if (typeof model.pages !== "undefined") {
                $.each(model.pages, function(page, page_data) {
                    if (typeof model.pages[page].panes !== "undefined") {
                        $.each(page_data.panes, function(pane, pane_data) {
                            if (typeof model.pages[page].panes[pane].widgets !== "undefined") {
                                $.each(pane_data.widgets, function(widget, widget_data) {
                                    delete widget_data.widget;
                                });
                            }
                        });
                    }
                });
            }

            return JSON.stringify(model);
        };

        this.load = function(model_id, model_name, model_data) {
            var model = JSON.parse(model_data);

            id = model_id;
            name = model_name;
            
            if(!this.isEmpty()){
                this.clear();
            }

            if (typeof model.pages !== "undefined") {
                $.each(model.pages, function(page_id, page) {
                    that.page().add(page_id, page.title);

                    if (typeof page.panes !== "undefined") {
                        $.each(page.panes, function(pane_id, pane) {
                            that.pane().add(page_id, pane_id, pane.title);

                            if (typeof pane.widgets !== "undefined") {
                                $.each(pane.widgets, function(widget_id, widget) {
                                    that.widget().add(widget.type, page_id, pane_id, widget.config, widget_id);
                                });
                            }
                        });
                    }
                });
            }
        };

        this.clear = function() {
            that.page().deleteAll();
            data = {};
        };

        this.isEmpty = function() {
            return _.size(data) === 0 ? true : false;
        };
    }

    return Model;
});