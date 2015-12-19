process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'] + ":.";
process.env.LD_LIBRARY_PATH = process.env.LAMBDA_TASK_ROOT + '/bin'+":.";
process.env.TESSDATA_PREFIX = __dirname;


console.log('running 2');
console.log(process.env['PATH']);
console.log(__dirname);


var async = require('async');
var AWS = require('aws-sdk');
var util = require('util');
var s3 = new AWS.S3();
var tesseract = require('node-tesseract');
var fs = require('fs');



exports.handler = function(event, context) {

console.log('ok');

console.log("Reading options from event:\n", JSON.stringify(event));

        var srcBucket = event.Records[0].s3.bucket.name;
        // Object key may have spaces or unicode non-ASCII characters.
    var srcKey    =
    decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
        var dstBucket = "hayekian-ocr-dest";
        var dstKey    = srcKey+".txt";


        // Infer the image type.
        var typeMatch = srcKey.match(/\.([^.]*)$/);
        if (!typeMatch) {
                console.error('unable to infer file type type for key ' + srcKey);
                return;
        }
        var imageType = typeMatch[1];
        if (imageType != "tif") {
                console.log('skipping non-tif ' + srcKey);
                return;
        }

        s3.getObject({
                     Bucket: srcBucket,
                     Key: srcKey
                                },

                        function ( err, data  )
                                {
                                console.log('got s3 file');
                                var d = new Date();
                                var n = d.getTime();
                                var fileName = n + '_' + dstKey;
                                fs.writeFile("/tmp/" + fileName, data.Body, function(err) {

                                        console.log('wrote file to temp');

                                        var options = {
                                                binary: __dirname +'/tesseract'
                                        };

                                        tesseract.process('/tmp/'+fileName ,options,function(err, text) {
                                                console.log('tess ran..text = ' + text);
                                                s3.putObject({
                                                        Bucket: dstBucket,
                                                        Key: dstKey,
                                                        Body: text,
                                                        ContentType: 'text/plain'
                                                },
                                                function(){
                                                        console.log('Finished...');
                                                        fs.unlink('/tmp/' + fileName);
                                                        });


                                        });


                                });

                        }
                        );
}
