﻿#region

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Formatters.Binary;
using System.Web;
using System.Web.Configuration;

#endregion

[Serializable]
public class TruckSchedule_Coll {
    private readonly string _a;
    private readonly string _c;
    private readonly string _cn;
    private readonly string _date;
    private readonly string _dn;
    private readonly string _gd;
    private readonly Guid _id;
    private readonly string _lu;
    private readonly string _on;
    private readonly int _s;
    private readonly string _tl;
    private readonly string _u;
    private readonly string _w;

    public TruckSchedule_Coll(Guid id, string dn, string tl, string date, string u, string cn, string c, string on,
                              int s, string gd, string w, string a, string lu) {
        _id = id;
        _dn = dn;
        _tl = tl;
        _date = date;
        _u = u;
        _cn = cn;
        _c = c;
        _on = on;
        _s = s;
        _gd = gd;
        _w = w;
        _a = a;
        _lu = lu;
    }

    public Guid ID {
        get { return _id; }
    }

    public string DriverName {
        get { return _dn; }
    }

    public string TruckLine {
        get { return _tl; }
    }

    public string Date {
        get { return _date; }
    }

    public string Unit {
        get { return _u; }
    }

    public string CustomerName {
        get { return _cn; }
    }

    public string City {
        get { return _c; }
    }

    public string OrderNumber {
        get { return _on; }
    }

    public int Sequence {
        get { return _s; }
    }

    public string GeneralDirection {
        get { return _gd; }
    }

    public string Weight {
        get { return _w; }
    }

    public string AdditionalInfo {
        get { return _a; }
    }

    public string LastUpdated {
        get { return _lu; }
    }
}

[Serializable]
public class TruckSchedule_Coll2 {
    private readonly string _a;
    private readonly string _c;
    private readonly string _cn;
    private readonly string _date;
    private readonly string _dn;
    private readonly string _gd;
    private readonly int _id;
    private readonly string _lu;
    private readonly string _on;
    private readonly int _s;
    private readonly string _tl;
    private readonly string _u;
    private readonly string _w;

    public TruckSchedule_Coll2(int id, string dn, string tl, string date, string u, string cn, string c, string on,
                               int s, string gd, string w, string a, string lu) {
        _id = id;
        _dn = dn;
        _tl = tl;
        _date = date;
        _u = u;
        _cn = cn;
        _c = c;
        _on = on;
        _s = s;
        _gd = gd;
        _w = w;
        _a = a;
        _lu = lu;
    }

    public int ID {
        get { return _id; }
    }

    public string DriverName {
        get { return _dn; }
    }

    public string TruckLine {
        get { return _tl; }
    }

    public string Date {
        get { return _date; }
    }

    public string Unit {
        get { return _u; }
    }

    public string CustomerName {
        get { return _cn; }
    }

    public string City {
        get { return _c; }
    }

    public string OrderNumber {
        get { return _on; }
    }

    public int Sequence {
        get { return _s; }
    }

    public string GeneralDirection {
        get { return _gd; }
    }

    public string Weight {
        get { return _w; }
    }

    public string AdditionalInfo {
        get { return _a; }
    }

    public string LastUpdated {
        get { return _lu; }
    }
}

[Serializable]
public class TruckSchedule {
    private readonly AppLog applog = new AppLog(false);
    private readonly DatabaseCall dbCall = new DatabaseCall();
    private const string TableName = "TruckSchedule";
    private List<string> _driver_coll = new List<string>();
    private List<TruckSchedule_Coll> _scheduler_coll = new List<TruckSchedule_Coll>();

