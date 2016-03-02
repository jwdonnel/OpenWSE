﻿<%@ Control Language="C#" AutoEventWireup="true" CodeFile="MessageBoard.ascx.cs"
    Inherits="Apps_MessageBoard_MessageBoard" ClientIDMode="Static" %>
<div class="pad-all app-title-bg-color">
    <div class="float-left">
        <asp:Image ID="img_Title" runat="server" CssClass="app-img-titlebar" />
        <asp:Label ID="lbl_Title" runat="server" Text="" CssClass="app-text-titlebar"></asp:Label>
    </div>
    <input id="btn_rssmessageboard" type="button" class="input-buttons float-right no-margin"
        value="RSS Feeds" onclick="LoadMBFeeds();" title="View the available RSS feeds" />
    <div class="clear"></div>
    <div id="mb_newmessage_groups" class="pad-top pad-bottom"
        style="font-size: 15px; display: none">
        <div class="inline-block">
            <span class="pad-right">Post to Group</span>
            <select id="dd_groups_messageboard" runat="server" onchange="GroupChanged_mb()">
            </select>
        </div>
    </div>
    <div class="clear"></div>
</div>
<div id="Messageboard_Holder">
    <textarea id="Editor_messageboard" style="min-height: 150px; width: 100%"></textarea>
    <div class="clear-space-two">
    </div>
    <div class="pad-left pad-right">
        <input id="imgbtn_update" type="button" class="input-buttons-create margin-top float-left margin-left margin-right"
            value="Post Message" onclick="PostMessage()" />
        <a href="#clear" id="btn_clearpost_messageboard" class="float-left margin-right margin-left margin-top-big"
            onclick="ClearPost();return false;">Clear</a>
        <div class="float-right pad-left pad-right margin-top-big">
            New message board posts may take a couple of seconds to refresh.
                <div class="clear-space-five">
                </div>
            <div id="lbl_errormessage_messageboard" style="font-size: 12px; color: Red; text-align: right">
            </div>
        </div>
    </div>
    <div class="clear-space">
    </div>
</div>
<div id="showMessageboard" class="boxshadow-dark" onclick="HideMessageBoard();return false;">
    Show New Message Controls
</div>
<div id="MessageList_messageboard">
</div>
<div id="MBRSS-Feed-Selector-element" class="Modal-element outside-main-app-div">
    <div class="Modal-overlay">
        <div class="Modal-element-align">
            <div class="Modal-element-modal" data-setwidth="550">
                <div class="ModalHeader">
                    <div>
                        <div class="app-head-button-holder-admin">
                            <a href="#" onclick="openWSE.LoadModalWindow(false, 'MBRSS-Feed-Selector-element', '');return false;"
                                class="ModalExitButton"></a>
                        </div>
                        <span class="Modal-title"></span>
                    </div>
                </div>
                <div class="ModalScrollContent">
                    <div class="ModalPadContent">
                        <div id="AddMBRSSFeedHolder">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<input type="hidden" data-scriptelement="true" data-tagname="link" data-tagtype="text/css" data-tagrel="stylesheet" data-tagsrc="~/Apps/MessageBoard/messageboard.css" />
<input type="hidden" data-scriptelement="true" data-tagname="script" data-tagtype="text/javascript" data-tagsrc="~/Apps/MessageBoard/messageboard.js" />
