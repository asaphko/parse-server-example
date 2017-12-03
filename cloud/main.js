
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.job("sendPush", function (request, response) {
    // create new config:
    var ConfigObject = Parse.Object.extend('ConfigObject');
    var object = new ConfigObject();
    object.set('locked', true);
    object.set('triggered', true);
    object.set('notified', true);
    object.save();

    var jsonBody = {
        app_id: process.env.ONESIGNAL_ID,
        included_segments: ["All"],
        contents: {en: "TRACKSi Alert!"},
        data: {foo: "bar"}
    };

    Parse.Cloud.httpRequest({
         method: "POST",
         url: "https://onesignal.com/api/v1/notifications",
         headers: {
           "Authorization": "Basic " + process.env.ONESIGNAL_KEY,
           "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify(jsonBody),
        success: function (httpResponse) {
                 console.log(httpResponse.text);
                 response.success(httpResponse);
        },
        error:function (httpResponse) {
                 console.error('Request failed with response code ' + httpResponse.status);
                 response.error(httpResponse.status);
        }

     });
});

Parse.Cloud.job("lock", function (request, response) {
    // create new config in locked mode:
    var ConfigObject = Parse.Object.extend('ConfigObject');
    var object = new ConfigObject();
    object.set('locked', true);
    object.set('triggered', false);
    object.set('notified', false);
    object.save();
});

Parse.Cloud.job("unlock", function (request, response) {
    // create new config in locked mode:
    var ConfigObject = Parse.Object.extend('ConfigObject');
    var object = new ConfigObject();
    object.set('locked', false);
    object.set('triggered', false);
    object.set('notified', false);
    object.save();
});

Parse.Cloud.job("trigger", function (request, response) {
    // create new config in locked mode:
    var ConfigObject = Parse.Object.extend('ConfigObject');
    var object = new ConfigObject();
    object.set('locked', true);
    object.set('triggered', true);
    object.set('notified', false);
    object.save();
});
