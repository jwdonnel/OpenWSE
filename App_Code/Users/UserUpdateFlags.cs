﻿#region

using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web.Configuration;
using System.Web.Security;
using System.Web;
using System.Data.SqlServerCe;
using System.Collections.Generic;

#endregion

namespace OpenWSE_Tools.AutoUpdates {

    /// <summary>
    ///     Summary description for UserUpdateFlags
    /// </summary>
    public class UserUpdateFlags {
        private readonly DatabaseCall dbCall = new DatabaseCall();

        public UserUpdateFlags() { }

        /// <summary>
        /// Updates all users with the given app and groupname
        /// </summary>
        /// <param name="appID">The app to update. Use "workspace" to update everything.</param>
        /// <param name="groupname">The groupname. Leave blank if none.</param>
        /// <param name="updateForCurrUser">Update the current user</param>
        public void addFlag(string appID, string groupname, bool updateForCurrUser = true) {
            if (string.IsNullOrEmpty(appID))
                appID = "workspace";

            string currUser = HttpContext.Current.User.Identity.Name.ToLower();

            MembershipUserCollection coll = Membership.GetAllUsers();
            foreach (MembershipUser u in coll) {
                if ((!updateForCurrUser) && (u.UserName.ToLower() == currUser))
                    continue;

                if (u.IsOnline) {
                    List<string> userSessionIds = MemberDatabase.GetUserSessionIds(u.UserName);
                    foreach (string session in userSessionIds) {
                        string check = getFlag_SessionID(u.UserName, appID, session);

                        if ((appID != "workspace") && (u.UserName.ToLower() == ServerSettings.AdminUserName.ToLower()) && (!appID.Contains("app-")))
                            check = "";
                        else if ((u.UserName.ToLower() == ServerSettings.AdminUserName.ToLower()) && (appID.Contains("app-")))
                            check = "-";

                        if (check == "") {
                            List<DatabaseQuery> query = new List<DatabaseQuery>();
                            query.Add(new DatabaseQuery("ApplicationId", ServerSettings.ApplicationID));
                            query.Add(new DatabaseQuery("ID", Guid.NewGuid().ToString()));
                            query.Add(new DatabaseQuery("SessionID", session));
                            query.Add(new DatabaseQuery("UserName", u.UserName.ToLower()));
                            query.Add(new DatabaseQuery("AppID", appID));
                            query.Add(new DatabaseQuery("GroupName", groupname));
                            query.Add(new DatabaseQuery("Date", ServerSettings.ServerDateTime.ToString()));

                            dbCall.CallInsert("UserUpdateFlags", query);
                        }
                    }
                }
            }
        }

        /// <summary>
        /// Adds a flag to the given user to update their current state
        /// </summary>
        /// <param name="username"></param>
        /// <param name="appID">The app to update. Use "workspace" to update everything.</param>
        /// <param name="groupname">The groupname. Leave blank if none.</param>
        public void addFlag(string username, string appID, string groupname) {
            try {
                MembershipUser m = Membership.GetUser(username);
                if (m.IsOnline) {
                    List<string> userSessionIds = MemberDatabase.GetUserSessionIds(username);
                    foreach (string session in userSessionIds) {
                        string check = getFlag_SessionID(m.UserName, appID, session);

                        if ((appID != "workspace") && (username.ToLower() == ServerSettings.AdminUserName.ToLower())) {
                            check = "";
                        }

                        if (check == "") {
                            if (string.IsNullOrEmpty(appID)) {
                                appID = "workspace";
                            }
                            List<DatabaseQuery> query = new List<DatabaseQuery>();
                            query.Add(new DatabaseQuery("ApplicationId", ServerSettings.ApplicationID));
                            query.Add(new DatabaseQuery("ID", Guid.NewGuid().ToString()));
                            query.Add(new DatabaseQuery("SessionID", session));
                            query.Add(new DatabaseQuery("UserName", username.ToLower()));
                            query.Add(new DatabaseQuery("AppID", appID));
                            query.Add(new DatabaseQuery("GroupName", groupname));
                            query.Add(new DatabaseQuery("Date", ServerSettings.ServerDateTime.ToString()));

                            dbCall.CallInsert("UserUpdateFlags", query);
                        }
                    }
                }
            }
            catch {
            }
        }

        /// <summary>
        /// Gets the update flag for the given user for the workspace
        /// </summary>
        /// <param name="username">Any given user in the database</param>
        /// <returns></returns>
        public string getFlag(string username) {
            List<DatabaseQuery> query = new List<DatabaseQuery>();
            query.Add(new DatabaseQuery("ApplicationId", ServerSettings.ApplicationID));

            string sessionId = MemberDatabase.GetUserSessionId(username);
            if (!string.IsNullOrEmpty(sessionId)) {
                query.Add(new DatabaseQuery("SessionID", sessionId));
            }

            query.Add(new DatabaseQuery("UserName", username.ToLower()));
            query.Add(new DatabaseQuery("AppID", "workspace"));

            DatabaseQuery dbSelect = dbCall.CallSelectSingle("UserUpdateFlags", "ID", query);
            if (!string.IsNullOrEmpty(dbSelect.Value.Trim())) {
                return dbSelect.Value.Trim();
            }

            return "";
        }

