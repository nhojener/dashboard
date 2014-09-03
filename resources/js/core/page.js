define(["jquery"], function($) {
    return {
        template: {
            page: "<div id='{page_id}' data-role='page' title='{page_title}'><div data-role='content'></div></div>",
            menu: "<li><a href='#{page_id}'>{page_title}</a><a class='ui-btn ui-btn-icon-notext ui-icon-delete ui-mini'>{page_id}</a></li>"
        },
        create: function(id, title) {
            $("body").append(this.template.page.replace("{page_id}", id).replace("{page_title}", title))
                    .find("#menulist")
                    .append(this.template.menu.replace(new RegExp("{page_id}", "g"), id).replace("{page_title}", title));

            $("#" + id).page();
            $("#menulist").listview("refresh");

            $.mobile.changePage("#" + id, {changeHash: true});
        },
        update: function(id, title) {
            $("body").find("#" + id + "[data-role='page']").attr("title", title);
            $("body #menulist")
                    .find("a[title='" + id + "']")
                    .parents("li").children("a")
                    .first()
                    .html($("body #menulist").find("a[title='" + id + "']").attr("title"));
        },
        delete: function(id) {
            $("#menulist").find("a[title='" + id + "']").parents("li").remove();
            $("#" + id + "[data-role='page']").remove();
        }
    };
});