    public TruckSchedule(bool getValues = true, string sortCol = "", string sortDir = "") {
        _scheduler_coll.Clear();

        if (getValues) {
            string orderBy = "Date DESC, LastUpdated DESC";
            if ((sortCol != "") && (sortDir != "")) {
                if (sortCol == "undefined")
                    sortCol = "Date";
                if (sortDir == "undefined")
                    sortDir = "DESC";

                orderBy = sortCol + " " + sortDir + ", LastUpdated " + sortDir;
            }

            List<Dictionary<string, string>> dbSelect = dbCall.CallSelect(TableName, "", null, orderBy);
            foreach (Dictionary<string, string> row in dbSelect) {
                string tl = row["TruckLine"];
                if (string.IsNullOrEmpty(tl)) {
                    var id = Guid.Parse(row["ID"]);
                    string dn = row["DriverName"];
                    string d = row["Date"].Replace(" 12:00:00 AM", "");
                    string u = row["Unit"];
                    string cn = row["CustomerName"];
                    string c = row["City"];
                    string on = row["OrderNumber"];
                    int s = Convert.ToInt32(row["Sequence"]);
                    string gd = row["GeneralDirection"];
                    string w = row["Weight"];
                    string lu = row["LastUpdated"];
                    string a = string.Empty;
                    if (!_driver_coll.Contains(dn)) {
                        _driver_coll.Add(dn);
                    }
                    TruckSchedule_Coll coll = new TruckSchedule_Coll(id, dn, tl, d, u, cn, c, on, s, gd, w, a, lu);
                    updateSlots(coll);
                }
            }

            //foreach (TruckSchedule_Coll x in _scheduler_coll)
            //{
            //    updateDate(x.ID, Convert.ToDateTime(x.Date).ToShortDateString().Replace("-", "/"));
            //}
        }
    }

    public TruckSchedule(bool getOther) {
        _scheduler_coll.Clear();
        List<Dictionary<string, string>> dbSelect = dbCall.CallSelect(TableName, "", null, "Date DESC");

        foreach (Dictionary<string, string> row in dbSelect) {
            string tl = row["TruckLine"];
            if (!string.IsNullOrEmpty(tl)) {
                var id = Guid.Parse(row["ID"]);
                string dn = row["DriverName"];
                string d = row["Date"].Replace(" 12:00:00 AM", "");
                string u = row["Unit"];
                string cn = row["CustomerName"];
                string c = row["City"];
                string on = row["OrderNumber"];
                int s = Convert.ToInt32(row["Sequence"]);
                string gd = row["GeneralDirection"];
                string w = row["Weight"];
                string a = row["AdditionalInfo"];
                string lu = row["LastUpdated"];
                if (!_driver_coll.Contains(dn)) {
                    _driver_coll.Add(dn);
                }
                TruckSchedule_Coll coll = new TruckSchedule_Coll(id, dn, tl, d, u, cn, c, on, s, gd, w, a, lu);
                updateSlots(coll);
            }
        }
    }

    public TruckSchedule(string date) {
        _scheduler_coll.Clear();

        List<DatabaseQuery> query = new List<DatabaseQuery>();
        query.Add(new DatabaseQuery("Date", date + " 12:00:00 AM"));

        List<Dictionary<string, string>> dbSelect = dbCall.CallSelect(TableName, "", query, "Date DESC");

        foreach (Dictionary<string, string> row in dbSelect) {
            string tl = row["TruckLine"];
            if (string.IsNullOrEmpty(tl)) {
                var id = Guid.Parse(row["ID"]);
                string dn = row["DriverName"];
                string d = row["Date"].Replace(" 12:00:00 AM", "");
                string u = row["Unit"];
                string cn = row["CustomerName"];
                string c = row["City"];
                string on = row["OrderNumber"];
                int s = Convert.ToInt32(row["Sequence"]);
                string gd = row["GeneralDirection"];
                string w = row["Weight"];
                string lu = row["LastUpdated"];
                string a = string.Empty;
                if (!_driver_coll.Contains(dn)) {
                    _driver_coll.Add(dn);
                }
                TruckSchedule_Coll coll = new TruckSchedule_Coll(id, dn, tl, d, u, cn, c, on, s, gd, w, a, lu);
                updateSlots(coll);
            }
        }
    }

