import fs from 'fs'
import fetch from './fetch.js'

var urls;
var urlsLength;
var currentUrl = 0;

	// interval between pings //
	var timeout = 25000;

var out = `Pinging `;
var times = 0;

fs.readFile("./url.json", (err, data) => {
	if (err) throw err;
	urls = JSON.parse(data);
	urlsLength = urls.length;
	for (let i = 0; i < urlsLength; i++) {
		if (i == urlsLength - 1) {
			out += urls[ i ].url
		} else {
			out += urls[ i ].url + ", ";
		}
	}
	console.log(out)
	main();
})


function ping(url) {
	fetch(url)
	.then(res => res.text())
	.then(body => {
			currentUrl++;
			if (currentUrl >= urlsLength) {
				setTimeout(() => {
					currentUrl = 0;
					times++
					ping(urls[ currentUrl ].url);
					console.log("pinged: " + urlsLength + " url(s), " + times + " time(s)")
				}, timeout);
				} else {
				ping(urls[ currentUrl ].url);
			}
		})
}

function main() {
	ping(urls[ currentUrl ].url)
}