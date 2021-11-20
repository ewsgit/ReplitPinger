import fs from "fs";
import fetch from "./fetch.js";
import express from "express";
const app = express();

var urls;
var urlsLength;
var currentUrl = 0;

// interval between pings //
var timeout = 1700000;
var times = 0;

fs.readFile("./url.json", (err, data) => {
  if (err) throw err;
  urls = JSON.parse(data);
  urlsLength = urls.length;
  main();
});

function ping(url) {
  fs.readFile("./url.json", (err, data) => {
    if (err) throw err;
    urls = JSON.parse(data);
    urlsLength = urls.length;
  });
  fetch(url)
    .then(res => res.text())
    .then(body => {
      currentUrl++;
      if (currentUrl >= urlsLength) {
        setTimeout(() => {
          currentUrl = 0;
          times++;
          ping(urls[currentUrl].url);
          console.log("pinged: " + urlsLength + " url(s), " + times + " time(s)");
        }, timeout);
      } else {
        ping(urls[currentUrl].url);
      }
    });
}

function isURL(str) {
  var urlRegex =
    "^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$";
  var url = new RegExp(urlRegex, "i");
  return str.length < 2083 && url.test(str);
}

function main() {
  ping(urls[currentUrl].url);
}

app.get("/", (req, res) => {
  fs.readFile("./index.html", (err, data) => {
    if (err) throw err;
    res.contentType("text/html");
    res.type("html");
    res.send(data);
  });
});

app.get("/add", (req, res) => {
  if (!isURL(req.query.url)) {
    return res.send("invalid url");
  }
  fs.readFile("./url.json", (err, data) => {
    if (err) throw err;
    urls = JSON.parse(data);
    urls.push({
      url: req.query.url,
    });
    fs.writeFile("./url.json", JSON.stringify(urls, null, 2), err => {
      if (err) throw err;
      res.send("Success");
			fetch(req.query.url)
				.then(res => {
					console.log("Pinged And Added " + req.query.url + " Successfully");
				})
		})
  });
});

app.listen(80, () => {
  console.log("listening on port 80");
});