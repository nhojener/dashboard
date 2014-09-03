<!DOCTYPE html>
<html>
    <head>
        <title>Web Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="<?php echo base_url(); ?>resources/css/style.css" rel="stylesheet" type="text/css"/>
        <link href="<?php echo base_url(); ?>resources/css/jquery.mobile-1.4.3.css" rel="stylesheet" type="text/css"/>
        <link href="<?php echo base_url(); ?>resources/css/jquery.mobile.theme-1.4.3.css" rel="stylesheet" type="text/css"/>
        <link href="<?php echo base_url(); ?>resources/css/jquery.jgrowl.css" rel="stylesheet" type="text/css"/>
        <link href="<?php echo base_url(); ?>resources/css/tooltipster.css" rel="stylesheet" type="text/css"/>
        <link href="<?php echo base_url(); ?>resources/css/themes/tooltipster-punk.css" rel="stylesheet" type="text/css"/>
        <link href="<?php echo base_url(); ?>resources/css/colorpicker.css" rel="stylesheet" type="text/css"/>
        <script type="text/javascript">var site_url = "<?php echo site_url(); ?>";</script>
        <script data-main="resources/js/init" src="resources/js/require.js"></script>
    </head>
    <body>
        <div class="header" data-role="header" data-position="fixed" data-theme="a">
            <div class="title"><span class="model">Web Dashboard</span><span class="page"></span></div> 
            <div class="copyright">
                <a id="clear" data-rel="popup" data-position-to="window" data-transition="pop" data-disabled="true" class="ui-btn ui-disabled ui-corner-all ui-shadow ui-btn-inline ui-icon-plus ui-btn-icon-left">CLEAR</a>
                <a href="#loadModel" data-rel="popup" data-position-to="window" data-transition="pop" data-disabled="true" class="ui-btn ui-disabled ui-corner-all ui-shadow ui-btn-inline ui-icon-plus ui-btn-icon-left">LOAD</a>
                <a href="#saveModel" data-rel="popup" data-position-to="window" data-transition="pop" data-disabled="true" class="ui-btn ui-disabled ui-corner-all ui-shadow ui-btn-inline ui-icon-plus ui-btn-icon-left">SAVE</a>
                <a href="#pane" data-rel="popup" data-position-to="window" data-transition="pop" data-disabled="true" class="ui-btn ui-disabled ui-corner-all ui-shadow ui-btn-inline ui-icon-plus ui-btn-icon-left">PANE</a>
                <a href="#page" data-rel="popup" data-position-to="window" data-transition="pop" data-disabled="true" class="ui-btn ui-disabled ui-corner-all ui-shadow ui-btn-inline ui-icon-plus ui-btn-icon-left">PAGE</a>
                <a href="#leftpanel" class="ui-btn ui-icon-bars ui-btn-icon-left ui-corner-all ui-mini">MENU</a>
            </div>
            <div style="clear:both"></div>
        </div>
        <div id="default" data-role="page">
            <div data-role="content"></div>
        </div>
        <div data-role="footer" data-position="fixed" data-theme="a">
            <h5>Powered By: DELCOM</h5>
        </div>

        <!-- Menu !-->
        <div id="leftpanel" data-role="panel" data-position="left" data-display="overlay" data-theme="b">
            <h2>Menu</h2>
            <ul id="menulist" data-role="listview"></ul>
        </div>

        <!-- Popup forms !-->
        <div id="page" data-role="popup" data-overlay-theme="b" data-theme="a" data-dismissible="false" style="max-width:500px;">
            <div data-role="header" data-theme="a">
                <h1>Page</h1>
            </div>
            <div role="main" class="ui-content">
                <form class="ui-field-contain ui-mini">
                    <table>
                        <tr>
                            <td><input id="page_id" name="page_id" type="text" placeholder="page-id" style="width: 200px"  maxlength="50"></td>
                            <td><input id="page_title" name="page_title" type="text" placeholder="page-title" style="width: 250px" maxlength="100"></td>
                        </tr>
                    </table>
                </form>
                <div style="float:right;">
                    <a id="save" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-mini">Save</a>
                    <a href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-mini" data-rel="back">Cancel</a>
                </div>
                <div style="clear:both"></div>
            </div>
        </div>
        <div id="pane" data-role="popup" data-overlay-theme="b" data-theme="a" data-dismissible="false" style="max-width:500px;">
            <div data-role="header" data-theme="a">
                <h1>Pane</h1>
            </div>
            <div role="main" class="ui-content">
                <form class="ui-field-contain ui-mini">
                    <table>
                        <tr>
                            <td><input id="pane_id" type="text" placeholder="pane-id" style="width: 200px"  maxlength="50"></td>
                            <td><input id="pane_title" type="text" placeholder="pane-title" style="width: 250px" maxlength="100"></td>
                        </tr>
                    </table>
                </form>
                <div style="float:right;">
                    <a id="save" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-mini">Save</a>
                    <a href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-mini" data-rel="back">Cancel</a>
                </div>
                <div style="clear:both"></div>
            </div>
        </div>
        <div id="widget" data-role="popup" data-overlay-theme="b" data-theme="a" data-dismissible="false">
            <div data-role="header" data-theme="a">
                <h1>Widget</h1>
            </div>
            <div role="main" class="ui-content">
                <form class="ui-field-contain ui-mini">
                    <table style="min-width: 300px">
                        <tr>
                            <td>
                                <select name="widget" data-native-menu="false"></select>
                            </td>
                        </tr>
                        <tr>
                            <td id="widget-custom-form"></td>
                        </tr>
                    </table>
                </form>
                <div style="float:right;">
                    <a id="save" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-mini">Save</a>
                    <a href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-mini" data-rel="back">Cancel</a>
                </div>
                <div style="clear:both"></div>
            </div>
        </div>
        <div id="saveModel" data-role="popup" data-overlay-theme="b" data-theme="a" data-dismissible="false">
            <div data-role="header" data-theme="a">
                <h1>Save</h1>
            </div>
            <div role="main" class="ui-content">
                <form class="ui-field-contain ui-mini">
                    <input name="filename" type="text" placeholder="name" style="width: 300px">
                </form>
                <div style="float:right;">
                    <a id="save" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-mini">Save</a>
                    <a href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-mini" data-rel="back">Cancel</a>
                </div>
                <div style="clear:both"></div>
            </div>
        </div>
        <div id="loadModel" data-role="popup" data-overlay-theme="b" data-theme="a" data-dismissible="false">
            <a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>
            <div role="main" class="ui-content">
                <table data-role="table" id="model" data-mode="columntoggle" class="ui-body-d ui-shadow table-stripe ui-responsive" data-column-btn-theme="b" data-column-btn-text="Columns to display..." data-column-popup-theme="a">
                    <thead>
                        <tr class="ui-bar-d">
                            <th style="width: 300px;">Model</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    </body>
</html>