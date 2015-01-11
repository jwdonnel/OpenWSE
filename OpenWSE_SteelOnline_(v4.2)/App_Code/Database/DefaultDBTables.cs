﻿using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Web;
using System.Xml;

/// <summary>
/// Summary description for CreateDefaultDBTables
/// </summary>
public class DefaultDBTables {

    #region Public Static Variables

    public static bool DefaultTableXmlMissing = false;
    public static bool DatabaseUpToDate = true;
    public static int TotalNumberOfColumns = 0;
    public static int TotalNumberOfRows = 0;
    private static int timeOutDelay = 100;

    #endregion

    public DefaultDBTables() { }


    #region Build Defaults

    public static void BuildDefaults() {
        string defaultsXml = ServerSettings.GetServerMapLocation + "App_Data\\DatabaseDefaults.xml";
        if (File.Exists(defaultsXml)) {
            DatabaseCall dbCall = new DatabaseCall();
            dbCall.NeedToLogErrors = false;

            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.Load(defaultsXml);

            if (xmlDoc != null) {
                BuildTable(xmlDoc.DocumentElement.ChildNodes, dbCall);
            }
        }
    }
    private static void BuildTable(XmlNodeList tables, DatabaseCall dbCall) {
        foreach (XmlNode table in tables) {
            try {
                if (table.Attributes["for"] != null && table.Attributes["for"].Value != dbCall.DataProvider) {
                    continue;
                }

                string tableName = table.Attributes["name"].Value;
                string primaryKey = string.Empty;
                if (table.Attributes["primaryKey"] != null) {
                    primaryKey = table.Attributes["primaryKey"].Value;
                }

                XmlNodeList columns = table.SelectNodes("/Tables/Table[@name='" + tableName + "']/Columns/Column");

                DataTable dbTable = dbCall.CallGetDataTable(tableName);
                if (dbTable == null || (dbTable.Columns.Count == 0 && string.IsNullOrEmpty(dbTable.TableName))) {
                    string columnList = CreateColumnList(columns, primaryKey, dbCall);
                    dbCall.CallCreateTable(tableName, columnList);
                }
                else if (dbTable.Columns.Count != columns.Count) {
                    string alterCols = AlterAddColumns(dbTable.Columns, columns, dbCall);
                    if (!string.IsNullOrEmpty(alterCols)) {
                        dbCall.CallAlterTable(tableName, alterCols);
                    }
                }
            }
            catch { }
        }
    }

    public static void CopyCorrectDatabase() {
        string filePath = ServerSettings.GetServerMapLocation + "App_Data\\DefaultDatabases\\";
        string dbPath = string.Empty;

        DatabaseCall tempDbCall = new DatabaseCall();
        if (CheckIfDatabaseIsLocal(tempDbCall, out dbPath)) {
            if (!File.Exists(dbPath)) {
                FileInfo fi = new FileInfo(dbPath);
                string dbName = fi.Name.ToUpper();
                if (tempDbCall.DataProvider == "System.Data.SqlClient") {
                    string logFile = fi.Name.Replace(fi.Extension, "") + "_log.LDF";
                    File.Copy(filePath + "SQLExpress\\SQLExpress.defaults", ServerSettings.GetServerMapLocation + "App_Data\\" + dbName);
                    File.Copy(filePath + "SQLExpress\\SQLExpress_log.defaults", ServerSettings.GetServerMapLocation + "App_Data\\" + logFile);
                }
                else if (tempDbCall.DataProvider == "System.Data.SqlServerCe.4.0") {
                    File.Copy(filePath + "SQLCe\\SQLCe.defaults", ServerSettings.GetServerMapLocation + "App_Data\\" + dbName);
                }
            }
        }
    }
    public static bool CheckIfDatabaseIsLocal(DatabaseCall dbCall, out string dbPath) {
        dbPath = string.Empty;
        if (dbCall.ConnectionString != null) {
            string[] dataSource = dbCall.ConnectionString.Split(';');
            foreach (string item in dataSource) {
                if (item.ToLower().Contains("|datadirectory|")) {
                    string tempPath = item.Replace("|DataDirectory|", AppDomain.CurrentDomain.GetData("DataDirectory").ToString());
                    dbPath = tempPath.Substring(tempPath.IndexOf("=") + 1);
                    return true;
                }
            }
        }

        return false;
    }

