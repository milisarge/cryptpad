define([
    '/common/rpc.js',

    '/bower_components/tweetnacl/nacl-fast.min.js'
], function (Rpc) {

    var Nacl = window.nacl;

    var deduplicate = function (array) {
        var a = array.slice();
        for(var i=0; i<a.length; i++) {
            for(var j=i+1; j<a.length; j++) {
                if(a[i] === a[j])
                    a.splice(j--, 1);
            }
        }
        return a;
    };

    var create = function (network, ed) {
        var exp = {};
        var rpc = Rpc.create(network, ed);

        var checkHash = exp.checkHash = function (fileList) {
            //var fileList = fo.getFilesDataFiles();
            var channelIdList = [];
            fileList.forEach(function (href) {
                var parsedHref = Cryptpad.parsePadUrl(href);
                if (!parsedHref || !parsedHref.hash) { return; }
                var parsedHash = Cryptpad.parseHash(parsedHref.hash);
                if (!parsedHash || !parsedHash.channel) { return; }
                channelIdList.push(Cryptpad.base64ToHex(parsedHash.channel));
            });
            var uniqueList = deduplicate(channelIdList).sort();
            var hash = Nacl.util.encodeBase64(Nacl.hash(Nacl.util.decodeUTF8( uniqueList.join('') )));

            console.log(hash);
            return true;
        };

        return exp;
    };

    return { create: create };
})
