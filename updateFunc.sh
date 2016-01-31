
rm output.txt
zip -r data .
aws lambda update-function-code --function-name OCR --zip-file fileb://data.zip



