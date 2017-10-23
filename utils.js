const http = require('http');
function Timer(isInterval){
  let milliseconds=1000;
  function internalStart(callback){
    if (isInterval){
         setTimeout.apply(this, [function(){
            callback.apply(this);
            internalStart.apply(this,[callback]);
          }, milliseconds]);
      } else {
        setTimeout.apply(this, [function(){
          callback.apply(this);
        }, milliseconds]);
      }
  };
  this.setTime=function(_milliseconds){
    milliseconds=_milliseconds;
  };
  this.start=function(callback){
      internalStart.apply(this, [callback]);
  };
};

function handleJsonResponse(request, response, cbSuccess){
   response.on('data', function (body) {
      if (response.statusCode==200){
        cbSuccess(body);
      }else{
        const resMessage=`HTTP: ${request.url} request responded with status: ${response.statusCode}`;
        console.error(resMessage);
      }
    });
};

function handleJsonRequest(url, request, response, cbPass){
  
  if (response){
    handleJsonResponse(request, response, cbPass);
    return;
  }
  
   var options; 
   if (url){
      const addressSplit=url.replace('http://','').replace('https://','').split(':');
      const hostName = addressSplit[0].split('/')[0];
      var port=80;
      if (addressSplit[1]){
          port = addressSplit[1].split('/')[0];
      }
      options = {
          host: hostName,
          port: port, 
          method:'POST',
          headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(jsonString)
          }
      };
   }
   if (response){
      
   }else if (options){
    _request=http.request(options);
   }
   _request.on('error', function (err) {
        console.log(`http error`,err);
        cbError(err);
    });
   _request.on('response', function (_response) {
        _response.setEncoding('utf8');
        _response.on('data', function (body) {
          const resMessage=`HttpHandler: ${options.host} responded with status: ${_response.statusCode}`;
          if (_response.statusCode==200){
            cbSuccess();
          }else{
            cbError(resMessage);
          }
        });
    });
    _request.write(jsonString);
    _request.end();
};

module.exports={
  getRandomNumber: function(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
  },
  createTimer: function(isInterval){
    return new Timer(isInterval);
  },
  getHostAndPortFromUrl: getHostAndPortFromUrl
};
