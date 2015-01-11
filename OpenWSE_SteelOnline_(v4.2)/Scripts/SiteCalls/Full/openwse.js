﻿// -----------------------------------------------------------------------------------
//
//	openWSE v3.5
//	by John Donnelly
//	Last Modification: 1/5/2015
//
//	Licensed under the Creative Commons Attribution 2.5 License - http://creativecommons.org/licenses/by/2.5/
//  	- Free for use in both personal and commercial projects
//		- Attribution requires leaving author name, author link, and the license info intact.
//
//  Requirements:
//      jquery v1.11.1 - http://code.jquery.com/jquery-1.11.1.min.js
//      migrate.jquery.min.js - http://code.jquery.com/jquery-migrate-1.2.1.min.js
//
// -----------------------------------------------------------------------------------


/* Variable Assignments */
var openWSE_Config = {
    siteName: "",
    demoMode: false,
    siteTheme: "Standard",
    animationSpeed: 200,
    hoverPreviewWorkspace: false,
    taskBarShowAll: true,
    ShowWorkspaceNumApp: true,
    desktopCSS: "site_desktop.css",
    mobileCSS: "site_mobile.css",
    winMinWidth: 1000,
    minPasswordLength: 6,
    workspaceMode: "",
    overlayPanelId: "pnl_OverlaysAll",
    reportAlert: true,
    siteRootFolder: "",
    displayLoadingOnRedirect: true
};