    #endregion

    #region Check Defaults

    public static void CheckIfDatabaseUpToDate() {
        DefaultTableXmlMissing = false;
        DatabaseUpToDate = true;
        TotalNumberOfColumns = 0;
        TotalNumberOfRows = 0;

        string defaultsXml = ServerSettings.GetServerMapLocation + "App_Data\\DatabaseDefaults.xml";
        if (File.Exists(defaultsXml)) {
            DatabaseCall dbCall = new DatabaseCall();
            dbCall.NeedToLogErrors = false;

            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.Load(defaultsXml);

            if (xmlDoc != null) {
                CompareTablesWithXml(xmlDoc.DocumentElement.ChildNodes, dbCall);
                CountTotalTableRowsColumns(dbCall);
            }
        }
        else {
            DefaultTableXmlMissing = true;
        }
    }
    private static void CompareTablesWithXml(XmlNodeList tables, DatabaseCall dbCall) {
        foreach (XmlNode table in tables) {
            try {
                if (table.Attributes["for"] != null && table.Attributes["for"].Value != dbCall.DataProvider) {
                    continue;
                }

                string tableName = table.Attributes["name"].Value;
                string primaryKey = string.Empty;
                if (table.Attributes["primaryKey"] != null) {
                    primaryKey = table.Attributes["primaryKey"].Value;
                }

                XmlNodeList columns = table.SelectNodes("/Tables/Table[@name='" + tableName + "']/Columns/Column");
                DataTable dbTable = dbCall.CallGetDataTable(tableName);

                if (dbTable == null || (dbTable.Columns.Count == 0 && string.IsNullOrEmpty(dbTable.TableName))) {
                    DatabaseUpToDate = false;
                }
                else {
                    CheckTableColumns(dbTable, columns, tableName, dbCall);
                }
            }
            catch { }
        }
    }
    private static void CheckTableColumns(DataTable dbTable, XmlNodeList columns, string tableName, DatabaseCall dbCall) {
        foreach (XmlNode xColumn in columns) {
            bool foundColumn = false;

            string[] attrs = GetColumnAttr(xColumn, dbCall);
            string columnName = attrs[0];
            string dataType_WithLength = attrs[1];
            bool nullable = attrs[2] != " NOT NULL";
            string dataType = attrs[3];
            string length = attrs[4];

            foreach (DataColumn dColumn in dbTable.Columns) {
                if (DoesColumnExist(dColumn, columnName, length, dataType, nullable)) {
                    foundColumn = true;
                    break;
                }
            }

            if (!foundColumn) {
                DatabaseUpToDate = false;
                break;
            }
        }

        foreach (DataColumn dColumn in dbTable.Columns) {
            List<string> columnList = new List<string>();

            foreach (XmlNode xColumn in columns) {
                string[] attrs = GetColumnAttr(xColumn, dbCall);
                string columnName = attrs[0];

                columnList.Add(columnName);
            }

            if (!columnList.Contains(dColumn.ColumnName)) {
                DatabaseUpToDate = false;
                break;
            }
        }
    }
    private static void CountTotalTableRowsColumns(DatabaseCall dbCall) {
        DataTable dbTables = dbCall.CallGetSchema("Tables");
        foreach (DataRow dRow in dbTables.Rows) {
            try {
                DataTable dbTable = dbCall.CallGetDataTable(dRow["Table_Name"].ToString());
                if (dbTable != null && dbTable.Columns.Count > 0) {
                    TotalNumberOfColumns += dbTable.Columns.Count;
                    TotalNumberOfRows += dbTable.Rows.Count;
                }
            }
            catch { }
        }
    }

    #endregion

    #region Update Defaults