        /// <summary>
        /// Gets the update flag for the given user for a app
        /// </summary>
        /// <param name="username">Any given user in the database</param>
        /// <param name="appID">The app to update. Use "workspace" to update everything.</param>
        /// <returns></returns>
        public string getFlag(string username, string appID) {
            if (!string.IsNullOrEmpty(appID)) {
                List<DatabaseQuery> query = new List<DatabaseQuery>();
                query.Add(new DatabaseQuery("ApplicationId", ServerSettings.ApplicationID));

                string sessionId = MemberDatabase.GetUserSessionId(username);
                if (!string.IsNullOrEmpty(sessionId)) {
                    query.Add(new DatabaseQuery("SessionID", sessionId));
                }

                query.Add(new DatabaseQuery("UserName", username.ToLower()));
                query.Add(new DatabaseQuery("AppID", appID));

                DatabaseQuery dbSelect = dbCall.CallSelectSingle("UserUpdateFlags", "ID", query);
                if (!string.IsNullOrEmpty(dbSelect.Value.Trim())) {
                    return dbSelect.Value.Trim();
                }
            }

            return "";
        }

        /// <summary>
        /// Gets the update flag for the given user on a given workspace for a given group
        /// </summary>
        /// <param name="username">Any given user in the database</param>
        /// <param name="appID">The app to update. Use "workspace" to update everything.</param>
        /// <param name="groupname">The groupname. Leave blank if none.</param>
        /// <returns></returns>
        public string getFlag(string username, string appID, string groupname) {
            List<DatabaseQuery> query = new List<DatabaseQuery>();
            query.Add(new DatabaseQuery("ApplicationId", ServerSettings.ApplicationID));

            string sessionId = MemberDatabase.GetUserSessionId(username);
            if (!string.IsNullOrEmpty(sessionId)) {
                query.Add(new DatabaseQuery("SessionID", sessionId));
            }

            query.Add(new DatabaseQuery("UserName", username.ToLower()));
            query.Add(new DatabaseQuery("AppID", appID));
            query.Add(new DatabaseQuery("GroupName", groupname));

            DatabaseQuery dbSelect = dbCall.CallSelectSingle("UserUpdateFlags", "ID", query);
            if (!string.IsNullOrEmpty(dbSelect.Value.Trim())) {
                return dbSelect.Value.Trim();
            }

            return "";
        }

        /// <summary>
        /// Gets the update flag for the given user for a app from the given SessionID
        /// </summary>
        /// <param name="username">Any given user in the database</param>
        /// <param name="appID">The app to update. Use "workspace" to update everything.</param>
        /// <returns></returns>
        public string getFlag_SessionID(string username, string appID, string sessionId) {
            if (!string.IsNullOrEmpty(appID)) {
                List<DatabaseQuery> query = new List<DatabaseQuery>();
                query.Add(new DatabaseQuery("ApplicationId", ServerSettings.ApplicationID));
                query.Add(new DatabaseQuery("SessionID", sessionId));
                query.Add(new DatabaseQuery("UserName", username.ToLower()));
                query.Add(new DatabaseQuery("AppID", appID));

                DatabaseQuery dbSelect = dbCall.CallSelectSingle("UserUpdateFlags", "ID", query);
                if (!string.IsNullOrEmpty(dbSelect.Value.Trim())) {
                    return dbSelect.Value.Trim();
                }
            }

            return "";
        }

        /// <summary>
        /// Gets the update flag for the given user for a app without using the SessionID
        /// </summary>
        /// <param name="username">Any given user in the database</param>
        /// <param name="appID">The app to update. Use "workspace" to update everything.</param>
        /// <returns></returns>
        public string getFlag_NoSessionID(string username, string appID) {
            if (!string.IsNullOrEmpty(appID)) {
                List<DatabaseQuery> query = new List<DatabaseQuery>();
                query.Add(new DatabaseQuery("ApplicationId", ServerSettings.ApplicationID));
                query.Add(new DatabaseQuery("UserName", username.ToLower()));
                query.Add(new DatabaseQuery("AppID", appID));

                DatabaseQuery dbSelect = dbCall.CallSelectSingle("UserUpdateFlags", "ID", query);
                if (!string.IsNullOrEmpty(dbSelect.Value.Trim())) {
                    return dbSelect.Value.Trim();
                }
            }

            return "";
        }

        public string getFlag_AppID(string id) {
            if ((id != "refresh") && (id != "undefined") && (id != "Request format is invalid: .\r\n")) {
                List<DatabaseQuery> query = new List<DatabaseQuery>();
                query.Add(new DatabaseQuery("ApplicationId", ServerSettings.ApplicationID));
                query.Add(new DatabaseQuery("ID", id));

                DatabaseQuery dbSelect = dbCall.CallSelectSingle("UserUpdateFlags", "AppID", query);
                if (!string.IsNullOrEmpty(dbSelect.Value.Trim())) {
                    return dbSelect.Value.Trim();
                }
            }
            return "";
        }

        public void deleteFlag(string id) {
            dbCall.CallDelete("UserUpdateFlags", new List<DatabaseQuery>() { new DatabaseQuery("ID", id), new DatabaseQuery("ApplicationId", ServerSettings.ApplicationID) });
        }

        public void deleteFlag_User_And_SessionId(string sessionId, string username) {
            dbCall.CallDelete("UserUpdateFlags", new List<DatabaseQuery>() { new DatabaseQuery("SessionID", sessionId), new DatabaseQuery("UserName", username.ToLower()), new DatabaseQuery("ApplicationId", ServerSettings.ApplicationID) });
        }

        public void deleteAllFlags() {
            List<DatabaseQuery> query = new List<DatabaseQuery>();
            query.Add(new DatabaseQuery("ApplicationId", ServerSettings.ApplicationID));

            dbCall.CallDelete("UserUpdateFlags", query);
        }
    }

}