var openWSE = function () {

    /* Private Variable Holders (DO NOT MODIFY) */
    var hf_r = "";
    var handler = "";
    var updateAppId = "";
    var aboutHolder = "";
    var autoupdaterunning = 0;
    var loadingImg = "<div class='loading-icon-sml'></div>";
    var loadingImg_lrg = "<div class='loading-icon-lrg'></div>";
    var innerScrollPos = 0;
    var runningNoti = false;
    var runningMoreNoti = false;
    var innerModalContent = new Array();
    var ddNotiLoading = "<div class='ddLoadingMessage'>" + loadingImg + "<h3>Loading Notifications. Please Wait...</h3></div>";
    var totalHelpPages = 0;
    var canSortMyAppOverlay = false;
    var canSaveSortedMyAppOverlay = false;
    var saveHandler = "WebServices/SaveControls.asmx";
    var loadingMessage = "<div class='loading-background-holder'></div>";
    var appMainClicked = 0;
    var needpostback = 0;
    var previewAppID = "";
    var previewxVal = "";
    var previewyVal = "";
    var previewHover = false;
    var appsToLoad = new Array();
    var maxBtn_InProgress = false;
    var minBtn_InProgress = false;
    var exitBtn_InProgress = false;
    var previousWidth = 0;
    var _topAboutPos = 0;
    var _leftAboutPos = 0;
    var canSaveSort = false;
    var uednTimeout;
    var pageLoadingTimeout;
    var topBarHt = 34;
    var bottomBarHt = 28;
    var currWinMode = "";
    var widgtIconOptionsOn = false;
    var pagedIconClicked = false;

    function init() {
        console.log(openWSE_Config);

        // Need to get correct path
        saveHandler = openWSE.siteRoot() + "WebServices/SaveControls.asmx";

        LoadViewPort();
        GetCurrentPage();

        $("#accordian-sidebar").AccordianTab({
            allowCloseAll: true,
            oneOpen: true,
            startCollapsed: true,
            animationSpeed: openWSE_Config.animationSpeed,
            createCookie: true
        });

        if ($("#user_profile_tab").length > 0) {
            $("#user_profile_tab").find(".b").css("min-width", $(".top-options").outerWidth());
        }

        if (openWSE_Config.demoMode) {
            $(".bgchange-icon").remove();
        }

        if (!openWSE.CheckIfWorkspaceLinkAvailable()) {
            if ($("#lnk_BackToWorkspace").length > 0) {
                $("#lnk_BackToWorkspace").remove();
            }
        }
    }
    function OnError(error, url) {
        var fullurl = openWSE.siteRoot() + "WebServices/AppLog_Errors.asmx/AddError";
        $.ajax({
            url: fullurl,
            type: "POST",
            data: '{ "message": "' + escape(error) + '","url": "' + escape(url) + '" }',
            contentType: "application/json; charset=utf-8"
        });
    }
    function AdjustContainerLogo() {
        if ($("#container_logo").length > 0) {
            var logoHeight = $("#container_logo").height();
            var logoWidth = $("#container_logo").width();

            var mTop = -(logoHeight / 2);
            var mLeft = -(logoWidth / 2);

            $("#container_logo").css({
                marginLeft: mLeft,
                marginTop: mTop
            });
        }
    }
    function SetContainerTopPos(adjustAll) {
        topBarHt = $("#always-visible").outerHeight();
        bottomBarHt = $("#container-footer").outerHeight();
        if ($("#always-visible").css("display") == "none") {
            topBarHt = 0;
        }
        if ($("#container-footer").css("display") == "none") {
            bottomBarHt = 0;
        }

        $("#container, #iframe-container-helper").css("top", topBarHt);
        $("#container, #iframe-container-helper, .administrator-workspace-note").css("bottom", bottomBarHt);

        AdjustContainerLogo();

        if (adjustAll) {
            if ($("#iframe-content-src").length > 0) {
                $("#iframe-content-src").css("height", $(window).height() - ($("#always-visible").height() + $("#container-footer").height()));
                $("#iframe-content-src").css("width", $(window).width());
            }

            openWSE.SetNoticiationsMaxHeight();
            openWSE.SetDropDownMaxHeight();
        }
    }


    /* Set the Paged version of the Workspace */
    function PagedWorkspace(appId) {
        LoadCurrentWorkspace("1");

        // Move Search Dropdown
        // CreateNewPagedSearchBox();

        if (appId != "" && $("#" + appId + "-pnl-icons").length != 0) {
            pagedIconClicked = true;
            $("#" + appId).addClass("auto-full-page");
            $("#" + appId).find(".app-head, .app-head-button-holder").hide();
            $("#" + appId + "-pnl-icons").trigger("click");
        }
    }
    function GetPagedAddOverlayAndModel() {
        $("#" + openWSE_Config.overlayPanelId).append($(".addOverlay-bg"));
        $("#" + openWSE_Config.overlayPanelId).append($("#overlayEdit-element"));
        $(".addOverlay-bg").css({
            bottom: $("#container-footer").outerHeight(),
            left: $("#sidebar_menulinks").outerWidth()
        });
    }
    function CreateNewPagedSearchBox() {
        $("#workspace-selector").append($("#searchwrapper-app-search"));
        $("#app_search_tab").remove();
        var $searchBox = $("#searchwrapper-app-search").find("#searchbox-app-search");
        if ($searchBox.length != 0) {
            $searchBox.parent().addClass("search-blur");
            $searchBox.val("Search");
            $searchBox.blur(function () {
                $(this).parent().addClass("search-blur");
                if ($(this).val().toLowerCase() == "") {
                    $(this).val("Search");
                }
            }).focus(function () {
                $(this).parent().removeClass("search-blur");
                if ($(this).val().toLowerCase() == "search") {
                    $(this).val("");
                }
            });
        }
    }
    function IsComplexWorkspaceMode() {
        if (openWSE_Config.workspaceMode.toLowerCase() == "complex" || openWSE_Config.workspaceMode == "") {
            return true;
        }

        return false;
    }


    function ConvertBitToBoolean(value) {
        if (value != null && value != undefined) {
            var _value = $.trim(value.toString().toLowerCase());

            if (_value != "true" && _value != "false" && _value != "0" && _value != "1" && _value != "") {
                return true;
            }

            if (_value == "1" || _value == "true" || _value == "") {
                return true;
            }
            else if (_value == "0" || _value == "false") {
                return false;
            }
        }

        return false;
    }

    function OpenMobileWorkspace() {
        window.open(openWSE.siteRoot() + 'AppRemote.aspx', '_blank', 'toolbar=no, scrollbars=yes, resizable=yes, width=340, height=550');
        return false;
    }


    /* Set Trial Text */
    function SetTrialText(exp) {
        var text = "<div class='trial-version-text'><span>Trial Version</span><span class='float-right'>Expires in " + exp + "</span></div>";
        $("#maincontent_overflow").prepend(text);
    }


    /* Auto Update System */
    Sys.WebForms.PageRequestManager.getInstance().add_beginRequest(function (sender, args) {
        if (($("#pnl_aboutHolder").length > 0) && ($.trim($("#pnl_aboutHolder").html()) != "") && ($("#aboutApp-element").css("display") == "block")) {
            aboutHolder = $.trim($("#pnl_aboutHolder").html());
        }

        SaveInnerModalContent(args);
    });
    Sys.WebForms.PageRequestManager.getInstance().add_endRequest(function () {
        $(".ui-tooltip-content").parents('div').remove();
        if (aboutHolder != "") {
            $("#MainContent_pnl_aboutHolder").html(aboutHolder);
            aboutHolder = "";
        }

        RemoveUpdateModal();

        // Load Saved Modal Content if needed
        LoadSavedInnerModalContent();

        // Refresh Notifications if available
        RefreshNotifications();

        // Start the Auto Update System
        autoupdate(hf_r, handler, updateAppId);

        ShowNewNotificationPopup();
    });
    function autoupdate(_hf_r, _handler, _updateAppId) {
        if ((hf_r == "") && (_hf_r != "")) {
            hf_r = _hf_r;
        }
        if ((handler == "") && (_handler != "")) {
            handler = _handler;
        }
        if ((updateAppId == "") && (_updateAppId != "")) {
            updateAppId = _updateAppId;
        }

        if ((hf_r != "") && (handler != "") && (updateAppId != "")) {
            if (autoupdaterunning == 0) {
                $.ajax({
                    url: _handler,
                    data: '{ "_appId": "' + escape(updateAppId) + '" }',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    type: "POST",
                    success: function (msg) {
                        var response = msg.d[0];
                        if (response == "TURNOFF") {
                            autoupdaterunning = 1;
                            return;
                        }
                        else if (response == "refresh") {
                            autoupdaterunning = 0;
                            document.getElementById(hf_r).value = "refresh";
                            __doPostBack(hf_r, "");
                        }
                        else if ((response != "false") && (response != "")) {
                            try {
                                if (openWSE.ConvertBitToBoolean(msg.d[1])) {
                                    autoupdaterunning = 0;
                                    LoadingMessage1("Receiving Request...");
                                    StartRemoteLoad(response, hf_r, handler, updateAppId);
                                }
                                else {
                                    autoupdaterunning = 0;
                                    document.getElementById(hf_r).value = response;
                                    __doPostBack(hf_r, "");
                                }
                            }
                            catch (evt) {
                                autoupdaterunning = 0;
                                autoupdate(hf_r, handler, updateAppId);
                            }
                        }
                        else {
                            autoupdaterunning = 0;
                            autoupdate(hf_r, handler, updateAppId);
                        }
                    },
                    error: function () {
                        autoupdaterunning = 0;
                        autoupdate(hf_r, handler, updateAppId);
                    }
                });
                autoupdaterunning = 1;
            }
        }
    };


    $(document.body).on("click", ".RandomActionBtns", function () {
        if ($(this).closest("#searchwrapper").length != 0) {
            LoadingMessage1("Searching...");
        }
        else {
            LoadingMessage1("Updating. Please Wait...");
        }
    });
    $(document.body).on("click", "#lbtn_signoff", function () {
        LoadingMessage1("Signing Off. Please Wait...");
    });
    $(document.body).on("keypress", "#searchbox-app-search", function (e) {
        if (e.which == 13) {
            $(this).focus();
            event.preventDefault();
            SearchSite();
        }
    });
    $(document.body).on("click", "#container, #container_logo, .workspace-holder, .content-main, .Modal-overlay, #iframe-container-helper", function (e) {
        $(".top-options li.a").removeClass("active");
        $(".top-options li.b").hide();
        openWSE.RemoveWorkspaceSelectorActive();
        CloseNoti();
        cookie.del("top_menu");
    });
    $(document.body).on("click", ".top-options li.a", function () {
        var $b = $(this).next();
        $(".top-options li.a").removeClass("active");
        if ($b.length == 1) {
            if (!$b.is(":visible")) {
                $(".top-options li.b").hide();
                var maxHeight = $(window).height() - 98;
                $b.find(".li-pnl-tab").css("max-height", maxHeight);
                $b.slideDown(openWSE_Config.animationSpeed);
                $(this).addClass("active");
                if ($b.find("input[type=text]").length > 0) {
                    $b.find("input[type=text]").focus();
                }

                var tabIndex = $("li.b").index($b);
                cookie.set("top_menu", tabIndex, "30");
            }
            else {
                CloseNoti();
                $(".top-options li.b").hide();
                $b.css("max-height", "");
            }
        }
        else {
            CloseNoti();
            $(".top-options li.b").hide();
        }
    });
    $(document.body).on("click", ".help-icon", function () {
        HelpOverlay(false);
    });
    $(document.body).on("keydown", "#tb_weather_postalCode", function (event) {
        try {
            if (event.which == 13) {
                SetPostalCode();
                return false;
            }
        } catch (evt) {
            if (event.keyCode == 13) {
                SetPostalCode();
                return false;
            }
            delete evt;
        }
    });
    $(document.body).on("click", ".workspace-reminder", function () {
        var $_this = $(this).parent();
        $(".app-popup").css("display", "none");
        $popup = $_this.find(".app-popup");
        $popup.css("display", "block");
        $popup.fadeIn(openWSE_Config.animationSpeed);
        return false;
    });

    $(document.body).on("mouseover", ".app-icon", function (e) {
        var $options = $(this).find(".app-options");
        if ($options.length > 0) {
            widgtIconOptionsOn = false;
            $options.css("visibility", "visible");
        }
    });
    $(document.body).on("mouseleave", ".app-icon", function (e) {
        var $options = $(this).find(".app-options");
        var $popup = $(this).find(".app-popup");
        if ($options.length > 0 && $popup.length > 0) {
            if ($popup.css("display") != "block") {
                $options.css("visibility", "hidden");
            }
        }
    });
    $(document.body).on("mouseleave", ".app-popup", function (e) {
        if (!widgtIconOptionsOn) {
            $(this).hide();
        }
    });
    $(document.body).on("click", ".app-popup-selector", function () {
        widgtIconOptionsOn = true;
    });

    $(document.body).on("click", ".app-icon", function () {
        var $this = $(this);

        if (!openWSE.IsComplexWorkspaceMode() && !pagedIconClicked) {
            window.location.href = openWSE.siteRoot() + "Workspace.aspx?AppPage=" + $this.attr("id").replace("-pnl-icons", "");
        }
        else if ($("#workspace_holder").length > 0) {
            var workspace = Getworkspace();

            LoadApp($this, workspace);
            if ($this.hasClass("active") == false) {
                $this.addClass("active");
            }

            if ($(".workspace-overlay-selector").hasClass("active")) {
                $(".workspace-overlay-selector").removeClass("active");
            }
        }
        else if ($("#app_tab_body").length > 0) {
            BuildOpenAppPopup(this);
        }

        pagedIconClicked = false;

        return false;
    });
    $(document.body).on("click", "#Category-Back", function () {
        var category = $("#Category-Back-Name-id").html();
        $("#Category-Back").fadeOut(openWSE_Config.animationSpeed);
        if ($("." + category).length > 0) {
            if (openWSE_Config.animationSpeed == 0) {
                $("." + category).hide();
                $(".app-icon-category-list").show();
                $("#Category-Back-Name").html("");
                $("#Category-Back-Name-id").html("");
                cookie.del("app_category");
                cookie.del("app_category_id");
            }
            else {
                $("." + category).hide("slide", { direction: "right" }, openWSE_Config.animationSpeed, function () {
                    $(".app-icon-category-list").show();
                    $("#Category-Back-Name").html("");
                    $("#Category-Back-Name-id").html("");
                    cookie.del("app_category");
                    cookie.del("app_category_id");
                });
            }
        }
        else {
            $(".app-icon-category-list").show();
            $("#Category-Back-Name").html("");
            $("#Category-Back-Name-id").html("");
            cookie.del("app_category");
            cookie.del("app_category_id");
        }
    });
    $(document.body).on("click", ".minimize-button-app", function () {
        if (!minBtn_InProgress) {
            minBtn_InProgress = true;
            var id = $(this).attr("href");
            var $_id = $(id);

            var name = $_id.find(".app-title").text();
            var _leftPos = $_id.css("left");
            var _topPos = $_id.css("top");
            var _width = $_id.width();
            var _height = $_id.height();
            var workspace = Getworkspace();

            if ($("#" + id.replace("#", "") + "-min-bar").length == 0) {
                $_id.animate({ opacity: 0.0, left: $("#minimized-app-bar").css("width"), top: 0 }, openWSE_Config.animationSpeed, function () {
                    BuildAppMinIcon(id.replace(/#/gi, ""), name, _leftPos, _topPos);
                    MoveOffScreen(id);
                    SetContainerTopPos(true);

                    $.ajax({
                        url: saveHandler + "/App_Minimize",
                        type: "POST",
                        data: '{ "appId": "' + id.replace(/#/gi, "") + '","name": "' + name + '","x": "' + _leftPos + '","y": "' + _topPos + '","width": "' + _width + '","height": "' + _height + '","workspace": "' + workspace + '","workspaceMode": "' + openWSE_Config.workspaceMode + '" }',
                        contentType: "application/json; charset=utf-8",
                        success: function (data) {
                            minBtn_InProgress = false;
                        },
                        error: function (data) {
                            minBtn_InProgress = false;
                        }
                    });
                });
            }
        }
        return false;
    });
    $(document.body).on("dblclick", ".app-head-dblclick", function () {
        if (!maxBtn_InProgress) {
            maxBtn_InProgress = true;
            var id = $(this).parent().attr("id");
            id = "#" + id;
            MaximizeApp(id);
        }
        return false;
    });
    $(document.body).on("click", ".maximize-button-app", function () {
        if (!maxBtn_InProgress) {
            maxBtn_InProgress = true;
            var id = $(this).attr("href");
            MaximizeApp(id);
        }
        return false;
    });
    $(document.body).on("click", ".exit-button-app, .exit-button-app-min", function () {
        if (!exitBtn_InProgress) {
            exitBtn_InProgress = true;
            var id = $(this).attr("href");
            if (id.indexOf("#") == -1) {
                id = "#" + id;
            }
            var $_id = $(id);

            if (id == "#app-appinstaller") {
                $("#app-installer-icon").removeClass("active");
            }

            if ($(id + "-min-bar").length > 0) {
                $(id + "-min-bar").remove();
                SetContainerTopPos(true);
            }

            var name = $_id.find(".app-title").text();

            if ($_id.hasClass("app-min-bar-preview")) {
                $_id.css("opacity", "0.0");
                $_id.css("filter", "alpha(opacity=0)");
                $_id.removeClass("app-min-bar-preview");
                previewHover = false;
                previewAppID = "";
                previewxVal = "";
                previewyVal = "";
                SetAppMinToMax(id);
            }

            RemoveworkspaceAppNum(id);
            RemoveAppIconActive(id);

            $_id.fadeOut(openWSE_Config.animationSpeed, function () {
                if ($_id.hasClass("app-maximized")) {
                    $_id.removeClass("app-maximized");
                }

                if ($_id.attr("id").indexOf("app-ChatClient-") != -1) {
                    $_id.remove();
                }

                var canclose = 1;
                var hfcanclose = document.getElementById("hf_" + id.replace(/#/gi, ""));

                if (hfcanclose != null) {
                    canclose = 0;
                }
                if ($_id.find(".app-body").find("div").html() == null) {
                    if (canclose == 1) {
                        $_id.find(".app-body").html("");
                        // $_id.find(".app-body").html(loadingMessage);
                    }
                }
                else {
                    if (canclose == 1) {
                        $_id.find(".app-body").find("div").html("");
                        // $_id.find(".app-body").find("div").html(loadingMessage);
                    }
                }

                $_id.css({
                    visibility: "hidden",
                    left: "",
                    top: "",
                    width: "",
                    height: ""
                });

                $_id.find(".app-body").css("height", "");

                if ($_id.find(".options-button-app").length > 0) {
                    $_id.find(".options-button-app").removeClass("active");
                    $_id.find(".app-popup-inner-app").hide();
                }

                $.ajax({
                    url: saveHandler + "/App_Close",
                    type: "POST",
                    data: '{ "appId": "' + id.replace(/#/gi, "") + '","workspaceMode": "' + openWSE_Config.workspaceMode + '" }',
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        exitBtn_InProgress = false;
                    },
                    error: function (data) {
                        exitBtn_InProgress = false;
                    }
                });
            });
        }
        return false;
    });
    $(document.body).on("click", ".app-min-bar", function () {
        var name = $(this).find("span").text();
        var workspace = Getworkspace();
        var _appId = $(this).attr("id");
        if (_appId.indexOf("-min-bar") != -1) {
            _appId = _appId.replace("-min-bar", "");
        }

        if ($("#" + _appId).hasClass("app-min-bar-preview")) {
            $("#" + _appId).css("opacity", "0.0");
            $("#" + _appId).css("filter", "alpha(opacity=0)");
            $("#" + _appId).removeClass("app-min-bar-preview");
            previewxVal = "";
            previewyVal = "";
        }

        $.ajax({
            url: saveHandler + "/App_Open",
            type: "POST",
            data: '{ "appId": "' + _appId + '","name": "' + name + '","workspace": "' + workspace + '","width": "' + $("#" + _appId).width() + '","height": "' + $("#" + _appId).height() + '","workspaceMode": "' + openWSE_Config.workspaceMode + '" }',
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                var content = data.d;
                if (content != "") {
                    $_id = $("#" + _appId);
                    MoveToCurrworkspace(workspace, _appId);
                    AddworkspaceAppNum(workspace, _appId);

                    var appWidth = $_id.width();
                    var appHeight = $_id.height();

                    if (($_id.css("display") != "block") || ($_id.css("visibility") != "visible")) {
                        var body = "";
                        if ($_id.find(".app-body").find("div").html() == null) {
                            body = $_id.find(".app-body").html().trim();
                        }
                        else {
                            body = $_id.find(".app-body").find("div").html().trim();
                        }

                        var maxApp = "0";
                        if ($_id.hasClass("app-maximized")) {
                            maxApp = "1";
                        }

                        if (body == "") {
                            if (_appId.indexOf("app-ChatClient-") != -1) {
                                var chatUser = $_id.attr("chat-username");
                                content = "ChatClient/ChatWindow.html?user=" + chatUser + "&displayVersion=workspace";
                            }

                            if ((($_id.css("left") == null) && ($_id.css("top") == null)) || (($_id.css("left") == "auto") && ($_id.css("top") == "auto"))) {
                                CreateSOApp(_appId, name, content, "50px", "50px", appWidth, appHeight, "1", maxApp);
                            }
                            else {
                                if (parseInt($_id.css("top")) < 0) {
                                    $_id.css("top", "50px");
                                }
                                if (parseInt($_id.css("left")) < 0) {
                                    $_id.css("left", "50px");
                                }
                                CreateSOApp(_appId, name, content, $_id.css("left"), $_id.css("top"), appWidth, appHeight, "1", maxApp);
                            }
                        }

                        if ($("#" + _appId + "-min-bar").length != 0) {
                            if ((!$_id.hasClass("auto-full-page")) && (!$_id.hasClass("auto-full-page-min")) && (!$_id.hasClass("app-maximized")) && (!$_id.hasClass("app-maximized-min"))) {
                                $_id.find(".maximize-button-app").removeClass("active");
                                $_id.css("width", appWidth);
                                $_id.css("height", appHeight);
                                $_id.css("top", topBarHt);
                            }
                            else {
                                $_id.find(".maximize-button-app").addClass("active");
                                $_id.css("top", "0px");

                                if ($_id.hasClass("app-maximized-min")) {
                                    $_id.removeClass("app-maximized-min");
                                    $_id.addClass("app-maximized");
                                }

                                if ($_id.hasClass("auto-full-page-min")) {
                                    $_id.removeClass("auto-full-page-min");
                                    $_id.addClass("auto-full-page");
                                }
                            }

                            if (previewHover && previewAppID == _appId) {
                                $_id.css({
                                    visibility: "visible",
                                    display: "block",
                                    opacity: 1.0,
                                    left: $("#" + _appId + "-min-bar-x").val(),
                                    top: $("#" + _appId + "-min-bar-y").val()
                                });
                            }
                            else {
                                $_id.css({
                                    visibility: "visible",
                                    display: "block"
                                }).animate({
                                    opacity: 1.0,
                                    left: $("#" + _appId + "-min-bar-x").val(),
                                    top: $("#" + _appId + "-min-bar-y").val()
                                }, openWSE_Config.animationSpeed);
                            }

                            $.ajax({
                                url: saveHandler + "/App_Move",
                                type: "POST",
                                data: '{ "appId": "' + _appId + '","name": "' + name + '","x": "' + $("#" + _appId + "-min-bar-x").val() + '","y": "' + $("#" + _appId + "-min-bar-y").val() + '","width": "' + appWidth + '","height": "' + appHeight + '","workspace": "' + workspace + '","workspaceMode": "' + openWSE_Config.workspaceMode + '" }',
                                contentType: "application/json; charset=utf-8"
                            });
                        }
                        else {
                            $_id.css({
                                top: topBarHt,
                                visibility: "visible",
                                display: "block"
                            }).fadeIn(openWSE_Config.animationSpeed);
                        }

                        var id = $_id.attr("id");
                        SetActiveApp(id);

                        if ($("#" + _appId + "-min-bar").length > 0) {
                            $("#" + _appId + "-min-bar").remove();
                        }
                    }

                    previewHover = false;
                    previewAppID = "";

                    SetContainerTopPos(true);

                    ResizeAppBody("#" + $_id.attr("id"));
                }
            }
        });
        return false;
    });
    $(document.body).on("click", ".app-main, .app-main-nobg", function (e) {
        var id = $(this).attr("id");
        SetActiveApp(id);
        appMainClicked = 1;
    });
    $(document.body).on("click", ".workspace-holder", function () {
        if (openWSE.IsComplexWorkspaceMode()) {
            if (appMainClicked == 0) {
                $(".app-main, .app-main-nobg").removeClass("selected");
                SetDeactiveAll();
            }
        }

        appMainClicked = 0;
    });
    $(document.body).on("click", ".options-button-app", function () {
        var $_id = $(this);
        var $_parent = $_id.parent();
        if ($_parent.find(".app-popup-inner-app").css("display") == "block") {
            $_id.removeClass("active");
            $_parent.find(".app-popup-inner-app").slideUp(openWSE_Config.animationSpeed);
        }
        else {
            $_id.addClass("active");
            var $ddSelector = $_parent.find(".app-popup-inner-app").find(".app-options-workspace-switch");
            if ($ddSelector.length > 0) {
                var currDb = $_id.closest(".workspace-holder").attr("id").replace("MainContent_workspace_", "");
                $ddSelector.val(currDb);
            }

            $_parent.find(".app-popup-inner-app").slideDown(openWSE_Config.animationSpeed);
            SetActiveApp($_parent.parent().attr("id"));
        }

        return false;
    });
    $(document.body).on("change", ".app-popup-selector, .app-options-workspace-switch", function () {
        if ($.trim($(this).val()) != "" && $.trim($(this).val()) != "-") {
            if ($("#workspace_holder").length > 0) {
                MoveAppToworkspace(this);
                var $_id = $(this).closest(".app-head-button-holder").parent().find(".options-button-app");
                if ($_id.length > 0) {
                    var $_parent = $_id.parent();
                    $_id.removeClass("active");
                    $_parent.find(".app-popup-inner-app").hide();
                }
            }
            else {
                var $this = $(this).closest(".app-icon");
                var x = "<div id='MessageActivationPopup' style='display: none;'>";
                x += "<div class='message-element-align'>";
                x += "<div class='message'>";

                var name = $this.find(".app-icon-font").text();
                if (name == "") {
                    name = $this.find(".app-title").text();
                    if (name == "") {
                        name = $this.find("span").text();
                    }
                }

                var _appId = $this.attr("id");
                if ((_appId == undefined) || (_appId == null) || (_appId == "")) {
                    _appId = $this.parent().attr("id");
                }

                var popOutBtn = "";
                if ($this.attr("popoutloc") != "" && $this.attr("popoutloc") != undefined && $this.attr("popoutloc") != null) {
                    var popoutloc = $this.attr("popoutloc");
                    popOutBtn = "<div class='clear-space'></div><a href='#' class='sb-links' onclick='openWSE.PopOutFrameFromSiteTools(\"" + name + "\", \"" + popoutloc + "\");return false;'>Open in new window</a>";
                }

                var currDB = "1";
                if ($this.attr("currentworkspace") != "" && $this.attr("currentworkspace") != undefined && $this.attr("currentworkspace") != null) {
                    currDB = $this.attr("currentworkspace");
                }

                var buttonYes = "<input type='button' class='input-buttons' value='Yes' style='width: 50px;' onclick='openWSE.LoadAppFromSiteTools(\"" + _appId + "\", \"" + name + "\", \"workspace_" + $(this).val() + "\");' />";
                var buttonNo = "<input type='button' class='input-buttons no-margin' value='No' style='width: 50px; margin-left: 10px!important;' onclick='$(\"#MessageActivationPopup\").hide();$(\"#MessageActivationPopup\").remove();return false;' />";

                x += "<h4 class='font-bold'>" + name + "</h4><div class='clear-space'></div>";
                x += "You must be on the workspace to load this app. Would you like to go back to your workspace?<div class='clear' style='height: 20px;'></div>" + buttonYes + buttonNo + popOutBtn;
                x += "</div></div></div>";
                $("body").append(x);
                $("#MessageActivationPopup").show();

                var heightMargin = $("#MessageActivationPopup").find(".page-load-message").height() / 2;
                $("#MessageActivationPopup").find(".page-load-message").css("margin-top", "-" + heightMargin + "px");
            }
        }
    });
    $(document.body).on("click", ".app-options", function () {
        $(".app-popup").css("display", "none");
        $popup = $(this).find(".app-popup");
        $popup.css("display", "block");
        $popup.fadeIn(openWSE_Config.animationSpeed);
        return false;
    });
    $(document.body).on("keypress", "input[type='text'], textarea", function (e) {
        if (!$(this).hasClass("mce-textbox") && !$(this).parent().hasClass("ace_editor")) {
            var code = (e.which) ? e.which : e.keyCode;
            var val = String.fromCharCode(code);

            if (!val.match('^.*?(?=[\^"#%&$\*<>\?\{\|\}]).*$')) {
                return false;
            }
        }
    });


    /* Loading And Updating Modals */
    var intervalCount = 0;
    var messageLoadInterval;
    function LoadingMessage1(message) {
        RemoveUpdateModal();

        if (message.indexOf("...") != -1) {
            message = message.replace("...", "");
        }

        message = message + "<span class='progress inline-block'></span>";

        var x = "<div id='update-element'><div class='update-element-overlay'><div class='update-element-align'>";
        x += "<div class='update-element-modal'>" + loadingImg + "<h3 class='inline-block'>" + message + "</h3></div></div></div></div>";
        $("body").append(x);

        StartMessageTickInterval($("#update-element").find(".progress")[0]);
        $("#update-element").show();

        var $modalWindow = $("#update-element").find(".update-element-modal");
        var currUpdateWidth = -($modalWindow.outerWidth() / 2);
        var currUpdateHeight = -($modalWindow.outerHeight() / 2);
        $modalWindow.css({
            marginLeft: currUpdateWidth,
            marginTop: currUpdateHeight
        });
    }
    function StartMessageTickInterval(elem) {
        messageLoadInterval = setInterval(function () {
            var messageWithTrail = "";
            switch (intervalCount) {
                case 0:
                    messageWithTrail = ".";
                    intervalCount++;
                    break;
                case 1:
                    messageWithTrail = "..";
                    intervalCount++;
                    break;
                case 2:
                    messageWithTrail = "...";
                    intervalCount++;
                    break;
                default:
                    messageWithTrail = "";
                    intervalCount = 0;
                    break;
            }
            $(elem).html(messageWithTrail);
        }, 500);
    }
    function RemoveUpdateModal() {
        if (messageLoadInterval != null) {
            clearInterval(messageLoadInterval);
        }
        $("#update-element").remove();
    }


    /* Alert Window */
    function AlertWindow(error, url) {
        if (error == "" || error == null) {
            error = "An error has occured that was not specified.";
        }

        var ele = "<div id='AlertWindow-element' class='Modal-element' style='display: none;'>";
        ele += "<div class='Modal-overlay'>";
        ele += "<div class='Modal-element-align'>";
        ele += "<div class='Modal-element-modal'>";

        // Header
        ele += "<div class='ModalHeader'><div><div class='app-head-button-holder-admin'>";
        ele += "<a href='#' onclick=\"openWSE.CloseAlertWindow();return false;\" class='ModalExitButton'></a>";
        ele += "</div><span class='Modal-title'></span></div></div>";

        // Body
        var okButton = "<input class='input-buttons confirm-ok-button' type='button' value='Ok' onclick=\"openWSE.CloseAlertWindow();\" style='width: 50px;' />";
        var reportBtn = "";
        if (openWSE_Config.reportAlert) {
            reportBtn = "<input class='input-buttons no-margin confirm-report-button' type='button' value='Report' onclick=\"openWSE.ReportAlert('" + escape(error) + "','" + escape(url) + "');\" style='margin-left: 16px!important;' />";
        }

        if (openWSE_Config.siteTheme == "") {
            openWSE_Config.siteTheme = "Standard";
        }

        var img = "<img alt='confirm' src='" + openWSE.siteRoot() + "App_Themes/" + openWSE_Config.siteTheme + "/Icons/alert.png' />";

        ele += "<div class='ModalPadContent'><div class='message-text'>" + img + error + "</div><div class='button-holder'>" + okButton + reportBtn + "</div></div>";
        ele += "</div></div></div></div>";

        $("body").append(ele);
        LoadModalWindow(true, "AlertWindow-element", "Message");
        $("#AlertWindow-element").find(".confirm-ok-button").focus();
    }
    function CloseAlertWindow() {
        if ($("#AlertWindow-element").length > 0) {
            $("#AlertWindow-element").hide();
            $("#AlertWindow-element").remove();
        }
    }
    function ReportAlert(error, url) {
        if (url == "" || url == null) {
            url = window.location.href;
        }
        OnError(unescape(error), unescape(url));
        CloseAlertWindow();
    }


    /* Confirm Window */
    function ConfirmWindow(message, okCallback, cancelCallback) {
        if (message == "" || message == null) {
            message = "Are you sure you want to continue?";
        }

        var ele = "<div id='ConfirmWindow-element' class='Modal-element' style='display: none;'>";
        ele += "<div class='Modal-overlay'>";
        ele += "<div class='Modal-element-align'>";
        ele += "<div class='Modal-element-modal'>";

        // Header
        ele += "<div class='ModalHeader'><div><div class='app-head-button-holder-admin'>";
        ele += "<a href='#' onclick=\"openWSE.CloseConfirmWindow();return false;\" class='ModalExitButton confirm-cancel-button-header'></a>";
        ele += "</div><span class='Modal-title'></span></div></div>";

        // Body
        var okButton = "<input class='input-buttons confirm-ok-button' type='button' value='Ok' style='width: 60px;' />";
        var cancelButton = "<input class='input-buttons confirm-cancel-button' type='button' value='Cancel' />";

        if (openWSE_Config.siteTheme == "") {
            openWSE_Config.siteTheme = "Standard";
        }

        var img = "<img alt='confirm' src='" + openWSE.siteRoot() + "App_Themes/" + openWSE_Config.siteTheme + "/Icons/confirm.png' />";
        ele += "<div class='ModalPadContent'><div class='message-text'>" + img + message + "</div><div class='button-holder'>" + okButton + cancelButton + "</div></div></div>";
        ele += "</div></div></div></div>";

        $("body").append(ele);

        $("#ConfirmWindow-element").find(".confirm-ok-button").one("click", function () {
            openWSE.CloseConfirmWindow();
            if (okCallback != null) {
                okCallback();
            }
        });
        $("#ConfirmWindow-element").find(".confirm-cancel-button, .confirm-cancel-button-header").one("click", function () {
            openWSE.CloseConfirmWindow();
            if (cancelCallback != null) {
                cancelCallback();
            }
        });

        LoadModalWindow(true, "ConfirmWindow-element", "Confirmation");
        $("#ConfirmWindow-element").find(".confirm-ok-button").focus();
    }
    function CloseConfirmWindow() {
        if ($("#ConfirmWindow-element").length > 0) {
            $("#ConfirmWindow-element").hide();
            $("#ConfirmWindow-element").remove();
        }
    }


    /* Window Load and Resize */
    function OnBrowserClose() {
        $.ajax({
            url: openWSE.siteRoot() + "WebServices/AcctSettings.asmx/OnBrowserClose",
            data: "",
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataFilter: function (data) { return data; }
        });
    }
    function CheckIfWorkspaceLinkAvailable() {
        var hasWorkspaceLink = false;
        $("#pnl_settingLinks").find(".app-icon-links").each(function () {
            var $this = $(this).find(".app-icon-font");
            if ($this.html().toLowerCase() == "workspace") {
                hasWorkspaceLink = true;
            }
        });

        return hasWorkspaceLink;
    }


    /* Radio Button Styling */
    var triggerRadioButtonClick = false;
    $(document.body).on("click", ".RadioButton-Toggle-Overlay", function () {
        var $switch = $(this).closest(".switch-slider");

        triggerRadioButtonClick = true;
        if ($switch.find(".cb-disable").hasClass("selected")) {
            $switch.animate({
                left: 0
            }, openWSE_Config.animationSpeed, function () {
                $switch.find(".cb-enable").find('input').trigger('click');
            });
        }
        else {
            var disabledPos = ($switch.parent().outerWidth() - $switch.find(".RadioButton-Toggle-Overlay").outerWidth()) + 2;
            $switch.animate({
                left: -disabledPos
            }, openWSE_Config.animationSpeed, function () {
                $switch.find(".cb-disable").find('input').trigger('click');
            });
        }
    });
    $(document.body).on("click", ".cb-enable, .cb-disable", function () {
        if (!triggerRadioButtonClick) {
            return false;
        }

        openWSE.LoadingMessage1("Updating...");
        triggerRadioButtonClick = false;
    });
    function RadioButtonStyle() {
        $('.switch').each(function () {
            var $thisSwitch = $(this);

            if ($thisSwitch.find(".RadioButton-Toggle-Overlay").length == 0) {
                var $cbEnabled = $(this).find(".cb-enable");
                var $cbDisabled = $(this).find(".cb-disable");

                if ($thisSwitch.find(".switch-slider").length == 0) {

                    // Append the slider switch
                    $thisSwitch.append("<div class='switch-slider'><table class='switch-slider-table' cellpadding='0' cellspacing='0'><tbody><tr><td class='td-enable'></td><td class='td-switch' title='Click or Drag'></td><td class='td-disable'></td></tr></tbody></table></div>");

                    $thisSwitch.find(".td-enable").append($cbEnabled);
                    $thisSwitch.find(".td-switch").html("<span class='RadioButton-Toggle-Overlay'></span>");
                    $thisSwitch.find(".td-disable").append($cbDisabled);

                    $cbEnabled.removeClass("RandomActionBtns");
                    $cbDisabled.removeClass("RandomActionBtns");

                    // Set the width of the switch
                    var ctrlWidth = $thisSwitch.find(".cb-enable").outerWidth();
                    if (ctrlWidth == 0) {
                        ctrlWidth = $thisSwitch.find(".cb-enable").find("label").outerWidth()
                    }
                    var switchWidth = ctrlWidth + $thisSwitch.find(".RadioButton-Toggle-Overlay").outerWidth();
                    $thisSwitch.width(switchWidth - 2);

                    var disabledPos = ($thisSwitch.outerWidth() - $thisSwitch.find(".RadioButton-Toggle-Overlay").outerWidth()) + 2;

                    var $inputval_cbEnabled = $cbEnabled.find("input");
                    var $inputval_cbDisabled = $cbDisabled.find("input");

                    if ((RadioButtonHasCheckedAttr($inputval_cbEnabled) && $inputval_cbEnabled.prop("checked")) || ($cbEnabled.hasClass("selected"))) {
                        $cbEnabled.addClass("selected");
                        $cbDisabled.removeClass("selected");
                        $inputval_cbEnabled.prop("checked", true);
                        $inputval_cbDisabled.prop("checked", false);
                        $thisSwitch.find(".switch-slider").css("left", 0);
                    }
                    else {
                        $cbDisabled.addClass("selected");
                        $cbEnabled.removeClass("selected");
                        $inputval_cbDisabled.prop("checked", true);
                        $inputval_cbEnabled.prop("checked", false);
                        $thisSwitch.find(".switch-slider").css("left", -disabledPos);
                    }
                }
                else {
                    $thisSwitch.find(".td-switch").html("<span class='RadioButton-Toggle-Overlay'></span>");
                }

                $thisSwitch.find(".switch-slider").draggable({
                    cancel: ".cb-enable, .cb-disable",
                    axis: "x",
                    drag: function (event, ui) {
                        var parentWt = ($(this).parent().outerWidth() - $(this).find(".RadioButton-Toggle-Overlay").outerWidth()) + 2;
                        if (ui.position.left < -parentWt) {
                            $(this).css("left", -parentWt);
                            return false;
                        }

                        if (ui.position.left >= 0) {
                            $(this).css("left", 0);
                            return false;
                        }
                    },
                    stop: function (event, ui) {
                        var mainWidth = ($(this).parent().outerWidth() - $(this).find(".RadioButton-Toggle-Overlay").outerWidth()) + 2;
                        var parentWt = mainWidth / 2;

                        var isEnabled = false;
                        var cbEnableChecked = true;
                        $thisSwitch.find(".cb-disable").each(function () {
                            var $inputval = $(this).find("input");
                            var checked = $inputval.attr("checked");

                            if ($(this).hasClass("selected")) {
                                cbEnableChecked = false;
                            }
                        });

                        if (ui.position.left > -parentWt) {
                            isEnabled = true;
                            $(this).animate({
                                left: 0
                            }, openWSE_Config.animationSpeed);
                        }
                        else {
                            $(this).animate({
                                left: -(parentWt * 2)
                            }, openWSE_Config.animationSpeed);
                        }

                        if (cbEnableChecked && !isEnabled) {
                            triggerRadioButtonClick = true;
                            $thisSwitch.find(".cb-disable").find('input').trigger('click');
                        }
                        else if (!cbEnableChecked && isEnabled) {
                            triggerRadioButtonClick = true;
                            $thisSwitch.find(".cb-enable").find('input').trigger('click');
                        }
                    }
                });
            }
        });
    }
    function RadioButtonHasCheckedAttr(_this) {
        var attr = $(_this)[0].attributes.checked;

        // For some browsers, `attr` is undefined; for others,
        // `attr` is false.  Check for both.
        if (typeof attr !== typeof undefined && attr !== false) {
            return true;
        }

        return false;
    }


    /* Rating Style Initalize */
    function RatingStyleInit(div, rating, disabled, appId, useLargeStars) {
        try {
            var _disabled = false;
            if (disabled) {
                _disabled = true;
            }

            var imagePath = openWSE.siteRoot() + "App_Themes/" + openWSE_Config.siteTheme;

            $(div).attr("data-average", rating);
            $(div).attr("data-id", "1");

            var sizeType = "big";
            if (!useLargeStars) {
                sizeType = "small";
            }

            $(div).jRating({
                step: true,
                type: sizeType,
                showRateInfo: false,
                canRateAgain: true,
                nbRates: 100,
                bigStarsPath: imagePath + "/Icons/star-rating-lrg.png",
                smallStarsPath: imagePath + "/Icons/star-rating-sml.png",
                isDisabled: _disabled,
                decimalLength: 2,
                length: 4,
                rateMax: 4,
                rateMin: 0,
                phpPath: "",
                sendRequest: true,
                onClick: function (element, rate) {
                    $("#AppRating-element").remove();

                    var modalHtml = "<div id='AppRating-element' class='Modal-element'><div class='Modal-overlay'><div class='Modal-element-align'><div class='Modal-element-modal' style='min-width: 350px;'>";
                    modalHtml += "<div class='ModalHeader'><div><div class='app-head-button-holder-admin'></div><span class='Modal-title'></span></div></div>";
                    modalHtml += "<div class='ModalPadContent'></div></div></div></div></div>";
                    $("#aboutApp-element").find(".ModalPadContent").append(modalHtml);

                    var x = "<div class='pad-bottom'>Add a comment to your rating or just press Submit.</div>";
                    x += "<textarea id='app-rating-comment' rows='4' cols='40' style='width: 96%; font-family: arial; font-size: 14px; padding: 5px; border: 1px solid #DDD;'></textarea>";
                    x += "<div class='clear-space'></div>";
                    x += "<input class='float-left no-margin input-buttons' type='button' value='Cancel' onclick='openWSE.ResetRating(\"" + div + "\", \"" + rating + "\", " + disabled + ", \"" + appId + "\", " + useLargeStars + ");$(\"#AppRating-element\").remove();' />";
                    x += "<input class='float-right no-margin input-buttons' type='button' value='Submit' onclick='openWSE.UpdateAppRating(\"" + div + "\", \"" + rate + "\", " + disabled + ", \"" + appId + "\", " + useLargeStars + ");' />";
                    x += "<div class='clear-space-five'></div>";

                    $("#AppRating-element").find(".ModalPadContent").html(x);
                    LoadModalWindow(true, "AppRating-element", "Rating Comment");
                }
            });

            if (!useLargeStars) {
                $(div).find(".jStar").addClass("jStar-Small");
            }
        }
        catch (evt) { }
    }
    function UpdateAppRating(div, rating, disabled, appId, useLargeStars) {
        LoadingMessage1("Updating rating...");
        $.ajax({
            url: openWSE.siteRoot() + "WebServices/SaveControls.asmx/UpdateAppRating",
            type: "POST",
            data: '{ "rating": "' + rating + '","appId": "' + appId + '","description": "' + $("#app-rating-comment").val() + '" }',
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                $("#AppRating-element").remove();

                if ($("#MainContent_btn_refreshStats").length > 0) {
                    __doPostBack('ctl00$MainContent$btn_refreshStats', '');
                }
                else {
                    openWSE.RemoveUpdateModal();
                    openWSE.ResetRating(div, rating, disabled, appId, useLargeStars);
                }
            }
        });
    }
    function ResetRating(div, rating, disabled, appId, useLargeStars) {
        $(div).html("");
        RatingStyleInit(div, rating, disabled, appId, useLargeStars);
    }


    /* App Open */
    function OpenAppNoti(id) {
        var _id = id.replace("-pnl-icons", "");

        $(".top-options li.a").removeClass("active");
        $(".top-options li.b").hide();

        if (openWSE.IsComplexWorkspaceMode()) {
            if ($("#workspace_holder").length > 0) {
                if ($('#' + _id).css('display') == 'none') {
                    needpostback = 1;
                    var workspace = Getworkspace();
                    LoadApp($('#' + id), workspace);
                    if ($('#' + id).find('span').hasClass('active') == false) {
                        $('#' + id).find('span').addClass('active');
                    }
                }
            }
            else {
                BuildOpenAppPopup($("#" + id));
            }
        }
        else {
            window.location.href = openWSE.siteRoot() + "Workspace.aspx?AppPage=" + _id;
        }
    }
    function SearchSite() {
        var x = $.trim($("#searchbox-app-search").val());

        if (x != "") {
            LoadingMessage1("Searching. Please Wait...");
            document.getElementById("hf_SearchSite").value = x;
            $('#searchbox-app-search').val("");
            __doPostBack("hf_SearchSite", "");
        }
    }
    function ClearAppSearch() {
        if ($("#searchbox-app-search").parent().parent().attr("id") == "workspace-selector") {
            $("#searchbox-app-search").val("Search");
        }
        else {
            $("#searchbox-app-search").val("");
        }
    }
    function SearchExternalSite(search) {
        $(".top-options li.a").removeClass("active");
        $(".top-options li.b").hide();

        window.open("http://google.com/search?q=" + search);
    }
    function BuildOpenAppPopup(_this) {
        var $this = $(_this);

        var x = "<div id='MessageActivationPopup' style='display: none;'>";
        x += "<div class='message-element-align'>";
        x += "<div class='message'>";

        var name = $this.find(".app-icon-font").text();
        if (name == "") {
            name = $this.find(".app-title").text();
            if (name == "") {
                name = $this.find("span").text();
            }
        }

        var _appId = $this.attr("id");
        if ((_appId == undefined) || (_appId == null) || (_appId == "")) {
            _appId = $this.parent().attr("id");
        }

        var popOutBtn = "";
        if ($this.attr("popoutloc") != "" && $this.attr("popoutloc") != undefined && $this.attr("popoutloc") != null) {
            var popoutloc = $this.attr("popoutloc");
            popOutBtn = "<div class='clear-space'></div><a href='#' class='sb-links' onclick='openWSE.PopOutFrameFromSiteTools(\"" + name + "\", \"" + popoutloc + "\");return false;'>Open in new window</a>";
        }

        var currDB = "1";
        if ($this.attr("currentworkspace") != "" && $this.attr("currentworkspace") != undefined && $this.attr("currentworkspace") != null) {
            currDB = $this.attr("currentworkspace");
        }

        var buttonYes = "<input type='button' class='input-buttons' value='Yes' style='width: 50px;' onclick='openWSE.LoadAppFromSiteTools(\"" + _appId + "\", \"" + name + "\", \"workspace_" + currDB + "\");' />";
        var buttonNo = "<input type='button' class='input-buttons no-margin' value='No' style='width: 50px; margin-left: 10px!important;' onclick='$(\"#MessageActivationPopup\").hide();$(\"#MessageActivationPopup\").remove();return false;' />";
        var messageStr = "You must be on the workspace to load this app. Would you like to go back to your workspace?";

        if (!openWSE.CheckIfWorkspaceLinkAvailable()) {
            buttonYes = "";
            var buttonNo = "<input type='button' class='input-buttons no-margin' value='Close' onclick='$(\"#MessageActivationPopup\").hide();$(\"#MessageActivationPopup\").remove();return false;' />";
            messageStr = "You are not authorized to use the workspace. ";
            if (popOutBtn != "") {
                messageStr += "However, you can open this app in a seperate window.";
            }
        }

        x += "<h4 class='font-bold'>" + name + "</h4><div class='clear-space'></div>";
        x += messageStr + "<div class='clear' style='height: 20px;'></div>" + buttonYes + buttonNo + popOutBtn;
        x += "</div></div></div>";
        $("body").append(x);
        $("#MessageActivationPopup").show();

        var heightMargin = $("#MessageActivationPopup").find(".page-load-message").height() / 2;
        $("#MessageActivationPopup").find(".page-load-message").css("margin-top", "-" + heightMargin + "px");
    }


    /* Modal Loader */
    function LoadModalWindow(open, element, title) {
        var $thisElement = $("#" + element);
        if (open) {
            $thisElement.show();

            var $modalElement = $thisElement.find(".Modal-element-modal");
            if ($modalElement.outerWidth() > $(window).width()) {
                $modalElement.css({
                    minWidth: 50,
                    width: $(window).width()
                });
                $modalElement.find(".ModalPadContent").css("overflow", "auto");
            }

            $thisElement.find(".Modal-element-align").css({
                marginTop: -($thisElement.find(".Modal-element-modal").height() / 2),
                marginLeft: -($thisElement.find(".Modal-element-modal").width() / 2)
            });

            var container = "#container";
            if (($("#container").length == 0) || (($thisElement.hasClass("outside-main-app-div")) && ($(".workspace-holder").length > 0))) {
                if ($("#maincontent_overflow").length > 0) {
                    container = "#maincontent_overflow";
                }
                else {
                    container = "body";
                }
            }

            $modalElement.draggable({
                containment: container,
                cancel: '.ModalPadContent, .ModalExitButton, #MainContent_pwreset_overlay',
                drag: function (event, ui) {
                    var $this = $(this);
                    $this.css("opacity", "0.6");
                    $this.css("filter", "alpha(opacity=60)");

                    // Apply an overlay over app
                    // This fixes the issues when dragging iframes
                    if ($this.find("iframe").length > 0) {
                        var $_id = $this.find(".ModalPadContent");
                        $wo = $_id.find(".app-overlay-fix");
                        if ($wo.length == 0) {
                            if ($_id.length == 1) {
                                $_id.append("<div class='app-overlay-fix'></div>");
                            }
                        }
                    }
                },
                stop: function (event, ui) {
                    var $this = $(this);
                    $this.css("opacity", "1.0");
                    $this.css("filter", "alpha(opacity=100)");
                    $wo = $(this).find(".app-overlay-fix");
                    if ($wo.length == 1) {
                        $wo.remove();
                    }
                }
            });

            if (title != "") {
                $thisElement.find(".Modal-title").html(title);
            }

            $thisElement.css("visibility", "visible");
        }
        else {
            $thisElement.hide();
            $thisElement.css("visibility", "hidden");
            $thisElement.find(".Modal-title").html("");
            $thisElement.find(".Modal-element-modal").find(".ModalPadContent").css("overflow", "");
        }
    }
    function SaveInnerModalContent(args) {
        try {
            var elem = args.get_postBackElement();
            if (elem != null) {
                if ((elem.id == "hf_UpdateAll") || (elem.id == "MainContent_hf_UpdateAll")) {
                    if (innerModalContent.length == 0) {
                        innerModalContent = new Array();
                        $(".Modal-element").each(function () {
                            var $this = $(this);
                            if (($this.css("display") == "block") && ($this.find("iframe").length == 0)) {
                                var innerModalContentString = escape($.trim($this.find(".ModalPadContent").html()));
                                if ((innerModalContentString != "") && (innerModalContentString != "undefined") && (innerModalContentString != null)) {
                                    var innerMCArray = new Array();
                                    if ($this.attr("id") != "") {
                                        innerMCArray[0] = $this.attr("id");
                                        innerMCArray[1] = innerModalContentString;
                                        innerModalContent.push(innerMCArray);
                                    }
                                }
                            }
                        });
                    }
                }
            }
        }
        catch (evt) { }

        if ($(".Modal-element").css("display") != "none") {
            var $innerScroll = $(".Modal-element").find(".modal-inner-scroll");
            if ($innerScroll.length > 0) {
                innerScrollPos = $innerScroll.scrollTop();
            }
        }
    }
    function LoadSavedInnerModalContent() {
        if (innerModalContent.length > 0) {
            $(".Modal-element").each(function () {
                var $this = $(this);
                if (($this.css("display") == "block") && ($this.find("iframe").length == 0)) {
                    for (var i = 0; i < innerModalContent.length; i++) {
                        if (innerModalContent[i][0] == $this.attr("id")) {
                            var tempContent = unescape(innerModalContent[i][1]);
                            $this.find(".ModalPadContent").html(tempContent);
                            break;
                        }
                    }
                }
            });

            innerModalContent = new Array();
        }

        if ($(".Modal-element").css("display") == "block") {
            var $innerScroll = $(".Modal-element").find(".modal-inner-scroll");
            if ($innerScroll.length > 0) {
                $innerScroll.scrollTop(innerScrollPos);
                innerScrollPos = 0;
            }
        }
    }


    /* Dropdown Menus */
    function LoadTopOptionsCookie() {
        var tabIndex = cookie.get("top_menu");
        if ((tabIndex != "") && (tabIndex != null) && (tabIndex != undefined)) {
            $(".top-options li.b").each(function (index) {
                if (index == tabIndex) {
                    $(this).show();
                    var $a = $(this).prev();
                    if ($a.length == 1) {
                        $a.addClass("active");
                    }
                    SetDropDownMaxHeight();
                }
            });
        }
    }
    function SetDropDownMaxHeight() {
        $(".top-options li.b").each(function () {
            if ($(this).is(":visible")) {
                var maxHeight = $(window).height() - 98;
                $(this).find(".li-pnl-tab").css("max-height", maxHeight);
            }
        });
    }


    /* Help Dialog */
    var newUserHelp = false;
    var needEmailChange = false;
    var adminPasswordChange = false;
    function HelpOverlay(NewUser) {
        if ($("#help_main_holder").css("display") == "none") {

            if ($("#iframe-container-helper").length > 0) {
                CloseIFrameContent();
            }

            newUserHelp = NewUser;

            setTimeout(function () {
                var fullUrl = "";
                var tempUrl = window.location.hash;
                if ((tempUrl.indexOf("#") == -1) && (window.location.href.charAt(window.location.href.length - 1) != "#")) {
                    fullUrl = "#?";
                }
                else if (tempUrl != "") {
                    fullUrl = "&";
                }
                else {
                    fullUrl = "?";
                }

                fullUrl += "help";

                window.location += fullUrl;
            }, openWSE_Config.animationSpeed);
        }
        else {
            CloseHelpOverlay();
        }
    }
    function HelpOverlayHistory() {
        var fullurl = saveHandler + "/GetTotalHelpPages";
        $.ajax({
            url: fullurl,
            type: "POST",
            data: '{ "currentPage": "' + document.location.href + '" }',
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                var count = parseInt(data.d);
                if (count > 0) {
                    totalHelpPages = count;
                    HelpMenuPageLoad(0, newUserHelp);
                    $("#help_main_holder").fadeIn(openWSE_Config.animationSpeed);
                }
                else {
                    if (!newUserHelp) {
                        openWSE.AlertWindow("There are no help pages available for this webpage.");
                        CloseHelpOverlay();
                    }
                    else {
                        NewUserPageLoad();
                        $("#help_main_holder").fadeIn(openWSE_Config.animationSpeed);
                    }
                }
            },
            error: function () {
                if (!newUserHelp) {
                    openWSE.AlertWindow("There was an error retrieving the help pages. Please try again.");
                    CloseHelpOverlay();
                }
                else {
                    NewUserPageLoad();
                    $("#help_main_holder").fadeIn(openWSE_Config.animationSpeed);
                }
            }
        });
    }
    function HelpMenuPageLoad(pagenum, NewUser) {
        var titleHeader = "<span class='pad-left'>Welecome to " + openWSE_Config.siteName + "</span>";
        if (!NewUser) {
            titleHeader = "<span class='pad-left'>" + openWSE_Config.siteName + " Help Pages</span>";
        }

        var btns = "";
        if (!NewUser) {
            btns += "<input type='button' class='input-buttons float-left' onclick='openWSE.HelpOverlay(false, " + adminPasswordChange + ")' value='Close' />";
        }
        if ((pagenum + 1) < totalHelpPages) {
            btns += "<input type='button' class='input-buttons float-right' onclick='openWSE.HelpMenuPageLoad(" + (pagenum + 1).toString() + "," + NewUser + ")' value='Next' />";
        }
        else if (((pagenum + 1) == totalHelpPages) && (NewUser)) {
            btns += "<input type='button' class='input-buttons float-right' onclick='openWSE.NewUserPageLoad()' value='Next' />";
        }

        if (pagenum > 0) {
            btns += "<input type='button' class='input-buttons float-right' onclick='openWSE.HelpMenuPageLoad(" + (pagenum - 1).toString() + "," + NewUser + ")' value='Back' />";
        }

        $("#helpmenu_title").html("<div class='help-Title-Top'>" + titleHeader + btns + "</div>");
        pagenum += 1;

        var currentPage = document.location.href;
        currentPage = currentPage.substring(currentPage.lastIndexOf("/") + 1);
        currentPage = currentPage.replace(currentPage.substring(currentPage.indexOf(".")), "");
        LoadingMessage1("Loading...");
        $("#helpdiv_pageholder").load(openWSE.siteRoot() + "HelpPages/" + currentPage + "/HelpPage" + pagenum + ".html", function () {
            RemoveUpdateModal();
            $(".help-images-workspace-img").each(function () {
                if (!$(this).hasClass("ignoreSrc")) {
                    var imgSrc = $(this).attr("src");
                    $(this).attr("src", openWSE.siteRoot() + "HelpPages/" + currentPage + "/images/" + imgSrc);
                }
            });
        });
    }
    function NewUserPageLoad() {
        var titleHeader = "<span class='pad-left'>Welecome to " + openWSE_Config.siteName + "</span>";
        var btns = "";
        btns += "<input id='btnFinish' type='button' class='input-buttons float-right display-none' onclick='openWSE.NewUserfinsh()' value='Finish' />";
        if (totalHelpPages > 0) {
            btns += "<input type='button' class='input-buttons float-right' onclick='openWSE.HelpMenuPageLoad(" + (totalHelpPages - 1).toString() + ",true)' value='Back' />";
        }

        $("#helpmenu_title").html("<div class='help-Title-Top'>" + titleHeader + btns + "</div>");
        $("#helpdiv_pageholder").html("<div style='position: absolute; top: 50%; left: 50%; margin-left: -95px; margin-top: -45px; padding: 20px;'><div class='loading-icon-lrg margin-top-sml'></div><h3 style='color: #FFF; float: left; font-weight: bold;'>Loading Step....</h3></div>");
        LoadingMessage1("Loading...");
        $.ajax({
            url: openWSE.siteRoot() + 'WebServices/AcctSettings.asmx/CheckForEmailAddress',
            data: '',
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                needEmailChange = openWSE.ConvertBitToBoolean(data.d[0]);
                adminPasswordChange = openWSE.ConvertBitToBoolean(data.d[1]);
                var newmember_text = "";

                if (!needEmailChange && !adminPasswordChange) {
                    newmember_text = UserSetupContainer();
                }
                else {
                    newmember_text = NewUserEmailContainer();
                }

                $("#helpdiv_pageholder").html(newmember_text);
                RemoveUpdateModal();
            }
        });
    }
    function UpdateEmail() {
        var tb = $.trim($("#tb_emailaddress_update").val());
        if (tb != "") {
            LoadingMessage1("Updating...");
            $.ajax({
                url: openWSE.siteRoot() + 'WebServices/AcctSettings.asmx/AddEmailAddress',
                data: '{"email": "' + escape(tb) + '"}',
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (openWSE.ConvertBitToBoolean(data.d)) {
                        needEmailChange = false;
                        $("#update-email-helpdiv").remove();
                    }

                    if ($("#update-password-helpdiv").length == 0) {
                        NewUserPageLoad();
                    }

                    RemoveUpdateModal();
                }
            });
        }
    }
    function UpdateAdminPassword() {
        var tb_pw1 = $.trim($("#tb_newpassword_update").val());
        var tb_pw2 = $.trim($("#tb_confirmnewpassword_update").val());

        $("#span_passwordmismatch").html("");

        if (tb_pw1 == "") {
            $("#span_newpassword_update").show();
        }
        else {
            $("#span_newpassword_update").hide();
        }

        if (tb_pw2 == "") {
            $("#span_confirmnewpassword_update").show();
        }
        else {
            $("#span_confirmnewpassword_update").hide();
        }

        if (tb_pw1 == tb_pw2 && tb_pw1 != "" && tb_pw2 != "") {
            if (tb_pw1.length < openWSE_Config.minPasswordLength) {
                $("#span_passwordmismatch").html("Password does not meet requirements.");
            }
            else {
                LoadingMessage1("Updating...");
                $.ajax({
                    url: openWSE.siteRoot() + 'WebServices/AcctSettings.asmx/UpdateAdminPassword',
                    data: '{"password1": "' + escape(tb_pw1) + '"}',
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        if (openWSE.ConvertBitToBoolean(data.d)) {
                            adminPasswordChange = false;
                            $("#update-password-helpdiv").remove();
                        }

                        if ($("#update-email-helpdiv").length == 0) {
                            NewUserPageLoad();
                        }

                        RemoveUpdateModal();
                    }
                });
            }
        }
        else {
            if (tb_pw1 != "" && tb_pw2 != "") {
                $("#span_passwordmismatch").html("Passwords do not match.");
            }
        }
    }
    function NewUserEmailContainer() {
        var newmember_text = "";

        if (needEmailChange) {
            newmember_text += "<div id='update-email-helpdiv' class='pad-all' align='center'>";
            newmember_text += "<h3>Before you can continue, you must provide a valid email address.<br />This email address will be used for notifications and password recovery.<br />If you fail to provide a valid email address, you will not be able to use the password recovery feature on the login page.</h3>";
            newmember_text += "<div class='clear-space'></div>";
            newmember_text += "<div class='clear-space'></div>";
            newmember_text += "<h3>Please provide a valid email address</h3>";
            newmember_text += "<div class='clear-space'></div>";
            newmember_text += "<span class='pad-right font-bold'>Email Address</span><input type='text' id='tb_emailaddress_update' onkeypress='openWSE.OnEmailUpdate_KeyPress(event)' class='textEntry margin-right' style='width: 200px;' />";
            newmember_text += "<input type='button' class='input-buttons' onclick='openWSE.UpdateEmail()' value='Update' />";
            newmember_text += "<div class='clear-space'></div>";
            newmember_text += "<div class='clear-space'></div>";
            newmember_text += "<div class='clear-space'></div>";
            newmember_text += "</div>";
        }
        else if (adminPasswordChange) {
            newmember_text += "<div id='update-password-helpdiv' class='pad-all' align='center'>";
            newmember_text += "<h3>You are currently signed in as Administrator. Create a new password for your Administrator account.</h3>";
            newmember_text += "<div class='clear-space-two'></div><small><b class='pad-right-sml'>Note:</b>Password must be at least " + openWSE_Config.minPasswordLength + " characters long.</small>";
            newmember_text += "<div class='clear-space'></div><table border='0' cellpadding='0' cellspacing='0'>";
            newmember_text += "<tr><td align='right'><span class='pad-right font-bold'>New Password:</span></td>";
            newmember_text += "<td align='left'><input type='password' id='tb_newpassword_update' onkeypress='openWSE.OnPasswordUpdate_KeyPress(event)' class='textEntry margin-right' style='width: 200px;' /><span id='span_newpassword_update' style='display: none; color: Red;'>*</span></td></tr>";
            newmember_text += "<tr><td></td><td><div class='clear-space'></div></td></tr>";
            newmember_text += "<tr><td align='right'><span class='pad-right font-bold'>Confirm New Password:</span></td>";
            newmember_text += "<td align='left'><input type='password' id='tb_confirmnewpassword_update' onkeypress='openWSE.OnPasswordUpdate_KeyPress(event)' class='textEntry margin-right' style='width: 200px;' /><span id='span_confirmnewpassword_update' style='display: none; color: Red;'>*</span></td></tr></table>";
            newmember_text += "<div class='clear-space'></div>";
            newmember_text += "<input type='button' class='input-buttons no-margin' onclick='openWSE.UpdateAdminPassword()' value='Change Password' />";
            newmember_text += "<div class='clear-space'></div>";
            newmember_text += "<span id='span_passwordmismatch' style='color: Red;'></div>";
            newmember_text += "</div>";
        }

        return newmember_text;
    }
    function OnEmailUpdate_KeyPress(e) {
        if (e.which == 13 || e.keyCode == 13) {
            openWSE.UpdateEmail();
            e.preventDefault();
        }
    }
    function OnPasswordUpdate_KeyPress(e) {
        if (e.which == 13 || e.keyCode == 13) {
            openWSE.UpdateAdminPassword();
            e.preventDefault();
        }
    }
    function UserSetupContainer() {
        var newmember_text = "";
        newmember_text = "<div class='pad-all' align='center'>";
        newmember_text += "<h3>You are now setup. Please click finish to load your workspace. You can change your email address within your 'Account Settings' page. If you need help in the future, click on the help icon at the bottom left hand corner of the workspace.</h3>";
        newmember_text += "<h3>By using this site you agree that OpenWSE can save cookies to your device. These cookies contain no information regarding your personal information.</h3>";
        newmember_text += "</div>";
        $("#btnFinish").removeClass("display-none");

        return newmember_text;
    }
    function NewUserfinsh() {
        $.ajax({
            url: openWSE.siteRoot() + 'WebServices/AcctSettings.asmx/UpdateAcctNewMember',
            data: '',
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                var response = data.d;
                if (openWSE.ConvertBitToBoolean(response)) {
                    window.location = openWSE.siteRoot() + "Workspace.aspx";
                }
            }
        });
    }
    function CloseHelpOverlay() {
        newUserHelp = false;
        adminPasswordChange = false;
        if ($("#help_main_holder").css("display") == "block") {
            $("#help_main_holder").fadeOut(openWSE_Config.animationSpeed, function () {
                $("#helpmenu_title, #helpdiv_1, #helpdiv_2").html("");
            });
        }

        try {
            var url = window.location.href;
            if (url.indexOf("?help") != -1) {
                var loc = url.split("?help");
                if (loc.length > 1) {
                    var fullLoc = "?help" + loc[1];
                    url = url.replace(fullLoc, "");
                    window.location = url;
                }
                else {
                    url = url.replace("?help", "");
                }

                window.location = url;
            }
            else if (url.indexOf("&help") != -1) {
                var loc = url.split("&help");
                if (loc.length > 1) {
                    var fullLoc = "&help" + loc[1];
                    url = url.replace(fullLoc, "");

                }
                else {
                    url = url.replace("&help", "");
                }

                window.location = url;
            }
        }
        catch (evt) { }
    }


    /* Message Popup */
    function ShowUpdatesPopup(message) {
        $(window).load(function () {
            var decodedMessage = unescape(message);
            var x = "<div id='MessageUpdatePopup' style='display: none;'>";
            x += "<div class='message-element-align'>";
            x += "<div id='MessageUpdatePopup-Text' class='message'>";
            x += decodedMessage;
            x += "</div></div></div>";
            $("body").append(x);
            $("#MessageUpdatePopup").show();
            var maxHeight = $(window).height() / 2;
            $(".new-update-holder").css("max-height", maxHeight);
            var heightMargin = $("#MessageUpdatePopup-Text").height() / 2;
            $("#MessageUpdatePopup-Text").css("margin-top", "-" + heightMargin + "px");

            $(window).resize(function () {
                var maxHeight = $(window).height() / 2;
                $(".new-update-holder").css("max-height", maxHeight);
                var heightMargin = $("#MessageUpdatePopup-Text").height() / 2;
                $("#MessageUpdatePopup-Text").css("margin-top", "-" + heightMargin + "px");
            });
        });
    }
    function ShowActivationPopup(message) {
        $(window).load(function () {
            var decodedMessage = unescape(message);
            var x = "<div id='MessageActivationPopup' style='display: none;'>";
            x += "<div class='message-element-align'>";
            x += "<div class='message'>";

            var img = "<img alt='' class='float-left pad-right-sml' src='" + openWSE.siteRoot() + "App_Themes/" + openWSE_Config.siteTheme + "/App/approve.png' />";
            var text = "<span style='font-size: 18px'>Got it</span>";
            var button = "<a href='" + openWSE.siteRoot() + "Workspace.aspx' class='input-buttons no-margin' style='text-decoration: none!important;'>" + img + " " + text + "</a>";

            x += decodedMessage + "<div class='clear' style='height: 20px;'></div>" + button;
            x += "</div></div></div>";
            $("body").append(x);
            $("#MessageActivationPopup").show();

            var heightMargin = $("#MessageActivationPopup").find(".page-load-message").height() / 2;
            $("#MessageActivationPopup").find(".page-load-message").css("margin-top", "-" + heightMargin + "px");

            $(window).resize(function () {
                var heightMargin = $("#MessageActivationPopup").find(".page-load-message").height() / 2;
                $("#MessageActivationPopup").find(".page-load-message").css("margin-top", "-" + heightMargin + "px");
            });
        });
    }
    function CloseUpdatesPopup() {
        $("#MessageUpdatePopup").fadeOut(openWSE_Config.animationSpeed, function () {
            $("#MessageUpdatePopup").remove();
        });
    }


    /* Overlay Menu Controls */
    var maxOverlayTableCol = 3;
    $(document.body).on("click", "#overlay_tab, #pnl_OverlaysAll", function (e) {
        if (openWSE_Config.overlayPanelId == "pnl_OverlaysAll") {
            if ($("#pnl_OverlaysAll").css("display") != "block") {
                $("#pnl_OverlaysAll").fadeIn(openWSE_Config.animationSpeed);
            }
            else {
                if (e.target.id == $(this).attr("id") || (e.target.className.indexOf("overlay-") == 0 && e.target.className.indexOf("overlay-entries") != 0)) {
                    $("#pnl_OverlaysAll").fadeOut(openWSE_Config.animationSpeed);
                }
            }
        }

        $(".top-options li.a").removeClass("active");
        $(".top-options li.b").hide();

        CloseNoti();
        cookie.del("top_menu");
    });
    $(document).keydown(function (e) {
        // ALT + O keydown combo
        e = e || window.event;
        if (e.altKey && e.which == 79) {
            if (openWSE_Config.overlayPanelId == "pnl_OverlaysAll") {
                if ($("#pnl_OverlaysAll").css("display") != "block") {
                    $("#pnl_OverlaysAll").fadeIn(openWSE_Config.animationSpeed);
                }
                else {
                    $("#pnl_OverlaysAll").fadeOut(openWSE_Config.animationSpeed);
                }
            }
        }

        if ($("#workspace_holder").length > 0) {
            // ALT + Up Arrow || ALT + Down Arrow
            if ((e.altKey && e.which == 38) || (e.altKey && e.which == 40)) {
                var current = parseInt(Getworkspace().replace("workspace_", ""));
                var totalWorkspaces = $(".dropdown-db-selector").find("ul").find("li").length;

                var $workspaceSelect = null;

                if (e.which == 40) {
                    if (current + 1 <= totalWorkspaces) {
                        $workspaceSelect = $(".workspace-selection-item").eq(current);
                    }
                    else {
                        $workspaceSelect = $(".workspace-selection-item").eq(0);
                    }
                }
                else {
                    if (current - 1 >= 1) {
                        $workspaceSelect = $(".workspace-selection-item").eq(current - 2);
                    }
                    else {
                        $workspaceSelect = $(".workspace-selection-item").eq(totalWorkspaces - 1);
                    }
                }

                if ($workspaceSelect != null) {
                    $workspaceSelect.trigger("click");
                    var oldid = "#MainContent_" + openWSE.Getworkspace();
                    var newid = "#MainContent_workspace_" + $workspaceSelect.html().replace("Workspace ", "");
                    openWSE.HoverWorkspacePreview(oldid, newid);
                }
            }
        }
    });
    function OverlayDisable(_this) {
        LoadingMessage1("Closing Overlay...");
        var $main = $(_this).closest(".workspace-overlay-selector");
        if ($main.length == 0) {
            $main = $("." + _this);
        }

        $main.remove();

        $.ajax({
            url: saveHandler + "/Overlay_Disable",
            type: "POST",
            data: '{ "classes": "' + $main.attr("class") + '" }',
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                TryRemoveLoadOverlay(data.d);
                RemoveUpdateModal();
            },
            error: function (data) {
                RemoveUpdateModal();
            }
        });
    }
    function TryAddLoadOverlay(ids) {
        var splitIds = ids.split(',');
        var dn = "#" + openWSE_Config.overlayPanelId;
        for (var i = 0; i < splitIds.length; i++) {
            if (splitIds[i] != "") {
                if ($(dn).find('.' + splitIds[i]).length > 0) {
                    $(dn).find('.' + splitIds[i]).remove();
                }

                $(dn).hide().prepend($('.move-holder').find('.' + splitIds[i])).show();
            }
        }

        if (ids != "") {
            UpdateOverlayTable();
        }
    }
    function TryRemoveLoadOverlay(id) {
        var $overlay = $("." + id);
        if ($overlay.length > 0) {
            $overlay.remove();
        }

        UpdateOverlayTable();
    }
    function CallOverlayList() {
        LoadingMessage1("Loading...");
        $.ajax({
            url: openWSE.siteRoot() + "WebServices/AcctSettings.asmx/GetUserOverlays",
            type: "POST",
            data: '{ }',
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                var str = "";
                if (data.d != null) {
                    str += "<div class='margin-top-sml'>";
                    str += "<table cellpadding='0' cellspacing='0' style='min-width: 100%;'><tbody>";
                    str += "<tr class='myHeaderStyle'><td width='30px'></td><td width='150px' align='center'>Overlay Name</td>";
                    str += "<td align='center'>Description</td></tr>";

                    for (var i = 0; i < data.d.length; i++) {
                        str += "<tr class='myItemStyle GridNormalRow'>";

                        var img = "<div class='add-overlay-list-item' onclick='openWSE.AddRemoveOverlayClick(\"" + data.d[i][1] + "\", this);' title='Add Overlay'></div>";
                        if (openWSE.ConvertBitToBoolean(data.d[i][3])) {
                            img = "<div class='add-overlay-list-item add-overlay-list-item-hasitem' onclick='openWSE.AddRemoveOverlayClick(\"" + data.d[i][1] + "\", this);' title='Remove Overlay'></div>";
                        }

                        str += "<td class='GridViewNumRow border-bottom'>" + img + "</td>";
                        str += "<td class='border-right border-bottom'>";
                        str += data.d[i][0] + "</td><td class='border-right border-bottom'>" + data.d[i][2] + "</td></tr>";
                    }

                    str += "</tbody></table></div>"

                    if (data.d.length == 0) {
                        str += "<div class='emptyGridView'>No overlays available</div>";
                    }
                }

                $("#overlayEdit-element").find("#overlay-edit-list").html(str);
                RemoveUpdateModal();
                LoadModalWindow(true, 'overlayEdit-element', 'Add/Remove Overlay');
            },
            error: function () {
                RemoveUpdateModal();
                openWSE.AlertWindow("There was an error retrieving your overlays. Please try again.");
            }
        });
    }
    function AddRemoveOverlayClick(id, _this) {
        if ($(_this).hasClass("add-overlay-list-item-hasitem")) {
            OverlayDisable(id);
            $(_this).removeClass("add-overlay-list-item-hasitem");
        }
        else {
            LoadingMessage1("Adding Overlay...");
            $(_this).addClass("add-overlay-list-item-hasitem");
            $("#hf_loadOverlay1").val(id);
            __doPostBack("hf_loadOverlay1", "");
        }
    }
    function CreateOverlayTable() {
        if ($(".overlay-table").length > 0) {
            $(".overlay-table").remove();
        }

        var $pnlId = $("#" + openWSE_Config.overlayPanelId);

        if ($pnlId.length > 0) {
            var tableCount = 0;
            $(".workspace-overlay-selector").each(function (index) {
                if (index % maxOverlayTableCol == 0) {
                    tableCount++;
                    $pnlId.append("<table id='overlay-table-id-" + tableCount + "' class='overlay-table' cellpadding='0' cellspacing='0'></table>");
                    $("#overlay-table-id-" + tableCount).append("<tr></tr>");
                }

                var $row = $("#overlay-table-id-" + tableCount).find("tr").eq(0);
                $row.append("<td class='overlay-cell-" + index + "'></td>");
                $("#overlay-table-id-" + tableCount).find(".overlay-cell-" + index).append($(this));
            });

            if (openWSE_Config.overlayPanelId != "pnl_OverlaysAll") {
                if ($("#MainContent_pnl_adminnote").length != 0) {
                    $pnlId.prepend($("#MainContent_pnl_adminnote"));
                    $("#MainContent_pnl_adminnote").removeClass("administrator-workspace-note").addClass("workspace-overlays administrator-workspace-note-overlay");
                }
            }
        }

        if ($(".overlay-table").length > 0) {
            $(".overlay-table").eq($(".overlay-table").length - 1).css("margin-bottom", "40px");
        }
    }
    function UpdateOverlayTable() {
        $(".workspace-overlay-selector").each(function () {
            $("#" + openWSE_Config.overlayPanelId).append($(this));
        });

        CreateOverlayTable();
    }


    /* Notifications */
    function GetUserNotifications(showLoading) {
        if (!openWSE_Config.demoMode) {
            if ($("#notification-tab-b").is(":visible")) {
                if (!runningNoti) {
                    runningNoti = true;
                    if ($(".ddLoadingMessage").length == 0) {
                        if (showLoading) {
                            $(".table-notiMessages-div").prepend(ddNotiLoading);
                        }
                    }

                    var myIds = new Array();
                    $("#table_NotiMessages tr").each(function (index) {
                        myIds[index] = $(this).attr("id");
                    });

                    var notiHandler = openWSE.siteRoot() + "WebServices/NotificationRetrieve.asmx/LoadUserNotifications";
                    $.ajax({
                        url: notiHandler,
                        type: "POST",
                        data: '{ "_currIds": "' + myIds + '","siteTheme": "' + openWSE_Config.siteTheme + '" }',
                        contentType: "application/json; charset=utf-8",
                        success: function (data) {
                            $(".ddLoadingMessage").remove();
                            if ((data.d != null) && (data.d != "")) {
                                $("#NotificationHolder").html($.trim(data.d));
                                if ($("#no-notifications-id").length > 0) {
                                    $("#lb_clearNoti").hide();
                                }
                                else {
                                    $("#lb_clearNoti").show();
                                }
                            }
                            else {
                                $("#lb_clearNoti").hide();
                            }

                            runningNoti = false;
                            SetNoticiationsMaxHeight();
                            SetNotificationScrollShadow();
                            CheckIfCanAddMore();
                        },
                        error: function () {
                            $(".ddLoadingMessage").remove();
                            SetNotificationScrollShadow();
                            $("#NotificationHolder").html("<h3 class='pad-top-big pad-bottom' style='color: Red; text-align: center;'>Error retrieving notifications!</h3>");
                            $("#lb_clearNoti").hide();
                            runningNoti = false;
                        }
                    });
                }
            }
        }
    }
    function CheckIfCanAddMore() {
        var elem = document.getElementById("table-notiMessages-div-id");
        if (elem != null) {
            var innerHeight = $("#table-notiMessages-div-id").innerHeight();
            var maxHeight = parseInt($("#table-notiMessages-div-id").css("max-height"));
            if ((innerHeight >= elem.scrollHeight) || (elem.scrollHeight < maxHeight)) {
                var totalMessages = parseInt($("#lbl_notifications").html());
                var currMessages = parseInt($("#table_NotiMessages tr").length);
                if (currMessages < totalMessages) {
                    $(".ddLoadingMessage").remove();
                    $("#NotificationHolder").append(ddNotiLoading);
                    GetMoreUserNotifications();
                }
            }
        }
    }
    function GetMoreUserNotifications() {
        if (!openWSE_Config.demoMode) {
            if ($("#notification-tab-b").is(":visible")) {
                if ((!runningMoreNoti) && (!runningNoti)) {
                    runningMoreNoti = true;
                    var notiHandler = openWSE.siteRoot() + "WebServices/NotificationRetrieve.asmx/LoadMoreUserNotifications";

                    var myIds = new Array();
                    $("#table_NotiMessages tr").each(function (index) {
                        myIds[index] = $(this).attr("id");
                    });

                    $.ajax({
                        url: notiHandler,
                        type: "POST",
                        data: '{ "_currIds": "' + myIds + '","_currCount": "' + parseInt($("#table_NotiMessages tr").length) + '","siteTheme": "' + openWSE_Config.siteTheme + '" }',
                        contentType: "application/json; charset=utf-8",
                        success: function (data) {
                            $(".ddLoadingMessage").remove();
                            if ((data.d != null) && (data.d != "")) {
                                $("#table_NotiMessages").append($.trim(data.d));
                            }
                            SetNoticiationsMaxHeight();
                            SetNotificationScrollShadow();
                            runningMoreNoti = false;
                            CheckIfCanAddMore();
                        },
                        error: function () {
                            $(".ddLoadingMessage").remove();
                            SetNotificationScrollShadow();
                            $("#NotificationHolder").append("<h3 class='pad-bottom-big' style='color: Red; text-align: center;'>Error retrieving notifications!</h3>");
                            runningMoreNoti = false;
                        }
                    });
                }
            }
        }
    }
    function RefreshNotifications() {
        if (!openWSE_Config.demoMode) {
            if ($("#notification-tab-b").is(":visible")) {
                if (!runningMoreNoti) {
                    runningMoreNoti = true;

                    var myIds = new Array();
                    $("#table_NotiMessages tr").each(function (index) {
                        myIds[index] = $(this).attr("id");
                    });

                    var notiHandler = openWSE.siteRoot() + "WebServices/NotificationRetrieve.asmx/RefreshUserNotifications";
                    $.ajax({
                        url: notiHandler,
                        type: "POST",
                        data: '{ "_currIds": "' + myIds + '","siteTheme": "' + openWSE_Config.siteTheme + '" }',
                        contentType: "application/json; charset=utf-8",
                        success: function (data) {
                            $(".ddLoadingMessage").remove();
                            if ((data.d[0] != null) && (data.d[0] != "")) {
                                if ($("#table_NotiMessages").length > 0) {
                                    $("#table_NotiMessages").prepend($.trim(data.d[0]));
                                }
                                else {
                                    var table = "<table ID='table_NotiMessages' class='table-notiMessages' cellpadding='5' cellspacing='5'>";
                                    table += $.trim(data.d[0]) + "</table>";
                                    $("#NotificationHolder").html(table);
                                }
                            }

                            if (data.d[1] != null) {
                                for (var i = 0; i < data.d[1].length; i++) {
                                    var tempId = data.d[1][i];
                                    $("#" + tempId).fadeOut(openWSE_Config.animationSpeed, function () {
                                        $("#" + tempId).remove();
                                    });
                                }
                            }

                            if ($("#lbl_notifications").html() == "0") {
                                $("#NotificationHolder").html("<h3 id='no-notifications-id'>No notifications available.</h3>");
                                $("#lb_clearNoti").hide();
                            }

                            SetNoticiationsMaxHeight();
                            SetNotificationScrollShadow();
                            runningMoreNoti = false;
                        },
                        error: function () {
                            $(".ddLoadingMessage").remove();
                            SetNotificationScrollShadow();
                            $("#NotificationHolder").html("<h3 class='pad-top-big pad-bottom-big' style='color: Red; text-align: center;'>Error retrieving notifications!</h3>");
                            runningMoreNoti = false;
                        }
                    });
                }
            }
        }
    }
    function CloseNoti() {
        $(".ddLoadingMessage").remove();
        $("#NotificationHolder").html("");
        $("#lb_clearNoti").hide();
        runningNoti = false;
    }
    function ResetNoti() {
        $(".ddLoadingMessage").remove();
        $("#lbl_notifications").removeClass("notifications-new");
        $("#lbl_notifications").addClass("notifications-none");
        $("#lbl_notifications").html("0");
        $("#NotificationHolder").html("<h3 id='no-notifications-id'>No notifications available.</h3>");
        $("#lb_clearNoti").hide();
    }
    function NotiActionsClearAll() {
        if (!openWSE_Config.demoMode) {
            LoadingMessage1("Clearing Notifications...");
            var notiHandler = openWSE.siteRoot() + "WebServices/NotificationRetrieve.asmx/DeleteNotifications";
            $.ajax({
                url: notiHandler,
                type: "POST",
                data: '{ "id": "' + "ClearAll" + '" }',
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (openWSE.ConvertBitToBoolean(data.d)) {
                        RemoveUpdateModal();
                        ResetNoti();
                    }
                }
            });
        }
    }
    function NotiActionsHideInd(_this) {
        if (!openWSE_Config.demoMode) {
            LoadingMessage1("Deleting. Please Wait...");
            var $this = $(_this).closest("tr");
            var id = $this.attr("id");
            var notiHandler = openWSE.siteRoot() + "WebServices/NotificationRetrieve.asmx/DeleteNotifications";
            $.ajax({
                url: notiHandler,
                type: "POST",
                data: '{ "id": "' + id + '" }',
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (openWSE.ConvertBitToBoolean(data.d)) {
                        $this.fadeOut(openWSE_Config.animationSpeed, function () {
                            RemoveUpdateModal();
                            $this.remove();
                            if ($("#lbl_notifications").html() == "1") {
                                ResetNoti();
                            }
                            else {
                                var currTotal = parseInt($("#lbl_notifications").html());
                                currTotal -= 1;
                                $("#lbl_notifications").html(currTotal);
                            }
                        });
                    }
                }
            });
        }
    }
    function SetNoticiationsMaxHeight() {
        if ($("#notification-tab-b").is(":visible")) {
            var bufferBottom = 65;
            var extendedHeight = $(window).height() - (bufferBottom + topBarHt);
            var bufferLeft = 7;
            var extendedWidth = $(window).width() - bufferLeft;
            $(".table-notiMessages-div").css({
                maxHeight: extendedHeight,
                maxWidth: extendedWidth
            });
            CheckIfCanAddMore();
        }
    }
    function SetNotificationScrollShadow() {
        $(".table-notiMessages-div").scroll(function () {
            var elem = document.getElementById("table-notiMessages-div-id");
            if (elem != null) {
                var $_scrollBar = $(".table-notiMessages-div");
                var temp = $_scrollBar.scrollTop();
                var innerHeight = $_scrollBar.innerHeight();
                if (temp > 0) {
                    if (temp + innerHeight >= elem.scrollHeight) {
                        var totalMessages = parseInt($("#lbl_notifications").html());
                        var currMessages = parseInt($("#table_NotiMessages tr").length);
                        if (currMessages < totalMessages) {
                            $(".ddLoadingMessage").remove();
                            $("#NotificationHolder").append(ddNotiLoading);
                            GetMoreUserNotifications();
                        }
                    }
                }
            }
        });
    }
    function ShowNewNotificationPopup() {
        try {
            var hasNewNoti = document.getElementById("hf_noti_update_hiddenField").value;

            if (hasNewNoti == "") {
                hasNewNoti = "0";
            }

            if (openWSE.ConvertBitToBoolean(hasNewNoti)) {
                $("#noti-update-element").fadeIn(openWSE_Config.animationSpeed, function () {
                    setTimeout(function () {
                        $("#noti-update-element").fadeOut(openWSE_Config.animationSpeed, function () {
                            $("#hf_noti_update_hiddenField").val("false");
                        });
                    }, 2500);
                });
            }
        }
        catch (evt) { }
    }


    /* Create Account (NoLoginRequired) */
    function LoadCreateAccountHolder() {
        if ($("#Login-holder").css("display") != "none") {
            $("#Login-holder").hide();
            $("#iframe-createaccount-holder").html("<iframe id='iframe-demo' src='SiteSettings/iframes/CreateAccount.aspx' frameborder='0' width='550px' style='visibility: hidden;'></iframe>");
            $("#iframe-createaccount-holder").append("<div style='text-align: center;'><h3 id='loadingControls'>Loading Controls. Please Wait...</h3></div>");
            $("#CreateAccount-holder").fadeIn(openWSE_Config.animationSpeed);
            $("#iframe-demo").load(function () {
                $("#loadingControls").remove();
                $("#register_password_cancel").show();
                $("#iframe-demo").css({
                    height: "300px",
                    visibility: "visible"
                });
            });
        }
        else {
            $("#CreateAccount-holder, #ForgotPassword-holder, #register_password_cancel").hide();
            $("#iframe-createaccount-holder").html("");
            $("#Login-holder").fadeIn(openWSE_Config.animationSpeed);
        }
    }
    function LoadRecoveryPassword() {
        $("#tb_username_recovery").val("");
        $("#lbl_passwordResetMessage").html("");
        $("#UserNameRequired_recovery").css("visibility", "hidden");
        $("#Login-holder").hide();
        $("#register_password_cancel").show();
        $("#ForgotPassword-holder").fadeIn(openWSE_Config.animationSpeed);
    }


    /* Weather Overlay */
    function SetPostalCode() {
        var postalCode = $.trim($("#tb_weather_postalCode").val());
        if (postalCode != "") {
            cookie.set("weather_postal", postalCode, "30");
            WeatherBuilder(openWSE_Config.siteTheme);
        }
    }
    function WeatherBuilder(theme) {
        var postalCode = "66212";
        var pc = cookie.get('weather_postal');

        if (($.trim(pc) == "") || (pc == null) || (pc == undefined)) {
            postalCode = $.trim($("#tb_weather_postalCode").val());
            cookie.set("weather_postal", postalCode, "30");
        }
        else {
            postalCode = pc;
        }

        if (postalCode == "") {
            postalCode = "66212";
        }

        if (theme != "") {
            openWSE_Config.siteTheme = theme;
        }

        var link = "//builder.zoomradar.net/weather_builder/widget.page.php?s=250x250&z=" + postalCode + "&i=1&c=5&ft=Current%20Weather";
        var weatherframe = '<iframe src="' + link + '" width="250" height="250" style="border: 0; opacity: 0.85; filter:alpha(opacity=85);" frameborder="0"></iframe>';
        var postalCode = "<span>Postal Code:</span><input id='tb_weather_postalCode' type='text' class='textEntry margin-left margin-right' maxlength='10' value='" + postalCode + "' style='width: 60px;' />";
        var refresh = "<a href='#' onclick='openWSE.SetPostalCode();return false;' class='img-refresh pad-all-sml margin-right-sml margin-bottom-sml float-right' title='Refresh weather'></a>";
        $('#Weather_Overlay_Position').html(weatherframe + "<div class='clear-space-two'></div><div id='weather-button-holder' class='overlay-header' style='height: 25px;'>" + refresh + postalCode + "</div>");
    }


    /* IFrame screens */
    function LoadIFrameContent(url, _this) {
        if ($("#iframe-container-helper").length > 0) {
            CloseIFrameContent();
            setTimeout(function () {
                LoadIFrameContent(url, _this);
            }, openWSE_Config.animationSpeed);
        }
        else {
            var fullUrl = "";
            var tempUrl = window.location.hash;
            if ((tempUrl.indexOf("#") == -1) && (window.location.href.charAt(window.location.href.length - 1) != "#")) {
                fullUrl = "#?";
            }
            else if (tempUrl != "") {
                fullUrl = "&";
            }
            else {
                fullUrl = "?";
            }

            fullUrl += "iframecontent=" + url; // + "&contentName=" + $.trim($(_this).text());

            window.location += fullUrl;
        }
    }
    function LoadIFrameContentHistory(url, name) {
        if ($("#iframe-container-helper").length > 0) {
            CloseIFrameContent();
            setTimeout(function () {
                LoadIFrameContentHistory(url, name);
            }, openWSE_Config.animationSpeed);
        }
        else {
            var iframeHeight = $(window).height() - ($("#always-visible").height() + $("#container-footer").height());
            if (!isExternal(url)) {
                url = openWSE.siteRoot() + url;
            }

            var iframe = "<iframe id='iframe-content-src' src='" + url + "' width='100%' frameborder='0' style='height: " + iframeHeight + "px;'></iframe>";
            var holder = "<div id='iframe-container-helper'>" + iframe + "<div class='loading-background-holder'></div></div>";
            var closeBtn = "<div id='iframe-container-close-btn'><a href='#' onclick='openWSE.CloseIFrameContent();return false;'>Close " + name + "</a></div>";
            $("#workspace-selector").hide();
            $("#top-main-bar-top").append(closeBtn);
            $("body").append(holder);
            $("#container").hide();
            $("#minimized-app-bar").hide();
            $("#iframe-container-helper").fadeIn(openWSE_Config.animationSpeed);

            document.getElementById("iframe-content-src").onload = function () {
                $(document).ready(function () {
                    setTimeout(function () {
                        $("#iframe-container-helper").find(".loading-background-holder").remove();
                    }, 150);
                });
            };

            $(".top-options li.a").removeClass("active");
            $(".top-options li.b").hide();
            cookie.del("top_menu");

            if ($("#always-visible").css("display") == "none") {
                $("#always-visible").show();
            }

            SetContainerTopPos(true);
        }
    }
    function CloseIFrameContent() {
        if ($("#always-visible").find(".top-options").css("display") == "none") {
            $("#always-visible").hide();
        }
        $("#container").show();
        $("#iframe-container-helper").html("");
        $("#iframe-container-helper").fadeOut(openWSE_Config.animationSpeed, function () {
            $("#iframe-container-helper").remove();
            $("#iframe-container-close-btn").remove();
            $("#workspace-selector").show();
            $("#minimized-app-bar").show();
            SetContainerTopPos(true);
        });

        try {
            var url = window.location.href;
            if (url.indexOf("?iframecontent=") != -1) {
                var loc = url.split("?iframecontent=");
                if (loc.length > 1) {
                    var fullLoc = "?iframecontent=" + loc[1];
                    url = url.replace(fullLoc, "");
                    window.location = url;
                }
            }
            else if (url.indexOf("&iframecontent=") != -1) {
                var loc = url.split("&iframecontent=");
                if (loc.length > 1) {
                    var fullLoc = "&iframecontent=" + loc[1];
                    url = url.replace(fullLoc, "");
                    window.location = url;
                }
            }
        }
        catch (evt) { }

        $(window).resize();
    }
    function isExternal(url) {
        var match = url.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
        if (typeof match[1] === "string" && match[1].length > 0 && match[1].toLowerCase() !== location.protocol) return true;
        if (typeof match[2] === "string" && match[2].length > 0 && match[2].replace(new RegExp(":(" + { "http:": 80, "https:": 443 }[location.protocol] + ")?$"), "") !== location.host) return true;
        return false;
    }


    /* Workspace Background Modal */
    function BackgroundSelector() {
        try {
            if ($("#background_selector_overlay").length > 0) {
                $("#background_selector_overlay").remove();
            }

            LoadingMessage1("Loading Backgrounds");
            $.ajax({
                url: openWSE.siteRoot() + "WebServices/AcctSettings.asmx/GetServerImageList",
                type: "POST",
                data: '{ "_workspace": "' + Getworkspace() + '" }',
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    var modal = "<div style='text-align: left'><small><b class='pad-right-sml'>Note:</b>All backgrounds will repeat on the workspace. Your connection speed will slow down with the larger sized images. Each image has the size details when you hover over them. Solid color backgrounds will be the quickest if you have a slower internet.</small></div>";
                    modal += "<div class='clear' style='height: 20px;'></div><div class='float-left'><input id='tb_imageurl' type='text' value='Link to image' class='textEntry' onfocus='if(this.value==\"Link to image\")this.value=\"\"' onblur='if(this.value==\"\")this.value=\"Link to image\"' style='width:355px;'>";
                    modal += "<input id='btn_urlupdate' type='button' value='Update Url' class='input-buttons margin-left' onclick='openWSE.updateBackgroundURL()' /><br /><div class='float-left'>Copy and paste any link that contains an image.</div></div>";
                    modal += "<a href='#' class='sb-links float-right' onclick='openWSE.ClearBackground();return false;'>Clear Background</a>";
                    modal += "<div class='clear' style='height: 30px;'></div>";
                    modal += "<div class='modal-inner-scroll'>" + data.d + "</div>";
                    $("#background-selector-holder").html(modal);
                    GetURLImage();
                    LoadModalWindow(true, "BackgroundSelector-element", "Select a new background");
                    RemoveUpdateModal();
                }
            });
        }
        catch (evt) { RemoveUpdateModal(); }
    }
    function ClearBackground() {
        $.ajax({
            url: openWSE.siteRoot() + "WebServices/AcctSettings.asmx/SaveNewBackground",
            type: "POST",
            data: '{ "_workspace": "' + Getworkspace() + '","_img": "' + "" + '" }',
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if ($("#app_title_bg").length == 0) {
                    $("#maincontent_overflow").css("background", "");
                    if (!$("#maincontent_overflow").hasClass("maincontent_overflow-main-bg")) {
                        $("#maincontent_overflow").addClass("maincontent_overflow-main-bg");
                    }
                }
                else if ($(".workspace-backgrounds-fixed").length > 0) {
                    $("#MainContent_bg_" + Getworkspace()).css("background", "#EFEFEF url('" + openWSE.siteRoot() + "App_Themes/" + openWSE_Config.siteTheme + "/Body/default-bg.jpg') repeat top left");
                }
                else {
                    $("#app_title_bg").css("background", "#EFEFEF url('" + openWSE.siteRoot() + "App_Themes/" + openWSE_Config.siteTheme + "/Body/default-bg.jpg') top left repeat");
                }
                $(".image-selector-active").each(function (index) {
                    $(this).removeClass("image-selector-active");
                    $(this).addClass("image-selector");
                });
            }
        });
    }
    function GetURLImage() {
        $.ajax({
            url: openWSE.siteRoot() + "WebServices/AcctSettings.asmx/GetURLImage",
            type: "POST",
            data: '{ "_workspace": "' + Getworkspace() + '" }',
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data.d != "") {
                    $("#tb_imageurl").val(data.d);
                }
            }
        });
    }
    function CloseBackgroundSelector() {
        $("#background_selector_overlay").fadeOut(openWSE_Config.animationSpeed, function () {
            $("#background_selector_overlay").remove();
        });
    }
    function updateBackgroundURL() {
        var img = $("#background-selector-holder").find("#tb_imageurl").val();
        if (img != "Link to image") {
            $.ajax({
                url: openWSE.siteRoot() + "WebServices/AcctSettings.asmx/SaveNewBackground",
                type: "POST",
                data: '{ "_workspace": "' + Getworkspace() + '","_img": "' + img + '" }',
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (data.d != "") {
                        if ($("#app_title_bg").length == 0) {
                            if ($("#maincontent_overflow").hasClass("maincontent_overflow-main-bg")) {
                                $("#maincontent_overflow").removeClass("maincontent_overflow-main-bg");
                            }
                            $("#maincontent_overflow").css("background-image", "url('" + data.d + "')");
                            $("#maincontent_overflow").css("background-color", "#EFEFEF");
                            $("#maincontent_overflow").css("background-position", "top left");
                            $("#maincontent_overflow").css("background-repeat", "repeat repeat");
                        }
                        else if ($(".workspace-backgrounds-fixed").length > 0) {
                            $("#MainContent_bg_" + Getworkspace()).css("background", "#EFEFEF url('" + data.d + "') repeat top left");
                        }
                        else {
                            $("#app_title_bg").css("background", "#EFEFEF url('" + data.d + "') top left repeat");
                        }
                        $(".image-selector-active").each(function (index) {
                            $(this).removeClass("image-selector-active");
                            $(this).addClass("image-selector");
                        });
                    }
                }
            });
        }
    }
    $(document.body).on("click", ".image-selector", function () {
        var $this = $(this);
        var img = $(this).find("img").attr("src");
        LoadingMessage1("Saving Background");
        $.ajax({
            url: openWSE.siteRoot() + "WebServices/AcctSettings.asmx/SaveNewBackground",
            type: "POST",
            data: '{ "_workspace": "' + Getworkspace() + '","_img": "' + img + '" }',
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data.d != "") {
                    if ($("#app_title_bg").length > 0) {
                        $("#app_title_bg").css("background-image", "url('" + data.d + "')");
                        $("#app_title_bg").css("background-color", "#EFEFEF");
                        $("#app_title_bg").css("background-position", "top left");
                        $("#app_title_bg").css("background-repeat", "repeat repeat");
                    }
                    else if ($("#workspace_holder").length > 0) {
                        if ($(".workspace-backgrounds-fixed").length > 0) {
                            $("#MainContent_bg_" + Getworkspace()).css("background", "#EFEFEF url('" + data.d + "') repeat top left");
                        }
                        else {
                            if ($("#maincontent_overflow").hasClass("maincontent_overflow-main-bg")) {
                                $("#maincontent_overflow").removeClass("maincontent_overflow-main-bg");
                            }
                            $("#maincontent_overflow").css("background-image", "url('" + data.d + "')");
                            $("#maincontent_overflow").css("background-color", "#EFEFEF");
                            $("#maincontent_overflow").css("background-position", "top left");
                            $("#maincontent_overflow").css("background-repeat", "repeat repeat");
                        }
                    }

                    $(".image-selector-active").each(function (index) {
                        $(this).removeClass("image-selector-active");
                        $(this).addClass("image-selector");
                    });
                    $this.addClass("image-selector-active");
                }
                openWSE.RemoveUpdateModal();
            }
        });
    });


    jQuery.fn.outerHTML = function (s) {
        return s ? this.before(s).remove() : jQuery("<p>").append(this.eq(0).clone()).html();
    };


    /* Workspace Selector Functions */
    function HideTasks(item) {
        $(item).find(".app-main, .app-main-nobg").each(function (index) {
            var id = $(this).attr("id");

            if ($("#minimized-app-bar").find("#" + id + "-min-bar").length != 0) {
                if ($("#minimized-app-bar").find("#" + id + "-min-bar").css("display") != "none") {
                    $("#minimized-app-bar").find("#" + id + "-min-bar").hide();
                }
            }
        });
    }
    function ShowTasks(item) {
        $(item).find(".app-main, .app-main-nobg").each(function (index) {
            var id = $(this).attr("id");

            if ($("#minimized-app-bar").find("#" + id + "-min-bar").length != 0) {
                if ($("#minimized-app-bar").find("#" + id + "-min-bar").css("display") == "none") {
                    $("#minimized-app-bar").find("#" + id + "-min-bar").show();
                }
            }
        });
        $("#minimized-app-bar").fadeIn(openWSE_Config.animationSpeed);
    }
    function LoadCurrentWorkspace(workspace) {
        SetWorkspaceNumber(workspace);
        id = "#MainContent_workspace_" + workspace;
        ResizeAllAppBody(id);

        $(id).css({
            visibility: "visible",
            opacity: 1.0,
            filter: "alpha(opacity=100)"
        });

        $('#workspace_holder .workspace-holder').each(function (index) {
            if ($(this).css("visibility") != "visible") {
                var id = $(this).attr("id");
                MoveOffScreen("#" + id);
            }
        });
    }
    function Getworkspace() {
        var $this = $('#workspace_holder').find(".workspace-holder");
        var len = $this.length;
        for (var i = 0; i < len; i++) {
            if ($this.eq(i).css("visibility") == "visible") {
                var id = $this.eq(i).attr("id");
                return "workspace_" + id.substring(id.lastIndexOf("_") + 1);
            }
        }
        return "workspace_1";
    }
    $(document.body).on("click", "#ddl_WorkspaceSelector", function (e) {
        var $selector = $(this).find(".dropdown-db-selector");

        if ($selector.length > 0) {
            if (e.target.className.indexOf("workspace-selection-item") == -1) {
                $selector.css("min-width", $("#ddl_WorkspaceSelector").outerWidth());

                if ($selector.css("display") != "block") {
                    $selector.css("top", $("#always-visible").outerHeight());
                    $selector.find(".workspace-selection-item").show();

                    var currentWorkspacenum = $(".selected-workspace").html().replace("Workspace ", "");
                    for (var i = 0; i < $selector.find(".workspace-selection-item").length; i++) {
                        var $this = $selector.find(".workspace-selection-item").eq(i);
                        if ($this.html().replace("Workspace ", "") == currentWorkspacenum) {
                            $this.addClass("font-bold");
                        }
                        else {
                            $this.removeClass("font-bold");
                        }
                    }

                    if (openWSE_Config.hoverPreviewWorkspace) {
                        $(".workspace-selection-item").hover(
                            function () {
                                var oldid = "#MainContent_" + openWSE.Getworkspace();
                                var newid = "#MainContent_workspace_" + $(this).html().replace("Workspace ", "");
                                openWSE.HoverWorkspacePreview(oldid, newid);
                            },
                            function () {
                                if ($selector.find("ul").css("display") == "block") {
                                    var oldid = "#MainContent_workspace_" + $(this).html().replace("Workspace ", "");
                                    var newid = "#MainContent_workspace_" + $(".selected-workspace").html().replace("Workspace ", "");
                                    openWSE.HoverWorkspacePreview(oldid, newid);
                                }
                            }
                        );
                    }

                    $("#ddl_WorkspaceSelector").addClass("active");
                    $selector.slideDown(openWSE_Config.animationSpeed);
                }
                else {
                    openWSE.RemoveWorkspaceSelectorActive();
                }
            }
        }
    });
    $(document.body).on("click", ".workspace-selection-item", function () {
        openWSE.RemoveWorkspaceSelectorActive();

        var currentWorkspacenum = $(".selected-workspace").html().replace("Workspace ", "");
        var workspacenum = $(this).html().replace("Workspace ", "");

        if (currentWorkspacenum != workspacenum) {
            var id = "#MainContent_workspace_" + workspacenum;
            openWSE.SetWorkspaceNumber(workspacenum);

            if (!openWSE_Config.hoverPreviewWorkspace) {
                var oldid = "#MainContent_workspace_" + currentWorkspacenum;
                var newid = "#MainContent_workspace_" + workspacenum;
                openWSE.HoverWorkspacePreview(oldid, newid);
            }

            $.ajax({
                url: saveHandler + "/App_CurrentWorkspace",
                type: "POST",
                data: '{ "workspace": "' + workspacenum + '","workspaceMode": "' + openWSE_Config.workspaceMode + '" }',
                contentType: "application/json; charset=utf-8"
            });
        }
    });
    function HoverWorkspacePreview(oldid, newid) {
        MoveOffScreen(oldid);
        MoveOnScreen_WorkspaceOnly(newid);

        if (!openWSE_Config.taskBarShowAll) {
            HideTasks(oldid);
            ShowTasks(newid);
        }

        $(oldid).css({
            opacity: 0.0,
            filter: "alpha(opacity=0)"
        });

        if (openWSE_Config.animationSpeed > 0) {
            $(newid).fadeTo(openWSE_Config.animationSpeed, 1.0);
        }
        else {
            $(newid).css({
                opacity: 1.0,
                filter: "alpha(opacity=100)"
            });
        }

        ResizeAllAppBody(newid);
    }
    function SetWorkspaceNumber(num) {
        $("#ddl_WorkspaceSelector").find(".selected-workspace").html("Workspace " + num);
    }
    function RemoveWorkspaceSelectorActive() {
        $("#ddl_WorkspaceSelector").removeClass("active");
        $("#ddl_WorkspaceSelector").find(".dropdown-db-selector").hide();
    }


    /* Workspace Auto Rotate */
    function AutoRotateWorkspace(interval, workspace, screens, autoRefresh) {
        setTimeout(function () {
            if (workspace == screens) {
                workspace = 1;
            }
            else {
                workspace++;
            }

            var id = "#MainContent_workspace_" + workspace;
            SetWorkspaceNumber(workspace);

            var isOn_fadeOut = false;
            var isOn_fadeIn = false;
            $('#workspace_holder .workspace-holder').each(function () {
                if ($(this).css("visibility") == "visible") {
                    if (!openWSE_Config.taskBarShowAll) {
                        $("#minimized-app-bar").fadeOut(openWSE_Config.animationSpeed);
                    }
                    $(this).fadeTo(openWSE_Config.animationSpeed, 0.0, function () {
                        if (!isOn_fadeOut) {
                            isOn_fadeOut = true;

                            // Move off screen
                            var oldid = $(this).attr("id");
                            MoveOffScreen("#" + oldid);

                            // Move onto screen
                            MoveOnScreen_WorkspaceOnly(id);
                            if (!openWSE_Config.taskBarShowAll) {
                                HideTasks("#" + oldid);
                                ShowTasks(id);
                            }

                            $(id).find(".app-main, .app-main-nobg").each(function (index) {
                                if (autoRefresh) {
                                    AutoUpdateOnRotate(this);
                                }
                            });

                            ResizeAllAppBody(id);

                            $(id).fadeTo(openWSE_Config.animationSpeed, 1.0, function () {
                                if (!isOn_fadeIn) {
                                    isOn_fadeIn = true;
                                }
                            });

                            return false;
                        }
                    });
                }
            });

            AutoRotateWorkspace(interval, workspace, screens, autoRefresh);
        }, (interval * 1000));
    }
    function AutoUpdateOnRotate(_this) {
        var name = $(_this).find(".app-title").text();
        var $_id = $(_this);
        var id = $_id.attr("id");

        if ($_id.css("display") == "block") {
            ResizeAppBody("#" + id);
            $(".app-main, .app-main-nobg").css("z-index", "1000");
            $_id.css("z-index", "3000");

            if ($_id.find(".iFrame-apps").length > 0) {
                var _content = $get(id + " .iFrame-apps");
                if (_content.src != null) {
                    _content.src = _content.src;
                }
            }
            else {
                $("#hf_ReloadApp").val(id);
                __doPostBack('hf_ReloadApp', '');
            }
        }
    }


    /* Build and Load App Functions */
    function AppsSortUnlocked(canSave) {
        canSortMyAppOverlay = true;
        if (canSave) {
            canSaveSort = true;
            canSaveSortedMyAppOverlay = true;
        }

        $('#pnl_icons').sortable({
            axis: 'y',
            cancel: '.app-icon-category-list, #Category-Back, .app-popup',
            containment: '#pnl_icons',
            opacity: 0.6,
            scrollSensitivity: 40,
            scrollSpeed: 40,
            start: function (event, ui) {
                $(document).tooltip({ disabled: true });
            },
            stop: function (event, ui) {
                var listorder = '';
                $('.app-icon').each(function () {
                    var temp = $(this).attr('id').replace("-pnl-icons", "");
                    if (temp != '') {
                        listorder += (temp + ',');
                    }
                });

                if (canSaveSort) {
                    $.ajax({
                        url: saveHandler + '/App_UpdateIcons',
                        type: 'POST', data: '{ "appList": "' + escape(listorder) + '" }',
                        contentType: 'application/json; charset=utf-8'
                    });
                }

                $(document).tooltip({ disabled: false });
            }
        });
        $('#pnl_icons').disableSelection();
    }
    function CreateSOApp(id, title, content, x, y, width, height, min, max) {
        var $_id = $("#" + id);
        if ((content != null) && (content != "")) {
            $_id.find(".app-title").text(title);
            if (openWSE.ConvertBitToBoolean(max)) {
                $_id.addClass("app-maximized");
                $_id.find(".maximize-button-app").addClass("active");
            }

            if (openWSE.ConvertBitToBoolean(min)) {
                BuildAppMinIcon(id, title, x, y);
                MoveOffScreen("#" + id);
                if (width != "") {
                    $_id.css("width", width);
                }
                if (height != "") {
                    $_id.css("height", height);
                }
            }
            else {
                $_id.css({
                    visibility: "visible",
                    display: "block",
                    zIndex: 3000
                });

                if (!openWSE.ConvertBitToBoolean(max)) {
                    $_id.removeClass("app-maximized");
                    $_id.find(".maximize-button-app").removeClass("active");
                    if (width != "") {
                        $_id.css("width", width);
                    }
                    if (height != "") {
                        $_id.css("height", height);
                    }
                    if (parseInt(y) < 0) {
                        y = "0";
                    }
                    if (parseInt(x) < 0) {
                        x = "0";
                    }
                    $_id.css({
                        left: x,
                        top: y
                    });
                }
            }

            if (content.indexOf(".ascx") == -1) {
                if (content.indexOf("ChatClient/ChatWindow.html") != -1) {
                    $_id.find(".app-body").html("<iframe class='iFrame-apps' src='" + openWSE.siteRoot() + content + "' width='100%' frameborder='0'></iframe>");
                    $_id.find("iframe").one('load', (function () {
                        $_id.find(".loading-background-holder").each(function () {
                            $(this).remove();
                        });
                    }));

                    ResizeAppBody("#" + id);
                }
                else {
                    $_id.find(".app-body").load(openWSE.siteRoot() + "Apps/" + content, function () {
                        ResizeAppBody("#" + id);

                        if ($_id.find(".app-body").find("iframe").length > 0) {
                            if ($_id.find(".app-body").find(".loading-background-holder").length <= 0) {
                                $_id.find(".app-body").append(loadingMessage);
                            }

                            $_id.find(".app-body").find("iframe").one('load', (function () {
                                $_id.find(".app-body").find(".loading-background-holder").each(function () {
                                    $(this).remove();
                                });
                            }));
                        }
                    });
                }
            }

            SetAppIconActive(id);
            var workspaceId = $_id.parent().attr("id");
            if ((workspaceId != undefined) && (workspaceId != null) && (workspaceId != "")) {
                AddworkspaceAppNum(workspaceId, id);
            }
        }
    }
    function BuildAppMinIcon(id, title, x, y) {
        var $_id = $("#" + id);
        if ($_id.length > 0) {
            var $imgsrc = $_id.find(".app-header-icon");
            var $titlesrc = $_id.find(".app-title");
            var needIconOn = false;
            var needToolTip = false;

            var chatUsername = "";
            var classMinBar = "app-min-bar";
            if (id.replace(/#/gi, "").indexOf("app-ChatClient-") != -1) {
                classMinBar = "app-min-bar chat-modal";
                chatUsername = " chat-username='" + $_id.attr("chat-username") + "'";
            }

            var str = "<div id='" + id + "-min-bar' class='" + classMinBar + "'" + chatUsername + "><input type='hidden' id='" + id + "-min-bar-x' value='" + x + "' />";
            str += "<input type='hidden' id='" + id + "-min-bar-y' value='" + y + "' />";

            if (((!$imgsrc.hasClass("display-none")) && ($imgsrc.length != 0)) && (!$titlesrc.hasClass("display-none"))) {
                str += $imgsrc.outerHTML();
                if ($imgsrc.css("display") == "none") {
                    needIconOn = true;
                }

                str += "<span class='app-title pad-right'>" + title + "</span>";
                str += "<a href='" + id + "' class='exit-button-app-min'></a></div>";
            }
            else if ((($imgsrc.hasClass("display-none")) || ($imgsrc.length == 0)) && ($titlesrc.hasClass("display-none"))) {
                str += "<span class='app-title pad-right'>" + title + "</span>";
                str += "<a href='" + id + "' class='exit-button-app-min'></a></div>";
            }
            else {
                var imgIsOn = false;
                var titleIsOn = true;
                if (!$imgsrc.hasClass("display-none")) {
                    str += $imgsrc.outerHTML();
                    imgIsOn = true;
                    if ($imgsrc.css("display") == "none") {
                        needIconOn = true;
                    }
                }

                if (!$titlesrc.hasClass("display-none")) {
                    str += "<span class='app-title pad-right'>" + title + "</span>";
                }
                else {
                    str += "<span class='app-title pad-right display-none'>" + title + "</span>";
                    needToolTip = true;
                    titleIsOn = false;
                }

                var marginLeft_iconOnly = "";
                if ((imgIsOn) && (!titleIsOn)) {
                    marginLeft_iconOnly = " style='margin-left: 5px;'";
                }

                str += "<a href='" + id + "' class='exit-button-app-min'" + marginLeft_iconOnly + "></a></div>";
            }

            if ($("#" + id + "-min-bar").length == 0) {
                $("#minimized-app-bar").append(str);
            }

            if (needIconOn) {
                $("#" + id + "-min-bar").find(".app-header-icon").show();
            }

            if (needToolTip) {
                $("#" + id + "-min-bar").attr("title", title);
            }

            $_id.css({
                visibility: "hidden",
                display: "block"
            });
        }
    }
    function LoadApp(_this, workspace) {
        var name = $(_this).find(".app-icon-font").text();
        if (name == "") {
            name = $(_this).find(".app-title").text();
            if (name == "") {
                name = $(_this).find("span").text();
            }
        }

        var _appId = $(_this).attr("id");
        if ((_appId == undefined) || (_appId == null) || (_appId == "")) {
            _appId = $(_this).parent().attr("id");
        }

        if ((_appId != undefined) && (_appId != null) && (_appId != "")) {
            if (_appId.indexOf("-pnl-icons") != -1) {
                _appId = _appId.replace("-pnl-icons", "");
            }

            $.ajax({
                url: saveHandler + "/App_Open",
                type: "POST",
                data: '{ "appId": "' + _appId + '","name": "' + name + '","workspace": "' + workspace + '","width": "' + $("#" + _appId).width() + '","height": "' + $("#" + _appId).height() + '","workspaceMode": "' + openWSE_Config.workspaceMode + '" }',
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    var content = data.d;
                    if (content != "") {
                        var $_id = $("#" + _appId);

                        SetActiveApp(_appId);
                        MoveToCurrworkspace(workspace, _appId);
                        AddworkspaceAppNum(workspace, _appId);

                        var appWidth = $_id.width();
                        var appHeight = $_id.height();

                        if (($_id.css("display") != "block") || ($_id.css("visibility") != "visible")) {
                            if (_appId.indexOf("app-ChatClient-") != -1) {
                                var chatUser = $_id.attr("chat-username");
                                content = "ChatClient/ChatWindow.html?user=" + chatUser + "&displayVersion=workspace";
                            }

                            if ((($_id.css("left") == null) && ($_id.css("top") == null)) || (($_id.css("left") == "auto") && ($_id.css("top") == "auto"))) {
                                CreateSOApp(_appId, name, content, "50px", "50px", appWidth, appHeight, "1", "0");
                            }
                            else {
                                if (parseInt($_id.css("top")) < 0) {
                                    $_id.css("top", "50px");
                                }
                                if (parseInt($_id.css("left")) < 0) {
                                    $_id.css("left", "50px");
                                }
                                CreateSOApp(_appId, name, content, $_id.css("left"), $_id.css("top"), appWidth, appHeight, "1", "0");
                            }

                            $_id.css("display", "block");
                            $_id.css("visibility", "visible");
                            $_id.css("z-index", "3000");

                            if ($("#" + _appId + "-min-bar-x").length != 0) {
                                if ($_id.find(".loading-background-holder").length <= 0) {
                                    $_id.find(".app-body").append(loadingMessage);
                                }
                                if ((!$_id.hasClass("auto-full-page")) && (!$_id.hasClass("auto-full-page-min")) && (!$_id.hasClass("app-maximized")) && (!$_id.hasClass("app-maximized-min"))) {
                                    $_id.find(".maximize-button-app").removeClass("active");
                                    $_id.css("width", appWidth);
                                    $_id.css("height", appHeight);
                                    $_id.css("top", topBarHt);
                                }
                                else {
                                    SetAppMinToMax("#" + _appId);
                                    $_id.find(".maximize-button-app").addClass("active");
                                    $_id.css("top", "0px");
                                }

                                $_id.css({
                                    visibility: "visible",
                                    display: "block"
                                }).animate({
                                    opacity: 1.0,
                                    filter: "alpha(opacity=100)",
                                    left: $("#" + _appId + "-min-bar-x").val(),
                                    top: $("#" + _appId + "-min-bar-y").val()
                                }, openWSE_Config.animationSpeed);

                                $.ajax({
                                    url: saveHandler + "/App_Move",
                                    type: "POST",
                                    data: '{ "appId": "' + _appId + '","name": "' + name + '","x": "' + $("#" + _appId + "-min-bar-x").val() + '","y": "' + $("#" + _appId + "-min-bar-y").val() + '","width": "' + appWidth + '","height": "' + appHeight + '","workspace": "' + workspace + '","workspaceMode": "' + openWSE_Config.workspaceMode + '" }',
                                    contentType: "application/json; charset=utf-8"
                                });

                                $("#" + _appId + "-min-bar").remove();
                                ResizeAllAppBody("#" + $_id.attr("id"));
                            }
                            else {
                                $_id.css({
                                    top: topBarHt,
                                    visibility: "visible",
                                    display: "block"
                                }).fadeIn(openWSE_Config.animationSpeed);
                            }

                            if ($("#" + _appId + "-min-bar").length > 0) {
                                $("#" + _appId + "-min-bar").remove();
                            }

                            if (needpostback == 1) {
                                var hf_loadApp1 = document.getElementById("hf_loadApp1");
                                if (appsToLoad.length == 0) {
                                    appsToLoad[0] = _appId;
                                    hf_loadApp1.value = _appId;
                                    __doPostBack("hf_loadApp1", "");
                                }
                                else {
                                    appsToLoad[appsToLoad.length - 1] = _appId;
                                }
                            }
                            else if ((content.indexOf(".ascx") > 0) && (needpostback == 0)) {
                                $_id.find(".loading-background-holder").each(function () {
                                    $(this).remove();
                                });
                            }
                        }
                    }
                }
            });
        }
    }
    function LoadAppFromSiteTools(appId, name, workspace) {
        if ((appId != undefined) && (appId != null) && (appId != "")) {
            if (appId.indexOf("-pnl-icons") != -1) {
                appId = appId.replace("-pnl-icons", "");
            }

            $("#MessageActivationPopup").hide();
            $("#MessageActivationPopup").remove();

            LoadingMessage1("Loading. Please Wait...");
            cookie.set("active_app", appId, 30);

            $.ajax({
                url: saveHandler + "/App_Open_ChangeWorkspace",
                type: "POST",
                data: '{ "appId": "' + appId + '","name": "' + name + '","workspace": "' + workspace + '","width": "' + $("#" + appId).width() + '","height": "' + $("#" + appId).height() + '","workspaceMode": "' + openWSE_Config.workspaceMode + '" }',
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    window.location = openWSE.siteRoot() + "Workspace.aspx";
                }
            });
        }
    }
    function DetermineNeedPostBack(id, npb) {
        if ($('#' + id).css('display') == 'none') {
            needpostback = npb;
        }
    }
    function WatchForLoad(app) {
        var $app = $('#' + app);
        $app.find("iframe").one('load', (function () {
            $app.find(".loading-background-holder").each(function () {
                $(this).remove();
            });
        }));
    }
    function LoadUserControl(id) {
        var hf_loadApp1 = document.getElementById("hf_loadApp1");
        for (var i = 0; i < appsToLoad.length; i++) {
            if (appsToLoad[i] == id) {
                appsToLoad.splice(i, 1);
            }
        }

        var a = "#MainContent_" + id.replace(/-/gi, "_") + "_advPanel";
        $(a).html("");
        if ($('.move-holder').find('.main-div-app-bg').length > 0) {
            $(a).hide().append($('.move-holder').find('.main-div-app-bg')).fadeIn(openWSE_Config.animationSpeed);
        }

        if ($('.move-holder').find('.outside-main-app-div').length > 0) {
            $('.move-holder').find('.outside-main-app-div').each(function () {
                $(a).hide().append($(this)).show();
            });
        }

        var $app = $('#' + id.replace("_", "-"));

        $app.find(".loading-background-holder").each(function () {
            $(this).remove();
        });

        if (appsToLoad.length > 0) {
            hf_loadApp1.value = appsToLoad[0];
            __doPostBack("hf_loadApp1", "");
        }

        needpostback = 0;
    }


    /* Fixes, Customizations, and Position */
    function ResizeAllAppBody(ele) {
        $(ele).find(".app-main, .app-main-nobg, .app-main-external").each(function (index) {
            ResizeAppBody(this);
        });
    }
    function ResizeAppBody(ele) {
        var $this = $(ele);
        if ($this.length > 0) {
            var appHt = $this.outerHeight();

            var $appHead = $this.find(".app-head");
            var headerHt = 0;
            if ($appHead.length > 0 && $appHead.css("display") != "none") {
                headerHt = $appHead.outerHeight();
            }

            var bodyHt = appHt - headerHt;
            $this.find(".app-body").css("height", bodyHt)

            if ($this.find(".iFrame-apps").length > 0) {
                var adjustmentHt = 2;
                if ($this.find(".app-title-bg-color").length > 0) {
                    adjustmentHt = $this.find(".app-title-bg-color").outerHeight() + (adjustmentHt + 1);
                }

                $this.find(".iFrame-apps").css("height", bodyHt - adjustmentHt);
            }
        }
    }
    function ApplyOverlayFix(id) {
        var $_id = $(id);
        $wo = $_id.find(".app-overlay-fix");
        if ($wo.length == 0) {
            $wb = $_id.find(".app-body");
            if ($wb.length == 1) {
                $wb.append("<div class='app-overlay-fix'></div>");
            }
        }
    }
    function RemoveOverlayFix(_this) {
        $wo = $(_this).find(".app-overlay-fix");
        if ($wo.length == 1) {
            $wo.remove();
        }
    }
    function MoveOffScreen(id) {
        var $_id = $(id);

        var appHt = $_id.height();
        var bottomPos = $(window).height();
        var topPos = -(appHt + bottomPos);
        $_id.css({
            visibility: "hidden",
            top: topPos,
            bottom: bottomPos,
            zIndex: -1
        });

        SetAppMaxToMin(id);
    }
    function MoveOnScreen_WorkspaceOnly(id) {
        var $_id = $(id);
        $_id.css({
            visibility: "visible",
            top: 0,
            bottom: 0,
            zIndex: ""
        });
        SetAppMinToMax(id);
    }
    function MoveToCurrworkspace(workspace, app) {
        var $app = $('#' + app);
        SetAppMinToMax('#' + app);
        var currentworkspace = $app.parent().attr("id");
        var newworkspace = 'MainContent_' + workspace;
        if (currentworkspace != newworkspace) {
            var loadscreen = $app.find("iframe").length;
            if (loadscreen > 0) {
                if ($app.find(".loading-background-holder").length <= 0) {
                    $app.find(".app-body").append(loadingMessage);
                }

                WatchForLoad(app);
            }
            $('#' + newworkspace).prepend($app);
            AddworkspaceAppNum(workspace, app);
        }
    }
    function SetAppMaxToMin(id) {
        if (id.indexOf("app-") != -1) {
            var $app = $(id);
            if ($app.hasClass("app-maximized")) {
                $app.removeClass("app-maximized");
                $app.addClass("app-maximized-min");
            }

            if ($app.hasClass("auto-full-page")) {
                $app.removeClass("auto-full-page");
                $app.addClass("auto-full-page-min");
            }
        }
    }
    function SetAppMinToMax(id) {
        if (id.indexOf("app-") != -1) {
            var $app = $(id);
            if ($app.hasClass("app-maximized-min")) {
                $app.removeClass("app-maximized-min");
                $app.addClass("app-maximized");
            }

            if ($app.hasClass("auto-full-page-min")) {
                $app.removeClass("auto-full-page-min");
                $app.addClass("auto-full-page");
            }

            ResizeAppBody(id);
        }
    }
    function HoverOverAppMin(_this) {
        if (!previewHover) {
            previewHover = true;
            previewAppID = $(_this).attr('id').replace('-min-bar', '');
            var workspace = Getworkspace();
            var $this = $('#MainContent_' + workspace).find('#' + previewAppID);
            if ($this.length > 0) {
                previewxVal = $("#" + previewAppID).css("left");
                previewyVal = $("#" + previewAppID).css("top");

                var xVal = $("#" + previewAppID + "-min-bar-x").val();
                var yVal = $("#" + previewAppID + "-min-bar-y").val();

                if (xVal == null || xVal == "") {
                    xVal = p.left - $('#workspace-selector').width();
                }
                if (yVal == null || yVal == "") {
                    yVal = 0;
                }

                SetAppMinToMax('#' + previewAppID);
                $this.css('left', xVal);
                $this.css('top', yVal);
                $this.addClass('app-min-bar-preview');
                $this.fadeTo(openWSE_Config.animationSpeed, 0.65);
            }
        }
    }
    function HoverOutAppMin() {
        var $this = $('#' + previewAppID);
        if ($this.hasClass('app-min-bar-preview')) {
            $this.css("opacity", "0.0");
            $this.css("filter", "alpha(opacity=0)");
            $this.removeClass('app-min-bar-preview');
            SetAppMaxToMin('#' + previewAppID);
            $this.css('left', previewxVal);
            $this.css('top', previewyVal);
            previewAppID = '';
            previewxVal = '';
            previewyVal = '';
            previewHover = false;
        }
        else {
            var workspace = Getworkspace();
            var $this = $('#MainContent_' + workspace).find('#' + previewAppID);
            if ($this.length == 0) {
                previewAppID = '';
                previewxVal = '';
                previewyVal = '';
                previewHover = false;
            }
        }

    }
    function SetActiveApp(id) {
        if (openWSE.IsComplexWorkspaceMode()) {
            SetDeactiveApps(id);
            var $_id = $("#" + id);
            $_id.addClass("selected");
            $_id.css("z-index", "3000");
            cookie.set("active_app", id, "30");
        }
    }
    function SetDeactiveApps(id) {
        if (openWSE.IsComplexWorkspaceMode()) {
            $(".app-main, .app-main-nobg").css("z-index", "1000");
            $(".app-main, .app-main-nobg").removeClass("selected");
            $(".app-main, .app-main-nobg").each(function (index) {
                var $this = $(this);
                var _id = $this.attr("id");
                if ($this.css("display") == "block") {
                    if (_id != id) {
                        ApplyOverlayFix("#" + _id);
                    }
                    else if (_id == id) {
                        $this.find(".app-overlay-fix").remove();
                    }
                }
            });
        }
    }
    function SetDeactiveAll() {
        cookie.del("active_app");
        $(".app-main, .app-main-nobg").each(function (index) {
            var $this = $(this);
            if ($this.css("display") == "block") {
                ApplyOverlayFix("#" + $this.attr("id"));
            }
        });
    }


    /* Load App Cookies */
    function LoadActiveAppCookie() {
        if (openWSE.IsComplexWorkspaceMode()) {
            var id = cookie.get('active_app');
            if ((id != null) && (id != "") && (id != undefined)) {
                SetActiveApp(id);
            }
            else {
                SetDeactiveAll();
            }
        }
    }
    function LoadCategoryCookies() {
        var id = cookie.get('app_category_id');
        var category = cookie.get('app_category');
        if ((document.getElementById("Category-Back") != null) && (id != null) && (id != "") && (category != null) && (category != "")) {
            $(".app-icon-category-list").hide();
            $("#Category-Back").show();
            $("." + id).show();
            $("#Category-Back-Name").html(category);
            $("#Category-Back-Name-id").html(id);
        }
    }


    /* App Remote Load Functions */
    function StartRemoteLoad(id, hf_r, handler, updateAppId) {
        $.ajax({
            url: saveHandler + "/App_RemoteLoad",
            data: '{ "_Id": "' + escape(id) + '" }',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "POST",
            success: function (data) {
                try {
                    if (data.d != null) {
                        LoadRemotely(unescape(data.d[0]), unescape(data.d[1]), unescape(data.d[2]));
                    }
                }
                catch (evt) { }
                RemoveUpdateModal();
                autoupdate(hf_r, handler, updateAppId);
            },
            error: function (data) {
                RemoveUpdateModal();
                autoupdate(hf_r, handler, updateAppId);
            }
        });
    }
    function LoadRemotely(appId, options, npb) {
        if (options == "close") {
            var $this = $("#" + appId);
            if ($this.css("display") == "block") {
                if ($this.find(".exit-button-app").length > 0) {
                    $this.find(".exit-button-app").click();
                }
            }
        }
        else if (appId == "workspace-selector") {
            try {
                $(".workspace-selection-item").eq(parseInt(options) - 1).trigger("click");
            }
            catch (evt) { }
            var oldid = "#MainContent_" + Getworkspace();
            var newid = "#MainContent_workspace_" + options;
            SetWorkspaceNumber(options);
            HoverWorkspacePreview(oldid, newid);
        }
        else {
            var optArray = options.split(";");
            var workspace = "1";
            if (optArray[0] != "" && optArray[0] != "0") {
                workspace = optArray[0];
            }
            else {
                workspace = Getworkspace().replace("workspace_", "");
            }

            if (openWSE.ConvertBitToBoolean(npb)) {
                needpostback = 1;
            }
            else {
                needpostback = 0;
            }

            var $this = $("#" + appId + "-pnl-icons");

            var _posY = optArray[2].replace("px", "");
            var _posX = optArray[3].replace("px", "");
            var _width = optArray[4].replace("px", "");
            var _height = optArray[5].replace("px", "");

            if ($("#hf_appContainer").val() != "") {
                var _posY = parseInt(_posY);
                var _posX = parseInt(_posX);
                var _width = parseInt(_width);
                var _height = parseInt(_height);

                if (_posX + _width > $("#container").width()) {
                    _posX = Math.abs($("#container").width() - _width) - 2;
                }

                if (_posY + _height > $("#container").height()) {
                    _posY = Math.abs($("#container").height() - _height) - 2;
                }
            }

            if ($("#" + appId).css("display") == "block") {
                $("#" + appId).css({
                    top: _posY + "px",
                    left: _posX + "px"
                });
            }
            else {
                $("#" + appId).css({
                    top: "auto",
                    left: "auto"
                });
            }

            if ($("#" + appId).hasClass("ui-resizable")) {
                $("#" + appId).css({
                    width: _width + "px",
                    height: _height + "px"
                });
            }

            if ($("#" + appId).css("display") == "block") {
                var _this = $("#" + appId).find(".reload-button-app").parent();
                ReloadApp(_this);
            }

            LoadApp($this, "workspace_" + workspace);
            if ($this.hasClass("active") == false) {
                $this.addClass("active");
            }

            SetRemoteLoadingOptions(appId, workspace, optArray[1]);
        }
    }
    function SetRemoteLoadingOptions(appId, option1, option2) {
        var $this = $("#" + appId);
        if ($this.css("display") == "block") {
            option1 = option1.substring(option1.lastIndexOf("_") + 1);

            try {
                $(".workspace-selection-item").eq(parseInt(option1) - 1).trigger("click");
            }
            catch (evt) { }

            var oldid = "#MainContent_" + Getworkspace();
            var newid = "#MainContent_workspace_" + option1;
            SetWorkspaceNumber(option1);
            HoverWorkspacePreview(oldid, newid);

            MoveAppToworkspace(option1);

            if (option2 != "") {
                var propSaved = false;
                switch (option2) {
                    case "minimize":
                        if ($("#" + appId + "-min-bar").length == 0) {
                            if ($this.find(".minimize-button-app").length > 0) {
                                $this.find(".minimize-button-app").click();
                                propSaved = true;
                            }
                        }
                        else {
                            var minAgain = setInterval(function () {
                                if ($this.css("visibility") == "visible") {
                                    $this.find(".minimize-button-app").click();
                                    propSaved = true;
                                    clearInterval(minAgain);
                                }
                            }, 50);
                        }
                        break;
                    case "maximize":
                        if (($this.find(".maximize-button-app").length > 0) && (!$this.hasClass("app-maximized"))) {
                            $this.find(".maximize-button-app").click();
                            propSaved = true;
                        }
                        break;
                    case "normal":
                        if ($this.hasClass("app-maximized")) {
                            if ($this.find(".maximize-button-app").length > 0) {
                                $this.find(".maximize-button-app").click();
                                propSaved = true;
                            }
                        }
                        break;
                }

                if (!propSaved) {
                    setTimeout(function () {
                        $.ajax({
                            url: saveHandler + "/App_Position",
                            type: "POST",
                            data: '{ "appId": "' + $this.attr("id") + '","posX": "' + $this.css("left") + '","posY": "' + $this.css("top") + '","workspaceMode": "' + openWSE_Config.workspaceMode + '" }',
                            contentType: "application/json; charset=utf-8"
                        });
                    }, openWSE_Config.animationSpeed);
                }
            }
        }
        else {
            setTimeout(function () {
                SetRemoteLoadingOptions(appId, option1, option2);
            }, 100);
        }
    }


    /* App Functions */
    function MaximizeApp(id) {
        var workspace = Getworkspace();
        var name = $(this).find(".app-title").text();
        var $_id = $(id);

        var _leftPos = $_id.css("left");
        var _topPos = $_id.css("top");
        var _width = $_id.width();
        var _height = $_id.height();

        SetActiveApp($_id.attr("id"));
        if ($_id.hasClass("app-maximized")) {
            $_id.removeClass("app-maximized")
            $_id.find(".maximize-button-app").removeClass("active");
            ResizeAppBody(id);
            $.ajax({
                url: saveHandler + "/App_Maximize",
                type: "POST",
                data: '{ "appId": "' + id.replace(/#/gi, "") + '","name": "' + name + '","x": "' + _leftPos + '","y": "' + _topPos + '","width": "' + _width + '","height": "' + _height + '","workspace": "' + workspace + '","ismax": "0","workspaceMode": "' + openWSE_Config.workspaceMode + '" }',
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    maxBtn_InProgress = false;
                    ResizeAppBody(id);
                },
                error: function (data) {
                    maxBtn_InProgress = false;
                }
            });
        }
        else {
            $_id.addClass("app-maximized");
            $_id.find(".maximize-button-app").addClass("active");
            ResizeAppBody(id);
            $.ajax({
                url: saveHandler + "/App_Maximize",
                type: "POST",
                data: '{ "appId": "' + id.replace(/#/gi, "") + '","name": "' + name + '","x": "' + _leftPos + '","y": "' + _topPos + '","width": "' + _width + '","height": "' + _height + '","workspace": "' + workspace + '","ismax": "1","workspaceMode": "' + openWSE_Config.workspaceMode + '" }',
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    maxBtn_InProgress = false;
                    ResizeAppBody(id);
                },
                error: function (data) {
                    maxBtn_InProgress = false;
                }
            });
        }
    }
    function SetAppIconActive(id) {
        if ((id != null) && (id != undefined)) {
            if (id.indexOf("app-ChatClient-") == -1) {
                var spanactive = $(".app-icon").find("span").length;
                for (var index = 0; index < spanactive; index++) {
                    var temp = $(".app-icon").eq(index).attr("id");
                    if (temp == (id + "-pnl-icons")) {
                        if ($(".app-icon").eq(index).hasClass("active") == false) {
                            $(".app-icon").eq(index).addClass("active");
                            break;
                        }
                    }
                }
            }
            else {
                var chatUserName = $("#" + id).attr("chat-username");
                $(".ChatUserNotSelected[chat-username='" + chatUserName + "']").addClass("ChatUserSelected");
            }
        }
    }
    function AddworkspaceAppNum(workspace, app) {
        if (openWSE_Config.ShowWorkspaceNumApp && openWSE.IsComplexWorkspaceMode()) {
            if (app.indexOf("#") == -1) {
                app = "#" + app;
            }

            var $appIcon = $(app + "-pnl-icons");
            if ($appIcon.length > 0) {
                var numberworkspace = "";
                var ndID = app.replace("#", "") + "-pnl-icons-workspace-reminder";
                var ndClasses = "workspace-reminder font-no-bold " + ndID;
                var style = "display:block;";

                if ($appIcon.find(".app-icon-font").length > 0) {
                    var $appIconName = $appIcon.find(".app-icon-font");
                    if ($appIconName.css("display") == "none") {
                        style = "display:none;";
                    }
                }

                if ($("." + ndID).length > 0) {
                    $("." + ndID).remove();
                }

                var dn = workspace.substring(workspace.lastIndexOf("_") + 1);
                numberworkspace = "<span class='" + ndClasses + "' style='" + style + "'>" + dn + "</span>";

                if (numberworkspace != "") {
                    $appIcon.append(numberworkspace);
                }
            }
        }
    }
    function RemoveworkspaceAppNum(app) {
        if (openWSE.IsComplexWorkspaceMode()) {
            if (app.indexOf("#") == -1) {
                app = "#" + app;
            }

            var $appIcon = $(app + "-pnl-icons");
            if ($appIcon.length > 0) {
                var ndID = app.replace("#", "") + "-pnl-icons-workspace-reminder";
                if ($("." + ndID).length > 0) {
                    $("." + ndID).remove();
                }
            }
        }
    }
    function RemoveAppIconActive(id) {
        $(id).find(".maximize-button-app").removeClass("active");
        if (id.indexOf("app-ChatClient-") == -1) {
            var spanactive = $(".app-icon").find("span").length;
            for (var index = 0; index < spanactive; index++) {
                var temp = "#" + $(".app-icon").eq(index).attr("id");
                if (temp == (id + "-pnl-icons")) {
                    if ($(".app-icon").eq(index).hasClass("active") == true) {
                        $(".app-icon").eq(index).removeClass("active");
                        break;
                    }
                }
            }
        }
        else {
            var chatUserName = $("#" + id.replace("#", "")).attr("chat-username");
            chatClient.displayMessageNoti(chatUserName);

            var $userIcon = $(".ChatUserNotSelected[chat-username='" + chatUserName + "']");
            if ($userIcon.length > 0) {
                setTimeout(function () {
                    $userIcon.removeClass("ChatUserSelected");
                    $userIcon.removeClass("chatisNew");
                    if ($("#SteelmfgHeader").hasClass("chatHeaderNew") == true) {
                        $("#SteelmfgHeader").removeClass("chatHeaderNew");
                    }
                }, openWSE_Config.animationSpeed);
            }

            chatClient.notificationCleared = 1;
            document.title = chatClient.currTitle;
        }
    }
    function CategoryClick(id, category) {
        $(".app-icon-category-list").hide();
        $("#Category-Back").fadeIn(openWSE_Config.animationSpeed);
        if (openWSE_Config.animationSpeed == 0) {
            $("." + id).show();
        }
        else {
            $("." + id).show("slide", { direction: "right" }, openWSE_Config.animationSpeed);
        }
        $("#Category-Back-Name").html(category);
        $("#Category-Back-Name-id").html(id);
        cookie.set("app_category", category, "30");
        cookie.set("app_category_id", id, "30");
    }
    function ApplyAppDragResize() {
        if (openWSE.IsComplexWorkspaceMode()) {
            $(".app-main, .app-main-nobg").draggable({
                scroll: true,
                cancel: '.app-body, .exit-button-app, .minimize-button-app, .maximize-button-app, .options-button-app, .app-head-button-holder, .app-maximized, .auto-full-page',
                start: function (event, ui) {
                    var $this = $(this);

                    SetActiveApp($this.attr("id"));

                    $this.css("opacity", "0.6");
                    $this.css("filter", "alpha(opacity=60)");

                    // Apply an overlay over app
                    // This fixes the issues when dragging iframes
                    $(".app-main, .app-main-nobg").each(function (index) {
                        var $this = $(this);
                        if ($this.css("display") == "block") {
                            ApplyOverlayFix("#" + $this.attr("id"));
                        }
                    });
                    event.stopPropagation();
                }
            }).resizable({
                handles: "se, s, e, w",
                minWidth: 150,
                minHeight: 150,
                create: function (event, ui) {
                    var $this = $(this);

                    if ($this.hasClass('no-resize')) {
                        var idr = $this.attr("id");

                        if (($this.hasClass('app-main')) && (!$this.hasClass('auto-full-page')) && (!$this.hasClass('auto-full-page-min'))) {
                            $get(idr).className = "app-main ui-draggable";
                        }
                        else if (($this.hasClass('app-main')) && (($this.hasClass('auto-full-page')) || ($this.hasClass('auto-full-page-min')))) {
                            if ($this.hasClass('auto-full-page-min')) {
                                $get(idr).className = "app-main auto-full-page-min ui-draggable";
                            }
                            else {
                                $get(idr).className = "app-main auto-full-page ui-draggable";
                            }
                        }
                        else if (($this.hasClass('app-main-nobg')) && (!$this.hasClass('auto-full-page')) && (!$this.hasClass('auto-full-page-min'))) {
                            $get(idr).className = "app-main-nobg ui-draggable";
                        }
                        else {
                            $get(idr).className = "app-main-nobg auto-full-page ui-draggable";
                        }
                        $this.find(".ui-resizable-handle").remove();
                    }
                }
            });

            if ($("#hf_appContainer").val() != "") {
                $(".app-main, .app-main-nobg").draggable("option", "containment", $("#hf_appContainer").val());
                $(".app-main, .app-main-nobg").resizable("option", "containment", "parent");
            }

            $(".app-main, .app-main-nobg").on("dragstop", function (event, ui) {
                var $this = $(this);

                $this.css("opacity", "1.0");
                $this.css("filter", "alpha(opacity=100)");
                if (this.offsetTop < 0) {
                    $this.animate({
                        top: 0
                    }, openWSE_Config.animationSpeed, function () { $this.css("top", "0"); });
                }
                if (this.offsetLeft < 0) {
                    $this.animate({
                        left: 0
                    }, openWSE_Config.animationSpeed, function () { $this.css("left", "0"); });
                }
                var name = $this.find(".app-title").text();
                var workspace = Getworkspace();

                var width = $this.width();
                var height = $this.height();

                RemoveOverlayFix(this);

                $.ajax({
                    url: saveHandler + "/App_Move",
                    type: "POST",
                    data: '{ "appId": "' + $this.attr("id") + '","name": "' + name + '","x": "' + $this.css("left") + '","y": "' + $this.css("top") + '","width": "' + width + '","height": "' + height + '","workspace": "' + workspace + '","workspaceMode": "' + openWSE_Config.workspaceMode + '" }',
                    contentType: "application/json; charset=utf-8"
                });
            });

            $(".app-main, .app-main-nobg").on("resizestart", function (event, ui) {
                if ($(this).hasClass("app-maximized")) {
                    $(this).removeClass("app-maximized");
                    var $maxBtn = $(this).find(".maximize-button-app");
                    if ($maxBtn.length > 0) {
                        $maxBtn.removeClass("active");
                    }
                }

                SetActiveApp($(this).attr("id"));

                // Apply an overlay over app
                // This fixes the issues when dragging iframes
                $(".app-main, .app-main-nobg").each(function (index) {
                    var $this = $(this);
                    if ($this.css("display") == "block") {
                        ApplyOverlayFix("#" + $this.attr("id"));
                    }
                });

                event.stopPropagation();
            });

            $(".app-main, .app-main-nobg").on("resize", function (event, ui) {
                if (ui != null) {
                    var $this = $(this);

                    if (!$this.hasClass('no-resize')) {

                        var w = ui.size.width;
                        var minw = parseInt($this.css("min-width"));
                        if (w < minw) {
                            w = minw;
                        }

                        var h = ui.size.height;
                        var minh = parseInt($this.css("min-height"));
                        if (h < minh) {
                            h = minh;
                        }

                        $this.css({
                            'width': w,
                            'height': h
                        });


                        ResizeAppBody("#" + $this.attr("id"));
                        previousWidth = $this.height();
                    }
                }
            });

            $(".app-main, .app-main-nobg").on("resizestop", function (event, ui) {
                var $this = $(this);

                if (!$this.hasClass('no-resize')) {
                    ResizeAppBody("#" + $this.attr("id"));
                    previousWidth = 0;

                    RemoveOverlayFix(this);

                    $.ajax({
                        url: saveHandler + "/App_Resize",
                        type: "POST",
                        data: '{ "appId": "' + $this.attr("id") + '","width": "' + ui.size.width + '","height": "' + ui.size.height + '","workspaceMode": "' + openWSE_Config.workspaceMode + '" }',
                        contentType: "application/json; charset=utf-8"
                    });
                }
            });
        }
    }
    function ReloadApp(_this) {
        var name = $(_this).closest(".app-head-button-holder").parent().find(".app-title").text();
        var $_id = $(_this).closest(".app-head-button-holder").parent();
        var id = $_id.attr("id");

        ResizeAppBody("#" + id);
        $(".app-main, .app-main-nobg").css("z-index", "1000");
        $_id.css("z-index", "3000");

        var $_idOptions = $_id.find(".options-button-app");
        var $_parent = $_idOptions.parent();
        $_idOptions.removeClass("active");
        $_parent.find(".app-popup-inner-app").hide();

        if ($_id.find(".iFrame-apps").length > 0) {
            var _content = $get(id + " .iFrame-apps");
            if (_content.src != null) {
                if ($_id.find(".app-body").find("div").html() == null) {
                    if ($_id.find(".app-body").find(".loading-background-holder").length <= 0) {
                        $_id.find(".app-body").append(loadingMessage);
                    }
                    $_id.find(".iFrame-apps").one('load', (function () {
                        $_id.find(".app-body").find(".loading-background-holder").each(function () {
                            $(this).remove();
                        });
                    }));
                }
                else {
                    if ($_id.find(".app-body").find("div").find(".loading-background-holder").length <= 0) {
                        $_id.find(".app-body").find("div").append(loadingMessage);
                    }

                    $_id.find(".iFrame-apps").one('load', (function () {
                        $_id.find(".app-body").find("div").find(".loading-background-holder").each(function () {
                            $(this).remove();
                        });
                    }));
                }

                _content.src = _content.src;
            }
        }
        else {
            if ($_id.find(".app-body").find(".loading-background-holder").length <= 0) {
                $_id.find(".app-body").append(loadingMessage);
            }
            $("#hf_ReloadApp").val(id);
            __doPostBack('hf_ReloadApp', '');
        }
    }
    function AboutApp(_this) {
        var $_id = $(_this).closest(".app-head-button-holder").parent();
        var appId = $_id.attr("id");
        $("#hf_aboutstatsapp").val("about;" + appId);

        var $_idOptions = $_id.find(".options-button-app");
        var $_parent = $_idOptions.parent();
        $_idOptions.removeClass("active");
        $_parent.find(".app-popup-inner-app").hide();

        $("#MainContent_pnl_aboutHolder").html("");

        LoadingMessage1("Loading. Please Wait...");
        __doPostBack("hf_aboutstatsapp", "");
    }
    function UninstallApp(appId) {
        openWSE.ConfirmWindow("Are you sure you want to remove this app?",
          function () {
              $("#hf_aboutstatsapp").val("uninstall;" + appId);
              LoadingMessage1('Removing App');
              __doPostBack("hf_aboutstatsapp", "");
          }, null);
    }
    function AppStats(_this) {
        var $_id = $(_this).closest(".app-head-button-holder").parent();
        var appId = $_id.attr("id");
        if ((appId == "") || (appId == null) || (appId == undefined)) {
            appId = _this;
        }

        $("#hf_aboutstatsapp").val("stats;" + appId);

        var $_idOptions = $_id.find(".options-button-app");
        var $_parent = $_idOptions.parent();
        $_idOptions.removeClass("active");
        $_parent.find(".app-popup-inner-app").hide();

        LoadingMessage1("Loading. Please Wait...");
        __doPostBack("hf_aboutstatsapp", "");
    }
    function NavigationBtns(_this, mode) {
        var $_id = $(_this).closest(".app-head-button-holder").parent();
        var $_iframe = $_id.find("iframe");
        if ($_iframe.length > 0) {
            var iframe = $_iframe[0];
            var iframewindow = iframe.contentWindow ? iframe.contentWindow : iframe.contentDocument.defaultView;
            try {
                if (iframewindow.history.length > 0) {
                    if (mode == "back") {
                        iframewindow.history.back();
                    }
                    else {
                        iframewindow.history.forward();
                    }
                }
            }
            catch (evt) { }
        }
    }
    function PopOutFrame(_this, url) {
        var $_id = $(_this).closest(".app-head-button-holder").parent();

        var _width = 315;
        var _height = 425;

        if ($_id.length > 0) {
            var name = $_id.find(".app-title").text();

            if ($_id.attr("id") == "app-appinstaller") {
                $("#app-installer-icon").removeClass("active");
            }

            _width = $_id.width();
            _height = $_id.height();
        }

        $_id.fadeOut(openWSE_Config.animationSpeed, function () {
            if ($_id.hasClass("app-maximized")) {
                $_id.removeClass("app-maximized");
            }

            RemoveworkspaceAppNum("#" + $_id.attr("id"));
            RemoveAppIconActive("#" + $_id.attr("id"));

            var canclose = 1;
            var hfcanclose = document.getElementById("hf_" + $_id.attr("id"));

            if (hfcanclose != null) {
                canclose = 0;
            }
            if ($_id.find(".app-body").find("div").html() == null) {
                if (canclose == 1) {
                    $_id.find(".app-body").html("");
                    // $_id.find(".app-body").html(loadingMessage);
                }
            }
            else {
                if (canclose == 1) {
                    $_id.find(".app-body").find("div").html("");
                    // $_id.find(".app-body").find("div").html(loadingMessage);
                }
            }

            $_id.css({
                visibility: "hidden",
                left: "",
                top: "",
                width: "",
                height: ""
            });

            if ($_id.find(".options-button-app").length > 0) {
                $_id.find(".options-button-app").removeClass("active");
                $_id.find(".app-popup-inner-app").hide();
            }

            $.ajax({
                url: saveHandler + "/App_Close",
                type: "POST",
                data: '{ "appId": "' + $_id.attr("id") + '","workspaceMode": "' + openWSE_Config.workspaceMode + '" }',
                contentType: "application/json; charset=utf-8"
            });
        });

        var specs = "width=" + _width + "px,height=" + _height + "px,location=no,menubar=no,toolbar=no,status=no,resizable=yes,scrollbars=yes";
        myWindow = window.open(url, name, specs);
        myWindow.focus();
    }
    function PopOutFrameFromSiteTools(name, url) {
        var specs = "width=400px,height=400px,location=no,menubar=no,toolbar=no,status=no,resizable=yes,scrollbars=yes";
        myWindow = window.open(url, name, specs);
        myWindow.focus();

        $("#MessageActivationPopup").hide();
        $("#MessageActivationPopup").remove();
    }
    function PopOutTool(name, url) {
        if (openWSE.IsComplexWorkspaceMode()) {
            $(".top-options li.a").removeClass("active");
            $(".top-options li.b").hide();

            var specs = "fullscreen=yes,location=no,menubar=no,toolbar=no,status=no,resizable=yes,scrollbars=yes";
            myWindow = window.open(url, name, specs)
            myWindow.focus()
        }
        else {
            window.location.href = url.replace("?toolView=true", "");
        }
    }
    function MoveAppToworkspace(id) {
        var d = "";
        if ($(id).length > 0) {
            if (($(id).hasClass("app-popup-selector")) || ($(id).hasClass("app-options-workspace-switch"))) {
                d = $.trim($(id).val());
            }
            else {
                d = $.trim($(id).text());
            }
        }
        else {
            d = id;
        }

        if (d == "" || d == "-") {
            return;
        }

        SetWorkspaceNumber(d);

        var workspacenum = d;
        d = "workspace_" + d;

        var current = Getworkspace();
        $_name = $(id).closest('.app-icon');
        if ($_name.length == 0) {
            $_name = $(id).closest(".app-head-button-holder").parent();
        }

        var isOn = 0;
        var tempId = $_name.attr('id');
        if ((tempId != "") && (tempId != undefined) && (tempId != null)) {
            tempId = $_name.attr('id').replace('-pnl-icons', '');
            AddworkspaceAppNum(d, tempId);
            if ($('#' + tempId).css('display') == 'block') {
                isOn = 1;
            }
        }

        if ((current != d) || (isOn == 0) || ((isOn == 1) && (current == d))) {
            $.ajax({
                url: saveHandler + "/App_CurrentWorkspace",
                type: "POST",
                data: '{ "workspace": "' + workspacenum + '","workspaceMode": "' + openWSE_Config.workspaceMode + '" }',
                contentType: "application/json; charset=utf-8"
            });

            LoadApp($_name, d);
            if (current != d) {
                _id = "#MainContent_" + d;
                $('#workspace_holder .workspace-holder').each(function () {
                    if ($(this).css("visibility") == "visible") {
                        if (!openWSE_Config.taskBarShowAll) {
                            $("#minimized-app-bar").fadeOut(openWSE_Config.animationSpeed);
                        }
                        $(this).fadeTo(openWSE_Config.animationSpeed, 0.0, function () {
                            // Move off screen
                            var oldid = $(this).attr("id");
                            MoveOffScreen("#" + oldid);

                            if (!openWSE_Config.taskBarShowAll) {
                                HideTasks("#" + oldid);
                                ShowTasks(_id);
                            }
                        });
                    }
                });

                $(_id).fadeTo(openWSE_Config.animationSpeed, 1.0);

                // Move selected onto screen
                MoveOnScreen_WorkspaceOnly(_id);
                ResizeAllAppBody(_id);

                $(".app-options").css("visibility", "hidden");
                setTimeout(function () {
                    $(".app-popup").hide();
                }, openWSE_Config.animationSpeed);
            }
        }
    }


    /* IE Version Checker */
    function getInternetExplorerVersion() {
        var e = -1; if (navigator.appName == "Microsoft Internet Explorer") {
            var t = navigator.userAgent; var n = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})"); if (n.exec(t) != null) e = parseFloat(RegExp.$1)
        }
        return e
    }
    function checkVersion() {
        var e = getInternetExplorerVersion(); if (e > -1) {
            if (e < 8) {
                openWSE.AlertWindow("You might want to consider upgrading your copy of Internet Explorer. Some features may not work correctly.")
            }
        }
    }


    /* Group Login Modal */
    function GroupLoginModal() {
        LoadingMessage1("Loading Groups...");
        $("#GroupLogin-element").remove();

        var modalHtml = "<div id='GroupLogin-element' class='Modal-element'><div class='Modal-overlay'><div class='Modal-element-align'><div class='Modal-element-modal'>";
        var closeBtn = "<a href='#' onclick='openWSE.CloseGroupLoginModal();return false;' class='ModalExitButton'></a>";
        modalHtml += "<div class='ModalHeader'><div><div class='app-head-button-holder-admin'>" + closeBtn + "</div><span class='Modal-title'></span></div></div>";
        modalHtml += "<div class='ModalPadContent'></div></div></div></div></div>";

        if ($("#extra_modal_holder").length > 0) {
            $("#extra_modal_holder").append(modalHtml);
        }
        else {
            $("body").append(modalHtml);
        }

        $.ajax({
            url: openWSE.siteRoot() + "WebServices/AcctSettings.asmx/GetUserGroups",
            type: "POST",
            data: '{ }',
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                var x = "<div class='clear-margin'>Select the group you would like to login to. Using this enables certain features of a group.</div><div class='clear-space'></div>";
                try {
                    for (var i = 0; i < data.d[0].length; i++) {
                        var groupId = data.d[0][i][0];
                        var groupName = data.d[0][i][1];
                        var image = data.d[0][i][2];
                        x += "<div class='logingroupselector' onclick='openWSE.LoginAsGroup(\"" + groupId + "\")' title='Click to login'>";
                        x += "<img alt='Group Logo' src='" + image + "' />";
                        x += "<span>" + groupName + "</span>";
                        x += "</div>";
                    }

                    if (openWSE.ConvertBitToBoolean(data.d[1])) {
                        x += "<div class='logingroupselector-logout' onclick='openWSE.LoginAsGroup(\"\")'>";
                        x += "<div>Logout of Group</div>";
                        x += "</div>";
                    }

                    x += "<div class='clear-space'></div>";
                }
                catch (evt) { }
                $("#GroupLogin-element").find(".ModalPadContent").html(x);
                LoadModalWindow(true, "GroupLogin-element", "Group Login");
                openWSE.RemoveUpdateModal();
            }
        });
    }
    function LoginAsGroup(id) {
        if (id != "") {
            LoadingMessage1("Logging into Group");
        }
        else {
            LoadingMessage1("Logging out of Group");
        }
        $.ajax({
            url: openWSE.siteRoot() + "WebServices/AcctSettings.asmx/LoginUnderGroup",
            type: "POST",
            data: '{ "id": "' + id + '" }',
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                location.reload();
            },
            error: function (e) {
                RemoveUpdateModal();
            }
        });
    }
    function CloseGroupLoginModal() {
        LoadModalWindow(false, "GroupLogin-element", "");
        setTimeout(function () {
            $("#GroupLogin-element").remove();
        }, openWSE_Config.animationSpeed);
    }


    /* AutoHide */
    var AutoHideMode_Config = {
        timer: 2000
    }
    var AutoHideMode = function () {
        var isHovering = false;
        var isHiding = false;
        var escKeyPressed = false;

        function init() {
            $("#always-visible, #container-footer").hover(function () {
                if ((!isHiding) && (!escKeyPressed)) {
                    HoverShow();
                    isHovering = true;
                }
            }, function () {
                isHovering = false;
                setTimeout(function () {
                    if ((!isHovering) && (!escKeyPressed)) {
                        isHovering = false;
                        isHiding = true;
                        AutoHide();
                    }
                }, AutoHideMode_Config.timer);
            });

            $(document).keyup(function (e) {
                if (e.which == 27) {
                    if (!escKeyPressed) {
                        escKeyPressed = true;
                        HoverShow();
                        isHovering = true;

                        openWSE.LoadingMessage1("AutoHide Mode Off");
                        setTimeout(function () {
                            openWSE.RemoveUpdateModal();
                        }, AutoHideMode_Config.timer);
                    }
                    else {
                        escKeyPressed = false;
                        isHovering = false;
                        isHiding = true;
                        AutoHide();

                        openWSE.LoadingMessage1("AutoHide Mode On");
                        setTimeout(function () {
                            openWSE.RemoveUpdateModal();
                        }, AutoHideMode_Config.timer);
                    }
                }
            });

            setTimeout(function () {
                if (!isHovering) {
                    isHovering = false;
                    isHiding = true;
                    AutoHide();
                }
            }, AutoHideMode_Config.timer);
        }

        function AutoHide() {
            $("#always-visible, #container-footer").css("height", "8px");
            $("#top-main-bar-top, .footer-padding").hide();
            isHiding = false;
            $("#container, #iframe-container-helper").css("top", "8px");
            $("#container, #iframe-container-helper").css("bottom", "8px");

            $(window).resize();
        }
        function HoverShow() {
            $("#top-main-bar-top, .footer-padding").show();
            $("#always-visible, #container-footer").css("height", "");
            $("#container, #iframe-container-helper").css("top", "");
            $("#container, #iframe-container-helper").css("bottom", "");

            $(window).resize();
        }

        return {
            init: init
        }
    }();


    /* Presentation Mode */
    var PresentationMode_Config = {
        timer: 1000
    }
    var PresentationMode = function () {
        var escKeyPressed = 2;
        var timeOutMode = null;

        function init() {
            $("#container").append("<div id='presentationmodeText'>Presentation Mode is Off</div>");
            ShowActivatePopup("To start 'Presentation Mode', press the ESC key");

            // Press the esc key to turn on/edit/off
            $(document).keyup(function (e) {
                if (e.which == 27) {
                    if ($("#PresentationActivate-element").length > 0) {
                        openWSE.LoadModalWindow(false, "PresentationActivate-element", "");
                    }

                    if (timeOutMode != null) {
                        clearTimeout(timeOutMode);
                    }

                    $("#presentationmodeText").remove();

                    if (escKeyPressed == 0) {
                        escKeyPressed = true;
                        HoverShow();
                        $("#container").append("<div id='presentationmodeText'>Presentation Mode is Off</div>");
                        $("#update-element").remove();
                        openWSE.LoadingMessage1("Presentation Mode Off");
                        timeOutMode = setTimeout(function () {
                            openWSE.RemoveUpdateModal();
                        }, PresentationMode_Config.timer);
                    }
                    else if (escKeyPressed == 1) {
                        escKeyPressed = 2;
                        EditMode();
                        $("#container").append("<div id='presentationmodeText'>Presentation Edit Mode</div>");
                        $("#update-element").remove();
                        openWSE.LoadingMessage1("Presentation Mode Edit");
                        timeOutMode = setTimeout(function () {
                            openWSE.RemoveUpdateModal();
                        }, PresentationMode_Config.timer);
                    }
                    else {
                        escKeyPressed = 0;
                        AutoHide();
                        $("#update-element").remove();
                        openWSE.LoadingMessage1("Presentation Mode On");
                        timeOutMode = setTimeout(function () {
                            openWSE.RemoveUpdateModal();
                        }, PresentationMode_Config.timer);
                    }
                }
            });
        }

        function ShowActivatePopup(message) {
            $(window).load(function () {
                var x = "<div id='PresentationActivate-element' class='Modal-element' style='display: none;'>";
                x += "<div class='Modal-overlay'>";
                x += "<div class='Modal-element-align'>";
                x += "<div class='Modal-element-modal'>";

                x += "<div class='ModalPadContent' style='height: 30px;'><h3 class='pad-top float-left'><b class='pad-right-sml'>Note:</b>" + message + "</h3>";
                x += "<input type='button' class='input-buttons float-right no-margin' value='Ok' onclick='openWSE.LoadModalWindow(false, \"PresentationActivate-element\", \"\");setTimeout(function(){$(\"#PresentationActivate-element\").remove();},openWSE_Config.animationSpeed);' style='margin-top: 2px!important;' /></div>";
                x += "</div></div></div></div>";

                $("body").append(x);
                openWSE.LoadModalWindow(true, "PresentationActivate-element", "");
            });
        }
        function AutoHide() {
            // Original AutoHide plugin
            $("#always-visible").addClass("header-presentation");
            $("#container-footer").addClass("footer-presentation");
            $("#always-visible, #container-footer").addClass("header-footer-presentation");
            $(".username-top-info").addClass("top-menu-color-presentation");
            $("#container, #iframe-container-helper").addClass("container-presentation");
            $("body").addClass("body-presentation-bg");
            $(".app-maximized").addClass("app-max-border-presentation");
            $(".app-main, .app-main-nobg, .app-main.selected, .app-main-nobg.selected, .workspace-overlays").addClass("body-presentation-bg app-max-border-presentation");
            $(".app-main, .app-main-nobg, .app-main.selected, .app-main-nobg.selected").addClass("no-shadow-presentation");
            $(".app-min-bar, .app-min-bar-alt, .ui-icon-gripsmall-diagonal-se").css("background-image", "none");
            $(".sidebar-padding-menulinks").hide();
            $(".app-head, .app-head-button-holder, .overlay-header").hide();
            $("#top-main-bar-top, .footer-padding").hide();
            $(window).resize();
            isHiding = false;
        }
        function EditMode() {
            // Original AutoHide plugin
            $("#always-visible").addClass("header-presentation");
            $("#container-footer").addClass("footer-presentation");
            $("#always-visible, #container-footer").addClass("header-footer-presentation");
            $(".username-top-info").addClass("top-menu-color-presentation");
            $("#container, .pnl-overlaysAll, #iframe-container-helper").addClass("container-presentation");
            $("body").addClass("body-presentation-bg");
            $("#top-main-bar-top, .footer-padding").hide();
            $(".sidebar-padding-menulinks").hide();
            $(window).resize();
        }
        function HoverShow() {
            // Original AutoHide plugin
            $("#always-visible").removeClass("header-presentation");
            $("#container-footer").removeClass("footer-presentation");
            $("#always-visible, #container-footer").removeClass("header-footer-presentation");
            $(".username-top-info").removeClass("top-menu-color-presentation");
            $("#container, .pnl-overlaysAll, #iframe-container-helper").removeClass("container-presentation");
            $("body").removeClass("body-presentation-bg");
            $(".app-maximized").removeClass("app-max-border-presentation");
            $(".app-main, .app-main-nobg, .app-main.selected, .app-main-nobg.selected, .workspace-overlays").removeClass("body-presentation-bg app-max-border-presentation");
            $(".app-main, .app-main-nobg, .app-main.selected, .app-main-nobg.selected").removeClass("no-shadow-presentation");
            $(".app-min-bar, .app-min-bar-alt, .ui-icon-gripsmall-diagonal-se").css("background-image", "");
            $(".sidebar-padding-menulinks").show();
            $(".app-head, .app-head-button-holder, .overlay-header").show();
            $("#top-main-bar-top, .footer-padding").show();

            $(".app-body").each(function () {
                var $this = null;
                if ($(this).find(".main-div-app-bg").length > 0) {
                    $this = $(this).find(".main-div-app-bg");
                }

                if ($this != null) {
                    $this.css("top", "");
                    $this.css("bottom", "");
                }
            });
            $(window).resize();
        }

        return {
            init: init
        }
    }();


    /* Has Change */
    function HashChange() {
        var url = location.hash;
        try {
            if (url.indexOf("?iframecontent=") != -1) {
                var loc = url.split("?iframecontent=");
                if (loc.length > 1) {
                    openWSE.LoadIFrameContentHistory(loc[1], "Content");
                }
            }
            else if (url.indexOf("&iframecontent=") != -1) {
                var loc = url.split("&iframecontent=");
                if (loc.length > 1) {
                    openWSE.LoadIFrameContentHistory(loc[1], "Content");
                }
            }
            else if ((url.indexOf("?help") != -1) || (url.indexOf("&help") != -1)) {
                HelpOverlayHistory();
            }
            else {
                if ($("#iframe-container-helper").length > 0) {
                    openWSE.CloseIFrameContent();
                }
                if ($("#help_main_holder").css("display") == "block") {
                    CloseHelpOverlay();
                }
            }
        }
        catch (evt) { }
    }


    /* Desktop - Mobile Site */
    function loadCSS(url) {
        var fullUrl = openWSE.siteRoot() + "App_Themes/" + openWSE_Config.siteTheme + "/" + url;
        $("link[href='" + fullUrl + "']").remove();
        var head = document.getElementsByTagName('head')[0];
        link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = fullUrl;
        head.appendChild(link);
    }
    function unloadCSS(url) {
        var fullUrl = openWSE.siteRoot() + "App_Themes/" + openWSE_Config.siteTheme + "/" + url;
        $("link[href='" + fullUrl + "']").remove();
    }
    function LoadViewPort() {
        if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
            var head = document.getElementsByTagName('head')[0];
            meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.id = 'mobileViewport';
            meta.content = 'width=device-width, initial-scale=0.70, user-scalable=no';
            head.appendChild(meta);
        }
        else {
            if ($("#mobileViewport").length > 0) {
                $("#mobileViewport").remove();
            }
        }
    }


    /* Group Invite Notification Actions */
    function AcceptGroupNotification(_this, groupId) {
        if (!openWSE_Config.demoMode) {
            LoadingMessage1("Accepting. Please Wait...");
            var $this = $(_this).closest("tr");
            var id = $this.attr("id");
            var notiHandler = openWSE.siteRoot() + "WebServices/NotificationRetrieve.asmx/AcceptInviteNotifications";
            $.ajax({
                url: notiHandler,
                type: "POST",
                data: '{ "id": "' + id + '", "groupId": "' + groupId + '" }',
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (openWSE.ConvertBitToBoolean(data.d)) {
                        $this.fadeOut(openWSE_Config.animationSpeed, function () {
                            RemoveUpdateModal();
                            $this.remove();
                            if ($("#lbl_notifications").html() == "1") {
                                ResetNoti();
                            }
                            else {
                                var currTotal = parseInt($("#lbl_notifications").html());
                                currTotal -= 1;
                                $("#lbl_notifications").html(currTotal);
                            }
                        });
                    }
                }
            });
        }
    }


    /* Feedback Overlay */
    function SubmitFeedback(id) {
        var $this = $("#" + id);
        if ($this.length > 0) {
            var text = $.trim($this.val());
            LoadingMessage1("Submitting feedback...");
            $.ajax({
                url: openWSE.siteRoot() + "WebServices/UpdateServerSettings.asmx/SubmitFeedback",
                data: "{ 'text': '" + text + "' }",
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataFilter: function (data) { return data; },
                success: function (data) {
                    RemoveUpdateModal();
                    $this.val("Enter your comments here...");
                    $this.css("color", "#B7B7B7");
                },
                error: function (data) {
                    openWSE.AlertWindow("An error occurred submitting your feedback! Please try again.");
                }
            });
        }
    }


    /* Sidebar and Resizing Container */
    function ToolView() {
        $("#container").css("top", "0");
        $("#always-visible, .sidebar-padding-menulinks").hide();

        var coHeight = $(window).height() - ($(".footer").height() + $("#app_title_bg").height());
        $("#maincontent_overflow").css({
            height: coHeight
        });

        $("#maincontent_overflow").width($(window).width());

        $("#always-visible").find(".top-options").hide();
        $("#DateDisplay").hide();
        $("#localtime").hide();

        $(window).resize();
    }
    function GetCurrentPage() {
        $(".app-icon-links").removeClass("active");
        $(".app-icon-sub-links").removeClass("active");

        var currPage = window.location.href.toLowerCase();
        $(".app-icon-links").each(function () {
            var thisHref = $(this).attr("href").toLowerCase();
            if (currPage.indexOf(thisHref) != -1) {
                $(this).addClass("active");
                if ($(this).next().hasClass("app-icon-sub-link-holder")) {
                    $(this).next().show();
                    var $expand = $(this).find(".img-expand-sml");
                    if ($expand.length == 1) {
                        $expand.removeClass("img-expand-sml");
                        $expand.addClass("img-collapse-sml");
                    }
                }
            }
        });

        $(".app-icon-sub-links").each(function () {
            var thisHref = $(this).attr("href").toLowerCase();
            if (currPage.indexOf(thisHref) != -1) {
                $(".app-icon-links").removeClass("active");
                $(this).addClass("active");
                $(this).parent().show();
                var $expand = $(this).parent().prev().find(".img-expand-sml");
                if ($expand.length == 1) {
                    $expand.removeClass("img-expand-sml");
                    $expand.addClass("img-collapse-sml");
                }
            }
        });
    }
    function ResizeContainer() {
        var coHeight = $(window).height() - ($(".footer").height() + $("#always-visible").height() + $("#app_title_bg").height());
        if ($("#always-visible").css("display") == "none") {
            coHeight += $("#always-visible").height();
        }

        if ($(".footer").css("display") == "none") {
            coHeight += $(".footer").height();
        }

        $("#maincontent_overflow").css({
            height: coHeight - 1
        });

        if (openWSE_Config.overlayPanelId == "pnl_OverlaysAll") {
            $("#pnl_OverlaysAll").height($(window).height());
        }

        if ($(".sidebar-padding-menulinks").css("display") == "none") {
            $("#maincontent_overflow").width($(window).width());
        }
        else {
            $("#accordian-sidebar").css("height", (coHeight - 1) + "px");
            $("#maincontent_overflow").css("width", ($(window).width() - $(".sidebar-padding-menulinks").outerWidth()) + "px");
        }
    }
    function ExpandAdminLinks(_this, div) {
        if ($(_this).hasClass("img-expand-sml")) {
            $(_this).removeClass("img-expand-sml");
            $(_this).addClass("img-collapse-sml");
            $(_this).closest(".app-icon-links").parent().find("." + div).slideDown(openWSE_Config.animationSpeed);
        }
        else {
            $(_this).removeClass("img-collapse-sml");
            $(_this).addClass("img-expand-sml");
            $(_this).closest(".app-icon-links").parent().find("." + div).slideUp(openWSE_Config.animationSpeed);
        }
    }
    $.fn.AccordianTab = function (options) {

        var $accordianDiv = this,
        defaults = {
            allowCloseAll: false,
            oneOpen: true,
            startCollapsed: true,
            animationSpeed: 150,
            createCookie: true,
            headerClass: "menu-title",
            bodyClass: "li-pnl-tab",
            collapsedClass: "menu-collapsed",
            expandedClass: "menu-expanded",
            menuDropDownClass: "menu-dd",
            expandTooltip: "Click to Expand",
            collapseTooltip: "Click to Collapse"
        },
        settings = $.extend({}, defaults, options);

        $(document).ready(function () {
            Create();
            MenuLinkCookie();
            TryToFindOneOpen();
        });
        $accordianDiv.find("." + settings.headerClass).on("click", function () {
            var $menu = $(this).find("." + settings.menuDropDownClass);
            var $pnl = $(this).parent().find("." + settings.bodyClass);
            if ($menu.length != 0 && $pnl.length != 0) {
                var toolTip = "";
                if ($menu.hasClass(settings.collapsedClass)) {
                    toolTip = settings.collapseTooltip;
                    $(this).attr("title", toolTip);
                    $menu.removeClass(settings.collapsedClass).addClass(settings.expandedClass);
                    $pnl.slideDown(settings.animationSpeed);
                }
                else if ((!settings.allowCloseAll && GetTotalOpen() > 1) || settings.allowCloseAll) {
                    toolTip = settings.expandTooltip;
                    $(this).attr("title", toolTip);
                    $menu.removeClass(settings.expandedClass).addClass(settings.collapsedClass);
                    $pnl.slideUp(settings.animationSpeed);
                }

                if (settings.oneOpen) {
                    $accordianDiv.find("." + settings.bodyClass).each(function () {
                        if ($(this).attr("id") != $pnl.attr("id")) {
                            $(this).parent().find("." + settings.headerClass).attr("title", settings.expandTooltip);
                            $(this).parent().find("." + settings.headerClass).find("." + settings.menuDropDownClass).removeClass(settings.expandedClass).addClass(settings.collapsedClass);
                            $(this).slideUp(settings.animationSpeed);
                        }
                    });
                }

                if ($(this).attr("aria-describedby") != null && $(this).attr("aria-describedby") != "") {
                    var jqueryToolTipId = $(this).attr("aria-describedby");
                    $("#" + jqueryToolTipId).find(".ui-tooltip-content").html(toolTip);
                }

                setTimeout(function () {
                    SetSidebarTabCookie();
                }, settings.animationSpeed * 2);
            }
        });

        function Create() {
            $accordianDiv.find("." + settings.headerClass).each(function (index) {
                if ($(this).find("." + settings.menuDropDownClass).length == 0) {
                    $(this).append("<span class='" + settings.menuDropDownClass + "'></span>");
                    if (settings.startCollapsed) {
                        $(this).attr("title", settings.expandTooltip);
                        $(this).find("." + settings.menuDropDownClass).addClass(settings.collapsedClass);
                        $(this).parent().find("." + settings.bodyClass).hide();
                    }
                    else {
                        $(this).attr("title", settings.collapseTooltip);
                        $(this).find("." + settings.menuDropDownClass).addClass(settings.expandedClass);
                        $(this).parent().find("." + settings.bodyClass).show();
                    }
                }
            });
        }
        function MenuLinkCookie() {
            var needToLoadOne = false;
            if (typeof cookie == "function" || typeof cookie == "object") {
                if (settings.createCookie) {
                    var slpitStr = cookie.get("menubar-links-tab");
                    try {
                        var pnls = slpitStr.split(",");
                        if (pnls != "" && pnls != null) {
                            for (var i = 0; i < pnls.length; i++) {
                                if (pnls[i] != "") {
                                    var $this = $accordianDiv.find("#" + pnls[i]);
                                    if ($this.length > 0) {
                                        if (settings.startCollapsed) {
                                            $this.parent().find("." + settings.headerClass).attr("title", settings.collapseTooltip);
                                            $this.parent().find("." + settings.menuDropDownClass).removeClass(settings.collapsedClass).addClass(settings.expandedClass);
                                            $this.show();
                                            if (settings.oneOpen) {
                                                return;
                                            }
                                        }
                                        else if ((!settings.allowCloseAll && GetTotalOpen() > 1) || settings.allowCloseAll || (!settings.startCollapsed && $this.css("display") == "block")) {
                                            $this.parent().find("." + settings.headerClass).attr("title", settings.expandTooltip);
                                            $this.parent().find("." + settings.menuDropDownClass).removeClass(settings.expandedClass).addClass(settings.collapsedClass);
                                            $this.hide();
                                        }
                                    }
                                }
                            }
                        }
                    }
                    catch (evt) { }
                }
                else {
                    cookie.del("menubar-links-tab");
                }

                if ((!settings.allowCloseAll && GetTotalOpen() == 0) || (!settings.startCollapsed && GetTotalOpen() == $accordianDiv.find("." + settings.bodyClass).length)) {
                    if (!settings.startCollapsed) {
                        CollapseAll();
                    }
                    needToLoadOne = true;
                }
            }
            else {
                needToLoadOne = true;
            }

            if (needToLoadOne && $accordianDiv.find("." + settings.bodyClass).length > 0) {
                var $this = $accordianDiv.find("." + settings.bodyClass).eq(0);
                $this.parent().find("." + settings.headerClass).attr("title", settings.collapseTooltip);
                $this.show();
                $this.parent().find("." + settings.menuDropDownClass).removeClass(settings.collapsedClass).addClass(settings.expandedClass);
            }
        }
        function SetSidebarTabCookie() {
            if (settings.createCookie) {
                var pnlIds = "";
                $accordianDiv.find("." + settings.bodyClass).each(function () {
                    if ($(this).css("display") == "block") {
                        pnlIds += $(this).attr("id") + ",";
                    }
                });

                if (typeof cookie == "function" || typeof cookie == "object") {
                    if (pnlIds != "") {
                        cookie.set("menubar-links-tab", pnlIds, 30);
                    }
                    else {
                        cookie.del("menubar-links-tab");
                    }
                }
            }
        }
        function GetTotalOpen() {
            var totalOpen = 0;
            $accordianDiv.find("." + settings.bodyClass).each(function () {
                if ($(this).css("display") == "block") {
                    totalOpen++;
                }
            });
            return totalOpen;
        }
        function CollapseAll() {
            $accordianDiv.find("." + settings.headerClass).each(function (index) {
                $(this).attr("title", settings.expandTooltip);
                $(this).find("." + settings.menuDropDownClass).addClass(settings.collapsedClass);
                $(this).parent().find("." + settings.bodyClass).hide();
            });
        }

        function TryToFindOneOpen() {
            var foundOne = false;
            $accordianDiv.find("." + settings.bodyClass).each(function () {
                if ($(this).css("display") == "block") {
                    foundOne = true;
                    return;
                }
            });

            if (!foundOne) {
                var $header = $accordianDiv.find("." + settings.headerClass).find("." + settings.menuDropDownClass);
                var $body = $accordianDiv.find("." + settings.bodyClass);
                if ($header.length > 0 && $body.length > 0) {
                    $header.eq(0).removeClass(settings.collapsedClass).addClass(settings.expandedClass);
                    $body.eq(0).show();
                }
            }
        }

    };

    function GetSiteRoot() {
        var sitePath = "";
        if (openWSE_Config.siteRootFolder != "") {
            sitePath = openWSE_Config.siteRootFolder + "/";
        }

        return window.location.protocol + "//" + window.location.host + "/" + sitePath;
    }

    function GetElementClassList(ele) {
        if ($(ele).length == 1) {
            var classList = $(ele)[0].className.split(/\s+/);
            return classList;
        }
        return new Array();
    }

    return {
        siteRoot: GetSiteRoot,
        loadingImg: loadingImg,
        loadingImg_lrg: loadingImg_lrg,
        topBarHt: topBarHt,
        GetPagedAddOverlayAndModel: GetPagedAddOverlayAndModel,
        IsComplexWorkspaceMode: IsComplexWorkspaceMode,
        PagedWorkspace: PagedWorkspace,
        SetContainerTopPos: SetContainerTopPos,
        SetTrialText: SetTrialText,
        ConvertBitToBoolean: ConvertBitToBoolean,
        OpenMobileWorkspace: OpenMobileWorkspace,
        init: init,
        OnError: OnError,
        AdjustContainerLogo: AdjustContainerLogo,
        autoupdate: autoupdate,
        LoadingMessage1: LoadingMessage1,
        RemoveUpdateModal: RemoveUpdateModal,
        AlertWindow: AlertWindow,
        CloseAlertWindow: CloseAlertWindow,
        ReportAlert: ReportAlert,
        ConfirmWindow: ConfirmWindow,
        CloseConfirmWindow: CloseConfirmWindow,
        StartMessageTickInterval: StartMessageTickInterval,
        OnBrowserClose: OnBrowserClose,
        CheckIfWorkspaceLinkAvailable: CheckIfWorkspaceLinkAvailable,
        RadioButtonStyle: RadioButtonStyle,
        RatingStyleInit: RatingStyleInit,
        UpdateAppRating: UpdateAppRating,
        ResetRating: ResetRating,
        OpenAppNoti: OpenAppNoti,
        SearchSite: SearchSite,
        ClearAppSearch: ClearAppSearch,
        SearchExternalSite: SearchExternalSite,
        LoadModalWindow: LoadModalWindow,
        SaveInnerModalContent: SaveInnerModalContent,
        LoadSavedInnerModalContent: LoadSavedInnerModalContent,
        LoadTopOptionsCookie: LoadTopOptionsCookie,
        SetDropDownMaxHeight: SetDropDownMaxHeight,
        ExpandAdminLinks: ExpandAdminLinks,
        HelpOverlay: HelpOverlay,
        HelpMenuPageLoad: HelpMenuPageLoad,
        NewUserPageLoad: NewUserPageLoad,
        NewUserfinsh: NewUserfinsh,
        OnEmailUpdate_KeyPress: OnEmailUpdate_KeyPress,
        OnPasswordUpdate_KeyPress: OnPasswordUpdate_KeyPress,
        UpdateEmail: UpdateEmail,
        UpdateAdminPassword: UpdateAdminPassword,
        ShowUpdatesPopup: ShowUpdatesPopup,
        ShowActivationPopup: ShowActivationPopup,
        CloseUpdatesPopup: CloseUpdatesPopup,
        OverlayDisable: OverlayDisable,
        TryAddLoadOverlay: TryAddLoadOverlay,
        TryRemoveLoadOverlay: TryRemoveLoadOverlay,
        CallOverlayList: CallOverlayList,
        AddRemoveOverlayClick: AddRemoveOverlayClick,
        CreateOverlayTable: CreateOverlayTable,
        GetUserNotifications: GetUserNotifications,
        NotiActionsClearAll: NotiActionsClearAll,
        NotiActionsHideInd: NotiActionsHideInd,
        LoadCreateAccountHolder: LoadCreateAccountHolder,
        LoadRecoveryPassword: LoadRecoveryPassword,
        SetPostalCode: SetPostalCode,
        WeatherBuilder: WeatherBuilder,
        LoadIFrameContent: LoadIFrameContent,
        LoadIFrameContentHistory: LoadIFrameContentHistory,
        CloseIFrameContent: CloseIFrameContent,
        BackgroundSelector: BackgroundSelector,
        ClearBackground: ClearBackground,
        GetURLImage: GetURLImage,
        CloseBackgroundSelector: CloseBackgroundSelector,
        updateBackgroundURL: updateBackgroundURL,
        HideTasks: HideTasks,
        ShowTasks: ShowTasks,
        LoadCurrentWorkspace: LoadCurrentWorkspace,
        Getworkspace: Getworkspace,
        HoverWorkspacePreview: HoverWorkspacePreview,
        SetWorkspaceNumber: SetWorkspaceNumber,
        RemoveWorkspaceSelectorActive: RemoveWorkspaceSelectorActive,
        AutoRotateWorkspace: AutoRotateWorkspace,
        AutoUpdateOnRotate: AutoUpdateOnRotate,
        AppsSortUnlocked: AppsSortUnlocked,
        CreateSOApp: CreateSOApp,
        BuildAppMinIcon: BuildAppMinIcon,
        LoadApp: LoadApp,
        LoadAppFromSiteTools: LoadAppFromSiteTools,
        DetermineNeedPostBack: DetermineNeedPostBack,
        WatchForLoad: WatchForLoad,
        LoadUserControl: LoadUserControl,
        ResizeAllAppBody: ResizeAllAppBody,
        ResizeAppBody: ResizeAppBody,
        ApplyOverlayFix: ApplyOverlayFix,
        RemoveOverlayFix: RemoveOverlayFix,
        MoveOffScreen: MoveOffScreen,
        MoveOnScreen_WorkspaceOnly: MoveOnScreen_WorkspaceOnly,
        MoveToCurrworkspace: MoveToCurrworkspace,
        SetAppMaxToMin: SetAppMaxToMin,
        SetAppMinToMax: SetAppMinToMax,
        HoverOverAppMin: HoverOverAppMin,
        HoverOutAppMin: HoverOutAppMin,
        SetNoticiationsMaxHeight: SetNoticiationsMaxHeight,
        SetActiveApp: SetActiveApp,
        SetDeactiveApps: SetDeactiveApps,
        SetDeactiveAll: SetDeactiveAll,
        LoadActiveAppCookie: LoadActiveAppCookie,
        LoadCategoryCookies: LoadCategoryCookies,
        MaximizeApp: MaximizeApp,
        StartRemoteLoad: StartRemoteLoad,
        LoadRemotely: LoadRemotely,
        SetRemoteLoadingOptions: SetRemoteLoadingOptions,
        SetAppIconActive: SetAppIconActive,
        AddworkspaceAppNum: AddworkspaceAppNum,
        RemoveworkspaceAppNum: RemoveworkspaceAppNum,
        RemoveAppIconActive: RemoveAppIconActive,
        CategoryClick: CategoryClick,
        ApplyAppDragResize: ApplyAppDragResize,
        ReloadApp: ReloadApp,
        AboutApp: AboutApp,
        UninstallApp: UninstallApp,
        AppStats: AppStats,
        NavigationBtns: NavigationBtns,
        PopOutFrame: PopOutFrame,
        PopOutFrameFromSiteTools: PopOutFrameFromSiteTools,
        PopOutTool: PopOutTool,
        MoveAppToworkspace: MoveAppToworkspace,
        getInternetExplorerVersion: getInternetExplorerVersion,
        checkVersion: checkVersion,
        GroupLoginModal: GroupLoginModal,
        LoginAsGroup: LoginAsGroup,
        CloseGroupLoginModal: CloseGroupLoginModal,
        AutoHideMode: AutoHideMode,
        PresentationMode: PresentationMode,
        HashChange: HashChange,
        AcceptGroupNotification: AcceptGroupNotification,
        SubmitFeedback: SubmitFeedback,
        ToolView: ToolView,
        ResizeContainer: ResizeContainer,
        GetElementClassList: GetElementClassList
    }
}();

