﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Security.Principal;
using System.Text;
using System.Data;
using System.Globalization;
using OpenWSE_Tools.GroupOrganizer;
using OpenWSE_Tools.Overlays;

public partial class Overlays_Groups_Overlay : System.Web.UI.UserControl {
    private ServerSettings _ss = new ServerSettings();
    private OverlayInitializer _overlayInit;
    private MemberDatabase _member;
    private Groups _groups = new Groups();

    protected void Page_Load(object sender, EventArgs e) {
        IIdentity userId = HttpContext.Current.User.Identity;

        _overlayInit = new OverlayInitializer(userId.Name, "Overlays/Groups/Groups_Overlay.ascx");
        if (_overlayInit.TryLoadOverlay) {
            _member = new MemberDatabase(userId.Name);
            LoadUserGroups();
        }
        else if ((!userId.IsAuthenticated) && (_ss.NoLoginRequired)) {
            LoadUserGroups_NoLogin();
        }
    }

    private void LoadUserGroups() {
        groups_pnl_entries.Controls.Clear();
        var str = new StringBuilder();
        int count = 0;
        List<string> tempGroups = _member.GroupList;
        foreach (var group in tempGroups) {
            _groups.getEntries(group);
            if (_groups.group_dt.Count > 0) {
                Dictionary<string, string> dr = _groups.group_dt[0];
                str.Append("<div class='groups-workspace-entry'>");
                string imgsrc;
                if (HelperMethods.ConvertBitToBoolean(dr["IsURL"])) {
                    imgsrc = dr["Image"];
                    if (imgsrc.StartsWith("~/")) {
                        imgsrc = ResolveUrl(imgsrc);
                    }
                }
                else {
                    imgsrc = ResolveUrl("~/Standard_Images/Groups/Logo/") + dr["Image"];
                }
                str.Append("<img alt='groupimg' src='" + imgsrc + "' />");
                str.Append("<span>" + dr["GroupName"] + "</span>");
                str.Append("<div class='clear'></div></div>");
                count++;
            }
            else {
                string x = tempGroups.Where(group2 => group2 != @group).Aggregate("", (current, group2) => current + (group2 + ServerSettings.StringDelimiter));
                _member.UpdateGroupName(x);
            }
        }
        groups_pnl_entries.Controls.Add(new LiteralControl(str.ToString() + "<div class='clear'></div>"));
    }

    private void LoadUserGroups_NoLogin() {
        groups_pnl_entries.Controls.Clear();
        var str = new StringBuilder();
        string imgsrc = ResolveUrl("~/Overlays/Groups/DemoGroup.png");

        str.Append("<div class='groups-workspace-entry'>");
        str.Append("<img alt='groupimg' src='" + imgsrc + "' />");
        str.Append("<span>" + ServerSettings.SiteName + " Guest</span>");
        str.Append("<div class='clear'></div></div>");
        groups_pnl_entries.Controls.Add(new LiteralControl(str.ToString() + "<div class='clear'></div>"));
    }
}