    public static void UpdateDefaults() {
        string defaultsXml = ServerSettings.GetServerMapLocation + "App_Data\\DatabaseDefaults.xml";
        if (File.Exists(defaultsXml)) {
            DatabaseCall dbCall = new DatabaseCall();
            dbCall.NeedToLogErrors = false;

            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.Load(defaultsXml);

            if (xmlDoc != null) {
                UpdateTables(xmlDoc.DocumentElement.ChildNodes, dbCall);
            }
        }
    }
    private static void UpdateTables(XmlNodeList tables, DatabaseCall dbCall) {
        foreach (XmlNode table in tables) {
            try {
                if (table.Attributes["for"] != null && table.Attributes["for"].Value != dbCall.DataProvider) {
                    continue;
                }

                string tableName = table.Attributes["name"].Value;
                string primaryKey = string.Empty;
                if (table.Attributes["primaryKey"] != null) {
                    primaryKey = table.Attributes["primaryKey"].Value;
                }

                XmlNodeList columns = table.SelectNodes("/Tables/Table[@name='" + tableName + "']/Columns/Column");
                DataTable dbTable = dbCall.CallGetDataTable(tableName);

                if (dbTable == null || (dbTable.Columns.Count == 0 && string.IsNullOrEmpty(dbTable.TableName))) {
                    string columnList = CreateColumnList(columns, primaryKey, dbCall);
                    dbCall.CallCreateTable(tableName, columnList);
                }
                else {
                    UpdateTableColumns(dbTable, columns, dbCall, tableName);
                }
            }
            catch { }
        }
    }
    private static void UpdateTableColumns(DataTable dbTable, XmlNodeList columns, DatabaseCall dbCall, string tableName) {
        // Add Table Colomn if Needed
        foreach (XmlNode xColumn in columns) {
            bool foundColumn = false;

            string[] attrs = GetColumnAttr(xColumn, dbCall);
            string columnName = attrs[0];
            string dataType_WithLength = attrs[1];
            bool nullable = attrs[2] != " NOT NULL";
            string dataType = attrs[3];
            string length = attrs[4];

            foreach (DataColumn dColumn in dbTable.Columns) {
                if (DoesColumnExist(dColumn, columnName, length, dataType, nullable)) {
                    foundColumn = true;
                    break;
                }
            }

            if (!foundColumn) {
                DataColumn _dColumn = GetDataColumn(dbTable.Columns, columnName);

                if (!ColumnCheck(_dColumn, columnName)) {
                    dbCall.CallAlterTable(tableName, string.Format("ADD {0} {1} NULL", columnName, dataType_WithLength));
                    if (!nullable) {
                        dbCall.CallUpdate(string.Format("UPDATE {0} SET {1}=0 WHERE {1} IS NULL", tableName, columnName));
                        dbCall.CallAlterTable(tableName, string.Format("ALTER COLUMN {0} {1} NOT NULL", columnName, dataType_WithLength));
                    }
                }
                else {
                    if (nullable) {
                        dbCall.CallAlterTable(tableName, string.Format("ALTER COLUMN {0} {1} NULL", columnName, dataType_WithLength));
                    }
                    else {
                        dbCall.CallUpdate(string.Format("UPDATE {0} SET {1}=0 WHERE {1} IS NULL", tableName, columnName));
                        dbCall.CallAlterTable(tableName, string.Format("ALTER COLUMN {0} {1} NOT NULL", columnName, dataType_WithLength));
                    }
                }

                Thread.Sleep(timeOutDelay);
            }
        }

        #region Drop Column

        // Drop Table Column if Needed
        foreach (DataColumn dColumn in dbTable.Columns) {
            List<string> columnList = new List<string>();

            foreach (XmlNode xColumn in columns) {
                string[] attrs = GetColumnAttr(xColumn, dbCall);
                string columnName = attrs[0];

                columnList.Add(columnName);
            }

            if (!columnList.Contains(dColumn.ColumnName)) {
                dbCall.CallAlterTable(tableName, string.Format("DROP COLUMN {0}", dColumn.ColumnName));
            }
        }

        #endregion
    }
    private static DataColumn GetDataColumn(DataColumnCollection coll, string columnName) {
        DataColumn _dColumn = new DataColumn();
        foreach (DataColumn dColumn in coll) {
            if (ColumnCheck(dColumn, columnName)) {
                _dColumn = dColumn;
                break;
            }
        }

        return _dColumn;
    }