$(window).resize(function () {
    openWSE.SetContainerTopPos(true);
    openWSE.ResizeContainer();
    var current = openWSE.Getworkspace();
    if ($("#MainContent_" + current).length > 0) {
        openWSE.ResizeAllAppBody("#MainContent_" + current);
    }
    else {
        openWSE.ResizeAllAppBody("body");
    }
});

$(document).ready(function () {
    openWSE.init();
    openWSE.SetContainerTopPos(false);
    openWSE.LoadCategoryCookies();
    openWSE.LoadTopOptionsCookie();
    openWSE.checkVersion();
    openWSE.GetUserNotifications(true);
    openWSE.HashChange();
    openWSE.ResizeContainer();

    // Auto complete for app searching
    if ($("#searchbox-app-search").length > 0) {
        $("#searchbox-app-search").autocomplete({
            minLength: 1,
            autoFocus: true,
            source: function (request, response) {
                $.ajax({
                    url: openWSE.siteRoot() + "WebServices/AutoComplete.asmx/GetAppSearchList",
                    data: "{ 'prefixText': '" + request.term + "', 'count': '10' }",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataFilter: function (data) { return data; },
                    success: function (data) {
                        response($.map(data.d, function (item) {
                            return {
                                label: item,
                                value: item
                            }
                        }))
                    }
                });
            }
        }).focus(function () {
            $(this).autocomplete("search", "");
        });
    }
});

