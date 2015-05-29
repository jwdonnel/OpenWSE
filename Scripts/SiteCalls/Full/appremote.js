﻿// -----------------------------------------------------------------------------------
//
//	appRemote v4.1
//	by John Donnelly
//	Last Modification: 5/24/2015
//
//	Licensed under the Creative Commons Attribution 2.5 License - http://creativecommons.org/licenses/by/2.5/
//  	- Free for use in both personal and commercial projects
//		- Attribution requires leaving author name, author link, and the license info intact.
//
//  Requirements:
//      jquery v1.11.0 - http://code.jquery.com/jquery-1.11.1.min.js
//      migrate.jquery.min.js - http://code.jquery.com/jquery-migrate-1.2.1.min.js
//
// -----------------------------------------------------------------------------------
var appRemote_Config = {
    animationSpeed: 150,
    closeTimeout: 2000,
    remoteId: "",
    remoteName: "",
    categoryId: "",
    categoryName: "",
    currUrl: "",
    workspaceMode: "",
    notiInterval: 10000,
    siteTheme: "Standard",
    siteRootFolder: "",
    forceGroupLogin: false,
    autoSync: false,
    scale: "0.95"
};

var appRemote = function () {

    var appMinWidth = 0;
    var appMinHeight = 0;
    var canSaveSort = false;
    var performingAction = false;
    var isAdminMode = false;
    var isDemoMode = false;

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
    function IsComplexWorkspaceMode() {
        if (appRemote_Config.workspaceMode.toLowerCase() == "complex" || appRemote_Config.workspaceMode == "") {
            return true;
        }

        return false;
    }

    $(document.body).on("click", "#appremote-menu-overlay", function () {
        CloseMenu();
    });
    function MenuClick() {
        if (!$("#appremote-sidebar-menu").hasClass("showmenu")) {
            OpenSidebarMenu_Swipe();
        }
        else {
            CloseSidebarMenu_Swipe();
        }
    }
    function CloseMenu() {
        CloseSidebarMenu_Swipe();
    }
    function OpenSidebarMenu_Swipe() {
        var $menu = $("#appremote-sidebar-menu");
        if ($menu.length > 0) {
            $("#workspace-selector-overlay, #workspace-selector-modal").hide();

            AdjustTopBottomPosSidebar();

            if (!$menu.hasClass("showmenu")) {
                $menu.addClass("showmenu");
                GetOpenedAppsForMenu();
                $menu.show();
                $("#appremote-menu-overlay").show();
                $menu.animate({
                    width: $(window).width() - 25
                }, 150, function () {
                    $menu.find(".appremote-sidebar-innercontent").show();
                });
            }
        }
    }
    function CloseSidebarMenu_Swipe() {
        var $menu = $("#appremote-sidebar-menu");
        if ($menu.length > 0) {
            $("#workspace-selector-overlay, #workspace-selector-modal").hide();

            AdjustTopBottomPosSidebar();

            if ($menu.hasClass("showmenu")) {
                $menu.removeClass("showmenu");
                $("#appremote-menu-overlay").hide();
                $menu.find(".appremote-sidebar-innercontent").hide();
                $menu.animate({
                    width: 0
                }, 150, function () {
                    $menu.hide();
                });
            }
        }
    }
    function AdjustTopBottomPosSidebar() {
        $("#appremote-sidebar-menu, #appremote-menu-overlay").css({
            top: $("#always-visible").outerHeight(),
            bottom: $("#container-footer").outerHeight()
        });
    }
    function InitializeSwipeEvent() {
        if ($("#menu-s").length > 0) {
            try {
                if ($("#notifications-viewtable").length > 0) {
                    document.id("notifications-viewtable").addEvent('swipe', SwipeEvent);
                }

                if ($("#grouplogin-list").length > 0) {
                    document.id("grouplogin-list").addEvent('swipe', SwipeEvent);
                }

                if ($("#pnl_AccountInfo").length > 0) {
                    document.id("pnl_AccountInfo").addEvent('swipe', SwipeEvent);
                }

                if ($("#pnl_chat_users").length > 0) {
                    document.id("pnl_chat_users").addEvent('swipe', SwipeEvent);
                }

                if ($("#pnl_icons").length > 0) {
                    document.id("pnl_icons").addEvent('swipe', SwipeEvent);
                }

                if ($("#pnl_adminPages").length > 0) {
                    document.id("pnl_adminPages").addEvent('swipe', SwipeEvent);
                }

                if ($("#pnl_options-minHeight").length > 0) {
                    document.id("pnl_options-minHeight").addEvent('swipe', SwipeEvent);
                }

                if ($("#appremote-sidebar-menu").length > 0) {
                    document.id("appremote-sidebar-menu").addEvent('swipe', SwipeEvent);
                }

                if ($("#appremote-menu-overlay").length > 0) {
                    document.id("appremote-menu-overlay").addEvent('swipe', SwipeEvent);
                }

                if ($("#pnl_login").length > 0) {
                    document.id("pnl_login").addEvent('swipe', SwipeEvent);
                }
            }
            catch (evt) { }
        }
    }
    function SwipeEvent(event) {
        if (event) {
            switch (event.direction) {
                case "left":
                    appRemote.CloseSidebarMenu_Swipe();
                    break;
                case "right":
                    appRemote.OpenSidebarMenu_Swipe();
                    break;
            }
        }
    }
    function GetOpenedAppsForMenu() {
        if ($("#appremote-sidebar-menu").hasClass("showmenu")) {
            var appArray = new Array();

            $("#opened_apps_header").hide();
            $("#opened_apps_holder").html("");

            $("#pnl_options").find(".loaded-app-holder").each(function () {
                var id = $(this).attr("id").replace("-loadedapp", "");
                var $app = $(".app-icon[data-appid='" + id + "']");
                if ($app.length > 0 && !ArrayContainsItem(id, appArray)) {
                    $app = $app.eq(0);
                    var appHtml = $.trim($app.html());
                    var onClick = $app.attr("onclick");
                    $("#opened_apps_holder").append("<div data-appid='" + id + "' class='opened-app-icon' onclick=\"" + onClick + "\">" + appHtml + "</div>");
                    appArray.push(id);
                }
            });

            $("#pnl_icons").find(".app-icon").each(function () {
                var id = $(this).attr("data-appid");
                if ($(this).hasClass("active") && !ArrayContainsItem(id, appArray)) {
                    var appHtml = $.trim($(this).html());
                    var onClick = $(this).attr("onclick");
                    $("#opened_apps_holder").append("<div data-appid='" + id + "' class='opened-app-icon' onclick=\"" + onClick + "\">" + appHtml + "</div>");
                    appArray.push(id);
                }
            });

            if (appArray.length > 0) {
                $("#opened_apps_header").show();
            }
        }
    }
    function ArrayContainsItem(item, appArray) {
        for (var i = 0; i < appArray.length; i++) {
            if (item == appArray[i]) {
                return true;
            }
        }

        return false;
    }
    function CloseAllOpened() {
        $("#pnl_options").find(".loaded-app-holder").each(function () {
            var id = $(this).attr("id").replace("-loadedapp", "");
            $("#pnl_options").find("#" + id + "-loadedapp").remove();
            $("#load-option-text").html("<b>" + $.trim($("#" + id).find(".app-icon-font").html()) + "</b> Options");
        });

        $(".app-icon").removeClass("active");
        $(".app-icon").find(".app-icon-font").removeClass("mobile-open");
        $(".app-icon").find(".workspace-reminder").remove();

        if (!performingAction && canConnect) {
            performingAction = true;
            StartLoadingOverlay("Closing Apps...");
            $.ajax({
                url: "WebServices/AcctSettings.asmx/CloseAllAppsFromAppRemote",
                type: "POST",
                data: '{ }',
                contentType: "application/json; charset=utf-8",
                complete: function (data) {
                    performingAction = false;
                    CloseStartLoadingOverlay();
                    $("#pnl_options-minHeight").show();
                    $("#options-btn-device").show();

                    $("#opened_apps_header").hide();
                    $("#opened_apps_holder").html("");

                    appRemote_Config.remoteId = "";
                    appRemote_Config.remoteName = "";
                    UpdateURL();
                }
            });
        }
        else if (!canConnect) {
            CloseStartLoadingOverlay();
            $("#pnl_options-minHeight").show();
            $("#options-btn-device").show();

            $("#opened_apps_header").hide();
            $("#opened_apps_holder").html("");

            appRemote_Config.remoteId = "";
            appRemote_Config.remoteName = "";
            UpdateURL();
        }
    }

    $(document.body).on("click", "#menu-s", function () {
        MenuClick();
    });
    $(document.body).on("click", "#db-b", function () {
        appRemote.HideApp();

        appRemote_Config.remoteId = "";
        appRemote_Config.remoteName = "";
        UpdateURL();
    });
    $(document.body).on("click", "#db-c", function () {
        $("#db-b").hide();
        $("#db-c").hide();

        $("#group-list").html("");

        if ($("#notifications-viewtable").css("display") == "block") {
            UpdateURL();
        }
        else if ($("#pnl_AccountInfo").css("display") == "block") {
            UpdateURL();
        }
        else if (appRemote_Config.categoryId == "adminPages") {
            $("#pnl_adminPage_iframe").hide();
            $("#pnl_adminPage_iframe").html("");
            $("#pnl_adminPages").show();

            appRemote_Config.categoryId = "adminPages";
            appRemote_Config.categoryName = "pageSelect";
            appRemote_Config.remoteId = "";
            appRemote_Config.remoteName = "";
            UpdateURL();
        }
        else if (appRemote_Config.categoryId == "chatClient") {
            $(".iFrame-chat").each(function () {
                $(this).remove();
            });
            appRemote_Config.categoryId = "chatClient";
            appRemote_Config.categoryName = "userSelect";
            appRemote_Config.remoteId = "";
            appRemote_Config.remoteName = "";
            UpdateURL();
        }
        else {
            $("#pnl_options").find("#" + appRemote_Config.remoteId + "-loadedapp").remove();
            $(".app-icon[data-appid='" + appRemote_Config.remoteId + "']").removeClass("active");
            $(".app-icon[data-appid='" + appRemote_Config.remoteId + "']").find(".app-icon-font").removeClass("mobile-open");
            $("#load-option-text").html("<b>" + appRemote_Config.remoteName + "</b> Options");
            $("#pnl_options-minHeight").show();
            $("#options-btn-device").show();

            appRemote_Config.remoteId = "";
            appRemote_Config.remoteName = "";
            UpdateURL();
        }
    });
    $(document.body).on("click", "#db-s", function () {
        CloseMenu();
        if (!performingAction) {
            $("#loading-message-modal").html("");
            if (($("#workspace-selector-overlay").css("display") == "none") || ($("#workspace-selector-modal").css("display") == "none")) {
                performingAction = true;
                var loadOverlayto = setTimeout(function () {
                    StartLoadingOverlay("Getting Current...");
                }, 1500);
                $.ajax({
                    url: "WebServices/AcctSettings.asmx/GetCurrentWorkspace_Remote",
                    type: "POST",
                    data: '{ }',
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        performingAction = false;
                        clearTimeout(loadOverlayto);
                        CloseStartLoadingOverlay();
                        if (data.d != "") {
                            $("#dropdownSelector").val(data.d);
                        }

                        $("#workspace-selector-overlay, #workspace-selector-modal").show();
                    },
                    error: function () {
                        $('#loading-message').html("<span style='color: Red;'>Error! Try again.</span>");
                        setTimeout(function () {
                            CloseStartLoadingOverlay();
                            if (canConnect) {
                                canConnect = false;
                                Load();
                            }
                        }, appRemote_Config.closeTimeout);
                        performingAction = false;
                    }
                });
            }
            else {
                $("#workspace-selector-overlay, #workspace-selector-modal").hide();
            }
        }
    });
    $(document.body).on("click", "#cc-s", function () {
        appRemote_Config.categoryId = "chatClient";
        appRemote_Config.categoryName = "userSelect";
        appRemote_Config.remoteId = "";
        appRemote_Config.remoteName = "";
        UpdateURL();
    });
    $(document.body).on("click", "#wl-s", function () {
        appRemote_Config.categoryId = "";
        appRemote_Config.categoryName = "";
        appRemote_Config.remoteId = "";
        appRemote_Config.remoteName = "";
        UpdateURL();
    });
    $(document.body).on("click", "#login-s", function () {
        CloseMenu();
        if ($("#pnl_login").css("display") != "block") {
            if (window.location.href.indexOf("?") == -1) {
                window.location += "?loginPnl=true";
            }
            else {
                window.location = GetLocationWithPartialSearch() + "loginPnl=true";
            }
        }
    });
    $(document.body).on("click", "#ap-s", function () {
        appRemote_Config.categoryId = "adminPages";
        appRemote_Config.categoryName = "pageSelect";
        appRemote_Config.remoteId = "";
        appRemote_Config.remoteName = "";
        UpdateURL();
    });
    $(document.body).on("click", "#lbl_UserName", function () {
        CloseMenu();
        if ($("#pnl_AccountInfo").css("display") != "block") {
            if (window.location.href.indexOf("?") == -1) {
                window.location += "?acctInfo=true";
            }
            else {
                window.location = GetLocationWithPartialSearch() + "acctInfo=true";
            }
        }
    });

    function GetLocationWithPartialSearch() {
        var loc = window.location.href.replace(window.location.href.substring(window.location.href.indexOf("&")), "");
        if (loc == "") {
            loc = window.location.href.replace(window.location.href.substring(window.location.href.indexOf("?")), "");
        }

        if (loc.indexOf("?") == -1) {
            loc += "?";
        }
        else {
            loc += "&";
        }

        return loc;
    }

    $(document.body).on("click", "#workspace-selector-overlay", function () {
        if (!performingAction) {
            if (($("#workspace-selector-overlay").css("display") != "none") || ($("#workspace-selector-modal").css("display") != "none")) {
                $("#loading-message-modal").html("");
                $("#workspace-selector-overlay, #workspace-selector-modal").hide();
            }
        }
    });
    $(document.body).on("keydown", "#moveresize-top, #moveresize-left, #moveresize-width, #moveresize-height", function (event) {
        try {
            if (event.which == 13) {
                event.preventDefault();
                OpenApp();
                return false;
            }
        } catch (evt) {
            if (event.keyCode == 13) {
                event.preventDefault();
                OpenApp();
                return false;
            }
            delete evt;
        }
    });
    $(document.body).on("change", "#dropdownSelector", function () {
        OnWorkspaceClick($(this).val());
    });

    $(document.body).on("click", "#Category-Back", function () {
        CategoryBack(true);
    });
    function CategoryClick(id, category, updateUrl) {
        appRemote_Config.categoryId = id;
        appRemote_Config.categoryName = category;
        $(".app-icon-category-list").hide();
        $("#Category-Back").show();
        $("." + appRemote_Config.categoryId).show();
        $("#Category-Back-Name").html(appRemote_Config.categoryName);
        $("#Category-Back-Name-id").html(appRemote_Config.categoryId);

        if (updateUrl) {
            UpdateURL();
        }
    }
    function CategoryBack(updateUrl) {
        appRemote_Config.categoryId = "";
        appRemote_Config.categoryName = "";
        appRemote_Config.remoteId = "";
        appRemote_Config.remoteName = "";
        var category = $("#Category-Back-Name-id").html();
        $("#Category-Back").hide();
        if ((category != "") && (category != undefined) && (category != null)) {
            if ($("." + category).length > 0) {
                $("." + category).hide();
                $(".app-icon-category-list").show();
                $("#Category-Back-Name").html("");
                $("#Category-Back-Name-id").html("");
            }
        }
        else {
            if ($("#pnl_chat_users").css("display") == "block") {
                $("#pnl_chat_users").hide();
            }
            if ($("#pnl_options").css("display") == "block") {
                $("#pnl_options").hide();
            }
            if ($("#pnl_adminPages").css("display") == "block") {
                $("#pnl_adminPages").hide();
            }
            if ($("#pnl_icons").css("display") == "none") {
                $("#pnl_icons").show();
            }
            $(".app-icon-category-list").show();
            $("#Category-Back-Name").html("");
            $("#Category-Back-Name-id").html("");
        }
        if (updateUrl) {
            UpdateURL();
        }
    }

    $(document.body).on("click", "#notifications", function () {
        CloseMenu();
        if ($("#notifications-viewtable").css("display") != "block") {
            if (window.location.href.indexOf("?") == -1) {
                window.location += "?notiOn=true";
            }
            else {
                window.location = GetLocationWithPartialSearch() + "notiOn=true";
            }
        }
    });
    $(document.body).on("click", "#tryconnect", function () {
        if (!canConnect) {
            StartLoadingOverlay("Trying to Connect");
            CanConnectToWorkspace();
        }
        else {
            canConnect = false;
            Load();
            GetOpenedAppsForMenu();
        }
    });
    $(document.body).on("click", "#group-btns-holder", function () {
        CloseMenu();
        if ($("#grouplogin-list").css("display") != "block") {
            if (window.location.href.indexOf("?") == -1) {
                window.location += "?groupLogin=true";
            }
            else {
                window.location = GetLocationWithPartialSearch() + "groupLogin=true";
            }
        }
    });
    $(document.body).on("click", "#groupLogout", function () {
        CloseMenu();
        StartLoadingOverlay("Please Wait");
        $("#hf_LogoutOfGroup").val(new Date().toString());
        __doPostBack("hf_LogoutOfGroup", "");
    });

    function AddBackgroundColorToLogo(color) {
        if (color == "" || color == null) {
            color = "0,0,0";
        }

        if ($("#groupLoginLogo").length > 0) {
            $("#groupLoginLogo").addClass("logo-backgroundcolor");
            $(".logo-backgroundcolor").css("background-color", "rgba(" + color + ",0.4)");
        }
        else if ($("#mainLoginLogo").length > 0) {
            $("#mainLoginLogo").addClass("logo-backgroundcolor");
            $(".logo-backgroundcolor").css("background-color", "rgba(" + color + ",0.4)");
        }
    }

    /* Group Login Modal */
    function GroupLoginModal() {
        if ($.trim($("#group-list").html()) == "") {
            StartLoadingOverlay("Please Wait");
            $.ajax({
                url: "WebServices/AcctSettings.asmx/GetUserGroups",
                type: "POST",
                data: '{ }',
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    var x = "";
                    try {
                        for (var i = 0; i < data.d[0].length; i++) {
                            var groupId = data.d[0][i][0];
                            var groupName = data.d[0][i][1];
                            var image = data.d[0][i][2];
                            var owner = data.d[0][i][3];
                            var background = data.d[0][i][4];

                            var styleBackground = "style=\"background: url('" + background + "'); background-size: cover;\"";

                            x += "<div class='group-selection-entry' onclick='appRemote.LoginAsGroup(\"" + groupId + "\")' title='Click to login' " + styleBackground + ">";
                            x += "<div class='overlay'></div>";
                            x += "<div class='group-selection-info'>";
                            x += "<div class='group-name-info'>";
                            x += "<span class='group-name'>" + groupName + "</span><div class='clear-space-five'></div>";
                            x += "<span class='group-info'><b class='pad-right-sml'>Owner:</b>" + owner + "</span>";
                            x += "</div>";
                            x += "<img class='group-img' alt='Group Logo' src='" + image + "' />";
                            x += "</div></div>";
                        }

                        if (appRemote.ConvertBitToBoolean(data.d[1])) {
                            x += "<div class='logingroupselector-logout' onclick='appRemote.LoginAsGroup(\"\")'>";
                            x += "<div>Log Out of Group</div>";
                            x += "</div>";
                        }

                        x += "<div class='clear-space'></div>";
                    }
                    catch (evt) { }

                    $("#group-list").html(x);
                    CloseStartLoadingOverlay();
                }
            });
        }
    }
    function LoginAsGroup(id) {
        StartLoadingOverlay("Please Wait");

        $.ajax({
            url: "WebServices/AcctSettings.asmx/LoginUnderGroup",
            type: "POST",
            data: '{ "id": "' + id + '" }',
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data.d == "true") {
                    window.location = "AppRemote.aspx";
                }
                else {
                    window.location = "AppRemote.aspx?group=" + id;
                }
            },
            error: function (e) {
                CloseStartLoadingOverlay();
            }
        });
    }


    /* Initialization */
    function init() {
        InitializeAdminPageLinks();
    };
    function InitializeAdminPageLinks() {
        if ($("#pnl_adminPages").length > 0) {
            $("#pnl_adminPages").find(".app-icon-links, .app-icon-sub-links").each(function () {
                var link = $(this).attr("href");

                if (link.indexOf("?") > 0) {
                    link += "&mobileMode=true";
                }
                else {
                    link += "?mobileMode=true";
                }

                $(this).attr("onclick", "appRemote.LoadAdminPage('" + link + "');return false;");
                $(this).attr("href", "#");
            });
        }
    }
    function SetAdminMode() {
        $("#workspace_header_btn").remove();
        isAdminMode = true;
        appRemote_Config.categoryId = "adminPages";
        appRemote_Config.categoryName = "pageSelect";
        appRemote_Config.remoteId = "";
        appRemote_Config.remoteName = "";
        UpdateURL();
    }
    function SetDemoMode() {
        $("#workspace_header_btn").remove();
        $("#notifications").remove();
        $("#pnl_login").hide();
        $("#app-load-options").remove();

        isDemoMode = true;
        Load();
    }

    var canConnect = false;
    function CanConnectToWorkspace() {
        if (!appRemote_Config.forceGroupLogin) {
            if (!appRemote.IsComplexWorkspaceMode()) {
                $("#workspace_header_btn").remove();
                canConnect = true;
            }
            else {
                if (!isDemoMode && !isAdminMode) {
                    $.ajax({
                        url: "WebServices/AcctSettings.asmx/CanConnectToWorkspace",
                        type: "POST",
                        data: '{ }',
                        contentType: "application/json; charset=utf-8",
                        success: function (data) {
                            if (data.d == "simple") {
                                canConnect = false;
                            }
                            else {
                                if (appRemote.ConvertBitToBoolean(data.d)) {
                                    canConnect = true;
                                }
                                else {
                                    canConnect = false;
                                }
                            }

                            Load();
                        },
                        error: function () {
                            canConnect = false;
                            Load();
                        }
                    });
                }
            }
        }
    }
    function ShiftControls() {
        if (!isDemoMode && !isAdminMode) {
            if (IsComplexWorkspaceMode()) {
                if (canConnect) {
                    $("#tryconnect").html("<span class='connected-img'></span>Disconnect from Workspace");
                    $("#tryconnect").addClass("synced");
                }
                else {
                    $("#tryconnect").html("<span class='disconnected-img'></span>Connect to Workspace");
                    $("#tryconnect").removeClass("synced");
                }
            }
        }

        $("#pnl_adminPages, #pnl_AccountInfo, #pnl_adminPage_iframe, #pnl_chat_popup, #pnl_chat_users, #pnl_icons, #pnl_login, #pnl_options, #notifications-viewtable, #grouplogin-list").css({
            top: $("#always-visible").outerHeight(),
            bottom: $("#container-footer").outerHeight()
        });

        if ($(".iFrame-chat").length > 0) {
            var h1 = $(window).height();
            var h2 = $("#always-visible").height();
            var h3 = $("#container-footer").height();
            var finalHeight = h1 - (h2 + h3);
            $(".iFrame-chat").height(finalHeight - 1);
        }
        $(".loaded-app-holder").each(function () {
            if ($(this).css("visibility") != "hidden") {
                var iframeHt = Math.abs($(window).height() - ($("#always-visible").outerHeight() + $("#container-footer").outerHeight()));
                $(this).css({
                    height: iframeHt,
                    width: $(window).width()
                });
            }
        });
    }

    function Load() {
        if (!performingAction) {
            currUrl = window.location.hash;
            ResetControls();

            if (appRemote_Config.autoSync && !canConnect) {
                CanConnectToWorkspace();
            }

            if ($("#pnl_login").length > 0) {
                $("#login_header_btn").show();
            }

            if (appRemote_Config.forceGroupLogin) {
                $("#grouplogin-list").show();
                GroupLoginModal();
            }
            else {
                if (currUrl == "") {
                    if ($("#pnl_login").length > 0 && $("#pnl_icons").length == 0) {
                        $("#pnl_login").show();
                    }
                    else {
                        $("#pnl_icons").show();

                        HideApp();
                        GetAllOpenedApps();
                        CategoryBack(false);
                    }
                }
                else if (currUrl.indexOf("acctInfo=true") != -1) {
                    if ($("#pnl_login").length > 0) {
                        $("#pnl_login").show();
                        $("#login_header_btn").hide();
                    }
                    else {
                        $("#pnl_AccountInfo").show();
                        $("#db-c").show();
                    }
                    $("#pnl_icons").hide();
                }
                else if (currUrl.indexOf("loginPnl=true") != -1) {
                    $("#pnl_login").show();
                    $("#pnl_icons").hide();
                    $("#login_header_btn").hide();
                }
                else if (currUrl.indexOf("notiOn=true") != -1) {
                    $("#login_header_btn").hide();
                    $("#db-c").show();
                    $("#notifications").hide();
                    GetUserNotifications(true);
                    $("#notifications-viewtable").show();
                }
                else if (currUrl.indexOf("groupLogin=true") != -1) {
                    $("#login_header_btn").hide();
                    $("#db-c").show();
                    $("#notifications").hide();
                    GroupLoginModal();
                    $("#grouplogin-list").show();
                }
                else {
                    if ($("#pnl_login").length > 0 && $("#pnl_icons").length == 0) {
                        $("#pnl_login").show();
                    }
                    else {
                        var id = getUrlParameterByName("id");
                        var category = getUrlParameterByName("category");
                        var appId = getUrlParameterByName("appId");
                        var name = getUrlParameterByName("name");

                        appRemote_Config.categoryId = id;
                        appRemote_Config.categoryName = category;
                        appRemote_Config.remoteId = appId;
                        appRemote_Config.remoteName = name;

                        if (id == "chatClient") {
                            LoadChatClient(category, appId, name);
                        }
                        else if (id == "adminPages") {
                            LoadAdminPages(id, category);
                        }
                        else {
                            LoadAppIcons(id, category, appId, name);
                        }
                    }
                }
            }
        }
        else if ((currUrl != "#") && (currUrl != "") && (currUrl != "1")) {
            var loc = window.location.href.split("#");
            if (loc.length > 0) {
                for (var i = 1; i < loc.length; i++) {
                    if ($.trim(loc[i]) != "") {
                        currUrl = $.trim(loc[i]);
                        break;
                    }
                }

                loc = loc[0];
            }

            window.location = loc + "#" + currUrl;
        }

        ShiftControls();
    }
    function ResetControls() {
        CloseStartLoadingOverlay();

        $(".loaded-app-holder").each(function () {
            var id = $(this).attr("id");
            if (id != null && id != undefined && id != "") {
                $(this).css({
                    visibility: "hidden",
                    height: 1,
                    width: 1,
                    position: "absolute",
                    top: -($(window).height() + 1)
                });
            }
        });

        $("#notifications-viewtable, #grouplogin-list").hide();

        if (currUrl.indexOf("notiOn=true") == -1) {
            $("#NotificationHolder").html("");
        }

        if (currUrl.indexOf("groupLogin=true") == -1) {
            $("#group-list").html("");
        }

        $("#loading-message-modal").html("");
        $(".loading-background-holder").remove();

        if ((appRemote_Config.categoryId == "adminPages" && appRemote_Config.categoryName == "pageSelect") || appRemote_Config.categoryId != "adminPages") {
            $("#pnl_adminPage_iframe").html("");
            $("#pnl_adminPage_iframe").hide();
        }
        else {
            $("#pnl_adminPage_iframe").css("visibility", "hidden");
        }

        $("#pnl_icons, #pnl_AccountInfo, #pnl_options, #pnl_chat_users, #pnl_chat_popup, #pnl_appMoveResize, #pnl_adminPages, #workspace-selector-overlay, #workspace-selector-modal").hide();

        $("#rb_norm").prop("checked", true);
        $("#ddl_appDropdownSelector").val("1");
        $("#loading-message").html("");
        $("#load-option-text").html("");

        $("#login_header_btn").hide();
        $("#db-b").hide();
        $("#db-c").hide();
        $("#notifications").show();

        if (isAdminMode && appRemote_Config.categoryId != "adminPages") {
            SetAdminMode();
        }

        if ($("#pnl_login").length > 0) {
            $("#pnl_login").hide();
            $("#login_header_btn").show();
        }

        if (canConnect) {
            $("#workspace_header_btn").show();
        }
        else {
            $("#workspace_header_btn").hide();
        }
    }

    function LoadAdminPages(id, category) {
        if ($("#pnl_adminPages").length > 0) {
            if (category == "pageSelect") {
                $("#pnl_adminPage_iframe").hide();
                $("#pnl_adminPage_iframe").html("");
                $("#pnl_adminPages").show();
            }
            else {
                BeginAdminPageLoad();
                if ($.trim($("#pnl_adminPage_iframe").html()) == "") {
                    ReloadAdminPage(category);
                }
                else {
                    $("#pnl_adminPage_iframe").css("visibility", "visible");
                }
            }
        }
    }
    function BeginAdminPageLoad() {
        $("#pnl_adminPages, #pnl_icons, #pnl_chat_users, #pnl_options, #pnl_chat_popup, #pnl_appMoveResize, #login_header_btn").hide();
        $("#db-c").show();
    }
    function LoadAdminPage(url) {
        if (window.event === undefined || (!$(window.event.target).hasClass("img-expand-sml") && !$(window.event.target).hasClass("img-collapse-sml"))) {
            appRemote_Config.categoryId = "adminPages";
            appRemote_Config.categoryName = escape(url);
            appRemote_Config.remoteId = "";
            appRemote_Config.remoteName = "";
            UpdateURL();
        }
    }
    function ReloadAdminPage(url) {
        var iframeHt = Math.abs($(window).height() - ($("#always-visible").outerHeight() + $("#container-footer").outerHeight()));

        $("#pnl_adminPage_iframe").html("<div class='loading-background-holder'></div><iframe src='" + unescape(url) + "' frameborder='0' class='loaded-app-holder' style='width: " + $(window).width() + "; height: " + iframeHt + "px;'></iframe>");
        $("#pnl_adminPage_iframe").show();
        $("#pnl_adminPage_iframe").css("visibility", "visible");

        $(".loaded-app-holder").one("load", (function () {
            $(".loading-background-holder").remove();
        }));
    }

    function LoadChatClient(category, appId, name) {
        if ($("#pnl_chat_users").length > 0) {
            if (appId != "") {
                LoadChatClientPnl(appId, name);
            }
            else if (category == "userSelect") {
                $("#pnl_chat_users").show();
            }
        }
    }
    function LoadChatClientPnl(appId, name) {
        if ($("#pnl_chat_popup").length > 0) {
            appRemote_Config.remoteId = appId;
            appRemote_Config.remoteName = name;
            if (appId.indexOf("app-") == -1) {
                $("#pnl_chat_users").hide();
                try {
                    chatClient.BuildChatWindowMobile(appId);

                    $("#db-b").hide();
                    $("#db-c").show();
                }
                catch (evt) { }
            }
            else {
                $("#pnl_chat_users").show();
                appRemote_Config.categoryId = "chatClient";
                appRemote_Config.categoryName = "userSelect";
                appRemote_Config.remoteId = "";
                appRemote_Config.remoteName = "";
                UpdateURL();
            }
        }
    }

    function LoadAppIcons(id, category, appId, name) {
        $("#pnl_icons").show();

        HideApp();
        GetAllOpenedApps();

        if (id != "" && category != "") {
            CategoryClick(id, category, false);
        }
        else if (appId == "") {
            CategoryBack(false);
        }

        if (appId != "") {
            $("#db-c").show();
            GetAppRemoteProps(appId, name);
        }
    }
    function LoadOptions(id, name, updateUrl) {
        if (appRemote_Config.categoryId == "chatClient" || appRemote_Config.categoryId == "adminPages") {
            appRemote_Config.categoryId = "";
            appRemote_Config.categoryName = "";
        }

        appRemote_Config.remoteId = id;
        appRemote_Config.remoteName = name;
        if (updateUrl) {
            UpdateURL();
        }
    }


    function UpdateURL() {
        CloseMenu();
        var loc = window.location.href.split("#?");
        if (loc.length > 0) {
            loc = loc[0];
        }

        if (loc.indexOf("#") != loc.length - 1) {
            loc += "#";
        }

        if ((appRemote_Config.categoryId != "") && (appRemote_Config.categoryName != "")) {
            loc += "?id=" + appRemote_Config.categoryId + "&category=" + appRemote_Config.categoryName;
        }

        if ((appRemote_Config.remoteId != "") && (appRemote_Config.remoteName != "")) {
            if ((appRemote_Config.categoryId != "") && (appRemote_Config.categoryName != "")) {
                loc += "&";
            }
            else {
                loc += "?";
            }

            loc += "appId=" + appRemote_Config.remoteId + "&name=" + appRemote_Config.remoteName;
        }

        window.location = loc;
    }
    function getUrlParameterByName(e) {
        e = e.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var t = "[\\?&]" + e + "=([^&#]*)";
        var n = new RegExp(t);
        var url = window.location.href.replace("#", "");
        var r = n.exec(url);
        if (r == null)
            return "";
        else
            return decodeURIComponent(r[1].replace(/\+/g, " "));
    }

    function StartLoadingOverlay(message) {
        if (message.indexOf("...") != -1) {
            message = message.replace("...", "");
        }

        if ($("#loadoptions-selector-overlay").css("display") == "block") {
            $("#loadoptions-selector-overlay, #loadoptions-selector-modal").hide();
            $("#loading-message").html("");
        }

        $("#loading-message").html(message);
        $("#loadoptions-selector-overlay, #loadoptions-selector-modal").show();
    }
    function CloseStartLoadingOverlay() {
        $("#loadoptions-selector-overlay, #loadoptions-selector-modal").hide();
        $("#loading-message").html("");
    }

    function OnWorkspaceClick(num) {
        if (!performingAction) {
            performingAction = true;
            $("#loading-message-modal").html("Switching Workspaces...");
            $.ajax({
                url: "WebServices/AcctSettings.asmx/UpdateAppRemote",
                type: "POST",
                data: '{ "id": "workspace-selector","options": "' + num + '" }',
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (appRemote.ConvertBitToBoolean(data.d)) {
                        $("#workspace-selector-overlay, #workspace-selector-modal").hide();
                        $("#loading-message-modal").html("");
                    }
                    else {
                        $('#loading-message-modal').html("<span style='color: Red;'>Error! Try again.</span>");
                        if (canConnect) {
                            canConnect = false;
                            Load();
                        }
                    }
                    performingAction = false;
                },
                error: function () {
                    $('#loading-message-modal').html("<span style='color: Red;'>Error! Try again.</span>");
                    if (canConnect) {
                        canConnect = false;
                        Load();
                    }

                    performingAction = false;
                }
            });
        }
    }
    function GetAppRemoteProps(id, name) {
        if (!performingAction) {
            $(".app-icon[data-appid='" + id + "']").removeClass("active");
            $(".app-icon[data-appid='" + id + "']").find(".app-icon-font").removeClass("mobile-open");

            if ($("#" + id + "-loadedapp").length > 0) {
                $("#pnl_options-minHeight").hide();

                var iframeHt = Math.abs($(window).height() - ($("#always-visible").outerHeight() + $("#container-footer").outerHeight()));
                $("#" + appRemote_Config.remoteId + "-loadedapp").css({
                    visibility: "visible",
                    position: "",
                    top: "",
                    height: iframeHt,
                    width: $(window).width()
                });

                $("#db-b").show();
                $("#db-c").show();
                $("#pnl_options").show();
                $("#pnl_adminPages, #pnl_icons").hide();
                $(".app-icon[data-appid='" + id + "']").addClass("active");
                $(".app-icon[data-appid='" + id + "']").find(".app-icon-font").addClass("mobile-open");
                return;
            }
            else {
                $("#pnl_options-minHeight").show();
                $(".app-icon[data-appid='" + id + "']").removeClass("active");
                $("#load-option-text").html("<b>" + appRemote_Config.remoteName + "</b> Options");
            }

            performingAction = true;
            var loadOverlayto = setTimeout(function () {
                StartLoadingOverlay("Loading Options...");
            }, 1500);
            $.ajax({
                url: "WebServices/AcctSettings.asmx/GetAppRemoteProps",
                type: "POST",
                data: '{ "appId": "' + id + '" }',
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    clearTimeout(loadOverlayto);
                    CloseStartLoadingOverlay();
                    if (appRemote.IsComplexWorkspaceMode()) {
                        $("#options-btn-open").show();
                    }

                    $("#options-btn-update").hide();
                    $("#pnl_appMoveResize").hide();

                    if (data.d.length > 0 && data.d[0].length == 14) {
                        var closed = data.d[0][0];
                        var min = data.d[0][1];
                        var max = data.d[0][2];
                        var db = data.d[0][3];
                        var updated = data.d[0][4];

                        var poxX = data.d[0][5].replace("px", "");
                        var poxY = data.d[0][6].replace("px", "");
                        var width = data.d[0][7].replace("px", "");
                        var height = data.d[0][8].replace("px", "");

                        var minHeight = data.d[0][9].replace("px", "");
                        var minWidth = data.d[0][10].replace("px", "");

                        var popoutLoc = data.d[0][11];
                        var allowMax = data.d[0][12];
                        var allowResize = data.d[0][13];

                        if ((width == "0") || (width == "")) {
                            width = minWidth;
                        }
                        if ((height == "0") || (height == "")) {
                            height = minHeight;
                        }

                        if ($("#app-load-options").length > 0) {
                            appMinWidth = minWidth;
                            appMinHeight = minHeight;

                            $("#moveresize-left").val(poxX);
                            $("#moveresize-top").val(poxY);
                            $("#moveresize-width").val(width);
                            $("#moveresize-height").val(height);

                            $("#moveresize-left").spinner({ min: 0 });
                            $("#moveresize-top").spinner({ min: 0 });
                            $("#moveresize-width").spinner({ min: parseInt(minWidth) });
                            $("#moveresize-height").spinner({ min: parseInt(minHeight) });

                            if (appRemote.IsComplexWorkspaceMode()) {
                                if (canConnect) {
                                    $("#app-load-options").show();
                                }
                                else {
                                    $("#app-load-options").hide();
                                }

                                if (appRemote.ConvertBitToBoolean(closed)) {
                                    $("#options-btn-close").hide();
                                }
                                else {
                                    $("#options-btn-close").show();
                                    $("#options-btn-open").hide();
                                    $("#options-btn-update").show();
                                    if (canConnect) {
                                        $(".app-icon[data-appid='" + id + "']").addClass("active");
                                    }
                                }
                            }
                            else {
                                $("#options-btn-close").hide();
                                $("#options-btn-open").hide();
                                $("#options-btn-update").hide();
                                $("#app-load-options").hide();
                            }

                            if (db != "") {
                                $("#ddl_appDropdownSelector").val(GetWorkspaceNumber(db));
                            }
                            else {
                                $("#ddl_appDropdownSelector").val(GetWorkspaceNumber(data.d[1]));
                            }

                            $("#rb_norm").prop("checked", true);
                            if (!appRemote.ConvertBitToBoolean(closed)) {
                                $("#pnl_appMoveResize").hide();
                                $("#resize-div").hide();

                                if ((!appRemote.ConvertBitToBoolean(allowMax)) && (!appRemote.ConvertBitToBoolean(allowResize))) {
                                    $("#pnl_appMoveResize").show();
                                }
                                else if (appRemote.ConvertBitToBoolean(allowResize)) {
                                    $("#pnl_appMoveResize").show();
                                    $("#resize-div").show();
                                }

                                if (appRemote.ConvertBitToBoolean(max)) {
                                    $("#rb_max").prop("checked", true);
                                }
                                if (appRemote.ConvertBitToBoolean(min)) {
                                    $("#rb_min").prop("checked", true);
                                }
                            }
                            else {
                                $("#rb_norm").prop("checked", true);
                                $("#pnl_appMoveResize").hide();
                            }

                            if (updated != "") {
                                $("#last-updated").html("<b class='pad-right-sml'>Last Updated:</b>" + updated);
                            }

                            if (appRemote.ConvertBitToBoolean(allowMax)) {
                                $("#div_max_rb_holder").show();
                            }
                            else {
                                $("#div_max_rb_holder").hide();
                            }
                        }

                        $("#no-options-available").hide();
                        $("#options-btn-device").hide();
                        if (popoutLoc != "") {
                            $("#options-btn-device").attr("href", popoutLoc);
                            $("#options-btn-device").show();
                        }

                        if (isDemoMode || !canConnect || !appRemote.IsComplexWorkspaceMode()) {
                            $("#options-btn-close").hide();
                            $("#options-btn-open").hide();
                            $("#options-btn-update").hide();
                            if ($("#options-btn-device").css("display") == "none") {
                                $("#no-options-available").show();
                            }
                        }
                    }
                    else {
                        $("#no-options-available").hide();
                        $("#options-btn-device").hide();
                        $("#options-btn-close").hide();
                        $("#pnl_appMoveResize").hide();
                        $("#ddl_appDropdownSelector").val("1");
                        $("#rb_norm").prop("checked", true);
                        $("#last-updated").html("");
                    }

                    var totalOptionsShown = 0;
                    $("#load-option-btn-holder").find(".option-buttons").each(function () {
                        if ($(this).css("display") != "none") {
                            totalOptionsShown++;
                        }
                    });

                    performingAction = false;
                    if (totalOptionsShown == 1 && $("#options-btn-device").css("display") == "block") {
                        appRemote.LoadApp();
                    }
                    else {
                        $("#load-option-text").next(".accordion-content").show();
                    }

                    $(document).tooltip({ disabled: true });
                    $("#pnl_adminPages").hide();
                    $("#pnl_icons").hide();
                    $(document).tooltip({ disabled: false });
                    $("#pnl_options").show();
                },
                error: function () {
                    alert("Error trying to access account. Please try again.");
                    if (canConnect) {
                        canConnect = false;
                        Load();
                    }
                    performingAction = false;
                }
            });
        }
    }
    function GetAllOpenedApps() {
        $(".app-icon").removeClass("active");
        $("#pnl_options").find(".loaded-app-holder").each(function () {
            var loadedAppId = $(this).attr("id").replace("-loadedapp", "");
            $(".app-icon[data-appid='" + loadedAppId + "']").addClass("active");
        });

        if (appRemote.IsComplexWorkspaceMode()) {
            $(".workspace-reminder").each(function () {
                $(this).remove();
            });

            if (canConnect) {
                var loadOverlayto = setTimeout(function () {
                    StartLoadingOverlay("Loading Remote...");
                }, 1500);
                $.ajax({
                    url: "WebServices/AcctSettings.asmx/GetAllOpenedApps",
                    type: "POST",
                    data: '{ }',
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        clearTimeout(loadOverlayto);
                        CloseStartLoadingOverlay();
                        if (data.d != null) {
                            for (var i = 0; i < data.d.length; i++) {
                                var $this = $(".app-icon[data-appid='" + data.d[i][0] + "']");
                                $this.addClass("active");

                                if (data.d[i][1] != "") {
                                    var db = "<span class='workspace-reminder font-no-bold'>" + GetWorkspaceNumber(data.d[i][1]) + "</span>";
                                    $this.append(db);
                                }
                            }
                        }

                        GetOpenedAppsForMenu();
                    }
                });
            }
        }
        else {
            clearTimeout(loadOverlayto);
            CloseStartLoadingOverlay();
        }
    }
    function GetWorkspaceNumber(db) {
        return db.replace("workspace_", "");
    }
    function OpenApp() {
        if (!performingAction) {
            performingAction = true;
            var options = "";
            var isMaxed = false;

            options += $("#ddl_appDropdownSelector").val() + ";";

            if ($("#rb_max").is(":checked")) {

                options += "maximize;";
                isMaxed = true;
            }
            else if ($("#rb_min").is(":checked")) {
                options += "minimize;";
            }
            else {
                options += "normal;";
            }

            var top = parseInt($("#moveresize-top").val());
            var left = parseInt($("#moveresize-left").val());
            if ((top < 0) || (top == null) || ((top.toString() == "NaN") && (top != null))) {
                top = 0;
            }
            if ((left < 0) || (left == null) || ((left.toString() == "NaN") && (left != null))) {
                left = 0;
            }

            var width = parseInt($("#moveresize-width").val());
            var height = parseInt($("#moveresize-height").val());
            if ((width < appMinWidth) || (width == null) || ((width.toString() == "NaN") && (width != null))) {
                width = appMinWidth;
            }
            if ((height < appMinHeight) || (height == null) || ((height.toString() == "NaN") && (height != null))) {
                height = appMinHeight;
            }

            options += top + ";" + left + ";" + width + ";" + height + ";";

            if ($("#options-btn-update").css("display") == "block") {
                StartLoadingOverlay("Refreshing App...");
            }
            else {
                StartLoadingOverlay("Loading App...");
            }

            $.ajax({
                url: "WebServices/AcctSettings.asmx/UpdateAppRemote",
                type: "POST",
                data: '{ "id": "' + appRemote_Config.remoteId + '","options": "' + escape(options) + '" }',
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    performingAction = false;
                    if (appRemote.ConvertBitToBoolean(data.d)) {
                        setTimeout(function () {
                            CloseStartLoadingOverlay();
                            GetAppRemoteProps(appRemote_Config.remoteId, appRemote_Config.remoteName);
                        }, appRemote_Config.closeTimeout);
                    }
                    else {
                        $('#loading-message').html("<span style='color: Red;'>Could not load!</span>");
                        setTimeout(function () {
                            CloseStartLoadingOverlay();
                            if (canConnect) {
                                canConnect = false;
                                Load();
                            }
                        }, appRemote_Config.closeTimeout);
                    }
                },
                error: function () {
                    $('#loading-message').html("<span style='color: Red;'>Could not load!</span>");
                    setTimeout(function () {
                        CloseStartLoadingOverlay();
                        if (canConnect) {
                            canConnect = false;
                            Load();
                        }
                    }, appRemote_Config.closeTimeout);
                    performingAction = false;
                }
            });
        }
    }
    function LoadApp() {
        var $iframe = $("#" + appRemote_Config.remoteId + "-loadedapp");
        if ($iframe.length > 0) {
            $iframe.remove();
        }

        $("#pnl_options-minHeight").hide();

        var href = $("#options-btn-device").attr("href");
        if (href.toLowerCase().indexOf("externalappholder.aspx?appid") > 0) {
            href += "&hidetoolbar=true";
        }

        var iframeHt = Math.abs($(window).height() - ($("#always-visible").outerHeight() + $("#container-footer").outerHeight()));

        $("#db-b").show();
        $("#db-c").show();

        $(".app-icon[data-appid='" + appRemote_Config.remoteId + "']").addClass("active");
        $(".app-icon[data-appid='" + appRemote_Config.remoteId + "']").find(".app-icon-font").addClass("mobile-open");
        $("#pnl_options").append("<div class='loading-background-holder'></div>");
        $("#pnl_options").append("<iframe id='" + appRemote_Config.remoteId + "-loadedapp' src='" + href + "' frameborder='0' class='loaded-app-holder' style='width: " + $(window).width() + "; height: " + iframeHt + "px;'></iframe>");
        $(".loaded-app-holder").one("load", (function () {
            $(".loading-background-holder").remove();
        }));
    }
    function HideApp() {
        var topPos = -($("#" + appRemote_Config.remoteId + "-loadedapp").outerHeight() * 2);
        $("#" + appRemote_Config.remoteId + "-loadedapp").css({
            visibility: "hidden",
            position: "absolute",
            top: topPos
        });
        $("#db-b").hide();
        $("#db-c").hide();
    }
    function CloseApp() {
        if (!performingAction) {
            performingAction = true;
            StartLoadingOverlay("Closing App...");
            $.ajax({
                url: "WebServices/AcctSettings.asmx/UpdateAppRemote",
                type: "POST",
                data: '{ "id": "' + appRemote_Config.remoteId + '","options": "' + "close" + '" }',
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    performingAction = false;
                    if (appRemote.ConvertBitToBoolean(data.d)) {
                        setTimeout(function () {
                            CloseStartLoadingOverlay();
                            GetAppRemoteProps(appRemote_Config.remoteId, appRemote_Config.remoteName);
                        }, appRemote_Config.closeTimeout);
                    }
                    else {
                        $('#loading-message').html("<span style='color: Red;'>Error! Try again.</span>");
                        setTimeout(function () {
                            CloseStartLoadingOverlay();
                            if (canConnect) {
                                canConnect = false;
                                Load();
                            }
                        }, appRemote_Config.closeTimeout);
                    }
                },
                error: function () {
                    $('#loading-message').html("<span style='color: Red;'>Error! Try again.</span>");
                    setTimeout(function () {
                        CloseStartLoadingOverlay();
                        if (canConnect) {
                            canConnect = false;
                            Load();
                        }
                    }, appRemote_Config.closeTimeout);
                    performingAction = false;
                }
            });
        }
    }
    function AppsSortUnlocked(canSave) {
        if (canSave) {
            canSaveSort = true;
        }

        $('#updatePnl_AppList').sortable({
            axis: 'y',
            cancel: '.app-icon-category-list, #Category-Back',
            containment: '#updatePnl_AppList',
            opacity: 0.6,
            scrollSensitivity: 40,
            scrollSpeed: 40,
            start: function (event, ui) {
                $(document).tooltip({ disabled: true });
            },
            stop: function (event, ui) {
                var listorder = '';
                $('.app-icon').each(function () {
                    var temp = $(this).attr('data-appid');
                    if (temp != '' && listorder.indexOf(temp) == -1) {
                        listorder += (temp + ',');
                    }
                });

                if (canSaveSort) {
                    $.ajax({
                        url: 'WebServices/SaveControls.asmx/App_UpdateIcons',
                        type: 'POST', data: '{ "appList": "' + escape(listorder) + '" }',
                        contentType: 'application/json; charset=utf-8'
                    });
                }

                $(document).tooltip({ disabled: false });
            }
        });
        $('#updatePnl_AppList').disableSelection();
    }


    /* Notifications */
    var runningNotiCheck = false;
    var runningNoti = false;
    var runningMoreNoti = false;
    var ddNotiLoading = "<div class='ddLoadingMessage'><h3>Loading Notifications. Please Wait...</h3></div>";
    function CheckForNewNotifications() {
        if (!runningNotiCheck) {
            runningNotiCheck = true;
            $.ajax({
                url: "WebServices/NotificationRetrieve.asmx/CheckForNewNotifications",
                type: "POST",
                data: '{ }',
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    var total = parseInt(data.d);

                    $("#notifications").find("#total-noti").html(total);
                    if (total == 0) {
                        $("#notifications").find(".notification-icon").removeClass("notifications-new").addClass("notifications-none");
                    }
                    else {
                        $("#notifications").find(".notification-icon").removeClass("notifications-none").addClass("notifications-new");
                    }

                    runningNotiCheck = false;
                    $(window).resize();
                    setTimeout(function () {
                        CheckForNewNotifications();
                    }, appRemote_Config.notiInterval);
                },
                error: function () {
                    runningNotiCheck = false;
                    setTimeout(function () {
                        CheckForNewNotifications();
                    }, appRemote_Config.notiInterval);
                }
            });
        }
    }
    function GetUserNotifications(showLoading) {
        if (!runningNoti) {
            if ($.trim($("#NotificationHolder").html()) == "") {
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
                    data: '{ "_currIds": "' + myIds + '","siteTheme": "' + appRemote_Config.siteTheme + '" }',
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
                        SetNotificationScrollShadow();
                        CheckIfCanAddMore();
                        $(window).resize();
                    },
                    error: function () {
                        $(".ddLoadingMessage").remove();
                        SetNotificationScrollShadow();
                        $("#NotificationHolder").html("<h3 class='pad-top-big pad-bottom-big' style='color: Red; text-align: center;'>Error retrieving notifications!</h3>");
                        $("#lb_clearNoti").hide();
                        runningNoti = false;
                    }
                });
            }
        }
    }
    function GetMoreUserNotifications() {
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
                data: '{ "_currIds": "' + myIds + '","_currCount": "' + parseInt($("#table_NotiMessages tr").length) + '","siteTheme": "' + appRemote_Config.siteTheme + '" }',
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    $(".ddLoadingMessage").remove();
                    if ((data.d != null) && (data.d != "")) {
                        $("#table_NotiMessages").append($.trim(data.d));
                    }

                    SetNotificationScrollShadow();
                    runningMoreNoti = false;
                    CheckIfCanAddMore();
                    $(window).resize();
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
    function CheckIfCanAddMore() {
        var elem = document.getElementById("notifications-viewtable");
        if (elem != null) {
            var innerHeight = $("#notifications-viewtable").innerHeight();
            var maxHeight = $("#notifications-viewtable").outerHeight();
            if ((innerHeight >= elem.scrollHeight) || (elem.scrollHeight < maxHeight)) {
                var totalMessages = parseInt($("#notifications").find("#total-noti").html());
                var currMessages = parseInt($("#table_NotiMessages tr").length);
                if (currMessages < totalMessages) {
                    $(".ddLoadingMessage").remove();
                    $("#NotificationHolder").append(ddNotiLoading);
                    GetMoreUserNotifications();
                }
            }
        }
    }
    function SetNotificationScrollShadow() {
        $("#notifications-viewtable").scroll(function () {
            var elem = document.getElementById("notifications-viewtable");
            if (elem != null) {
                var $_scrollBar = $("#notifications-viewtable");
                var temp = $_scrollBar.scrollTop();
                if (temp > 0) {
                    if (temp + $_scrollBar.height() >= elem.scrollHeight) {
                        var totalMessages = parseInt($("#notifications").find("#total-noti").html());
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
    function NotiActionsClearAll() {
        StartLoadingOverlay("Clearing...");
        var notiHandler = openWSE.siteRoot() + "WebServices/NotificationRetrieve.asmx/DeleteNotifications";
        $.ajax({
            url: notiHandler,
            type: "POST",
            data: '{ "id": "' + "ClearAll" + '" }',
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (appRemote.ConvertBitToBoolean(data.d)) {
                    CloseStartLoadingOverlay();
                    ResetNoti();

                    $("#db-b").hide();
                    $("#db-c").hide();
                    UpdateURL();
                }
            }
        });
    }
    function ResetNoti() {
        $("#notifications").find("#total-noti").html("0");
        $("#notifications").find(".notification-icon").removeClass("notifications-new").addClass("notifications-none");

        var loc = window.location.href.split("#?");
        if (loc.length > 0) {
            loc = loc[0];
        }

        if (loc.indexOf("#") != loc.length - 1) {
            loc += "#";
        }

        if ((appRemote_Config.categoryId != "") && (appRemote_Config.categoryName != "")) {
            loc += "?id=" + appRemote_Config.categoryId + "&category=" + appRemote_Config.categoryName;
        }

        if ((appRemote_Config.remoteId != "") && (appRemote_Config.remoteName != "")) {
            if ((appRemote_Config.categoryId != "") && (appRemote_Config.categoryName != "")) {
                loc += "&";
            }
            else {
                loc += "?";
            }

            loc += "appId=" + appRemote_Config.remoteId + "&name=" + appRemote_Config.remoteName;
        }

        window.location = loc;
    }
    function RefreshNotifications() {
        $("#NotificationHolder").html("");
        runningNoti = false;
        GetUserNotifications(true);
    }


    function LoadCreateAccountHolder() {
        if ($("#Login-holder").css("display") != "none") {
            $("#Login-holder").hide();
            $("#iframe-createaccount-holder").html("<iframe id='iframe-demo' src='" + openWSE.siteRoot() + "SiteTools/iframes/CreateAccount.aspx' frameborder='0' width='100%' style='visibility: hidden;'></iframe>");
            $("#iframe-createaccount-holder").append("<div style='text-align: center;'><h3 id='loadingControls'>Loading Controls. Please Wait...</h3></div>");
            $("#CreateAccount-holder").show();
            $("#iframe-demo").load(function () {
                $("#loadingControls").remove();
                $("#iframe-demo").css({
                    height: "475px",
                    visibility: "visible"
                });
            });
        }
        else {
            $("#CreateAccount-holder, #ForgotPassword-holder").hide();
            $("#iframe-createaccount-holder").html("");
            $("#Login-holder").show();
        }
    }
    function LoadRecoveryPassword() {
        if ($("#ForgotPassword-holder").css("display") != "block") {
            $("#tb_username_recovery").val("");
            $("#lbl_passwordResetMessage").html("");
            $("#UserNameRequired_recovery").css("visibility", "hidden");
            $("#Login-holder").hide();
            $("#ForgotPassword-holder").show();
        }
        else {
            $("#ForgotPassword-holder").hide();
            $("#Login-holder").show();
        }
    }


    /* Rating Style Initalize */
    function RatingStyleInit(div, rating, disabled, appId, useLargeStars) {
        try {
            var _disabled = false;
            if (disabled) {
                _disabled = true;
            }

            var imagePath = openWSE.siteRoot() + "App_Themes/Standard";

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
                sendRequest: true
            });

            if (!useLargeStars) {
                $(div).find(".jStar").addClass("jStar-Small");
            }
        }
        catch (evt) { }
    }


    function IsValidAspxFile(filename) {
        filename = filename.toLowerCase();
        if (filename.length > 5 && filename.substring(filename.length - 5) == ".aspx") {
            return true;
        }

        return false;
    }
    function IsValidAscxFile(filename) {
        filename = filename.toLowerCase();
        if (filename.length > 5 && filename.substring(filename.length - 5) == ".ascx") {
            return true;
        }

        return false;
    }
    function IsValidHttpBasedAppType(filename) {
        filename = filename.toLowerCase();
        if (filename.indexOf("http://") != -1 || filename.indexOf("https://") != -1 || filename.indexOf("www.") != -1) {
            return true;
        }

        return false;
    }

    return {
        AddBackgroundColorToLogo: AddBackgroundColorToLogo,
        MenuClick: MenuClick,
        OpenSidebarMenu_Swipe: OpenSidebarMenu_Swipe,
        CloseSidebarMenu_Swipe: CloseSidebarMenu_Swipe,
        InitializeSwipeEvent: InitializeSwipeEvent,
        CloseAllOpened: CloseAllOpened,
        init: init,
        ConvertBitToBoolean: ConvertBitToBoolean,
        IsComplexWorkspaceMode: IsComplexWorkspaceMode,
        StartLoadingOverlay: StartLoadingOverlay,
        CloseStartLoadingOverlay: CloseStartLoadingOverlay,
        AppsSortUnlocked: AppsSortUnlocked,
        LoadOptions: LoadOptions,
        LoadAdminPage: LoadAdminPage,
        LoginAsGroup: LoginAsGroup,
        SetAdminMode: SetAdminMode,
        SetDemoMode: SetDemoMode,
        Load: Load,
        CategoryClick: CategoryClick,
        OnWorkspaceClick: OnWorkspaceClick,
        OpenApp: OpenApp,
        LoadApp: LoadApp,
        HideApp: HideApp,
        CloseApp: CloseApp,
        RefreshNotifications: RefreshNotifications,
        CheckForNewNotifications: CheckForNewNotifications,
        NotiActionsClearAll: NotiActionsClearAll,
        ResetNoti: ResetNoti,
        UpdateURL: UpdateURL,
        LoadCreateAccountHolder: LoadCreateAccountHolder,
        LoadRecoveryPassword: LoadRecoveryPassword,
        RatingStyleInit: RatingStyleInit,
        GroupLoginModal: GroupLoginModal
    };

}();

var openWSE = function () {

    // Background Loop Timer
    var backgroundLoopTimer = new Array();
    function BackgroundLoop(backgrounds, timer, div) {
        if ($(div).length > 0) {
            var list = backgrounds.split('|');
            var modifiedList = new Array();
            for (var i = 0; i < list.length; i++) {
                if (list[i] != "") {
                    modifiedList.push(list[i]);
                }
            }

            var timerIndex = FindBackgroundLoopTimerIndex(div);
            if (timerIndex == -1 && modifiedList.length > 1) {
                backgroundLoopTimer.push(
                    {
                        "obj": null,
                        "loopIndex": 1,
                        "div": div,
                        "list": modifiedList
                    });

                timerIndex = backgroundLoopTimer.length - 1;
            }
            else if (timerIndex != -1) {
                clearInterval(backgroundLoopTimer[timerIndex].obj);
                backgroundLoopTimer[timerIndex].obj = null;
                backgroundLoopTimer[timerIndex].loopIndex = modifiedList.length - 1;
                backgroundLoopTimer[timerIndex].list = modifiedList;
            }

            if (backgroundLoopTimer.length > 0 && backgroundLoopTimer[timerIndex] != null && backgroundLoopTimer[timerIndex].list.length > 1) {
                backgroundLoopTimer[timerIndex].obj = setInterval(function () {
                    var img = backgroundLoopTimer[timerIndex].list[backgroundLoopTimer[timerIndex].loopIndex];
                    if (img == null || img == undefined) {
                        backgroundLoopTimer[timerIndex].loopIndex = 0;
                        var img = backgroundLoopTimer[timerIndex].list[backgroundLoopTimer[timerIndex].loopIndex];
                    }

                    if (img != null && img != undefined) {
                        if (img.length > 6) {
                            if (img.toLowerCase().indexOf("http") == -1 && img.toLowerCase().indexOf("www.") == -1) {
                                img = GetSiteRoot() + img;
                            }

                            $(div).css("background", "#FFFFFF url('" + img + "') repeat right center");
                            $(div).css("background-size", "auto");
                        }
                        else {
                            $(div).css("background", "#" + img);
                        }
                    }

                    backgroundLoopTimer[timerIndex].loopIndex++;
                    if (backgroundLoopTimer[timerIndex].loopIndex >= backgroundLoopTimer[timerIndex].list.length) {
                        backgroundLoopTimer[timerIndex].loopIndex = 0;
                    }
                }, timer);
            }
        }
    }
    function FindBackgroundLoopTimerIndex(div) {
        for (var i = 0; i < backgroundLoopTimer.length; i++) {
            if (backgroundLoopTimer[i].div == div) {
                return i;
            }
        }

        return -1;
    }
    function GetSiteRoot() {
        var sitePath = "";
        if (appRemote_Config.siteRootFolder != "") {
            sitePath = appRemote_Config.siteRootFolder + "/";
        }

        return window.location.protocol + "//" + window.location.host + "/" + sitePath;
    }

    return {
        NotiActionsHideInd: function (_this) {
            appRemote.StartLoadingOverlay("Deleting...");
            var $this = $(_this).closest("tr");
            var id = $this.attr("id");
            var notiHandler = openWSE.siteRoot() + "WebServices/NotificationRetrieve.asmx/DeleteNotifications";
            $.ajax({
                url: notiHandler,
                type: "POST",
                data: '{ "id": "' + id + '" }',
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (appRemote.ConvertBitToBoolean(data.d)) {
                        $this.hide();
                        appRemote.CloseStartLoadingOverlay();
                        $this.remove();
                        if ($("#notifications").find("#total-noti").html() == "1") {
                            appRemote.ResetNoti();
                        }
                        else {
                            var currTotal = parseInt($("#notifications").find("#total-noti").html());
                            currTotal -= 1;
                            $("#notifications").find("#total-noti").html(currTotal);
                        }
                    }
                }
            });
        },
        AcceptGroupNotification: function (_this, groupId) {
            appRemote.StartLoadingOverlay("Accepting...");
            var $this = $(_this).closest("tr");
            var id = $this.attr("id");
            var notiHandler = openWSE.siteRoot() + "WebServices/NotificationRetrieve.asmx/AcceptInviteNotifications";
            $.ajax({
                url: notiHandler,
                type: "POST",
                data: '{ "id": "' + id + '", "groupId": "' + groupId + '" }',
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (appRemote.ConvertBitToBoolean(data.d)) {
                        $this.hide();
                        appRemote.CloseStartLoadingOverlay();
                        $this.remove();
                        if ($("#notifications").find("#total-noti").html() == "1") {
                            appRemote.ResetNoti();
                        }
                        else {
                            var currTotal = parseInt($("#notifications").find("#total-noti").html());
                            currTotal -= 1;
                            $("#notifications").find("#total-noti").html(currTotal);
                        }
                    }
                }
            });
        },
        siteRoot: function () {
            var sitePath = "";
            if (appRemote_Config.siteRootFolder != "") {
                sitePath = appRemote_Config.siteRootFolder + "/";
            }

            return window.location.protocol + "//" + window.location.host + "/" + sitePath;
        },
        ExpandAdminLinks: function (_this, div) {
            if ($(_this).hasClass("img-expand-sml")) {
                $(_this).removeClass("img-expand-sml");
                $(_this).addClass("img-collapse-sml");
                $(_this).closest(".app-icon-links").parent().find("." + div).slideDown(appRemote_Config.animationSpeed);
            }
            else {
                $(_this).removeClass("img-collapse-sml");
                $(_this).addClass("img-expand-sml");
                $(_this).closest(".app-icon-links").parent().find("." + div).slideUp(appRemote_Config.animationSpeed);
            }
        },
        BackgroundLoop: BackgroundLoop
    };
}();

$(document).ready(function () {
    appRemote.init();
    var loc = window.location.href.split("#");
    if (loc.length == 1) {
        window.location += "#";
    }

    appRemote.Load();
    appRemote.InitializeSwipeEvent();
});

$(function () {
    $(window).hashchange(function () {
        appRemote.Load();
    });
});

$(window).resize(function () {
    $("#pnl_adminPages, #pnl_AccountInfo, #pnl_adminPage_iframe, #pnl_chat_popup, #pnl_chat_users, #pnl_icons, #pnl_login, #pnl_options, #notifications-viewtable, #grouplogin-list").css({
        top: $("#always-visible").outerHeight(),
        bottom: $("#container-footer").outerHeight()
    });

    if ($(".iFrame-chat").length > 0) {
        var h1 = $(window).height();
        var h2 = $("#always-visible").height();
        var h3 = $("#container-footer").height();
        var finalHeight = h1 - (h2 + h3);
        $(".iFrame-chat").height(finalHeight - 1);
    }

    var iframeHt = Math.abs($(window).height() - ($("#always-visible").outerHeight() + $("#container-footer").outerHeight()));
    $(".loaded-app-holder").each(function () {
        if ($(this).css("visibility") != "hidden") {
            $(this).css({
                height: iframeHt,
                width: $(window).width(),
                position: "",
                top: ""
            });
        }
    });

    if ($("#notifications-viewtable").css("display") == "block") {
        $(".alert-panel-description").each(function () {
            $(this).css("width", $(window).width() - 135);
        });
    }
});


// jQuery Cookie
(function (a, b, c) {
    function e(a) {
        return a
    }

    function f(a) {
        return decodeURIComponent(a.replace(d, " "))
    }
    var d = /\+/g;
    var g = a.cookie = function (d, h, i) {
        if (h !== c) {
            i = a.extend({}, g.defaults, i);
            if (h === null) {
                i.expires = -1
            }
            if (typeof i.expires === "number") {
                var j = i.expires,
                    k = i.expires = new Date;
                k.setDate(k.getDate() + j)
            }
            h = g.json ? JSON.stringify(h) : String(h);
            return b.cookie = [encodeURIComponent(d), "=", g.raw ? h : encodeURIComponent(h), i.expires ? "; expires=" + i.expires.toUTCString() : "", i.path ? "; path=" + i.path : "", i.domain ? "; domain=" + i.domain : "", i.secure ? "; secure" : ""].join("")
        }
        var l = g.raw ? e : f;
        var m = b.cookie.split("; ");
        for (var n = 0, o; o = m[n] && m[n].split("=") ; n++) {
            if (l(o.shift()) === d) {
                var p = l(o.join("="));
                return g.json ? JSON.parse(p) : p
            }
        }
        return null
    };
    g.defaults = {};
    a.removeCookie = function (b, c) {
        if (a.cookie(b, c) !== null) {
            a.cookie(b, null, c);
            return true
        }
        return false
    }
})(jQuery, document);
var cookie = {
    set: function (e, t, n) {
        if (openWSE_Config.saveCookiesAsSessions) {
            var saveHandler = openWSE.siteRoot() + "WebServices/SaveControls.asmx/SetCookie";
            $.ajax({
                url: saveHandler,
                type: "POST",
                data: '{ "name": "' + e + '","value": "' + t + '" }',
                contentType: "application/json; charset=utf-8"
            });
        }
        else {
            var r = cookie.get(e);
            if (n) {
                var i = new Date;
                i.setTime(i.getTime() + n * 24 * 60 * 60 * 1e3);
                var s = "; expires=" + i.toGMTString()
            } else var s = "";
            document.cookie = e + "=" + t + s + "; path=/"
        }
    },
    get: function (e) {
        var cookieVal = null;
        if (openWSE_Config.saveCookiesAsSessions) {
            var saveHandler = openWSE.siteRoot() + "WebServices/SaveControls.asmx/GetCookie";
            $.ajax({
                url: saveHandler,
                type: "POST",
                async: false,
                data: '{ "name": "' + e + '" }',
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    if (result) {
                        cookieVal = result.d;
                    }
                }
            });
        }
        else {
            var t = e + "=";
            var n = document.cookie.split(";");
            for (var r = 0; r < n.length; r++) {
                var i = n[r];
                while (i.charAt(0) == " ") i = i.substring(1, i.length);
                if (i.indexOf(t) == 0) {
                    return i.substring(t.length, i.length)
                }
            }
        }

        return cookieVal;
    },
    del: function (e) {
        if (openWSE_Config.saveCookiesAsSessions) {
            var saveHandler = openWSE.siteRoot() + "WebServices/SaveControls.asmx/DelCookie";
            $.ajax({
                url: saveHandler,
                type: "POST",
                data: '{ "name": "' + e + '" }',
                contentType: "application/json; charset=utf-8"
            });
        }
        else {
            this.set(e, "", -1)
        }
    }
}