    public TruckSchedule(string driver, string date, string unit, string direction) {
        _scheduler_coll.Clear();

        List<DatabaseQuery> query = new List<DatabaseQuery>();
        query.Add(new DatabaseQuery("DriverName", driver));
        query.Add(new DatabaseQuery("Date", date + " 12:00:00 AM"));
        query.Add(new DatabaseQuery("Unit", unit));
        query.Add(new DatabaseQuery("GeneralDirection", direction));

        List<Dictionary<string, string>> dbSelect = dbCall.CallSelect(TableName, "", query, "Sequence ASC");

        foreach (Dictionary<string, string> row in dbSelect) {
            string tl = row["TruckLine"];
            if (string.IsNullOrEmpty(tl)) {
                var id = Guid.Parse(row["ID"]);
                string dn = row["DriverName"];
                string d = row["Date"].Replace(" 12:00:00 AM", "");
                string u = row["Unit"];
                string cn = row["CustomerName"];
                string c = row["City"];
                string on = row["OrderNumber"];
                int s = Convert.ToInt32(row["Sequence"]);
                string gd = row["GeneralDirection"];
                string w = row["Weight"];
                string lu = row["LastUpdated"];
                string a = string.Empty;
                if (!_driver_coll.Contains(dn)) {
                    _driver_coll.Add(dn);
                }
                TruckSchedule_Coll coll = new TruckSchedule_Coll(id, dn, tl, d, u, cn, c, on, s, gd, w, a, lu);
                updateSlots(coll);
            }
        }
    }

    public List<TruckSchedule_Coll> scheduler_coll {
        get { return _scheduler_coll; }
    }

    public List<string> drivers_coll {
        get { return _driver_coll; }
    }

    public List<TruckSchedule_Coll> getOtherTruckDates(List<TruckSchedule_Coll> ts, string month, string year) {
        var x = new List<TruckSchedule_Coll>();
        for (int i = 0; i < ts.Count; i++) {
            try {
                string tempdate = Convert.ToDateTime(ts[i].Date).ToShortDateString();
                int first = tempdate.IndexOf('/');
                string m = tempdate.Substring(0, first);
                int last = tempdate.Length - 4;
                string y = tempdate.Substring(last);
                if ((month == m) && (year == y)) {
                    x.Add(ts[i]);
                }
            }
            catch {
            }
        }

        return x;
    }

    private List<TruckSchedule_Coll> getDataDate(string date) {
        var x = new List<TruckSchedule_Coll>();

        List<DatabaseQuery> query = new List<DatabaseQuery>();
        query.Add(new DatabaseQuery("Date", date + " 12:00:00 AM"));

        List<Dictionary<string, string>> dbSelect = dbCall.CallSelect(TableName, "", query, "Date DESC");

        foreach (Dictionary<string, string> row in dbSelect) {
            string tl = row["TruckLine"];
            if (string.IsNullOrEmpty(tl)) {
                var id = Guid.Parse(row["ID"]);
                string dn = row["DriverName"];
                string d = row["Date"].Replace(" 12:00:00 AM", "");
                string u = row["Unit"];
                string cn = row["CustomerName"];
                string c = row["City"];
                string on = row["OrderNumber"];
                int s = Convert.ToInt32(row["Sequence"]);
                string gd = row["GeneralDirection"];
                string w = row["Weight"];
                string lu = row["LastUpdated"];
                string a = string.Empty;
                TruckSchedule_Coll coll = new TruckSchedule_Coll(id, dn, tl, d, u, cn, c, on, s, gd, w, a, lu);
                x.Add(coll);
            }
        }

        return x;
    }

    public List<TruckSchedule_Coll> getUserData(string driver, string sortCol = "", string sortDir = "") {
        string orderBy = "Date DESC";
        if ((sortCol != "") && (sortDir != ""))
            orderBy = sortCol + " " + sortDir;

        List<DatabaseQuery> query = new List<DatabaseQuery>();
        query.Add(new DatabaseQuery("DriverName", driver));

        List<Dictionary<string, string>> dbSelect = dbCall.CallSelect(TableName, "", query, orderBy);

        var x = new List<TruckSchedule_Coll>();

        foreach (Dictionary<string, string> row in dbSelect) {
            string tl = row["TruckLine"];
            if (string.IsNullOrEmpty(tl)) {
                var id = Guid.Parse(row["ID"]);
                string dn = row["DriverName"];
                string d = row["Date"].Replace(" 12:00:00 AM", "");
                string u = row["Unit"];
                string cn = row["CustomerName"];
                string c = row["City"];
                string on = row["OrderNumber"];
                int s = Convert.ToInt32(row["Sequence"]);
                string gd = row["GeneralDirection"];
                string w = row["Weight"];
                string lu = row["LastUpdated"];
                string a = string.Empty;
                TruckSchedule_Coll coll = new TruckSchedule_Coll(id, dn, tl, d, u, cn, c, on, s, gd, w, a, lu);
                x.Add(coll);
            }
        }

        return x;
    }