    #endregion

    #region Updatable Tables

    public static List<string> UpdatableTables(List<Dictionary<string, DataTable>> tableList) {
        List<string> tablesUpdate = new List<string>();
        DatabaseCall dbCall = new DatabaseCall();
        dbCall.NeedToLogErrors = false;
        tablesUpdate = CompareTablesWithXml_Updatable(tableList, dbCall);
        return tablesUpdate;
    }
    private static List<string> CompareTablesWithXml_Updatable(List<Dictionary<string, DataTable>> tables, DatabaseCall dbCall) {
        List<string> tablesAllowed = new List<string>();

        for (int i = 0; i < tables.Count; i++) {
            foreach (string tableName in tables[i].Keys) {
                try {
                    if (!string.IsNullOrEmpty(tableName)) {
                        DataTable dbTable = dbCall.CallGetDataTable(tableName);

                        if (dbTable != null && dbTable.Columns.Count > 0) {
                            if (CompareDataColumns(dbTable.Columns, tables[i][tableName].Columns)) {
                                tablesAllowed.Add(tableName);
                            }
                        }
                    }
                }
                catch { }
            }
        }

        return tablesAllowed;
    }
    private static bool CompareDataColumns(DataColumnCollection dColumns1, DataColumnCollection dColumns2) {
        if (dColumns1.Count == dColumns2.Count) {
            return true;
        }

        return false;
    }

    #endregion

    #region Get Table In Defaults

    public static List<string> GetDatabaseTableDefault(string tableName, DatabaseCall dbCall) {
        List<string> columnList = new List<string>();
        string defaultsXml = ServerSettings.GetServerMapLocation + "App_Data\\DatabaseDefaults.xml";
        if (File.Exists(defaultsXml)) {

            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.Load(defaultsXml);

            if (xmlDoc != null) {
                XmlNodeList columns = xmlDoc.DocumentElement.SelectNodes("/Tables/Table[@name='" + tableName + "']/Columns/Column");
                foreach (XmlNode columnNode in columns) {
                    string[] attrs = GetColumnAttr(columnNode, dbCall);
                    if (!columnList.Contains(attrs[0])) {
                        columnList.Add(attrs[0]);
                    }
                }
            }
        }

        return columnList;
    }

    #endregion


    /// <summary>
    /// Creates the command text to add a new column to a table. (ADD ONLY)
    /// </summary>
    /// <param name="currColumns"></param>
    /// <param name="newColumns"></param>
    /// <returns></returns>
    private static string AlterAddColumns(DataColumnCollection currColumns, XmlNodeList newColumns, DatabaseCall dbCall) {
        StringBuilder commandText = new StringBuilder();
        int count = 0;
        foreach (XmlNode column in newColumns) {

            string[] attrs = GetColumnAttr(column, dbCall);
            string columnName = attrs[0];
            string dataType = attrs[1];

            if (!currColumns.Contains(columnName)) {
                count++;
                commandText.AppendFormat("{0},", columnName + " " + dataType);
            }
        }

        if (!string.IsNullOrEmpty(commandText.ToString())) {
            string commandTextstr = commandText.ToString();
            if (commandTextstr[commandTextstr.Length - 1] == ',') {
                commandTextstr = commandTextstr.Remove(commandTextstr.Length - 1);
            }

            return "ADD " + commandTextstr;
        }

        return string.Empty;
    }

