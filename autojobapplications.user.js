// ==UserScript==
// @name         Auto-saving Job Applications
// @namespace    sarcasmappreciated_projects
// @version      1.0
// @description  Saving applications
// @author       sarcasmappreciated
// @include      /https:\/\/.*(greenhouse).*/
// @downloadURL  https://github.com/SarcasmAppreciated/save-job-application-info-script/raw/mainline/autojobapplications.user.js
// @updateURL    https://github.com/SarcasmAppreciated/save-job-application-info-script/raw/mainline/autojobapplications.user.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @require      https://raw.githubusercontent.com/eligrey/FileSaver.js/master/dist/FileSaver.js
// ==/UserScript==
(function() {
    "use strict";
    const buffer = "buffer";
    const flushNow = "flushNow";
    const getWebData = () => {
        const websiteTitle = document.getElementsByTagName("title")[0].innerHTML;
        const jobTitle = websiteTitle.match(new RegExp(/(Senior\s)?(Software\s(Development\s)?Engineer).*/));
        const urlLocation = window.location.href;
        if (jobTitle && urlLocation) {
            const newJob = {
                title: jobTitle[0],
                url: urlLocation,
                date: new Date().toString()
            };
            GM_setValue(buffer, newJob);
            GM_setValue(flushNow, false);
            const listener = GM_addValueChangeListener (
                flushNow, (keyName, oldValue, newValue, bRmtTrggrd) => {
                // console.log(`Received new event: ${newValue}`);
                const job = GM_getValue(buffer, null);
                if (newValue === true && job) {
                    setTimeout ( () => {
                        const date = job.date.split(" ");
                        const formattedJob = [date[1], date[2], date[3], date[4], job.title, job.url].join(" ");
                        const fileName = [job.title.replace(/[^a-zA-Z]/g, "_"), date[1], date[2], date[3], ".txt"].join("_");
                        const blob = new Blob([formattedJob], {type: "text/plain;charset=utf-8"});
                        saveAs(blob, fileName);
                        GM_setValue(flushNow, false);
                        GM_setValue(buffer, null);
                        GM_removeValueChangeListener(listener);
                    }, 1222);
                }
            });
        }
    }

    const applyWithLinkedIn = new RegExp(/(https:\/\/www.linkedin.com\/xdoor\/widgets\/user\/session.html).*(boards.greenhouse.io)/);
    if (applyWithLinkedIn.test(window.location.href)) {
        GM_setValue(flushNow, true);
    } else {
        getWebData();
    }
})();