    public List<TruckSchedule_Coll> getUserData_noDup(List<TruckSchedule_Coll> x) {
        var temp = new List<TruckSchedule_Coll>();
        var temp2 = new List<string>();

        foreach (TruckSchedule_Coll t in x) {
            string s = t.DriverName + ";" + t.Date + ";" + t.Unit + ";" + t.GeneralDirection;
            if (!temp2.Contains(s)) {
                temp.Add(t);
                temp2.Add(s);
            }
        }

        return temp;
    }

    public List<TruckSchedule_Coll> getUserData_noDup2(List<TruckSchedule_Coll> x) {
        var temp = new List<TruckSchedule_Coll>();
        var temp2 = new List<string>();

        foreach (TruckSchedule_Coll t in x) {
            string s = t.DriverName + ";" + t.Date + ";" + t.Unit + ";" + t.GeneralDirection + ";" + t.OrderNumber + ";" + t.TruckLine + ";" + t.CustomerName + ";" + t.City + ";" + t.Weight;
            if (!temp2.Contains(s)) {
                temp.Add(t);
                temp2.Add(s);
            }
        }

        return temp;
    }

    public void addItem(string dn, string tl, string date, string u, string cn, string c, string on, int s, string gd, string weight, string addinfo) {
        List<TruckSchedule_Coll> tempcoll = getDataDate(date);
        bool canCont = tempcoll.All(t => (t.Date != date) || (t.DriverName.ToLower() != dn.ToLower()) || (t.Unit.ToLower() != u.ToLower()) || (t.Sequence != s) || (t.OrderNumber.ToLower() != @on.ToLower()) || (t.City.ToLower() != c.ToLower()) || (t.CustomerName.ToLower() != cn.ToLower()));
        if (canCont) {
            List<DatabaseQuery> query = new List<DatabaseQuery>();
            query.Add(new DatabaseQuery("ID", Guid.NewGuid().ToString()));
            query.Add(new DatabaseQuery("DriverName", dn));
            query.Add(new DatabaseQuery("TruckLine", tl));
            query.Add(new DatabaseQuery("Date", date));
            query.Add(new DatabaseQuery("Unit", u));
            query.Add(new DatabaseQuery("CustomerName", cn));
            query.Add(new DatabaseQuery("City", c));
            query.Add(new DatabaseQuery("OrderNumber", on));
            query.Add(new DatabaseQuery("Sequence", s.ToString()));
            query.Add(new DatabaseQuery("GeneralDirection", gd));
            query.Add(new DatabaseQuery("Weight", weight));
            query.Add(new DatabaseQuery("AdditionalInfo", addinfo));
            query.Add(new DatabaseQuery("LastUpdated", DateTime.Now.ToString()));

            dbCall.CallInsert(TableName, query);
        }
    }

    public void deleteSlot(Guid id) {
        List<DatabaseQuery> query = new List<DatabaseQuery>();
        query.Add(new DatabaseQuery("ID", id.ToString()));

        dbCall.CallDelete(TableName, query);
    }

    public void deleteSlots(string drivername) {
        List<DatabaseQuery> query = new List<DatabaseQuery>();
        query.Add(new DatabaseQuery("DriverName", drivername));

        dbCall.CallDelete(TableName, query);
    }

