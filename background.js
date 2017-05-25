let iconStatus = 1;

chrome.browserAction.onClicked.addListener((tab) => {
	// console.log("Icon status: " + iconStatus)
	if (iconStatus == 1){
		iconStatus = 0;
		chrome.browserAction.setIcon({path:"./elms_off.png"}, () => {
			console.log("I tried to turn it off.");
		});
	} else {
		iconStatus = 1;
		chrome.browserAction.setIcon({path:"./elms.png"}, () => {
			console.log("I tried to turn it on.");
		});
	}
});

chrome.webRequest.onBeforeRequest.addListener((downloadItem) => {
	if (iconStatus == 1){
		if (downloadItem.url.includes("download") && downloadItem.url.startsWith("https://myelms.umd.edu")){
			if (downloadItem.url.includes("files")){
				const downloadIndex = downloadItem.url.indexOf("download");
				const newLink = downloadItem.url.substring(0, downloadIndex);
				chrome.tabs.create({ url: newLink });
				return {redirectUrl: "javascript:"};
			} else if (downloadItem.url.includes("submissions")){
				const beginningOfFileNo = downloadItem.url.indexOf("=") + 1;
				const fileNo = downloadItem.url.substring(beginningOfFileNo);
				// The User Number starts after "submissions/" in the URL, so we add 12.
				const beginningOfUserNo = downloadItem.url.indexOf("submissions/") + 12;
				// Length of the User Number is 7.
				const endOfUserNo = beginningOfUserNo + 7;
				const userNo = downloadItem.url.substring(beginningOfUserNo, endOfUserNo);
				const newLink = "https://myelms.umd.edu/users/" + userNo + "/files/" + fileNo + "/";
				chrome.tabs.create({ url: newLink });
				return {redirectUrl: "javascript:"};
			}
		}
	}
}, {urls: ["<all_urls>"]}, ["blocking"]);