define(["jquery"], function($) {
    return {
        template: {
            pane: "<ul id='{pane_id}' class='pane' data-role='listview' data-inset='true' style='float:left; display: inline-block; margin-left: 10px;'>"
                    + "<li data-role='list-divider'>"
                    + "<h2 style='float:left;'>{pane_title}</h2>"
                    + "<a style='float:right;' class='ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all ui-mini'></a>"
                    + "<a href='#widget' data-rel='popup' data-position-to='window' data-transition='pop' style='float:right; margin-left: 10px;' class='ui-btn ui-icon-plus ui-btn-icon-notext ui-corner-all ui-mini'></a>"
                    + "</li>"
                    + "</ul>"
        },
        create: function(page, id, title) {
            $("body").find("#" + page + "[data-role='page'] div[data-role='content']")
                    .append(this.template.pane.replace("{pane_id}", id).replace("{pane_title}", title));

            $("#" + page + "[data-role='page'] #" + id).listview();
        },
        update: function(page, id, title) {
            $("body").find("#" + page + "[data-role='page'] ul[id='" + id + "'] h2").html(title);
        },
        delete: function(page, id) {
            $("body").find("#" + page + "[data-role='page'] ul[id='" + id + "']").remove();
        }
    };
});