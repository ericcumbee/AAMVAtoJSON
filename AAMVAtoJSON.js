
const {parseV1,parseV2,parseV3,parseV4,parseV5,parseV6,parseV7} = require('./parsers');
function AAMVAtoJSON(data) {
    let version = parseInt(data.substr(15,2));
    let obj = {};
    let m = null;
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
    let dl = {};
    switch(obj.header.AAMVAVersion) {
        case (0): {
                console.log('0')
            //  pass to v1
        }
        case(1): {
            //console.log('1');
            dl = parseV1(obj);
            break;
        }
        case(2): {
            console.log('2');
            break;
        }
        case(3): {
            switch(obj.DL['DBC']){
                case('1'): {
                    dlObj.sex = 'M';
                    break;
                }
                case('2'): {
                    dlObj.sex = 'F';
                    break;
                }
            }
            break;
        }
        case(4): {
            dlObj.licenseNumber = obj.DL['DAQ'];
            if('DCA' in obj.DL)
            {
                dlObj.class = obj.DL['DCA'];
                dlObj.restrictions = obj.DL['DCB'];
                dlObj.endorsements = obj.DL['DCD'];
                dlObj.type = "DL";
            } else {
                dlObj.class = 'NA';
                dlObj.restrictions = 'NA';
                dlObj.endorsements = 'NA';
                dlObj.type = "ID";
            }
            switch(obj.DL['DBC']){
                case('1'): {
                    dlObj.sex = 'M';
                    break;
                }
                case('2'): {
                    dlObj.sex = 'F';
                    break;
                }
            }
            if(obj.DL['DAU'].substr(-2).toLowerCase() == 'cm')
            {
                dlObj.units = "METRIC";
                console.log('cm detected');
            } else if(obj.DL['DAU'].substr(-1)=='"')
            {
                console.log('these fuckers are stupid and cant read the spec');
                console.log(obj.DL['DAU']);
                dlObj.height.major = parseInt(obj.DL['DAU'].substr(0));
                dlObj.height.minor = parseInt(obj.DL['DAU'].substr(3,2));
                dlObj.units = "IMPERIAL";
            } else if(obj.DL['DAU'].substr(-2).toLowerCase=='in')
            {
                dlObj.height.minor = parseInt(obj.DL['DAU'].substr(0,3));
                dlObj.units = "IMPERIAL";
            }
            //console.log(obj.DL['DAW']);

            if(dlObj.units == 'METRIC') {
                try{
                    dlObj.weight = obj.DL['DAX'];
                }
                catch(err){
                    dlObj.weight = 'NONE';
                }
            }
            else if(dlObj.units =="IMPERIAL")
            {
                try{
                    dlObj.weight = obj.DL['DAW'];
                }
                catch(err){
                    dlObj.weight = 'NONE';
                }
            }
            if(dlObj.weight == 'NONE') {
                try{
                    if(dlObj.units == 'METRIC') {
                        dlObj.weight = obj.DL['DCE'];
                    } else if(dlObj.units == 'IMPERIAL') {
                        dlObj.weight = obj.DL['DCE']
                    }
                }
                catch(err){
                    dlObj.weight = none;
                }
            }
            try{
                dlObj.name.suffixName = obj.DL['DCU'];
            } catch(err){
                dlObj.name.suffixName = null;
            }
            dlObj.name.lastName = obj.DL['DCS'];
            dlObj.name.firstName = obj.DL['DAC'];
            dlObj.name.middleName = obj.DL['DAD'];
            dlObj.hair = obj.DL['DAZ'];
            dlObj.eyes = obj.DL['DAY'];
            dlObj.address.street = obj.DL['DAG'];
            dlObj.address.city = obj.DL['DAI'];
            dlObj.address.state = obj.DL['DAJ'];
            dlObj.address.zip = obj.DL['DAK'];
            //JS Date takes Month Index starting at 0 so subtract 1
            dlObj.expirationDate = new Date(parseInt(obj.DL['DBA'].substr(4,4)),parseInt(obj.DL['DBA'].substr(0,2))-1,parseInt(obj.DL['DBA'].substr(2,2)));
            dlObj.birthDate = new Date(parseInt(obj.DL['DBB'].substr(4,4)),parseInt(obj.DL['DBB'].substr(0,2))-1,parseInt(obj.DL['DBB'].substr(2,2)));
            dlObj.issueDate = new Date(parseInt(obj.DL['DBD'].substr(4,4)),parseInt(obj.DL['DBD'].substr(0,2))-1,parseInt(obj.DL['DBD'].substr(2,2)));

            //
            break;
        }
        case(5): {
            console.log('5');
            break;
        }
        case(6): {
            console.log('6');
            break;
        }
        case(7): {
            console.log('7');
            break;
        }
    }
    return dl;
}

module.exports.AAMVAtoJSON = AAMVAtoJSON;
