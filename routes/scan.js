
/*
 * GET scan page.
 */

var exec = require('child_process').exec
  , EOL = require('os').EOL
  , iplist = false;

/*
 * GET home page.
 */

exports.ind = function(req, res){
  res.render('index',{title: "MITM Catcher v1.0"});
};

exports.scan = function(req, res){
  var cmd
    , patt = /((([0-9]{1,3})\.?){4})\s*((([0-9a-f]{1,3})\-?){6})/
    , different = {};
  cmd = exec('arp -a',
    function (error, stdout, stderr) {
      if (error !== null)
        console.log('exec error: ' + error);
      stdout = stdout.split(EOL);
      var stdoutarr = {};
      for(x = 0; x<stdout.length; x++){
        var tmp = false;
        if(tmp = patt.exec(stdout[x]))
          stdoutarr[tmp[1]] = tmp[4];
      }
      console.dir(stdoutarr);
      if (iplist != false){
        Object.keys(stdoutarr).forEach(function(k){
          if(iplist[k] == undefined)
          	iplist[k] = stdoutarr[k];
          else if(iplist[k] != stdoutarr[k]){
          	different[k] = stdoutarr[k];
          }
        });
      }
      else
        iplist = stdoutarr;
      var s_all = {
      	different: different,
      	ip_mac: iplist
      };
      res.send(JSON.stringify(s_all));
    });
};