    public DataTable GetDailyOverview(string date) {
        var dataTable = new DataTable();

        List<DatabaseQuery> query = new List<DatabaseQuery>();
        query.Add(new DatabaseQuery("Date", date + " 12:00:00 AM"));

        List<Dictionary<string, string>> dbSelect = dbCall.CallSelect(TableName, "Date, TruckLine, DriverName, Unit, CustomerName, City, OrderNumber, Sequence, GeneralDirection, Weight", query);

        var dt = new DataTable();
        dt.Columns.Add(new DataColumn("Date", Type.GetType("System.DateTime")));
        dt.Columns.Add(new DataColumn("TruckLine"));
        dt.Columns.Add(new DataColumn("DriverName"));
        dt.Columns.Add(new DataColumn("Stop"));
        dt.Columns.Add(new DataColumn("Unit"));
        dt.Columns.Add(new DataColumn("CustomerName"));
        dt.Columns.Add(new DataColumn("City"));
        dt.Columns.Add(new DataColumn("OrderNumber"));
        dt.Columns.Add(new DataColumn("GeneralDirection"));
        dt.Columns.Add(new DataColumn("Weight"));

        foreach (Dictionary<string, string> dr in dbSelect) {
            DataRow drts = dt.NewRow();
            int weight = 0;

            string da = dr["Date"].ToString().Replace(" 12:00:00 AM", "");
            string tl = dr["TruckLine"].ToString();
            string dn = dr["DriverName"].ToString();
            string st = dr["Sequence"].ToString();
            string un = dr["Unit"].ToString();
            string cn = dr["CustomerName"].ToString();
            string c = dr["City"].ToString();
            string on = dr["OrderNumber"].ToString();
            string gd = dr["GeneralDirection"].ToString();
            int.TryParse(dr["Weight"].ToString(), out weight);

            #region set initial values

            if (string.IsNullOrEmpty(da)) {
                da = "-";
            }
            if (string.IsNullOrEmpty(tl)) {
                tl = "-";
            }
            if (string.IsNullOrEmpty(dn)) {
                dn = "-";
            }
            if (string.IsNullOrEmpty(st)) {
                st = "-";
            }
            if (string.IsNullOrEmpty(un)) {
                un = "-";
            }
            if (string.IsNullOrEmpty(cn)) {
                cn = "-";
            }
            if (string.IsNullOrEmpty(c)) {
                c = "-";
            }
            if (string.IsNullOrEmpty(on)) {
                on = "-";
            }
            if (string.IsNullOrEmpty(gd)) {
                gd = "-";
            }

            #endregion

            drts["Date"] = da;
            drts["TruckLine"] = tl.Replace("_", " ");
            drts["DriverName"] = dn.Replace("_", " ");
            drts["Stop"] = st;
            drts["Unit"] = un;
            drts["CustomerName"] = cn.Replace("_", " ");
            drts["City"] = c.Replace("_", " ");
            drts["OrderNumber"] = on;
            drts["GeneralDirection"] = gd.Replace("_", " ");
            drts["Weight"] = weight.ToString("#,##0");
            dt.Rows.Add(drts);
        }

        dataTable = dt;
        var dv = new DataView(dataTable);

        string sortBy = dv.Table.Columns[2] + ", " + dv.Table.Columns[3] + " desc";
        string tempSortyBy = GetSortParamas;
        if (tempSortyBy != "") {
            sortBy = tempSortyBy;
        }

        dv.Sort = sortBy;
        dataTable = dv.ToTable();

        return dataTable;
    }

