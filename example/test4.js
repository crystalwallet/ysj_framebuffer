var request = require('request');

openstackAuth('admin', 'ncl2015', 'admin', function(tokenID, novaServiceURL) {
    getVirtualInstances(tokenID, novaServiceURL, function(VMs) {
        console.log(VMs);
    });
});

function openstackAuth(id, pw, tenentName, cb) {
    request({
        method: 'POST',
        uri: 'http://143.248.2.209:5000/v2.0/tokens',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            auth: {
                tenantName: tenentName,
                passwordCredentials: {
                    username: id,
                    password: pw
                }
            }
        })
    }, function(e, r, b) {
        var authRes = JSON.parse(b);
        var tokenID = authRes.access.token.id;
        var novaServiceURL = authRes.access.serviceCatalog[1].endpoints[0].publicURL;
        cb(tokenID, novaServiceURL);
    });
}

function getVirtualInstances(tokenID, novaServiceURL, cb) {
    request({
        method: 'GET',
        uri: novaServiceURL + '/servers',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': tokenID
        }
    }, function(e, r, b) {
        var VMs = JSON.parse(b);
        cb(VMs);
    });
}