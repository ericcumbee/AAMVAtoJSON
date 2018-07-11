function AAMVAtoJSON(data) {
    var version = parseInt(data.substr(15,2));
    var obj = {};
    var m = null;
    var initOffset = 21;
    if(version == 0| version == 1) {
        m = data.match(/^@\n\u001e|\x1c\r(ANSI |AAMVA )(\d{6})(\d{2})(\d{2})/);
        //console.log(m);
        initOffset = 19;
        obj = {
            header: {
                IIN: m[2],
                AAMVAVersion: parseInt(m[3]),
                jurisdictionVersion: null,
                numberOfEntries: parseInt(m[4])
            }
        };
    } else {
        m = data.match(/^@\n(\u001e|\x1c)\r(ANSI |AAMVA )(\d{6})(\d{2})(\d{2})(\d{2})/);
        obj = {
            header: {
                IIN: m[3],
                AAMVAVersion: parseInt(m[4]),
                jurisdictionVersion: parseInt(m[5]),
                numberOfEntries: parseInt(m[6])
            }
        };
    }
    if (!m) {
        return null;
    }
    for (var i = 0; i < obj.header.numberOfEntries; i++) {
        var offset = initOffset + i * 10;
        var d = data.substring(offset, offset + 10).match(/(.{2})(\d{4})(\d{4})/);
        var subfileType = d[1];
        var offset = parseInt(d[2]);
        var length = parseInt(d[3]);
        if (i === 0) {
          obj.files = [ subfileType ];
        } else {
          obj.files.push(subfileType);
        }
        var Adjustment = 2;
        if(obj.header.IIN === "636005")
        {
            Adjustment = 1;
        }
        obj[subfileType] = data.substring(offset + Adjustment, offset + length).trim().split(/\n\r?/).reduce(function (p, c) {
            p[c.substring(0,3)] = c.substring(3).trim();
            return p;
        }, { } );
    }
    // Convert from US MM/DD/CCYY date to UTC millisecond date
    if (obj.DL) {
        ["DBA", "DBB", "DBD", "DDB", "DDC", "DDH", "DDI", "DDJ"].forEach(function (k) {
            if (!obj.DL[k]) return;
            m = obj.DL[k].match(/(\d{2})(\d{2})(\d{4})/);
            if (!m) return;
            obj.DL[k] = (new Date(m[3] + "-" + m[1] + "-" + m[2])).getTime();
        } );
    }

    return obj;
}
