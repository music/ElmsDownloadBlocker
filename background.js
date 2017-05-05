var iconStatus = 1;

chrome.browserAction.onClicked.addListener((tab) => {
	// console.log("Icon status: " + iconStatus)
	if (iconStatus == 1){
		iconStatus = 0;
		chrome.browserAction.setIcon({path:"./elms_off.png"}, () => {
			console.log("I tried to turn it off.")
		});
	} else {
		iconStatus = 1;
		chrome.browserAction.setIcon({path:"./elms.png"}, () => {
			console.log("I tried to turn it on.")
		});
	}
});

chrome.webRequest.onBeforeRequest.addListener((downloadItem) => {
	if (iconStatus == 1){
		if (downloadItem.url.includes("download") && downloadItem.url.startsWith("https://myelms.umd.edu")){
			var downloadIndex = downloadItem.url.indexOf("download");
			var newLink = downloadItem.url.substring(0, downloadIndex);
			return {redirectUrl: newLink};
		}
	}
}, {urls: ["<all_urls>"]}, ["blocking"]);