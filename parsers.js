function parseV1(data) {
    let address2 = null;
    if('DAH' in data.DL){
        address2 = data.DL['DAH'];
    } else {

    }
    let lastName=null;
    let firstName=null;
    let middleName=null;
    let suffixName=null;
    let prefixName=null;
    try{
        lastName = data.DL[DAB];
        firstName = data.DL[DAC];
        middleName = data.DL[DAD];
        //Optional
        suffixName = data.DL[DAE];
        prefixName = data.DL[DAF];
    } catch(err){
        let name = data.DL['DAA'].split(',');
        lastName = name[0];
        firstName = name[1];
        middleName = name[2];
    }
    let hair=null;
    if(data.DL['DAZ'].length > 0) {
        hair = data.DL['DAZ'];
    }
    else {
        hair = 'NA';
    }
    let eyes=null;
    if('DAZ' in data.DL && data.DL['DAZ'].length > 0) {
        eyes = data.DL['DAZ'];
    }
    else {
        eyes = 'NA';
    }
    let sex =null;
    switch(data.DL['DBC']){
        case('1'): {
            sex = 'M';
            break;
        }
        case('2'): {
            sex = 'F';
            break;
        }
    }

    if('DAZ' in data.DL && data.DL['DAZ'].length > 0) {
        eyes = data.DL['DAZ'];
    }
    else {
        eyes = 'NA';
    }
    let dlObj = {
        iin: data.header.IIN,
        type: null,
        licenseNumber:data.DL['DAQ'],
        class:data.DL['DAR'],
        name:{
            prefixName:prefixName,
            lastName:lastName,
            firstName:firstName,
            middleName:middleName,
            suffixName:suffixName
        },
        address:{
            street: data.DL['DAG'],
            address2: address2,
            city: data.DL['DAI'],
            state: data.DL['DAJ'],
            zip: data.DL['DAK']
        },
        expirationDate:new Date(parseInt(data.DL['DBA'].substr(0,4)),parseInt(data.DL['DBA'].substr(4,2))-1,parseInt(data.DL['DBA'].substr(6,2))),
        birthDate:new Date(parseInt(data.DL['DBB'].substr(0,4)),parseInt(data.DL['DBB'].substr(4,2))-1,parseInt(data.DL['DBB'].substr(6,2))),
        issueDate:new Date(parseInt(data.DL['DBD'].substr(0,4)),parseInt(data.DL['DBD'].substr(4,2))-1,parseInt(data.DL['DBD'].substr(6,2))),
        sex:sex,
        hair: hair,
        eyes: eyes,
        height:{
            major:null,
            minor:null,
        },
        weight:null,
        restrictions:null,
        endorsements:null
    }
            //Parse Eyes

            //Parse Height
            if('DAV' in data.DL && data.DL['DAV'].length > 0) {

                dlObj.height.minor = parseInt(data.DL['DAV']);
                dlObj.units = "METRIC";
            }
            else if('DAU' in data.DL && data.DL['DAU'].length > 0) {
                dlObj.height.major = parseInt(data.DL['DAU'].substr(0,1));
                dlObj.height.minor = parseInt(data.DL['DAU'].substr(1,2));
                dlObj.units = "IMPERIAL";
            }
            //Parse Weight
            if('DAX' in data.DL && data.DL['DAX'].length > 0) {
                dlObj.weight = parseInt(data.DL['DAX'])
            } else if('DAW' in data.DL && data.DL['DAW'].length > 0) {
                dlObj.weight = parseInt(data.DL['DAW']);
            }


            //JS Date takes Month Index starting at 0 so subtract 1

            if('DAZ' in data.DL) {
                dlObj.eyes = data.DL['DAZ'];
            }
            else {
                dlObj.eyes = 'NA';
            }
            //parse endorsements and set card type
            if('DAT' in data.DL)
            {
                try{
                    dlObj.restrictions = data.DL['DAS'];
                }
                catch(err){
                    dlObj.restrictions = "NONE";
                    dlObj.type = "ID";
                }
                dlObj.endorsements = data.DL['DAT'];
                dlObj.type = "DL";
            }
    return dlObj;
}
function parseV2(data) {
   
};
function parseV3(data) {

};
function parseV4(data) {

};
function parseV5(data) {

};
function parseV6(data) {

};
function parseV7(data) {

}

module.exports = {parseV1,parseV2,parseV3,parseV4,parseV5,parseV6,parseV7};