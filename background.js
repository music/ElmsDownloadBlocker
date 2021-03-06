const SUBMISSION_LENGTH = 12;  // number of characters in the word "submissions/"
const USER_NO_LENGTH = 7;  // length of the user number identifier
var iconStatus = 1;

function is_elms_download(url) {
	return url.includes("download") &&
			(url.startsWith("https://umd.instructure.com") ||
			 url.startsWith("https://myelms.umd.edu"));
}

chrome.browserAction.onClicked.addListener((tab) => {
	if (iconStatus == 1){
		iconStatus = 0;
		chrome.browserAction.setIcon({path:"./elms_off.png"}, () => {});
	} else {
		iconStatus = 1;
		chrome.browserAction.setIcon({path:"./elms.png"}, () => {});
	}
});

chrome.webRequest.onBeforeRequest.addListener((downloadItem) => {
	if (iconStatus == 1) {
		if (is_elms_download(downloadItem.url)) {
			if (downloadItem.url.includes("files")){
				const downloadIndex = downloadItem.url.indexOf("download");
				const newLink = downloadItem.url.substring(0, downloadIndex);
				chrome.tabs.create({ url: newLink });
				return {redirectUrl: "javascript:"};
			} else if (downloadItem.url.includes("submissions")) {
				const beginningOfFileNo = downloadItem.url.indexOf("=") + 1;
				const fileNo = downloadItem.url.substring(beginningOfFileNo);
				// The User Number, which has 7 characters, starts after "submissions/"
				// in the URL, which has 12 characters
				const beginningOfUserNo =
						downloadItem.url.indexOf("submissions/") + SUBMISSION_LENGTH;
				const endOfUserNo = beginningOfUserNo + USER_NO_LENGTH;
				const userNo = downloadItem.url.substring(beginningOfUserNo, endOfUserNo);
				const newLink = origin + userNo + "/files/" + fileNo + "/";
				chrome.tabs.create({ url: newLink });
				return {redirectUrl: "javascript:"};
			}
		}
	}
}, {urls: ["<all_urls>"]}, ["blocking"]);