    public DataTable GetDailyOverview_Month(string date) {
        var dataTable = new DataTable();

        DateTime _dateTime = new DateTime();
        DateTime.TryParse(date, out _dateTime);

        List<DatabaseQuery> query = new List<DatabaseQuery>();
        query.Add(new DatabaseQuery("DateMonth", _dateTime.Month.ToString()));
        query.Add(new DatabaseQuery("DateYear", _dateTime.Year.ToString()));

        List<Dictionary<string, string>> dbSelect = dbCall.CallSelect(TableName, "Date, TruckLine, DriverName, Unit, CustomerName, City, OrderNumber, Sequence, GeneralDirection, Weight", "MONTH(Date)=@DateMonth AND YEAR(Date)=@DateYear", query);

        var dt = new DataTable();
        dt.Columns.Add(new DataColumn("Date", Type.GetType("System.DateTime")));
        dt.Columns.Add(new DataColumn("TruckLine"));
        dt.Columns.Add(new DataColumn("DriverName"));
        dt.Columns.Add(new DataColumn("Stop"));
        dt.Columns.Add(new DataColumn("Unit"));
        dt.Columns.Add(new DataColumn("CustomerName"));
        dt.Columns.Add(new DataColumn("City"));
        dt.Columns.Add(new DataColumn("OrderNumber"));
        dt.Columns.Add(new DataColumn("GeneralDirection"));
        dt.Columns.Add(new DataColumn("Weight"));

        foreach (Dictionary<string, string> dr in dbSelect) {
            DateTime temp_date = Convert.ToDateTime(dr["Date"].ToString());
            if ((temp_date.Month.ToString() == _dateTime.Month.ToString()) && (temp_date.Year.ToString() == _dateTime.Year.ToString())) {
                DataRow drts = dt.NewRow();
                int weight = 0;

                string da = dr["Date"].ToString().Replace(" 12:00:00 AM", "");
                string tl = dr["TruckLine"].ToString();
                string dn = dr["DriverName"].ToString();
                string st = dr["Sequence"].ToString();
                string un = dr["Unit"].ToString();
                string cn = dr["CustomerName"].ToString();
                string c = dr["City"].ToString();
                string on = dr["OrderNumber"].ToString();
                string gd = dr["GeneralDirection"].ToString();
                int.TryParse(dr["Weight"].ToString(), out weight);

                #region set initial values

                if (string.IsNullOrEmpty(da)) {
                    da = "-";
                }
                if (string.IsNullOrEmpty(tl)) {
                    tl = "-";
                }
                if (string.IsNullOrEmpty(dn)) {
                    dn = "-";
                }
                if (string.IsNullOrEmpty(st)) {
                    st = "-";
                }
                if (string.IsNullOrEmpty(un)) {
                    un = "-";
                }
                if (string.IsNullOrEmpty(cn)) {
                    cn = "-";
                }
                if (string.IsNullOrEmpty(c)) {
                    c = "-";
                }
                if (string.IsNullOrEmpty(on)) {
                    on = "-";
                }
                if (string.IsNullOrEmpty(gd)) {
                    gd = "-";
                }

                #endregion

                drts["Date"] = da;
                drts["TruckLine"] = tl.Replace("_", " ");
                drts["DriverName"] = dn.Replace("_", " ");
                drts["Stop"] = st;
                drts["Unit"] = un;
                drts["CustomerName"] = cn.Replace("_", " ");
                drts["City"] = c.Replace("_", " ");
                drts["OrderNumber"] = on;
                drts["GeneralDirection"] = gd.Replace("_", " ");
                drts["Weight"] = weight.ToString("#,##0");
                dt.Rows.Add(drts);
            }

            dataTable = dt;
            var dv = new DataView(dataTable);

            string sortBy = dv.Table.Columns[2] + ", " + dv.Table.Columns[3] + " desc";
            string tempSortyBy = GetSortParamas;
            if (tempSortyBy != "") {
                sortBy = tempSortyBy;
            }

            dv.Sort = sortBy;
            dataTable = dv.ToTable();
        }

        return dataTable;
    }

    public string GetSortParamas {
        get {
            string sortBy = string.Empty;
            AppParams param = new AppParams(false);
            param.GetAllParameters_ForApp("app-dailyoverview");
            List<Dictionary<string, string>> datalist = param.listdt;
            foreach (Dictionary<string, string> rowParam in datalist) {
                string Parameter = rowParam["Parameter"];
                if (Parameter.IndexOf("Sort By=") == 0) {
                    if ((!Parameter.ToLower().Contains("delete")) && (!Parameter.ToLower().Contains("update"))
                        && (!Parameter.ToLower().Contains("select")) && (!Parameter.ToLower().Contains("create"))) {
                        string subParam = Parameter.Substring(0 + ("Sort By=").Length);
                        if ((subParam.ToLower().Contains("asc")) || (subParam.ToLower().Contains("desc"))) {
                            sortBy = subParam;
                            break;
                        }
                    }
                }
            }

            return sortBy;
        }
    }

    public bool updateDriverName(string on, string dn) {
        List<DatabaseQuery> query = new List<DatabaseQuery>();
        query.Add(new DatabaseQuery("DriverName", on));

        List<DatabaseQuery> updateQuery = new List<DatabaseQuery>();
        updateQuery.Add(new DatabaseQuery("DriverName", dn));

        return dbCall.CallUpdate(TableName, updateQuery, query);
    }