    private static string CreateColumnList(XmlNodeList columns, string primaryKey, DatabaseCall dbCall) {
        StringBuilder columnText = new StringBuilder();

        foreach (XmlNode column in columns) {
            string[] attrs = GetColumnAttr(column, dbCall);
            string columnName = attrs[0];
            string dataType = attrs[1];
            string nullable = attrs[2];

            columnText.Append(columnName + " " + dataType + nullable + ",");
        }

        if (!string.IsNullOrEmpty(primaryKey)) {
            columnText.Append("PRIMARY KEY (" + primaryKey + ")");
        }

        string tempText = columnText.ToString();
        if (tempText[tempText.Length - 1] == ',') {
            tempText = tempText.Remove(tempText.Length - 1);
        }

        return tempText;
    }
    private static string GetDataType(string type, string length) {
        switch (type.ToLower()) {
            case "nvarchar":
                if (!string.IsNullOrEmpty(length)) {
                    type = "nvarchar(" + length + ")";
                }
                else {
                    type = "nvarchar(4000)";
                }
                break;

            case "datetime":
                type = "datetime";
                break;

            case "integer":
                type = "int";
                break;

            case "decimal":
                type = "decimal(18, 0)";
                break;
        }

        if (string.IsNullOrEmpty(type)) {
            return "nvarchar(4000)";
        }

        return type;
    }
    private static string GetCorrectDataType(Type type) {
        switch (type.Name.ToLower()) {
            case "guid":
                return "uniqueidentifier";

            case "string":
                return "";

            case "datetime":
                return "datetime";

            case "int16":
                return "int";

            case "int32":
                return "int";

            case "boolean":
                return "bit";

            case "decimal":
                return "decimal";

            case "float":
                return "float";
        }

        return string.Empty;
    }
    private static string[] GetColumnAttr(XmlNode column, DatabaseCall dbCall) {
        string columnName = column.Attributes["id"].Value;
        string dataType = string.Empty;
        string length = string.Empty;
        string nullable = string.Empty;

        if (column.Attributes["type"] != null) {
            dataType = column.Attributes["type"].Value;
            if (column.Attributes["length"] != null) {
                length = column.Attributes["length"].Value;
                if (length == "4000" && dbCall.DataProvider == "System.Data.SqlClient") {
                    length = "MAX";
                }
                else {
                    int l = 0;
                    int.TryParse(length, out l);
                    if ((l > 4000) || (length.ToLower() == "max")) {
                        length = "4000";
                    }
                }
            }
        }

        string dataType_WithLength = GetDataType(dataType, length);

        if (column.Attributes["nullable"] != null && !HelperMethods.ConvertBitToBoolean(column.Attributes["nullable"].Value)) {
            nullable = " NOT NULL";
        }

        List<string> columnAttr = new List<string>();
        columnAttr.Add(columnName);
        columnAttr.Add(dataType_WithLength);
        columnAttr.Add(nullable);
        columnAttr.Add(dataType);
        columnAttr.Add(length);

        return columnAttr.ToArray();
    }

    #region Check Column Booleans

    private static bool ColumnCheck(DataColumn dColumn, string columnName) {
        return dColumn.ColumnName == columnName;
    }
    private static bool NullableCheck(DataColumn dColumn, bool nullable) {
        return dColumn.AllowDBNull.ToString().ToLower() == nullable.ToString().ToLower();
    }
    private static bool LengthCheck(DataColumn dColumn, string length) {
        return (dColumn.MaxLength.ToString() == length && dColumn.MaxLength != -1) || string.IsNullOrEmpty(length) || (dColumn.MaxLength > 4000 && length.ToLower() == "max");
    }
    private static bool DataTypeCheck(string dataType) {
        dataType = dataType.ToLower();
        return dataType == "nvarchar" || dataType.Contains("char") || string.IsNullOrEmpty(dataType) || dataType == "ntext" || dataType == "uniqueidentifier";
    }
    private static bool ColumnTypeCheck(DataColumn dColumn, string dataType) {
        string dColumnType = GetCorrectDataType(dColumn.DataType);
        return dataType == dColumnType || string.IsNullOrEmpty(dColumnType);
    }

    #endregion

    private static bool DoesColumnExist(DataColumn dColumn, string columnName, string length, string dataType, bool nullable) {
        bool columnCheck = ColumnCheck(dColumn, columnName);
        bool nullableCheck = NullableCheck(dColumn, nullable);
        bool maxLengthNotEqualToOne = dColumn.MaxLength != -1;
        bool lengthCheck = LengthCheck(dColumn, length);
        bool dataTypeCheck = DataTypeCheck(dataType);
        bool columnTypeCheck = ColumnTypeCheck(dColumn, dataType);

        return columnCheck && nullableCheck && (((lengthCheck) && (dataTypeCheck) && (columnTypeCheck)) || (columnTypeCheck && !maxLengthNotEqualToOne));
    }
}