openstackAuth('admin', 'ncl2015', 'admin', function(tokenID, novaServiceURL) {
    //getVirtualInstances(tokenID, novaServiceURL, function(VMs) {
    //  //console.log(VMs);
    //  getDetailVirtualInstance(tokenID, novaServiceURL, VMs.servers[0].id, function(vm) {
    //    //console.log(vm.server.image);
    //    //terminateVirtualInstance(tokenID, novaServiceURL, VMs.servers[0].id, function() {
    //    //  console.log('VM deleted');
    //    //});
    //  });
    //});

    getFlavors(tokenID, novaServiceURL, function(flavors) {
        var flavorsMap = {};
        for(var index in flavors.flavors) {
            var flavor = flavors.flavors[index];
            flavorsMap[flavor.name] = flavor;
        }
        console.log(flavorsMap);
        getImages(tokenID, novaServiceURL, function(images) {
            var imagesMap = {};
            for(var index in images.images) {
                var image = images.images[index];
                imagesMap[image.name] = image;
            }
            console.log(imagesMap);

            //image Á¤º¸, flavor Á¤º¸
            createVirtualInstance(tokenID, novaServiceURL, "testest", flavorsMap["m1.small"], imagesMap["cirros-0.3.4-x86_64"], function(vm) {
                console.log(vm);
                setTimeout(function() {
                    getVirtualInstanceAddress(tokenID, novaServiceURL, vm.server.id, function(address) {
                        console.log(address.addresses['demo-net']);
                    })
                }, 2000);
            });
        })
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

function getDetailVirtualInstance(tokenID, novaServiceURL, serverID, cb) {
    request({
        method: 'GET',
        uri: novaServiceURL + '/servers/' + serverID,
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': tokenID
        }
    }, function(e, r, b) {
        var vm = JSON.parse(b);
        cb(vm);
    });
}

function terminateVirtualInstance(tokenID, novaServiceURL, serverID, cb) {
    request({
        method: 'DELETE',
        uri: novaServiceURL + '/servers/' + serverID,
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': tokenID
        }
    }, function(e, r, b) {
        console.log(r.statusCode);
        cb();
    });
}

function getFlavors(tokenID, novaServiceURL, cb) {
    request({
        method: 'GET',
        uri: novaServiceURL + '/flavors',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': tokenID
        }
    }, function(e, r, b) {
        var flavors = JSON.parse(b);
        cb(flavors);
    });
}

function getImages(tokenID, novaServiceURL, cb) {
    request({
        method: 'GET',
        uri: novaServiceURL + '/images',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': tokenID
        }
    }, function(e, r, b) {
        var images = JSON.parse(b);
        cb(images);
    });
}

function createVirtualInstance(tokenID, novaServiceURL, name, flavor, image, cb) {
    request({
        method: 'POST',
        uri: novaServiceURL + '/servers',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': tokenID
        },
        body: JSON.stringify({
            server: {
                name: name,
                imageRef: image.id,
                flavorRef: flavor.id
            }
        })
    }, function(e, r, b) {
        var vm = JSON.parse(b);
        cb(vm);
    });
}

function getVirtualInstanceAddress(tokenID, novaServiceURL, serverID, cb) {
    request({
        method: 'GET',
        uri: novaServiceURL + '/servers/' + serverID + '/ips',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': tokenID
        }
    }, function(e, r, b) {
        var address = JSON.parse(b);
        cb(address);
    });
}