    public void updateTruckLine(Guid id, string tl) {
        List<DatabaseQuery> query = new List<DatabaseQuery>();
        query.Add(new DatabaseQuery("ID", id.ToString()));

        List<DatabaseQuery> updateQuery = new List<DatabaseQuery>();
        updateQuery.Add(new DatabaseQuery("TruckLine", tl));
        updateQuery.Add(new DatabaseQuery("LastUpdated", DateTime.Now.ToString()));

        dbCall.CallUpdate(TableName, updateQuery, query);
    }

    public void updateDate(Guid id, string d) {
        List<DatabaseQuery> query = new List<DatabaseQuery>();
        query.Add(new DatabaseQuery("ID", id.ToString()));

        List<DatabaseQuery> updateQuery = new List<DatabaseQuery>();
        updateQuery.Add(new DatabaseQuery("Date", d + " 12:00:00 AM"));
        updateQuery.Add(new DatabaseQuery("LastUpdated", DateTime.Now.ToString()));

        dbCall.CallUpdate(TableName, updateQuery, query);
    }

    public void updateUnit(Guid id, string u) {
        List<DatabaseQuery> query = new List<DatabaseQuery>();
        query.Add(new DatabaseQuery("ID", id.ToString()));

        List<DatabaseQuery> updateQuery = new List<DatabaseQuery>();
        updateQuery.Add(new DatabaseQuery("Unit", u));
        updateQuery.Add(new DatabaseQuery("LastUpdated", DateTime.Now.ToString()));

        dbCall.CallUpdate(TableName, updateQuery, query);
    }

    public void updateCustomerName(Guid id, string cn) {
        List<DatabaseQuery> query = new List<DatabaseQuery>();
        query.Add(new DatabaseQuery("ID", id.ToString()));

        List<DatabaseQuery> updateQuery = new List<DatabaseQuery>();
        updateQuery.Add(new DatabaseQuery("CustomerName", cn));
        updateQuery.Add(new DatabaseQuery("LastUpdated", DateTime.Now.ToString()));

        dbCall.CallUpdate(TableName, updateQuery, query);
    }

    public void updateCity(Guid id, string c) {
        List<DatabaseQuery> query = new List<DatabaseQuery>();
        query.Add(new DatabaseQuery("ID", id.ToString()));

        List<DatabaseQuery> updateQuery = new List<DatabaseQuery>();
        updateQuery.Add(new DatabaseQuery("City", c));
        updateQuery.Add(new DatabaseQuery("LastUpdated", DateTime.Now.ToString()));

        dbCall.CallUpdate(TableName, updateQuery, query);
    }

    public void updateOrderNumber(Guid id, string on) {
        List<DatabaseQuery> query = new List<DatabaseQuery>();
        query.Add(new DatabaseQuery("ID", id.ToString()));

        List<DatabaseQuery> updateQuery = new List<DatabaseQuery>();
        updateQuery.Add(new DatabaseQuery("OrderNumber", on));
        updateQuery.Add(new DatabaseQuery("LastUpdated", DateTime.Now.ToString()));

        dbCall.CallUpdate(TableName, updateQuery, query);
    }

    public void updateGeneralDirection(Guid id, string gd) {
        List<DatabaseQuery> query = new List<DatabaseQuery>();
        query.Add(new DatabaseQuery("ID", id.ToString()));

        List<DatabaseQuery> updateQuery = new List<DatabaseQuery>();
        updateQuery.Add(new DatabaseQuery("GeneralDirection", gd));
        updateQuery.Add(new DatabaseQuery("LastUpdated", DateTime.Now.ToString()));

        dbCall.CallUpdate(TableName, updateQuery, query);
    }

    public void updateSequence(Guid id, string s) {
        List<DatabaseQuery> query = new List<DatabaseQuery>();
        query.Add(new DatabaseQuery("ID", id.ToString()));

        List<DatabaseQuery> updateQuery = new List<DatabaseQuery>();
        updateQuery.Add(new DatabaseQuery("Sequence", s));
        updateQuery.Add(new DatabaseQuery("LastUpdated", DateTime.Now.ToString()));

        dbCall.CallUpdate(TableName, updateQuery, query);
    }

