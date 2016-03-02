﻿<%@ Page Title="Site Settings" Language="C#" MasterPageFile="~/Site.master"
    AutoEventWireup="true" CodeFile="SiteSettings.aspx.cs" Inherits="SiteTools_SiteSettings" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="Server">
</asp:Content>
<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="Server">
    <div class="maincontent-padding margin-top">
        <div id="sitesettings">
            <div id="MainSettings">
                <asp:Panel ID="pnlLinkBtns" runat="server">
                </asp:Panel>
                <asp:Panel ID="pnl_ServerSettings" ClientIDMode="Static" CssClass="pnl-section" runat="server">
                    <asp:UpdatePanel ID="UpdatePanel4" runat="server">
                        <ContentTemplate>
                            Server side settings and overrides will effect every user. Not Administrative users will not be able to edit certain settings.
                            <div class="clear-space"></div>
                            <div class="table-settings-box">
                                <div class="td-settings-title">
                                    Total Number of Workspaces Allowed
                                </div>
                                <div class="title-line"></div>
                                <div class="td-settings-ctrl">
                                    <asp:Panel ID="pnl_totalworkspacesAllowed" runat="server" DefaultButton="btn_updateTotalWorkspaces">
                                        <asp:TextBox ID="tb_totalWorkspacesAllowed" runat="server" CssClass="textEntry" Width="55px" TextMode="Number"></asp:TextBox>
                                        <asp:Button ID="btn_updateTotalWorkspaces" runat="server" Text="Update" OnClick="btn_updateTotalWorkspaces_Click"
                                            CssClass="RandomActionBtns input-buttons margin-left" />
                                    </asp:Panel>
                                </div>
                                <div class="td-settings-desc">
                                    Determine how many workspaces a user is allowed to have.
                                </div>
                            </div>
                            <div class="table-settings-box">
                                <div class="td-settings-title">
                                    Server Timezone
                                </div>
                                <div class="title-line"></div>
                                <div class="td-settings-ctrl">
                                    <asp:DropDownList ID="dd_timezoneset" runat="server" CssClass="margin-right">
                                        <asp:ListItem Value="-12">(GMT-12:00) International Date Line West</asp:ListItem>
                                        <asp:ListItem Value="-11">(GMT-11:00) Midway Island, Samoa</asp:ListItem>
                                        <asp:ListItem Value="-10">(GMT-10:00) Hawaii</asp:ListItem>
                                        <asp:ListItem Value="-9">(GMT-09:00) Alaska</asp:ListItem>
                                        <asp:ListItem Value="-8">(GMT-08:00) Pacific Time (US & Canada)</asp:ListItem>
                                        <asp:ListItem Value="-7">(GMT-07:00) Mountain Time (US & Canada)</asp:ListItem>
                                        <asp:ListItem Value="-6">(GMT-06:00) Central Time (US & Canada)</asp:ListItem>
                                        <asp:ListItem Value="-5">(GMT-05:00) Eastern Time (US & Canada), Indiana (East)</asp:ListItem>
                                        <asp:ListItem Value="-4">(GMT-04:00) Atlantic Time (Canada)</asp:ListItem>
                                        <asp:ListItem Value="-3.5">(GMT-03:30) Newfoundland</asp:ListItem>
                                        <asp:ListItem Value="-3">(GMT-03:00) Montevideo</asp:ListItem>
                                        <asp:ListItem Value="-2">(GMT-02:00) Mid-Atlantic</asp:ListItem>
                                        <asp:ListItem Value="-1">(GMT-01:00) Cape Verde Is.</asp:ListItem>
                                        <asp:ListItem Value="0">(GMT+00:00) Greenwich Mean Timen</asp:ListItem>
                                        <asp:ListItem Value="1">(GMT+01:00) Amsterdam, Berlin, Rome, Stockholm, Vienna</asp:ListItem>
                                        <asp:ListItem Value="2">(GMT+02:00) Athens, Bucharest, Istanbul</asp:ListItem>
                                        <asp:ListItem Value="3">(GMT+03:00) Moscow, St. Petersburg, Volgograd</asp:ListItem>
                                        <asp:ListItem Value="3.5">(GMT+03:30) Tehran</asp:ListItem>
                                        <asp:ListItem Value="4">(GMT+04:00) Abu Dhabi, Muscat</asp:ListItem>
                                        <asp:ListItem Value="4.5">(GMT+04:30) Kabul</asp:ListItem>
                                        <asp:ListItem Value="5">(GMT+05:00) Yekaterinburg</asp:ListItem>
                                        <asp:ListItem Value="5.5">(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</asp:ListItem>
                                        <asp:ListItem Value="5.75">(GMT+05:45) Kathmandu</asp:ListItem>
                                        <asp:ListItem Value="6">(GMT+06:00) Almaty, Novosibirsk And Astana, Dhaka</asp:ListItem>
                                        <asp:ListItem Value="6.5">(GMT+06:30) Yangon (Rangoon)</asp:ListItem>
                                        <asp:ListItem Value="7">(GMT+07:00) Bangkok, Hanoi, Jakarta And Krasnoyarsk</asp:ListItem>
                                        <asp:ListItem Value="8">(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi</asp:ListItem>
                                        <asp:ListItem Value="9">(GMT+09:00) Osaka, Sapporo, Tokyo</asp:ListItem>
                                        <asp:ListItem Value="9.5">(GMT+09:30) Adelaide</asp:ListItem>
                                        <asp:ListItem Value="10">(GMT+10:00) Brisbane</asp:ListItem>
                                        <asp:ListItem Value="11">(GMT+11:00) Magadan, Solomon Is., New Caledonia</asp:ListItem>
                                        <asp:ListItem Value="12">(GMT+12:00) Auckland, Wellington</asp:ListItem>
                                        <asp:ListItem Value="13">(GMT+13:00) Nuku'alofa</asp:ListItem>
                                    </asp:DropDownList>
                                    <asp:Button ID="btn_timezoneset" runat="server" CssClass="input-buttons RandomActionBtns" Text="Update" OnClick="btn_timezoneset_Click" />
                                    <div class="clear-space"></div>
                                    <span class="font-bold pad-right-sml">Current Server Time:</span><asp:Label ID="lbl_currentServerTime" runat="server" Text="" ClientIDMode="Static"></asp:Label>
                                </div>
                                <div class="td-settings-desc">
                                    Set the current timezone for the server.
                                </div>
                            </div>
                            <div class="table-settings-box">
                                <div class="td-settings-title">
                                    Cache Workspace
                                </div>
                                <div class="title-line"></div>
                                <div class="td-settings-ctrl">
                                    <div class="field switch inline-block">
                                        <asp:RadioButton ID="rb_cachehp_on" runat="server" Text="On" CssClass="RandomActionBtns cb-enable"
                                            OnCheckedChanged="rb_cachehp_on_CheckedChanged" AutoPostBack="True" />
                                        <asp:RadioButton ID="rb_cachehp_off" runat="server" Text="Off" CssClass="RandomActionBtns cb-disable"
                                            OnCheckedChanged="rb_cachehp_off_CheckedChanged" AutoPostBack="True" />
                                    </div>
                                </div>
                                <div class="td-settings-desc">
                                    Turn On to cache the user workspace. (Disabled by default)
                                </div>
                            </div>
                            <div class="table-settings-box">
                                <div class="td-settings-title">
                                    Clear Sever Cache
                                </div>
                                <div class="title-line"></div>
                                <div class="td-settings-ctrl">
                                    <asp:Button ID="btn_clearCache" runat="server" Text="Clear Cache" CssClass="input-buttons margin-right RandomActionBtns"
                                        OnClick="btn_clearCache_Click" />
                                </div>
                                <div class="td-settings-desc">
                                    <span class="font-bold">Last Cache Clear:</span>
                                    <asp:Label ID="lbl_lastcacheclear" runat="server" Text="" CssClass="pad-left-sml"></asp:Label>
                                </div>
                            </div>
                            <div id="ClearAppProp_Controls" class="table-settings-box">
                                <div class="td-settings-title">
                                    Clear User App Properties
                                </div>
                                <div class="title-line"></div>
                                <div class="td-settings-ctrl">
                                    <asp:Button ID="btn_clearapps" runat="server" Text="Clear Properties" OnClick="btn_clearapps_Click"
                                        CssClass="RandomActionBtns input-buttons" />
                                </div>
                                <div class="td-settings-desc">
                                    Delete all entries in the UserApps Table. (Used for fixing
                                                errors on the user side)
                                </div>
                            </div>
                            <asp:Panel ID="pnl_updateFolder" runat="server" DefaultButton="btn_updateFolder">
                                <div class="table-settings-box">
                                    <div class="td-settings-title">
                                        FileDrive Folder
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <asp:TextBox ID="tb_updateFolder" runat="server" CssClass="textEntry" Width="98%"></asp:TextBox>
                                        <div class="clear-space-five"></div>
                                        <asp:LinkButton ID="btn_usedefaultloc" runat="server" CssClass="RandomActionBtns margin-top-sml"
                                            OnClick="btn_usedefaultloc_Click" Font-Size="Small">Use default path</asp:LinkButton>
                                        <div class="clear-space"></div>
                                        <asp:Button ID="btn_updateFolder" runat="server" CssClass="no-margin RandomActionBtns input-buttons"
                                            Text="Update" OnClick="btn_updateFolder_Click" />
                                    </div>
                                    <div class="td-settings-desc">
                                        This sets the root path for the FileDrive App to search through.
                                    </div>
                                </div>
                            </asp:Panel>
                        </ContentTemplate>
                    </asp:UpdatePanel>
                </asp:Panel>

                <asp:Panel ID="pnl_emailSettings" runat="server" ClientIDMode="Static" CssClass="pnl-section" Style="display: none;">
                    <asp:UpdatePanel ID="UpdatePanel2" runat="server">
                        <ContentTemplate>
                            The mail settings are used for outgoing email such as the notifications, updates,
                            and message forwarding.
                            <div class="clear-space"></div>
                            <asp:Panel ID="pnl_mailsettings" runat="server">
                                <div class="clear-margin" style="font-size: 12px;">
                                    <div class="float-left pad-right-big">
                                        <b class="pad-right-sml">Updated By:</b><asp:Label ID="lbl_updatedbymailsettings"
                                            runat="server" Text="N/A"></asp:Label>
                                    </div>
                                    <div class="float-left pad-left-big pad-right-big margin-right-big">
                                        <b class="pad-right-sml">Date Updated:</b><asp:Label ID="lbl_dateupdatedmailsettings"
                                            runat="server" Text="N/A"></asp:Label>
                                    </div>
                                    <div class="float-left pad-left-big">
                                        <h3>
                                            <span class="pad-right font-bold">Status:</span><asp:Label ID="lbl_emailStatus" runat="server"></asp:Label></h3>
                                    </div>
                                </div>
                                <div class="clear-space"></div>
                                <div class="table-settings-box">
                                    <div class="td-settings-title">
                                        Email Status
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <div class="field switch inline-block">
                                            <asp:RadioButton ID="rb_emailStatus_on" runat="server" Text="On" CssClass="RandomActionBtns cb-enable"
                                                OnCheckedChanged="rb_emailStatus_on_Checked" AutoPostBack="true" />
                                            <asp:RadioButton ID="rb_emailStatus_off" runat="server" Text="Off" CssClass="RandomActionBtns cb-disable"
                                                OnCheckedChanged="rb_emailStatus_off_Checked" AutoPostBack="true" />
                                        </div>
                                    </div>
                                    <div class="td-settings-desc">
                                        Turn on/off the ability to send emails from this site.
                                    </div>
                                </div>
                                <asp:Panel ID="pnl_emailStatus_holder" runat="server">
                                    <div class="table-settings-box">
                                        <div class="td-settings-title">
                                            SMTP Server Address
                                        </div>
                                        <div class="title-line"></div>
                                        <div class="td-settings-ctrl">
                                            <asp:TextBox ID="tb_smtpserver" runat="server" CssClass="textEntry margin-right-big"
                                                Width="200px"></asp:TextBox>
                                        </div>
                                    </div>
                                    <div class="table-settings-box">
                                        <div class="td-settings-title">
                                            Port Number
                                        </div>
                                        <div class="title-line"></div>
                                        <div class="td-settings-ctrl">
                                            <asp:TextBox ID="tb_portnumber" runat="server" CssClass="textEntry margin-right-big"
                                                Width="55px" MaxLength="4" TextMode="Number"></asp:TextBox>
                                        </div>
                                        <div class="td-settings-desc">
                                            Enter in the smtp server address and port number<br />
                                            that your outgoing mail will use. (Example: smtp.gmail.com:587)
                                        </div>
                                    </div>
                                    <div class="table-settings-box">
                                        <div class="td-settings-title">
                                            SSL Enabled
                                        </div>
                                        <div class="title-line"></div>
                                        <div class="td-settings-ctrl">
                                            <div class="field switch inline-block">
                                                <asp:RadioButton ID="rb_ssl_enabled" runat="server" Text="Yes" CssClass="RandomActionBtns cb-enable"
                                                    OnCheckedChanged="rb_ssl_enabled_Checked" AutoPostBack="true" />
                                                <asp:RadioButton ID="rb_ssl_disabled" runat="server" Text="No" CssClass="RandomActionBtns cb-disable"
                                                    OnCheckedChanged="rb_ssl_disabled_Checked" AutoPostBack="true" />
                                            </div>
                                        </div>
                                        <div class="td-settings-desc">
                                            Check to make sure that the port number being used to send email is not SSL enabled.
                                                    If it is, click enabled for SSL.
                                        </div>
                                    </div>
                                    <div class="table-settings-box">
                                        <div class="td-settings-title">
                                            Email Address
                                        </div>
                                        <div class="title-line"></div>
                                        <div class="td-settings-ctrl">
                                            <asp:TextBox ID="tb_usernamesmtp" runat="server" CssClass="textEntry"
                                                Width="200px"></asp:TextBox>
                                        </div>
                                        <div class="td-settings-desc">
                                            Use the email address associated with the smtp server.
                                        </div>
                                    </div>
                                    <div class="table-settings-box">
                                        <div class="td-settings-title">
                                            Email Password
                                        </div>
                                        <div class="title-line"></div>
                                        <div class="td-settings-ctrl">
                                            <asp:TextBox ID="tb_passwordsmtp" runat="server" CssClass="textEntry"
                                                Width="200px"></asp:TextBox>
                                        </div>
                                        <div class="td-settings-desc">
                                            Enter the password associated with the email address and smtp server.
                                        </div>
                                    </div>
                                    <div class="clear-space">
                                    </div>
                                    <asp:Button ID="btn_updatemailsettings" runat="server" Text="Update Mail Settings"
                                        ClientIDMode="Static" CssClass="input-buttons RandomActionBtns float-left"
                                        OnClick="btn_updatemailsettings_Click" />
                                    <asp:LinkButton ID="lbtn_testconnection" runat="server" Text="Test Connection" CssClass="margin-top-sml margin-left-big TestConnection float-left" OnClick="lbtn_testconnection_Click" />
                                    <asp:LinkButton ID="lbtn_SendTestEmail" runat="server" CssClass="margin-top-sml margin-left-big TestConnection float-left" OnClick="lbtn_SendTestEmail_Click" />
                                    <div class="clear-space">
                                    </div>
                                    <a id="btn_customizeSMTP" runat="server" clientidmode="Static" href="#iframecontent"
                                        class="margin-right float-left input-buttons" onclick="openWSE.LoadIFrameContent('SiteTools/iframes/EmailSettings.aspx', this);return false;"
                                        style="display: block;"><span class="img-customize margin-right-sml float-left"></span>Customize Outgoing Email Messages</a>
                                    <asp:Label ID="lbl_testconnection" runat="server" Visible="false" CssClass="float-left pad-left-big margin-left-big"
                                        Font-Size="Small" Style="padding-top: 7px;" Text=""></asp:Label>
                                    <small>
                                        <asp:Label ID="lbl_mailsettings_error" runat="server" ForeColor="Red" Visible="false"
                                            Style="margin-left: 180px;" Text="All fields must be filled out."></asp:Label></small>
                                    <div class="clear-space">
                                    </div>
                                </asp:Panel>
                            </asp:Panel>
                        </ContentTemplate>
                        <Triggers>
                            <asp:AsyncPostBackTrigger ControlID="lbtn_testconnection" />
                        </Triggers>
                    </asp:UpdatePanel>
                </asp:Panel>

                <asp:Panel ID="pnl_admincontrolsonly" CssClass="pnl-section" ClientIDMode="Static" runat="server" Visible="false" Enabled="false" Style="display: none;">
                    <asp:UpdatePanel ID="UpdatePanel3" runat="server">
                        <ContentTemplate>
                            These settings are only for the Administrator user. No users can see or modify these settings.
                            <div class="clear-space"></div>
                            <div class="table-settings-box">
                                <div class="td-settings-title">
                                    Update Server Settings Cache
                                </div>
                                <div class="title-line"></div>
                                <div class="td-settings-ctrl">
                                    <asp:Button ID="btn_updateserversettingscache" runat="server" Text="Update Cache" OnClick="btn_updateserversettingscache_Click"
                                        CssClass="RandomActionBtns input-buttons" />
                                </div>
                                <div class="td-settings-desc">
                                    Updates the Server Settings Cache. Only needed if change is made manually on the database.
                                </div>
                            </div>
                            <div id="ClearUserNoti_Controls" class="table-settings-box">
                                <div class="td-settings-title">
                                    Clear User Notifications
                                </div>
                                <div class="title-line"></div>
                                <div class="td-settings-ctrl">
                                    <asp:Button ID="btn_clearnotiall" runat="server" Text="Clear Notifications" OnClick="btn_clearnotiall_Click"
                                        CssClass="RandomActionBtns input-buttons" />
                                </div>
                                <div class="td-settings-desc">
                                    Delete all entries in the UserNotifications Table.
                                </div>
                            </div>
                            <div class="table-settings-box">
                                <div class="td-settings-title">
                                    Clear User Update Flags
                                </div>
                                <div class="title-line"></div>
                                <div class="td-settings-ctrl">
                                    <asp:Button ID="btn_clearflagall" runat="server" Text="Clear User Flags" OnClick="btn_clearflagall_Click"
                                        CssClass="RandomActionBtns input-buttons" />
                                </div>
                                <div class="td-settings-desc">
                                    Delete all entries in the UserUpdateFlags Table.
                                </div>
                            </div>
                            <div class="table-settings-box">
                                <div class="td-settings-title">
                                    Clear All User Chat Logs
                                </div>
                                <div class="title-line"></div>
                                <div class="td-settings-ctrl">
                                    <asp:Button ID="btn_clearuserchats" runat="server" Text="Clear Chat Logs" OnClick="btn_clearuserchats_Click"
                                        CssClass="RandomActionBtns input-buttons" />
                                </div>
                                <div class="td-settings-desc">
                                    Delete all user chat entries.
                                </div>
                            </div>
                            <asp:Panel ID="pnl_updateadminnote" runat="server" DefaultButton="btn_updateadminnote">
                                <div class="table-settings-box">
                                    <div class="td-settings-title">
                                        Administrator Workspace Note
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <asp:TextBox ID="tb_adminnote" runat="server" CssClass="textEntry float-left" Width="350px"
                                            AutoPostBack="False" TextMode="MultiLine" Height="40px" Font-Names='"Arial"'
                                            BorderColor="#D9D9D9" BorderStyle="Solid" BorderWidth="1px" Style="padding: 4px;"
                                            ForeColor="#353535"></asp:TextBox>
                                        <div class="clear-space"></div>
                                        <asp:Button ID="btn_updateadminnote" runat="server" CssClass="no-margin RandomActionBtns input-buttons"
                                            Text="Update" OnClick="btn_updateadminnote_Click" />
                                        <div class="clear-space-five">
                                        </div>
                                        <asp:LinkButton ID="btn_updateadminnote_clear" runat="server" CssClass="RandomActionBtns"
                                            OnClick="btn_updateadminnote_clear_Click">Clear</asp:LinkButton>
                                    </div>
                                    <div class="td-settings-desc">
                                        Add a note for all users to see on a workspace overlay.
                                                <asp:Label ID="lbl_adminnoteby" runat="server" Text=""></asp:Label>
                                    </div>
                                </div>
                                <asp:Panel ID="pnlLoginMessage" runat="server">
                                    <div class="table-settings-box">
                                        <div class="td-settings-title">
                                            Login Page Message
                                        </div>
                                        <div class="title-line"></div>
                                        <div class="td-settings-ctrl">
                                            <asp:TextBox ID="tb_loginPageMessage" runat="server" CssClass="textEntry float-left"
                                                Width="350px" AutoPostBack="False" TextMode="MultiLine" Height="40px" Font-Names='"Arial"'
                                                BorderColor="#D9D9D9" BorderStyle="Solid" BorderWidth="1px" Style="padding: 4px;"
                                                ForeColor="#353535"></asp:TextBox>
                                            <div class="clear-space"></div>
                                            <asp:Button ID="btn_loginPageMessage" runat="server" CssClass="no-margin RandomActionBtns input-buttons"
                                                Text="Update" OnClick="btn_loginPageMessage_Click" />
                                            <div class="clear-space-five">
                                            </div>
                                            <asp:LinkButton ID="lbtn_loginPageMessage" runat="server" CssClass="RandomActionBtns"
                                                OnClick="lbtn_loginPageMessage_clear_Click">Clear</asp:LinkButton>
                                        </div>
                                        <div class="td-settings-desc">
                                            Add a note for all users to see on the Login Page.
                                                    <asp:Label ID="lbl_loginMessageDate" runat="server" Text="N/A"></asp:Label>
                                        </div>
                                    </div>
                                </asp:Panel>
                            </asp:Panel>
                            <div class="table-settings-box">
                                <div class="td-settings-title">
                                    Show New Updates on User Login
                                </div>
                                <div class="title-line"></div>
                                <div class="td-settings-ctrl">
                                    <asp:Button ID="btn_ShowUpdates" runat="server" Text="Show Updates" OnClick="btn_showUpdates_Click"
                                        CssClass="RandomActionBtns input-buttons" />
                                </div>
                                <div class="td-settings-desc">
                                    Will show the latest updates upon user login. (Will apply
                                                to all users)
                                            <br />
                                    <span class="font-bold pad-right-sml">Last Updated:</span><asp:Label
                                        ID="lbl_dateUpdated_sup" runat="server"></asp:Label>
                                </div>
                            </div>
                            <div class="table-settings-box">
                                <div class="td-settings-title">
                                    Custom Error Page
                                </div>
                                <div class="title-line"></div>
                                <div class="td-settings-ctrl">
                                    <div class="field switch inline-block">
                                        <asp:RadioButton ID="rb_CustomErrorPage_on" runat="server" Text="Yes" CssClass="RandomActionBtns cb-enable"
                                            OnCheckedChanged="rb_CustomErrorPage_on_CheckedChanged" AutoPostBack="True" />
                                        <asp:RadioButton ID="rb_CustomErrorPage_off" runat="server" Text="No" CssClass="RandomActionBtns cb-disable"
                                            OnCheckedChanged="rb_CustomErrorPage_off_CheckedChanged" AutoPostBack="True" />
                                    </div>
                                </div>
                                <div class="td-settings-desc">
                                    Turn this on to direct users to a custom error page instead of showing the issue.
                                </div>
                            </div>
                            <asp:Panel ID="pnl_ErrorPageRedirect" runat="server" Enabled="false" Visible="false" DefaultButton="btnCustomErrorPageRedirect">
                                <div class="table-settings-box">
                                    <div class="td-settings-title">
                                        Error Page Redirect
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <asp:TextBox ID="tbCustomErrorPageRedirect" runat="server" CssClass="textEntry margin-right"></asp:TextBox>
                                        <asp:Button ID="btnCustomErrorPageRedirect" runat="server" CssClass="input-buttons RandomActionBtns" Text="Update" OnClick="btnCustomErrorPageRedirect_Click" />
                                        <div class="clear-space-five"></div>
                                        <asp:LinkButton ID="lbtn_UserDefaultRedirectPage" runat="server" CssClass="RandomActionBtns margin-top-sml"
                                            OnClick="lbtn_UserDefaultRedirectPage_Click" Font-Size="Small">Use default page</asp:LinkButton>
                                    </div>
                                    <div class="td-settings-desc">
                                        Set the redirect page when an error occurs.
                                    </div>
                                </div>
                            </asp:Panel>
                            <div class="table-settings-box">
                                <div class="td-settings-title">
                                    Save Cookies as ASP.NET Sessions
                                </div>
                                <div class="title-line"></div>
                                <div class="td-settings-ctrl">
                                    <div class="field switch inline-block">
                                        <asp:RadioButton ID="rb_SaveCookiesAsSessions_on" runat="server" Text="Yes" CssClass="RandomActionBtns cb-enable"
                                            OnCheckedChanged="rb_SaveCookiesAsSessions_on_CheckedChanged" AutoPostBack="True" />
                                        <asp:RadioButton ID="rb_SaveCookiesAsSessions_off" runat="server" Text="No" CssClass="RandomActionBtns cb-disable"
                                            OnCheckedChanged="rb_SaveCookiesAsSessions_off_CheckedChanged" AutoPostBack="True" />
                                    </div>
                                </div>
                                <div class="td-settings-desc">
                                    Turn this on to save any cookies being handled in the javascript to an ASP.NET Session State. This can be useful if users don't want to cookies. Be careful though, this might cause the system to slow down.
                                </div>
                            </div>
                            <div class="table-settings-box">
                                <div class="td-settings-title">
                                    Use SSL Redirect
                                </div>
                                <div class="title-line"></div>
                                <div class="td-settings-ctrl">
                                    <div class="field switch inline-block">
                                        <asp:RadioButton ID="rb_sslredirect_on" runat="server" Text="Yes" CssClass="RandomActionBtns cb-enable"
                                            OnCheckedChanged="rb_sslredirect_on_CheckedChanged" AutoPostBack="True" />
                                        <asp:RadioButton ID="rb_sslredirect_off" runat="server" Text="No" CssClass="RandomActionBtns cb-disable"
                                            OnCheckedChanged="rb_sslredirect_off_CheckedChanged" AutoPostBack="True" />
                                    </div>
                                </div>
                                <div class="td-settings-desc">
                                    If your site requires ssl to access, select True to redirect
                                                the http requests to https. May Slow down requests. (Will not redirect on apps) You must setup Bindings within IIS on your
                                                server to point to both https and http urls. (No users except the Administrator
                                                will be able to access it)
                                </div>
                            </div>
                            <asp:Panel ID="pnl_sslValidation" runat="server" Enabled="false" Visible="false">
                                <div class="table-settings-box">
                                    <div class="td-settings-title">
                                        URL Validation
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <div class="field switch inline-block">
                                            <asp:RadioButton ID="rb_urlvalidation_on" runat="server" Text="On" CssClass="RandomActionBtns cb-enable"
                                                OnCheckedChanged="rb_urlvalidation_on_CheckedChanged" AutoPostBack="True" />
                                            <asp:RadioButton ID="rb_urlvalidation_off" runat="server" Text="Off" CssClass="RandomActionBtns cb-disable"
                                                OnCheckedChanged="rb_urlvalidation_off_CheckedChanged" AutoPostBack="True" />
                                        </div>
                                    </div>
                                    <div class="td-settings-desc">
                                        If you want to check if the URL is valid, enable this setting.
                                    </div>
                                </div>
                            </asp:Panel>
                            <div id="ChatClient_Controls" class="table-settings-box">
                                <div class="td-settings-title">
                                    Chat Client
                                </div>
                                <div class="title-line"></div>
                                <div class="td-settings-ctrl">
                                    <div class="field switch inline-block">
                                        <asp:RadioButton ID="rb_chatclient_on" runat="server" Text="On" CssClass="RandomActionBtns cb-enable"
                                            OnCheckedChanged="rb_chatclient_on_CheckedChanged" AutoPostBack="True" />
                                        <asp:RadioButton ID="rb_chatclient_off" runat="server" Text="Off" CssClass="RandomActionBtns cb-disable"
                                            OnCheckedChanged="rb_chatclient_off_CheckedChanged" AutoPostBack="True" />
                                    </div>
                                </div>
                                <div class="td-settings-desc">
                                    Disabling this will disable all users from accessing the
                                                chat client.
                                </div>
                            </div>
                            <div class="table-settings-box">
                                <div class="td-settings-title">
                                    Associate Apps & Plugins with Groups
                                </div>
                                <div class="title-line"></div>
                                <div class="td-settings-ctrl">
                                    <div class="field switch inline-block">
                                        <asp:RadioButton ID="rb_AssociateWithGroups_on" runat="server" Text="Yes" CssClass="RandomActionBtns cb-enable"
                                            OnCheckedChanged="rb_AssociateWithGroups_on_CheckedChanged" AutoPostBack="True" />
                                        <asp:RadioButton ID="rb_AssociateWithGroups_off" runat="server" Text="No" CssClass="RandomActionBtns cb-disable"
                                            OnCheckedChanged="rb_AssociateWithGroups_off_CheckedChanged" AutoPostBack="True" />
                                    </div>
                                </div>
                                <div class="td-settings-desc">
                                    Set this to Yes to lock apps, plugins, custom tables, table imports, and anything that is specific to groups. This is done by taking the creator and matching the group they are in.
                                </div>
                            </div>
                            <div class="table-settings-box">
                                <div class="td-settings-title">
                                    Clear All User Group Session States
                                </div>
                                <div class="title-line"></div>
                                <div class="td-settings-ctrl">
                                    <asp:Button ID="btn_ClearGroupSessions" runat="server" CssClass="RandomActionBtns input-buttons" Text="Clear Sessions" OnClick="btn_ClearGroupSessions_Click" />
                                </div>
                                <div class="td-settings-desc">
                                    Click here to clear all group session states stored in memory. This will kick any user currently logged into a group off.
                                </div>
                            </div>
                            <div class="table-settings-box">
                                <div class="td-settings-title">
                                    Allow App Rating
                                </div>
                                <div class="title-line"></div>
                                <div class="td-settings-ctrl">
                                    <div class="field switch inline-block">
                                        <asp:RadioButton ID="rb_allowapprating_on" runat="server" Text="Yes" CssClass="RandomActionBtns cb-enable"
                                            OnCheckedChanged="rb_allowapprating_on_CheckedChanged" AutoPostBack="True" />
                                        <asp:RadioButton ID="rb_allowapprating_off" runat="server" Text="No" CssClass="RandomActionBtns cb-disable"
                                            OnCheckedChanged="rb_allowapprating_off_CheckedChanged" AutoPostBack="True" />
                                    </div>
                                </div>
                                <div class="td-settings-desc">
                                    Set to No if you want to disable and hide all app ratings.
                                </div>
                            </div>
                            <div class="table-settings-box">
                                <div class="td-settings-title">
                                    Allow User Privacy
                                </div>
                                <div class="title-line"></div>
                                <div class="td-settings-ctrl">
                                    <div class="field switch inline-block">
                                        <asp:RadioButton ID="rb_allowUserPrivacy_on" runat="server" Text="Yes" CssClass="RandomActionBtns cb-enable"
                                            OnCheckedChanged="rb_allowUserPrivacy_on_CheckedChanged" AutoPostBack="True" />
                                        <asp:RadioButton ID="rb_allowUserPrivacy_off" runat="server" Text="No" CssClass="RandomActionBtns cb-disable"
                                            OnCheckedChanged="rb_allowUserPrivacy_off_CheckedChanged" AutoPostBack="True" />
                                    </div>
                                </div>
                                <div class="td-settings-desc">
                                    Set to true if you want to allow all users to decide if
                                                they want to be private. This will stop any logging of the user
                                                in the Network Log and disables the chat client for a user.
                                </div>
                            </div>
                            <div class="table-settings-box">
                                <div class="td-settings-title">
                                    Site Status
                                </div>
                                <div class="title-line"></div>
                                <div class="td-settings-ctrl">
                                    <div class="field switch inline-block">
                                        <asp:RadioButton ID="rb_siteonline" runat="server" Text="Online" CssClass="RandomActionBtns cb-enable"
                                            OnCheckedChanged="rb_siteonline_CheckedChanged" AutoPostBack="True" />
                                        <asp:RadioButton ID="rb_siteoffline" runat="server" Text="Offline" CssClass="RandomActionBtns cb-disable"
                                            OnCheckedChanged="rb_siteoffline_CheckedChanged" AutoPostBack="True" />
                                    </div>
                                </div>
                                <div class="td-settings-desc">
                                    Take the site offline. (No users except the Administrator
                                                will be able to access it)
                                </div>
                            </div>
                            <div class="table-settings-box">
                                <div class="td-settings-title">
                                    Email On Created Account
                                </div>
                                <div class="title-line"></div>
                                <div class="td-settings-ctrl">
                                    <div class="field switch inline-block">
                                        <asp:RadioButton ID="rb_emailonReg_on" runat="server" Text="Yes" CssClass="RandomActionBtns cb-enable"
                                            OnCheckedChanged="rb_emailonReg_on_CheckedChanged" AutoPostBack="True" />
                                        <asp:RadioButton ID="rb_emailonReg_off" runat="server" Text="No" CssClass="RandomActionBtns cb-disable"
                                            OnCheckedChanged="rb_emailonReg_off_CheckedChanged" AutoPostBack="True" />
                                    </div>
                                </div>
                                <div class="td-settings-desc">
                                    Email the Administrator when a user creates a new account.
                                </div>
                            </div>
                            <div class="table-settings-box">
                                <div class="td-settings-title">
                                    Hide All App/Sidebar Icons
                                </div>
                                <div class="title-line"></div>
                                <div class="td-settings-ctrl">
                                    <div class="field switch inline-block">
                                        <asp:RadioButton ID="rb_hideAllAppIcons_on" runat="server" Text="Yes" CssClass="RandomActionBtns cb-enable"
                                            OnCheckedChanged="rb_hideAllAppIcons_on_CheckedChanged" AutoPostBack="True" />
                                        <asp:RadioButton ID="rb_hideAllAppIcons_off" runat="server" Text="No" CssClass="RandomActionBtns cb-disable"
                                            OnCheckedChanged="rb_hideAllAppIcons_off_CheckedChanged" AutoPostBack="True" />
                                    </div>
                                </div>
                                <div class="td-settings-desc">
                                    Select Yes to hide all app and sidebar icons.
                                </div>
                            </div>
                            <div class="table-settings-box">
                                <div class="td-settings-title">
                                    Force Group Login
                                </div>
                                <div class="title-line"></div>
                                <div class="td-settings-ctrl">
                                    <div class="field switch inline-block">
                                        <asp:RadioButton ID="rb_ForceGroupLogin_on" runat="server" Text="Yes" CssClass="RandomActionBtns cb-enable"
                                            OnCheckedChanged="rb_ForceGroupLogin_on_CheckedChanged" AutoPostBack="True" />
                                        <asp:RadioButton ID="rb_ForceGroupLogin_off" runat="server" Text="No" CssClass="RandomActionBtns cb-disable"
                                            OnCheckedChanged="rb_ForceGroupLogin_off_CheckedChanged" AutoPostBack="True" />
                                    </div>
                                </div>
                                <div class="td-settings-desc">
                                    You can force users to login to a group by enabling this feature. Enabling this will force users to use the default login page. (No preview or demo users allowed)
                                </div>
                            </div>
                            <asp:Panel ID="pnl_showpreviewbutton" runat="server">
                                <div class="table-settings-box">
                                    <div class="td-settings-title">
                                        Show Preview Button on Login Screen
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <div class="field switch inline-block">
                                            <asp:RadioButton ID="rb_ShowPreviewButtonLogin_on" runat="server" Text="Show" CssClass="RandomActionBtns cb-enable"
                                                OnCheckedChanged="rb_ShowPreviewButtonLogin_on_CheckedChanged" AutoPostBack="True" />
                                            <asp:RadioButton ID="rb_ShowPreviewButtonLogin_off" runat="server" Text="Hide" CssClass="RandomActionBtns cb-disable"
                                                OnCheckedChanged="rb_ShowPreviewButtonLogin_off_CheckedChanged" AutoPostBack="True" />
                                        </div>
                                    </div>
                                    <div class="td-settings-desc">
                                        Select Show to show the preview button on the login screen.
                                                    (Disabled by default)
                                    </div>
                                </div>
                            </asp:Panel>
                            <asp:Panel ID="pnl_nologinrequired" runat="server">
                                <div class="table-settings-box">
                                    <div class="td-settings-title">
                                        No Login Required
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <div class="field switch inline-block">
                                            <asp:RadioButton ID="rb_nologinrequired_on" runat="server" Text="Yes" CssClass="RandomActionBtns cb-enable"
                                                OnCheckedChanged="rb_nologinrequired_on_CheckedChanged" AutoPostBack="True" />
                                            <asp:RadioButton ID="rb_nologinrequired_off" runat="server" Text="No" CssClass="RandomActionBtns cb-disable"
                                                OnCheckedChanged="rb_nologinrequired_off_CheckedChanged" AutoPostBack="True" />
                                        </div>
                                    </div>
                                    <div class="td-settings-desc">
                                        Set to No to make the site available to anyone without
                                                an account.
                                    </div>
                                </div>
                                <asp:Panel ID="pnl_showloginmodalondemomode" runat="server">
                                    <div class="table-settings-box">
                                        <div class="td-settings-title">
                                            Show Login Modal on Page Load (No Login/Demo Mode)
                                        </div>
                                        <div class="title-line"></div>
                                        <div class="td-settings-ctrl">
                                            <div class="field switch inline-block">
                                                <asp:RadioButton ID="rb_ShowLoginModalOnDemoMode_on" runat="server" Text="Yes" CssClass="RandomActionBtns cb-enable"
                                                    OnCheckedChanged="rb_ShowLoginModalOnDemoMode_on_CheckedChanged" AutoPostBack="True" />
                                                <asp:RadioButton ID="rb_ShowLoginModalOnDemoMode_off" runat="server" Text="No" CssClass="RandomActionBtns cb-disable"
                                                    OnCheckedChanged="rb_ShowLoginModalOnDemoMode_off_CheckedChanged" AutoPostBack="True" />
                                            </div>
                                        </div>
                                        <div class="td-settings-desc">
                                            Set to Yes to force the login modal window on page load. This will only apply when user is attempting to access the Workspace on No Login/Demo mode.
                                        </div>
                                    </div>
                                </asp:Panel>
                            </asp:Panel>
                            <asp:Panel ID="pnl_NoLoginMainPage" runat="server" Enabled="false" Visible="false">
                                <div class="table-settings-box">
                                    <div class="td-settings-title">
                                        No Login/Demo Customizations
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <a href="#iframecontent" class="input-buttons-create float-left" onclick="openWSE.LoadIFrameContent('SiteTools/UserMaintenance/AcctSettings.aspx?u=demouser&toolview=true', this);return false;"
                                            style="display: block;">Customize Demo User</a>
                                        <div class="clear"></div>
                                    </div>
                                    <div class="td-settings-desc">
                                        Customize the demo user settings.
                                    </div>
                                </div>
                            </asp:Panel>
                            <div class="clear" style="height: 50px;">
                            </div>
                            <asp:Panel ID="Panel1" CssClass="pnl-section-child" runat="server">
                                <div class="editor_titles">
                                    <div class="title-line"></div>
                                    <h3>System Lock Settings</h3>
                                </div>
                                The Administrator can lock all users (including the Administrator) from accessing certain features of the site.
                                <div class="clear-space">
                                </div>
                                <div class="table-settings-box">
                                    <div class="td-settings-title">Lock File Manager</div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <div class="field switch inline-block">
                                            <asp:RadioButton ID="rb_LockFileManager_on" runat="server" Text="Yes" CssClass="RandomActionBtns cb-enable"
                                                OnCheckedChanged="rb_LockFileManager_on_CheckedChanged" AutoPostBack="True" />
                                            <asp:RadioButton ID="rb_LockFileManager_off" runat="server" Text="No" CssClass="RandomActionBtns cb-disable"
                                                OnCheckedChanged="rb_LockFileManager_off_CheckedChanged" AutoPostBack="True" />
                                        </div>
                                    </div>
                                    <div class="td-settings-desc">
                                        Lock the File Manager so no other user can view the source
                                                code.
                                    </div>
                                </div>
                                <div class="table-settings-box">
                                    <div class="td-settings-title">
                                        Lock Site Plugins
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <div class="field switch inline-block">
                                            <asp:RadioButton ID="rb_siteplugins_on" runat="server" Text="Yes" CssClass="RandomActionBtns cb-enable"
                                                OnCheckedChanged="rb_siteplugins_on_CheckedChanged" AutoPostBack="True" />
                                            <asp:RadioButton ID="rb_siteplugins_off" runat="server" Text="No" CssClass="RandomActionBtns cb-disable"
                                                OnCheckedChanged="rb_siteplugins_off_CheckedChanged" AutoPostBack="True" />
                                        </div>
                                    </div>
                                    <div class="td-settings-desc">
                                        Lock the Site Plugins feature so no user can upload, install
                                                them, or edit them.
                                    </div>
                                </div>
                                <div class="table-settings-box">
                                    <div class="td-settings-title">
                                        Lock Notifications Manager
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <div class="field switch inline-block">
                                            <asp:RadioButton ID="rb_sitenotifi_on" runat="server" Text="Yes" CssClass="RandomActionBtns cb-enable"
                                                OnCheckedChanged="rb_sitenotifi_on_CheckedChanged" AutoPostBack="True" />
                                            <asp:RadioButton ID="rb_sitenotifi_off" runat="server" Text="No" CssClass="RandomActionBtns cb-disable"
                                                OnCheckedChanged="rb_sitenotifi_off_CheckedChanged" AutoPostBack="True" />
                                        </div>
                                    </div>
                                    <div class="td-settings-desc">
                                        Lock the Site Notifications feature so no user can upload,
                                                install, or edit them.
                                    </div>
                                </div>
                                <div class="table-settings-box">
                                    <div class="td-settings-title">
                                        Lock Overlay Manager
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <div class="field switch inline-block">
                                            <asp:RadioButton ID="rb_siteoverlay_on" runat="server" Text="Yes" CssClass="RandomActionBtns cb-enable"
                                                OnCheckedChanged="rb_siteoverlay_on_CheckedChanged" AutoPostBack="True" />
                                            <asp:RadioButton ID="rb_siteoverlay_off" runat="server" Text="No" CssClass="RandomActionBtns cb-disable"
                                                OnCheckedChanged="rb_siteoverlay_off_CheckedChanged" AutoPostBack="True" />
                                        </div>
                                    </div>
                                    <div class="td-settings-desc">
                                        Lock the Site Overlay feature so no user can upload, install,
                                                or edit them.
                                    </div>
                                </div>
                                <div class="table-settings-box">
                                    <div class="td-settings-title">
                                        Lock Custom Tables
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <div class="field switch inline-block">
                                            <asp:RadioButton ID="rb_lockcustomtables_on" runat="server" Text="Yes" CssClass="RandomActionBtns cb-enable"
                                                OnCheckedChanged="rb_lockcustomtables_on_CheckedChanged" AutoPostBack="True" />
                                            <asp:RadioButton ID="rb_lockcustomtables_off" runat="server" Text="No" CssClass="RandomActionBtns cb-disable"
                                                OnCheckedChanged="rb_lockcustomtables_off_CheckedChanged" AutoPostBack="True" />
                                        </div>
                                    </div>
                                    <div class="td-settings-desc">
                                        Prevent anyone from creating a custom table.
                                    </div>
                                </div>
                                <div class="table-settings-box">
                                    <div class="td-settings-title">
                                        Lock App Creator
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <div class="field switch inline-block">
                                            <asp:RadioButton ID="rb_LockAppCreator_on" runat="server" Text="Yes" CssClass="RandomActionBtns cb-enable"
                                                OnCheckedChanged="rb_LockAppCreator_on_CheckedChanged" AutoPostBack="True" />
                                            <asp:RadioButton ID="rb_LockAppCreator_off" runat="server" Text="No" CssClass="RandomActionBtns cb-disable"
                                                OnCheckedChanged="rb_LockAppCreator_off_CheckedChanged" AutoPostBack="True" />
                                        </div>
                                    </div>
                                    <div class="td-settings-desc">
                                        Prevent anyone from creating and uploading an app.
                                    </div>
                                </div>
                                <div class="table-settings-box">
                                    <div class="td-settings-title">
                                        Lock Background Services
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <div class="field switch inline-block">
                                            <asp:RadioButton ID="rb_LockBackgroundServices_on" runat="server" Text="Yes" CssClass="RandomActionBtns cb-enable"
                                                OnCheckedChanged="rb_LockBackgroundServices_on_CheckedChanged" AutoPostBack="True" />
                                            <asp:RadioButton ID="rb_LockBackgroundServices_off" runat="server" Text="No" CssClass="RandomActionBtns cb-disable"
                                                OnCheckedChanged="rb_LockBackgroundServices_off_CheckedChanged" AutoPostBack="True" />
                                        </div>
                                    </div>
                                    <div class="td-settings-desc">
                                        Prevent anyone from uploading, starting, or stopping a background service.
                                    </div>
                                </div>
                                <div class="table-settings-box">
                                    <div class="td-settings-title">
                                        Lock Startup Scripts
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <div class="field switch inline-block">
                                            <asp:RadioButton ID="rb_Lockstartupscripts_on" runat="server" Text="Yes" CssClass="RandomActionBtns cb-enable"
                                                OnCheckedChanged="rb_Lockstartupscripts_on_CheckedChanged" AutoPostBack="True" />
                                            <asp:RadioButton ID="rb_Lockstartupscripts_off" runat="server" Text="No" CssClass="RandomActionBtns cb-disable"
                                                OnCheckedChanged="rb_Lockstartupscripts_off_CheckedChanged" AutoPostBack="True" />
                                        </div>
                                    </div>
                                    <div class="td-settings-desc">
                                        Lock the Startup Scripts so no other user can edit.
                                    </div>
                                </div>
                                <div class="table-settings-box">
                                    <div class="td-settings-title">
                                        Lock IP Listener and WatchList
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <div class="field switch inline-block">
                                            <asp:RadioButton ID="rb_Lockiplisteneron" runat="server" Text="Yes" CssClass="RandomActionBtns cb-enable"
                                                OnCheckedChanged="rb_Lockiplisteneron_CheckedChanged" AutoPostBack="True" />
                                            <asp:RadioButton ID="rb_Lockiplisteneroff" runat="server" Text="No" CssClass="RandomActionBtns cb-disable"
                                                OnCheckedChanged="rb_Lockiplisteneroff_CheckedChanged" AutoPostBack="True" />
                                        </div>
                                    </div>
                                    <div class="td-settings-desc">
                                        Lock the IP Listener and IP WatchList so no other user can edit.
                                    </div>
                                </div>
                                <div class="table-settings-box">
                                    <div class="td-settings-title">
                                        Lock Site Customizations
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <div class="field switch inline-block">
                                            <asp:RadioButton ID="rb_siteCustomizations_On" runat="server" Text="Yes" CssClass="RandomActionBtns cb-enable"
                                                OnCheckedChanged="rb_siteCustomizations_On_CheckedChanged" AutoPostBack="True" />
                                            <asp:RadioButton ID="rb_siteCustomizations_Off" runat="server" Text="No" CssClass="RandomActionBtns cb-disable"
                                                OnCheckedChanged="rb_siteCustomizations_Off_CheckedChanged" AutoPostBack="True" />
                                        </div>
                                    </div>
                                    <div class="td-settings-desc">
                                        Lock the Site Customizations so no other user can edit.
                                    </div>
                                </div>
                            </asp:Panel>
                            <asp:Panel ID="pnl_twitterSettings" CssClass="pnl-section-child" runat="server">
                                <div class="editor_titles">
                                    <div class="title-line"></div>
                                    <h3>
                                        <img id="twitter_logo" alt="" src="~/Standard_Images/ApiLoginImages/twitter_login.png" runat="server" />Twitter OAuth Settings</h3>
                                </div>
                                Your application's OAuth settings. Keep the "Access Token Secret" and "Consumer Secret" a secret. This key
                                should never be human-readable.
                                <div class="clear-space">
                                </div>
                                <asp:Panel ID="pnl_TwitterAccessToken" runat="server" DefaultButton="btn_updateTwitterAccessToken">
                                    <div class="table-settings-box no-margin no-padding no-border">
                                        <div class="td-settings-title">
                                            Access Token
                                        </div>
                                        <div class="title-line"></div>
                                        <div class="td-settings-ctrl">
                                            <asp:TextBox ID="tb_updateTwitterAccessToken" runat="server" CssClass="textEntry"
                                                Width="400px"></asp:TextBox><asp:Button ID="btn_updateTwitterAccessToken" runat="server" CssClass="margin-left RandomActionBtns input-buttons"
                                                    Text="Update" OnClick="btn_updateTwitterAccessToken_Click" />
                                        </div>
                                    </div>
                                </asp:Panel>
                                <asp:Panel ID="pnl_TwitterAccessTokenSecret" runat="server" DefaultButton="btn_updateTwitterAccessTokenSecret">
                                    <div class="table-settings-box no-margin no-padding no-border">
                                        <div class="td-settings-title">
                                            Access Token Secret
                                        </div>
                                        <div class="title-line"></div>
                                        <div class="td-settings-ctrl">
                                            <asp:TextBox ID="tb_updateTwitterAccessTokenSecret" runat="server" CssClass="textEntry"
                                                Width="400px"></asp:TextBox><asp:Button ID="btn_updateTwitterAccessTokenSecret" runat="server" CssClass="margin-left RandomActionBtns input-buttons"
                                                    Text="Update" OnClick="btn_updateTwitterAccessTokenSecret_Click" />
                                        </div>
                                    </div>
                                </asp:Panel>
                                <asp:Panel ID="pnl_TwitterConsumerKey" runat="server" DefaultButton="btn_updateTwitterConsumerKey">
                                    <div class="table-settings-box no-margin no-padding no-border">
                                        <div class="td-settings-title">
                                            Consumer Key
                                        </div>
                                        <div class="title-line"></div>
                                        <div class="td-settings-ctrl">
                                            <asp:TextBox ID="tb_updateTwitterConsumerKey" runat="server" CssClass="textEntry"
                                                Width="400px"></asp:TextBox><asp:Button ID="btn_updateTwitterConsumerKey" runat="server" CssClass="margin-left RandomActionBtns input-buttons"
                                                    Text="Update" OnClick="btn_updateTwitterConsumerKey_Click" />
                                        </div>
                                    </div>
                                </asp:Panel>
                                <asp:Panel ID="pnl_TwitterConsumerSecret" runat="server" DefaultButton="btn_updateTwitterConsumerSecret">
                                    <div class="table-settings-box no-margin no-padding no-border">
                                        <div class="td-settings-title">
                                            Consumer Secret
                                        </div>
                                        <div class="title-line"></div>
                                        <div class="td-settings-ctrl">
                                            <asp:TextBox ID="tb_updateTwitterConsumerSecret" runat="server" CssClass="textEntry"
                                                Width="400px"></asp:TextBox><asp:Button ID="btn_updateTwitterConsumerSecret" runat="server" CssClass="margin-left RandomActionBtns input-buttons"
                                                    Text="Update" OnClick="btn_updateTwitterConsumerSecret_Click" />
                                        </div>
                                    </div>
                                </asp:Panel>
                            </asp:Panel>
                            <asp:Panel ID="pnl_googleSettings" CssClass="pnl-section-child" runat="server">
                                <div class="editor_titles">
                                    <div class="title-line"></div>
                                    <h3>
                                        <img id="google_logo" alt="" src="~/Standard_Images/ApiLoginImages/google_login.png" runat="server" />Google OAuth 2.0 Settings</h3>
                                </div>
                                Your Google OAuth 2.0 settings. Keep the "Client Secret" a secret. This key
                                should never be human-readable. Make sure your redirect url(s) match your Google App.
                                <div class="clear-space">
                                </div>
                                <asp:Panel ID="pnl_GoogleClientId" runat="server" DefaultButton="btn_updateGoogleClientId">
                                    <div class="table-settings-box no-margin no-padding no-border">
                                        <div class="td-settings-title">
                                            Client ID
                                        </div>
                                        <div class="title-line"></div>
                                        <div class="td-settings-ctrl">
                                            <asp:TextBox ID="txt_GoogleClientId" runat="server" CssClass="textEntry"
                                                Width="400px"></asp:TextBox><asp:Button ID="btn_updateGoogleClientId" runat="server" CssClass="margin-left RandomActionBtns input-buttons"
                                                    Text="Update" OnClick="btn_updateGoogleClientId_Click" />
                                        </div>
                                    </div>
                                </asp:Panel>
                                <asp:Panel ID="pnl_GoogleClientSecret" runat="server" DefaultButton="btn_updateGoogleClientSecret">
                                    <div class="table-settings-box no-margin no-padding no-border">
                                        <div class="td-settings-title">
                                            Client Secret
                                        </div>
                                        <div class="title-line"></div>
                                        <div class="td-settings-ctrl">
                                            <asp:TextBox ID="txt_GoogleClientSecret" runat="server" CssClass="textEntry"
                                                Width="400px"></asp:TextBox><asp:Button ID="btn_updateGoogleClientSecret" runat="server" CssClass="margin-left RandomActionBtns input-buttons"
                                                    Text="Update" OnClick="btn_updateGoogleClientSecret_Click" />
                                        </div>
                                    </div>
                                </asp:Panel>
                                <div class="table-settings-box no-margin no-padding no-border">
                                    <div class="td-settings-title">
                                        Redirect Url(s)
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <asp:Literal ID="ltl_googleRedirect" runat="server"></asp:Literal>
                                    </div>
                                </div>
                            </asp:Panel>
                            <asp:Panel ID="pnl_facebookSettings" CssClass="pnl-section-child" runat="server" Style="padding-bottom: 20px;">
                                <div class="editor_titles">
                                    <div class="title-line"></div>
                                    <h3>
                                        <img id="facebook_img" alt="" src="~/Standard_Images/ApiLoginImages/facebook_login.png" runat="server" />Facebook API Settings</h3>
                                </div>
                                Your Facebook Graph API settings. Keep the "App Secret" a secret. This key
                                should never be human-readable. Make sure your redirect url(s) match your Facebook App.
                                <div class="clear-space">
                                </div>
                                <asp:Panel ID="pnl_facebookAppId" runat="server" DefaultButton="btn_updateFacebookAppId">
                                    <div class="table-settings-box no-margin no-padding no-border">
                                        <div class="td-settings-title">
                                            App ID
                                        </div>
                                        <div class="title-line"></div>
                                        <div class="td-settings-ctrl">
                                            <asp:TextBox ID="txt_facebookAppId" runat="server" CssClass="textEntry"
                                                Width="400px"></asp:TextBox>
                                            <asp:Button ID="btn_updateFacebookAppId" runat="server" CssClass="margin-left RandomActionBtns input-buttons"
                                                Text="Update" OnClick="btn_updateFacebookAppId_Click" />
                                        </div>
                                    </div>
                                </asp:Panel>
                                <asp:Panel ID="pnl_facebookAppSecret" runat="server" DefaultButton="btn_updateFacebookAppSecret">
                                    <div class="table-settings-box no-margin no-padding no-border">
                                        <div class="td-settings-title">
                                            App Secret
                                        </div>
                                        <div class="title-line"></div>
                                        <div class="td-settings-ctrl">
                                            <asp:TextBox ID="txt_facebookAppSecret" runat="server" CssClass="textEntry"
                                                Width="400px"></asp:TextBox><asp:Button ID="btn_updateFacebookAppSecret" runat="server" CssClass="margin-left RandomActionBtns input-buttons"
                                                    Text="Update" OnClick="btn_updateFacebookAppSecret_Click" />
                                        </div>
                                    </div>
                                </asp:Panel>
                                <div class="table-settings-box no-margin no-padding no-border">
                                    <div class="td-settings-title">
                                        Redirect Url(s)
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <asp:Literal ID="ltl_facebookRedirect" runat="server"></asp:Literal>
                                    </div>
                                </div>
                            </asp:Panel>
                        </ContentTemplate>
                    </asp:UpdatePanel>
                </asp:Panel>

                <asp:Panel ID="pnl_Customizations" ClientIDMode="Static" runat="server" CssClass="pnl-section" Style="display: none;">
                    <asp:UpdatePanel ID="UpdatePanel1" runat="server">
                        <ContentTemplate>
                            <asp:Panel ID="pnl_meteTagCustomizations" runat="server">
                                <div class="table-settings-box">
                                    <div class="td-settings-title">
                                        Site Description
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <asp:TextBox ID="tb_descriptionMetaTag" runat="server" CssClass="textEntry float-left"
                                            Width="95%" AutoPostBack="False" TextMode="MultiLine" MaxLength="4000"
                                            BorderColor="#D9D9D9" BorderStyle="Solid" BorderWidth="1px" Height="75px" Style="padding: 4px;"
                                            ForeColor="#353535"></asp:TextBox>
                                        <div class="clear-space"></div>
                                        <asp:Button ID="btn_descriptionMetaTag" runat="server" CssClass="RandomActionBtns input-buttons"
                                            Text="Update" OnClick="btn_descriptionMetaTag_Click" />
                                        <asp:LinkButton ID="lbtn_clearDescriptionMeta" runat="server" CssClass="RandomActionBtns"
                                            OnClick="lbtn_clearDescriptionMeta_Click">Clear</asp:LinkButton>
                                    </div>
                                    <div class="td-settings-desc">
                                        This will update the description meta tag on any page that doesn't have a description with it.
                                    </div>
                                </div>
                                <div class="table-settings-box">
                                    <div class="td-settings-title">
                                        Site Keywords
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <asp:Panel ID="pnl_keywordsMetaTag" runat="server" CssClass="keyword-split-array-holder">
                                        </asp:Panel>
                                        <div class="clear-space"></div>
                                        <asp:HiddenField ID="hf_keywordsMetaTag" runat="server" ClientIDMode="Static" OnValueChanged="hf_keywordsMetaTag_Changed" />
                                        <input id="btnKeywordsUpdate" type="button" class="input-buttons" value="Update" onclick="UpdateSiteKeywords();" />
                                        <asp:LinkButton ID="lbtn_clearAllKeywordsMeta" runat="server" CssClass="RandomActionBtns margin-right"
                                            OnClick="lbtn_clearAllKeywordsMeta_Click" ClientIDMode="Static">Clear</asp:LinkButton>
                                        <a href="#" id="aViewAsString" onclick="ViewAsString();return false;">View as String</a>
                                    </div>
                                    <div class="td-settings-desc">
                                        This will update the keywords meta tag on any page that doesn't have keywords with it.
                                    </div>
                                </div>
                                <div class="table-settings-box">
                                    <div class="td-settings-title">
                                        Default Site Font Family
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <asp:Panel ID="pnl_defaultbodyfontfamily" runat="server" DefaultButton="btn_defaultbodyfontfamily">
                                            <asp:DropDownList ID="dd_defaultbodyfontfamily" runat="server" CssClass="margin-right">
                                            </asp:DropDownList>
                                            <asp:Button ID="btn_defaultbodyfontfamily" runat="server" Text="Update" OnClick="btn_defaultbodyfontfamily_Click"
                                                CssClass="RandomActionBtns input-buttons margin-left" />
                                        </asp:Panel>
                                        <div class="clear-space"></div>
                                        <div id="span_fontfamilypreview"></div>
                                    </div>
                                    <div class="td-settings-desc">
                                        Set the default site font family. Some fonts may not work with certain browsers. Visit <a href="https://www.google.com/fonts" target="_blank">https://www.google.com/fonts</a> to get custom fonts. (Must refresh the page to see changes)
                                    </div>
                                </div>
                                <div class="table-settings-box">
                                    <div class="td-settings-title">
                                        Default Site Font Size
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <asp:Panel ID="pnl_defaultfontsize" runat="server" DefaultButton="btn_defaultfontsize">
                                            <asp:TextBox ID="tb_defaultfontsize" runat="server" CssClass="textEntry" Width="55px" TextMode="Number"></asp:TextBox><span class="pad-left-sml">px</span>
                                            <asp:Button ID="btn_defaultfontsize" runat="server" Text="Update" OnClick="btn_defaultfontsize_Click"
                                                CssClass="RandomActionBtns input-buttons margin-left" />
                                            <asp:LinkButton ID="lbtn_defaultfontsize_clear" runat="server" Text="Reset to default" OnClick="lbtn_defaultfontsize_clear_Click"
                                                CssClass="RandomActionBtns" />
                                        </asp:Panel>
                                    </div>
                                    <div class="td-settings-desc">
                                        Set the default site font size. Empty values will inherit the font-size from the site theme. (Must refresh the page to see changes)
                                    </div>
                                </div>
                                <div class="table-settings-box">
                                    <div class="td-settings-title">
                                        Default Site Font Color
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <asp:Panel ID="pnl_defaultfontcolor" runat="server" DefaultButton="btn_defaultfontcolor">
                                            <asp:TextBox ID="tb_defaultfontcolor" runat="server" CssClass="textEntry color" MaxLength="6" Width="75px"></asp:TextBox>
                                            <asp:Button ID="btn_defaultfontcolor" runat="server" Text="Update" OnClick="btn_defaultfontcolor_Click"
                                                CssClass="RandomActionBtns input-buttons margin-left" />
                                            <asp:LinkButton ID="lbtn_defaultfontcolor_clear" runat="server" Text="Reset to default" OnClick="lbtn_defaultfontcolor_clear_Click"
                                                CssClass="RandomActionBtns" />
                                        </asp:Panel>
                                    </div>
                                    <div class="td-settings-desc">
                                        Set the default site font color. (Must refresh the page to see changes)
                                    </div>
                                </div>
                                <div class="table-settings-box">
                                    <div class="td-settings-title">
                                        Site Map
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <asp:Button ID="btn_CreateSiteMap" runat="server" Text="Create Sitemap File" OnClick="btn_CreateSiteMap_Click"
                                            CssClass="RandomActionBtns input-buttons" />
                                        <asp:Panel ID="pnl_viewDeleteSiteMap" runat="server" Enabled="false" Visible="false">
                                            <div class="clear-space-five"></div>
                                            <asp:HyperLink ID="hyp_viewSiteMap" runat="server" CssClass="margin-right" Text="View" Target="_blank"></asp:HyperLink>
                                            <asp:LinkButton ID="lbtn_deleteSiteMap" runat="server" OnClick="lbtn_deleteSiteMap_Click" CssClass="RandomActionBtns" Text="Delete"></asp:LinkButton>
                                        </asp:Panel>
                                    </div>
                                    <div class="td-settings-desc">
                                        Creates the sitemap.xml used for search engines. Create this before creating your Robots file.<br />
                                        <span class="font-bold">Last Modified:</span>
                                        <asp:Label ID="lbl_siteMapModified" runat="server" Text="" CssClass="pad-left-sml"></asp:Label>
                                    </div>
                                </div>
                                <div class="table-settings-box">
                                    <div class="td-settings-title">
                                        Robots File
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <asp:Button ID="btn_CreateRobotsFile" runat="server" Text="Create Robots File" OnClick="btn_CreateRobotsFile_Click"
                                            CssClass="RandomActionBtns input-buttons" />
                                        <asp:Panel ID="pnl_viewDeleteRobotTxt" runat="server" Enabled="false" Visible="false">
                                            <div class="clear-space-five"></div>
                                            <asp:HyperLink ID="hyp_viewRobotsTxt" runat="server" CssClass="margin-right" Text="View" Target="_blank"></asp:HyperLink>
                                            <asp:LinkButton ID="lbtn_deleteRobotsTxt" runat="server" OnClick="lbtn_deleteRobotsTxt_Click" CssClass="RandomActionBtns" Text="Delete"></asp:LinkButton>
                                        </asp:Panel>
                                    </div>
                                    <div class="td-settings-desc">
                                        Creates the robots.txt used for search engines.<br />
                                        <span class="font-bold">Last Modified:</span>
                                        <asp:Label ID="lbl_robotsLastModified" runat="server" Text="" CssClass="pad-left-sml"></asp:Label>
                                    </div>
                                </div>
                            </asp:Panel>
                            <asp:Panel ID="pnl_ImageCustomizations" runat="server" Enabled="false" Visible="false">
                                <div class="table-settings-box">
                                    <div class="td-settings-title">
                                        Main Site Logo
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <div class="pad-all-sml inline-block margin-right-big">
                                            <asp:Label ID="lbl_workspaceLogo" runat="server"></asp:Label>
                                            <asp:Image ID="img_workspaceLogo" runat="server" Width="175px" />
                                        </div>
                                        <div class="clear-space">
                                        </div>
                                        <asp:Panel ID="pnl_MainSiteLogoUpload" runat="server" Enabled="false" Visible="false">
                                            <asp:FileUpload ID="FileUpload2" runat="server" />
                                            <div class="clear-space">
                                            </div>
                                            <asp:Button ID="btn_uploadlogo" runat="server" CssClass="input-buttons" Text="Update"
                                                OnClick="btn_uploadlogo_Click" disabled="disabled" />
                                            <div class="clear">
                                            </div>
                                            <div id="fu_error_message" style="color: Red">
                                            </div>
                                        </asp:Panel>
                                    </div>
                                    <div class="td-settings-desc">
                                        <asp:Panel ID="pnl_MainSiteLogoDesc" runat="server" Enabled="false" Visible="false">
                                            Upload a new logo to display on the workspace. This logo will be centered
                                                    on the page. Uploading new logo will overwrite previous logo. (.png, .jpg, .jpeg, .gif ONLY)
                                        </asp:Panel>
                                    </div>
                                </div>
                                <div class="table-settings-box">
                                    <div class="td-settings-title">
                                        Fav Icon
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <div class="pad-all-sml inline-block margin-right-big">
                                            <asp:Image ID="img_Favicon" runat="server" Style="max-height: 65px" />
                                        </div>
                                        <div class="clear-space">
                                        </div>
                                        <asp:FileUpload ID="FileUpload4" runat="server" />
                                        <div class="clear-space">
                                        </div>
                                        <asp:Button ID="btn_uploadlogo_fav" runat="server" CssClass="input-buttons" Text="Update"
                                            OnClick="btn_uploadlogo_fav_Click" disabled="disabled" />
                                        <div class="clear">
                                        </div>
                                        <div id="fu_error_message_2" style="color: Red">
                                        </div>
                                    </div>
                                    <div class="td-settings-desc">
                                        Upload a new logo to display on the browser tab. Uploading new logo will overwrite previous favicon. (.png, .jpg, .jpeg, .gif, .ico
                                                    ONLY)
                                    </div>
                                </div>
                                <div class="table-settings-box">
                                    <div class="td-settings-title">
                                        Main Logo Transparency
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <div class="float-left pad-right pad-top-sml">
                                            <div id="Slider1" class="ajax__slider_h_rail">
                                            </div>
                                        </div>
                                        <asp:Button ID="btn_updateLogoOpacity" runat="server" CssClass="RandomActionBtns margin-left input-buttons"
                                            Text="Update" OnClick="btn_updateLogoOpacity_Click" />
                                        <div>
                                            <b class="pad-right">Current value:</b><span id="currentLogoOpacity"></span>
                                        </div>
                                        <asp:HiddenField ID="hf_opacity" runat="server" ClientIDMode="Static" />
                                    </div>
                                    <div class="td-settings-desc">
                                        Change the opacity/transparency of the main logo on the workspace.
                                    </div>
                                </div>
                                <div class="table-settings-box">
                                    <div class="td-settings-title">
                                        Add a background to the logo
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <div class="field switch inline-block">
                                            <asp:RadioButton ID="rb_AddBackgroundToLogo_on" runat="server" Text="Yes" CssClass="RandomActionBtns cb-enable"
                                                OnCheckedChanged="rb_AddBackgroundToLogo_on_Checked" AutoPostBack="true" />
                                            <asp:RadioButton ID="rb_AddBackgroundToLogo_off" runat="server" Text="No" CssClass="RandomActionBtns cb-disable"
                                                OnCheckedChanged="rb_AddBackgroundToLogo_off_Checked" AutoPostBack="true" />
                                        </div>
                                    </div>
                                    <div class="td-settings-desc">
                                        Add a transparent background color to the logo.
                                    </div>
                                </div>
                                <asp:Panel ID="pnl_logobackgroundColor" runat="server">
                                    <div class="table-settings-box">
                                        <div class="td-settings-title">
                                            Logo Background Color
                                        </div>
                                        <div class="title-line"></div>
                                        <div class="td-settings-ctrl">
                                            <asp:TextBox ID="tb_logoBgColor" runat="server" CssClass="textEntry float-left color" AutoPostBack="False" MaxLength="6" Width="75px"></asp:TextBox>
                                            <div class="clear-space"></div>
                                            <asp:Button ID="btn_logoBgColor" runat="server" CssClass="RandomActionBtns input-buttons"
                                                Text="Update" OnClick="btn_logoBgColor_Click" />
                                        </div>
                                        <div class="td-settings-desc">
                                            Add a color to your logo's background.
                                        </div>
                                    </div>
                                </asp:Panel>
                                <div class="table-settings-box">
                                    <div class="td-settings-title">
                                        Sidebar Category Icons
                                    </div>
                                    <div class="title-line"></div>
                                    <div class="td-settings-ctrl">
                                        <asp:Panel ID="pnl_SidebarCategoryIcons" runat="server" CssClass="margin-top">
                                        </asp:Panel>
                                        <asp:HiddenField ID="hf_SidebarCategoryIcons" runat="server" ClientIDMode="Static" OnValueChanged="hf_SidebarCategoryIcons_ValueChanged" />
                                    </div>
                                    <div class="td-settings-desc">
                                        Set the icons for each category.
                                    </div>
                                </div>
                            </asp:Panel>
                            <div class="table-settings-box">
                                <div class="td-settings-title">
                                    Public Background Photos
                                </div>
                                <div class="title-line"></div>
                                <div class="td-settings-ctrl">
                                    <asp:FileUpload ID="FileUpload5" runat="server" Width="252px" />
                                    <asp:Button ID="btn_uploadbgImage" runat="server" CssClass="input-buttons margin-left"
                                        Text="Upload" OnClick="btn_uploadbgImage_Click" disabled="disabled" />
                                    <div class="clear">
                                    </div>
                                    <div id="fu_error_message_3" style="color: Red">
                                    </div>
                                    <div class="clear-space">
                                    </div>
                                    <asp:DropDownList ID="dd_bgmanage" runat="server" AutoPostBack="true" CssClass="margin-right-big"
                                        OnSelectedIndexChanged="dd_bgmanage_change">
                                    </asp:DropDownList>
                                    <asp:LinkButton ID="lbtn_bgmanage" runat="server" CssClass="margin-right" Enabled="false"
                                        Visible="false" OnClick="lbtn_bgmanage_click">Delete</asp:LinkButton>
                                    <asp:LinkButton ID="lbtn_bgmanage_SetasDefault" runat="server" CssClass="RandomActionBtns" Enabled="false"
                                        Visible="false" OnClick="lbtn_bgmanage_SetasDefault_click">Set as Default</asp:LinkButton>
                                    <div class="clear">
                                    </div>
                                    <asp:Image ID="img_previewbg" runat="server" CssClass="margin-right margin-top boxshadow-dark rounded-corners-2" Enabled="false" Visible="false" Style="max-height: 200px;" />
                                </div>
                                <div class="td-settings-desc">
                                    Upload new photos to the background list on the workspace. (.png, .jpg, .jpeg, .gif ONLY)<br />
                                    Setting an image as the default will only set it for the users current theme.
                                </div>
                            </div>
                        </ContentTemplate>
                        <Triggers>
                            <asp:AsyncPostBackTrigger ControlID="lbtn_defaultfontsize_clear" />
                            <asp:AsyncPostBackTrigger ControlID="lbtn_defaultfontcolor_clear" />
                        </Triggers>
                    </asp:UpdatePanel>
                </asp:Panel>

            </div>
            <div id="CustomizationIFrame" style="display: none; margin-left: -60px; margin-right: -40px; margin-top: 4px;">
            </div>
        </div>
        <div class="clear-space">
        </div>
        <script type="text/javascript" src='<%=ResolveUrl("~/WebControls/jscolor/jscolor.js")%>'></script>
    </div>
</asp:Content>
