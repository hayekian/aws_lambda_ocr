# aws_lambda_ocr

WARNING... this project is more of a repertoir of AWS Lambda related functionality and examples...

It implements an AWS lambda function that automatically OCRs files/images dropped in one bucket and places them in another as text

To create a Lambda function as this one that uses native libraries used by the tesseract node module they must be included in the zip file that creates the Lambda function. You can use the linux ldd command to see a listing of libraries an executable uses. That is how I found the various libraries included here. 