$(function () {
    $(window).hashchange(function () {
        openWSE.HashChange();
    });

    if (openWSE_Config.displayLoadingOnRedirect) {
        $("#lnk_BackToWorkspace, .app-icon-links, .title-dd-name").click("click", function (e) {
            if (e.target.className != "img-expand-sml" && e.target.className != "img-collapse-sml") {
                openWSE.LoadingMessage1("Loading...");
            }
        });

        if (!openWSE.IsComplexWorkspaceMode()) {
            $(".app-icon").click("click", function (e) {
                if (e.target.className != "app-options") {
                    openWSE.LoadingMessage1("Loading...");
                }
            });
        }
    }
});

window.onerror = function (errorMsg, url) {
    url = window.location.href;
    if (!openWSE_Config.reportAlert) {
        openWSE.OnError(errorMsg, url);
    }
    else {
        openWSE.AlertWindow(errorMsg, url);
    }
}

$(window).load(function () {
    openWSE.ApplyAppDragResize();
    var current = openWSE.Getworkspace();
    openWSE.ResizeAllAppBody("#MainContent_" + current);
    openWSE.AdjustContainerLogo();

    if ($("#container_logo").length > 0) {
        $("#container_logo").css({
            visibility: "visible"
        });
    }

    openWSE.LoadActiveAppCookie();
    if (!openWSE_Config.taskBarShowAll) {
        $(".app-min-bar").hide();
        $("#MainContent_" + current).find(".app-main, .app-main-nobg").each(function (index) {
            var id = $(this).attr("id");

            if ($("#minimized-app-bar").find("#" + id + "-min-bar").length != 0) {
                if ($("#minimized-app-bar").find("#" + id + "-min-bar").css("display") == "none") {
                    $("#minimized-app-bar").find("#" + id + "-min-bar").show();
                }
            }
        });
    }
});

$.extend({
    LoadingMessage: function () {
        try {
            var container = arguments[0];
            var message = arguments[1];
            if ((message == null) || (message == "") || (message == undefined)) {
                message = "Updating. Please Wait...";
            }
            if ($("#update-element").length > 0) {
                $("#update-element").remove();
            }
            var x = "<div id='update-element'><div class='update-element-overlay' style='position: absolute!important'><div class='update-element-align' style='position: absolute!important'>";
            x += "<div class='update-element-modal'>" + openWSE.loadingImg + "<h3 class='inline-block'>" + message + "</h3></div></div></div></div>";
            $(container).append(x);
            $("#update-element").fadeIn(openWSE_Config.animationSpeed);
        }
        catch (evt) { }
    }
});