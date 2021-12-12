# ESPN-cricinfo-webscrapper
WebScrapper which scrapes the details of individual player using cheerio for each IPL team into xlsx files , for the entire IPL tournament


### Cheerio
* https://cheerio.js.org/
* Cheerio implements a subset of core jQuery. 
* Cheerio works with a very simple, consistent DOM model. As a result parsing, manipulating, and rendering are incredibly efficient.


#### Using xlsx module to store json data into xlsx files
* npm i xlsx for installing the module
* https://www.npmjs.com/package/xlsx

```javascript
// xlsx write functionality
* function excelWriter(filePath, json, sheetName) {
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, filePath);
}
```

```javascript

// xlsx read functionality
function excelReader(filePath, sheetName) {
    if (fs.existsSync(filePath) == false) {
        return [];
    }
    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}
```


### Screenshots
##### Final Screenshot after scraping all the data to excel files
<img width="1792" alt="image" src="https://user-images.githubusercontent.com/76193921/145710016-7d64185c-3bcb-4d44-9e88-98bad81f2178.png">

##### Data present inside excel files
<img width="1780" alt="image" src="https://user-images.githubusercontent.com/76193921/145710076-885e7cdc-c064-4d58-8a04-f151be9c0d63.png">