    public void updateWeight(Guid id, string w) {
        List<DatabaseQuery> query = new List<DatabaseQuery>();
        query.Add(new DatabaseQuery("ID", id.ToString()));

        List<DatabaseQuery> updateQuery = new List<DatabaseQuery>();
        updateQuery.Add(new DatabaseQuery("Weight", w));
        updateQuery.Add(new DatabaseQuery("LastUpdated", DateTime.Now.ToString()));

        dbCall.CallUpdate(TableName, updateQuery, query);
    }

    public void updateInfo(Guid id, string a) {
        List<DatabaseQuery> query = new List<DatabaseQuery>();
        query.Add(new DatabaseQuery("ID", id.ToString()));

        List<DatabaseQuery> updateQuery = new List<DatabaseQuery>();
        updateQuery.Add(new DatabaseQuery("AdditionalInfo", a));
        updateQuery.Add(new DatabaseQuery("LastUpdated", DateTime.Now.ToString()));

        dbCall.CallUpdate(TableName, updateQuery, query);
    }

    public int GetEntryCount(string driver, string date, string unit) {
        List<DatabaseQuery> query = new List<DatabaseQuery>();
        query.Add(new DatabaseQuery("DriverName", driver));
        query.Add(new DatabaseQuery("Date", date + " 12:00:00 AM"));
        query.Add(new DatabaseQuery("Unit", unit));

        List<Dictionary<string, string>> dbSelect = dbCall.CallSelect(TableName, "", query);
        return dbSelect.Count;
    }

    public List<string> getListGeneralDirections() {
        var temp = new List<string>();
        var ts = new TruckSchedule();
        for (int i = 0; i < ts.scheduler_coll.Count; i++) {
            if (!temp.Contains(ts.scheduler_coll[i].GeneralDirection)) {
                temp.Add(ts.scheduler_coll[i].GeneralDirection);
            }
        }

        return temp;
    }

    public int calTotalWeightGD_Month(string date, string direction) {
        string cal = date;
        int index = cal.IndexOf("/", System.StringComparison.Ordinal);

        DateTime _dateTime = new DateTime();
        DateTime.TryParse(date, out _dateTime);
        int weight = 0;

        List<DatabaseQuery> query = new List<DatabaseQuery>();
        query.Add(new DatabaseQuery("GeneralDirection", direction));
        query.Add(new DatabaseQuery("DateMonth", _dateTime.Month.ToString()));
        query.Add(new DatabaseQuery("DateYear", _dateTime.Year.ToString()));

        List<Dictionary<string, string>> dbSelect = dbCall.CallSelect(TableName, "Weight", "MONTH(Date)=@DateMonth AND YEAR(Date)=@DateYear AND GeneralDirection=@GeneralDirection", query);

        foreach (Dictionary<string, string> row in dbSelect) {
            try {
                weight += Convert.ToInt32(row["Weight"]);
            }
            catch {
            }
        }

        return weight;
    }

    public int calTotalWeightGD(string date, string direction) {
        int weight = 0;
        List<DatabaseQuery> query = new List<DatabaseQuery>();
        query.Add(new DatabaseQuery("GeneralDirection", direction));
        query.Add(new DatabaseQuery("Date", date + " 12:00:00 AM"));

        List<Dictionary<string, string>> dbSelect = dbCall.CallSelect(TableName, "Weight", query);

        foreach (Dictionary<string, string> row in dbSelect) {
            try {
                weight += Convert.ToInt32(row["Weight"]);
            }
            catch {
            }
        }

        return weight;
    }

    public int calTotalWeightGD(string date, string direction, string unit, string driver) {
        int weight = 0;
        List<DatabaseQuery> query = new List<DatabaseQuery>();
        query.Add(new DatabaseQuery("GeneralDirection", direction));
        query.Add(new DatabaseQuery("Date", date + " 12:00:00 AM"));
        query.Add(new DatabaseQuery("Unit", unit));
        query.Add(new DatabaseQuery("DriverName", driver));

        List<Dictionary<string, string>> dbSelect = dbCall.CallSelect(TableName, "Weight", query);

        foreach (Dictionary<string, string> row in dbSelect) {
            try {
                weight += Convert.ToInt32(row["Weight"].Replace(",", "").Trim());
            }
            catch {
            }
        }

        return weight;
    }

    private void updateSlots(TruckSchedule_Coll coll) {
        _scheduler_coll.Add(coll);
    }
}