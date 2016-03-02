﻿var twitterTimeOut = null;
var twitterStation = function () {
    var numColumns = 4;
    var mobileWidth = 850;

    function ResizeAppWindow() {
        $(".app-main-holder[data-appid='app-twitterstation']").find(".twitter-feed-box-padding").css("min-height", "");

        $(".app-main-holder[data-appid='app-twitterstation']").find(".app-title-bg-color").removeClass("twitter-box-list-" + mobileWidth + "-maxwidth");
        $(".app-main-holder[data-appid='app-twitterstation']").find(".twitter-box-list").removeClass("twitter-box-list-" + mobileWidth + "-maxwidth");
        $(".app-main-holder[data-appid='app-twitterstation']").find(".twitter-feed-box").removeClass("twitter-feed-box-" + mobileWidth + "-maxwidth");

        if ($(".app-main-holder[data-appid='app-twitterstation']").outerWidth() < mobileWidth) {
            $(".app-main-holder[data-appid='app-twitterstation']").find(".app-title-bg-color").addClass("twitter-box-list-" + mobileWidth + "-maxwidth");
            $(".app-main-holder[data-appid='app-twitterstation']").find(".twitter-box-list").addClass("twitter-box-list-" + mobileWidth + "-maxwidth");
            $(".app-main-holder[data-appid='app-twitterstation']").find(".twitter-feed-box").addClass("twitter-feed-box-" + mobileWidth + "-maxwidth");
        }
        else {
            var maxHeight = 0;
            $("#twitterstation-load").find(".twitter-feed-box").each(function (index) {
                if (index % numColumns == 0 && index > 0 && maxHeight > 0) {
                    for (var i = index - 1; i >= (index - numColumns) ; i--) {
                        $("#twitterstation-load").find(".twitter-feed-box-padding").eq(i).css("min-height", maxHeight + "px");
                    }
                    maxHeight = 0;
                }
                else {
                    var tempHeight = $(this).find(".twitter-feed-box-padding").outerHeight() - 10;
                    if (tempHeight > maxHeight) {
                        maxHeight = tempHeight;
                    }
                }
            });
        }
    }

    var twitterService = openWSE.siteRoot() + "Apps/Twitter/TwitterStationService.asmx";
    var editId = "";

    $(document.body).on("click", ".exit-button-app[href='#app-twitterstation']", function () {
        clearInterval(twitterTimeOut);
        twitterTimeOut = null;
    });

    function Init(refreshInt) {
        if ($("#twitterstation-load").length > 0) {
            twitterService = openWSE.siteRoot() + "Apps/Twitter/TwitterStationService.asmx";
            editId = "";

            twitterStation.GetFeeds(true);

            if (refreshInt > 0) {
                var interval = refreshInt * 60000;
                twitterTimeOut = setInterval(function () {
                    twitterStation.GetFeeds(false);
                }, interval);
            }

            $("#TwitterAdd_element").find("input[type='text']").keypress(function (e) {
                if (e.which == 13 || e.keyCode == 13) {
                    if (editId != "") {
                        twitterStation.UpdateFeed(editId);
                    }
                    else {
                        twitterStation.FinishAdd();
                    }
                }
            });
        }
    }

    var inAddMode = false;
    function AddFeed() {
        inAddMode = true;
        $("#lbl_errorTwitter").html("");
        $("#must-have-twitter-search").hide();
        $("#btn_add").show();
        $("#btn_update").hide();
        $("#hf_editID").val("");
        $("#tb_title").val("");
        $("#tb_caption").val("");
        $("#tb_twitteraccount").val("");
        editId = "";
        openWSE.LoadModalWindow(true, "TwitterAdd_element", "Add Twitter Feed");
        $("#tb_twitteraccount").focus();
    }
    function FinishAdd() {
        if ($.trim($("#tb_twitteraccount").val()) != "") {
            $("#must-have-twitter-search").hide();
            openWSE.LoadingMessage1("Adding Feed...");
            $.ajax({
                url: twitterService + "/AddUserFeed",
                type: "POST",
                data: '{ "title": "' + $("#tb_title").val() + '","caption": "' + $("#tb_caption").val() + '","search": "' + $("#tb_twitteraccount").val() + '","display": "' + $("#dd_display_amount").val() + '","searchType": "' + $("#dd_mode").val() + '" }',
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    editId = "";
                    openWSE.LoadModalWindow(false, "TwitterAdd_element", "");
                    openWSE.RemoveUpdateModal();
                    GetFeeds(true);
                },
                error: function (err) {
                    openWSE.AlertWindow(err, window.location.href);
                    openWSE.RemoveUpdateModal();
                }
            });
        }
        else {
            $("#must-have-twitter-search").show();
        }
    }

    function EditFeed(id) {
        if (id != "") {
            editId = id;
            openWSE.LoadingMessage1("Loading...");
            $.ajax({
                url: twitterService + "/EditUserFeed",
                type: "POST",
                data: '{ "id": "' + id + '" }',
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    $("#must-have-twitter-search").hide();
                    $("#btn_add").hide();
                    $("#btn_update").show();
                    $("#lbl_errorTwitter").html("");

                    $("#tb_title").val(data.d[0]);
                    $("#tb_caption").val(data.d[1]);
                    $("#tb_twitteraccount").val(data.d[2]);
                    $("#dd_mode").val(data.d[3]);
                    $("#dd_display_amount").val(data.d[4]);

                    openWSE.LoadModalWindow(false, 'TwitterEditFeeds_element', '');
                    openWSE.LoadModalWindow(true, "TwitterAdd_element", "Edit Twitter Feed");
                    openWSE.RemoveUpdateModal();
                    $("#tb_twitteraccount").focus();
                },
                error: function (err) {
                    openWSE.AlertWindow(err, window.location.href);
                    openWSE.RemoveUpdateModal();
                }
            });
        }
    }
    function UpdateFeed() {
        if ($.trim($("#tb_twitteraccount").val()) != "") {
            $("#must-have-twitter-search").hide();
            if (editId != "") {
                openWSE.LoadingMessage1("Updating...");
                $.ajax({
                    url: twitterService + "/UpdateUserFeed",
                    type: "POST",
                    data: '{ "id": "' + editId + '","title": "' + $("#tb_title").val() + '","caption": "' + $("#tb_caption").val() + '","search": "' + $("#tb_twitteraccount").val() + '","display": "' + $("#dd_display_amount").val() + '","searchType": "' + $("#dd_mode").val() + '" }',
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        editId = "";
                        openWSE.LoadModalWindow(false, "TwitterAdd_element", "");
                        openWSE.LoadModalWindow(true, 'TwitterEditFeeds_element', 'Edit Feeds');
                        openWSE.RemoveUpdateModal();
                        GetFeeds(true);
                    },
                    error: function (err) {
                        openWSE.AlertWindow(err, window.location.href);
                        openWSE.RemoveUpdateModal();
                    }
                });
            }
        }
        else {
            $("#must-have-twitter-search").show();
        }
    }

    function DeleteFeed(id) {
        if (id != "") {
            openWSE.ConfirmWindow("Are you sure you want to delete this feed?",
                function () {
                    openWSE.LoadingMessage1("Deleting...");
                    $.ajax({
                        url: twitterService + "/DeleteUserFeed",
                        type: "POST",
                        data: '{ "id": "' + id + '" }',
                        contentType: "application/json; charset=utf-8",
                        success: function (data) {
                            twitterStation.GetFeeds(true);
                            openWSE.RemoveUpdateModal();
                        },
                        error: function (err) {
                            openWSE.AlertWindow(err, window.location.href);
                            openWSE.RemoveUpdateModal();
                        }
                    });
                }, null);
        }
    }

    function CloseModal() {
        editId = "";
        $("#must-have-twitter-search").hide();
        openWSE.LoadModalWindow(false, "TwitterAdd_element", "");
        if (!inAddMode) {
            openWSE.LoadModalWindow(true, 'TwitterEditFeeds_element', 'Edit Feeds');
        }

        inAddMode = false;
    }

    function GetFeeds(showLoading) {
        if (showLoading) {
            $("#twitterstation-load").find("#twitterstation-posts").find(".loading-tweets").remove();
            $("#twitterstation-load").find("#twitterstation-posts").prepend("<span class='loading-tweets'>Loading Tweets...</span>");
        }

        $.ajax({
            url: twitterService + "/GetUserFeeds",
            type: "POST",
            data: '{ }',
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                var feedArray = new Array();
                if (data.d.length > 0) {
                    var tweetHolder = "";
                    var enableEdit = data.d[0];

                    for (var i = 1; i < data.d.length; i++) {
                        var id = data.d[i][0];
                        tweetHolder += "<div id='" + id + "' class='clear'>";
                        tweetHolder += "<div class='twitter-header'><table style='width: 100%;'><tr>";

                        var name = data.d[i][1];
                        var description = data.d[i][2];
                        var feeds = data.d[i][3];
                        var screenName = "";

                        if (data.d[i].length == 6) {
                            tweetHolder += "<td style='width: 50px;'><img src='" + data.d[i][3] + "' alt='' /></td>";
                            screenName = data.d[i][4];
                            feeds = data.d[i][5];
                        }

                        if (screenName != "" && screenName.indexOf("@") != 0) {
                            screenName = "@" + screenName;
                        }

                        tweetHolder += "<td><h3 class='float-left pad-right-big'>" + name + "</h3><span class='float-left' style='color: #AAA; padding-top: 2px; font-size: 12px;'>" + screenName + "</span><div class='clear-space-two'></div>";
                        tweetHolder += "<h4>" + description + "</h4></td>";
                        tweetHolder += "<td style='width: 90px;'><div class='float-right'>";
                        if (enableEdit == "true") {
                            tweetHolder += "<a href='#edit' class='td-edit-btn margin-right' onclick=\"twitterStation.EditFeed('" + id + "');return false;\" title='Edit'></a>";
                            tweetHolder += "<a href='#delete' class='td-cancel-btn' onclick=\"twitterStation.DeleteFeed('" + id + "');return false;\" title='Delete'></a>";
                        }
                        tweetHolder += "</div></td></tr></table></div>";

                        for (var j = 0; j < feeds.length; j++) {
                            if (feeds[j].length == 3) {
                                feedArray.push({ "id": data.d[i][0], "name": name, "screenName": screenName, "description": description, "image": data.d[i][3], "feed": feeds[j][0], "datePretty": feeds[j][1], "date": parseInt(feeds[j][2]) });
                            }
                            else {
                                var screenNameTemp = feeds[j][5];
                                if (screenNameTemp != "" && screenNameTemp.indexOf("@") != 0) {
                                    screenNameTemp = "@" + screenNameTemp;
                                }

                                feedArray.push({ "id": data.d[i][0], "name": feeds[j][2], "screenName": screenNameTemp, "description": description, "image": feeds[j][3], "feed": feeds[j][0], "datePretty": feeds[j][1], "date": parseInt(feeds[j][4]) });
                            }
                        }

                        tweetHolder += "</div>";
                    }

                    $("#TwitterEditFeeds_element").find("#twitter_edit_feeds_holder").html(tweetHolder);

                    if ($.trim($("#TwitterEditFeeds_element").find("#twitter_edit_feeds_holder").html()) == "") {
                        $("#TwitterEditFeeds_element").find("#twitter_edit_feeds_holder").html("<h3 class='pad-all' style='color: #353535;'>No Twitter feeds found.</h3>");
                    }
                }
                else {
                    $("#TwitterEditFeeds_element").find("#twitter_edit_feeds_holder").html("<h3 class='pad-all' style='color: #353535;'>No Twitter feeds found.</h3>");
                }

                if (feedArray.length == 0) {
                    $("#twitterstation-load").find("#twitterstation-posts").html("<h3 class='pad-all' style='color: #353535;'>No Twitter feeds found.</h3>");
                }
                else {
                    feedArray.sort(function (a, b) {
                        return b.date - a.date;
                    });

                    var innerFeedsHtml = "<div class='twitter-box-list'>";
                    for (var i = 0; i < feedArray.length; i++) {
                        if (i % numColumns == 0) {
                            innerFeedsHtml += "<div class='clear'></div>";
                        }

                        innerFeedsHtml += "<div class='" + feedArray[i].id + " twitter-feed-box'><div class='twitter-feed-box-padding'>";
                        innerFeedsHtml += "<img alt='' src='" + feedArray[i].image + "' class='twitter-feed-img' />";
                        innerFeedsHtml += "<div class='twitter-feed-date'>" + feedArray[i].datePretty + "</div>";
                        innerFeedsHtml += "<div class='float-left'><span class='twitter-feed-name'>" + feedArray[i].name + "</span><div class='clear-space-two'></div>";
                        innerFeedsHtml += "<span class='twitter-feed-screenname'><a href='https://twitter.com/" + feedArray[i].screenName.replace(/@/g, "") + "' target='_blank'>" + feedArray[i].screenName + "</a></span></div><div class='clear'></div>";
                        innerFeedsHtml += "<div class='twitter-feed-text'>" + feedArray[i].feed + "</div>";
                        innerFeedsHtml += "</div></div>";
                    }
                    innerFeedsHtml += "</div>";

                    $("#twitterstation-load").find("#twitterstation-posts").html(innerFeedsHtml + "<div class='clear'></div>");
                }

                $("#twitterstation-load").find("#twitterstation-posts").find(".loading-tweets").remove();

                ResizeAppWindow();
            },
            error: function (err) {
                openWSE.AlertWindow(err, window.location.href);
                $("#twitterstation-load").find("#twitterstation-posts").find(".loading-tweets").remove();
                $("#TwitterEditFeeds_element").find("#twitter_edit_feeds_holder").html("<h3 class='pad-all'>There was an error getting your feeds.</h3>");
                $("#twitterstation-load").find("#twitterstation-posts").html("<h3 class='pad-all'>There was an error getting your feeds.</h3>");
                openWSE.RemoveUpdateModal();
            }
        });
    }

    return {
        ResizeAppWindow: ResizeAppWindow,
        Init: Init,
        AddFeed: AddFeed,
        FinishAdd:FinishAdd,
        EditFeed: EditFeed,
        UpdateFeed: UpdateFeed,
        DeleteFeed: DeleteFeed,
        CloseModal: CloseModal,
        GetFeeds: GetFeeds
    }
}();

$(window).resize(function () {
    twitterStation.ResizeAppWindow();
});

$(document).ready(function () {
    if (twitterTimeOut == null) {
        twitterStation.Init(5);
    }
});

Sys.Application.add_load(function () {
    if (twitterTimeOut == null) {
        twitterStation.Init(5);
    }
});
