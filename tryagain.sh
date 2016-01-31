
rm output.txt
zip -r data .
aws lambda update-function-code --function-name OCR --zip-file fileb://data.zip
aws lambda invoke-async --function-name OCR --debug --invoke-args input.txt > output.txt



