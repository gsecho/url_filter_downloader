/*
Author: Chuantong.Huang@gmail.com

    MP3 Dowloader
*/

// html5 filesystim API: http://www.html5rocks.com/en/tutorials/file/filesystem/
window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

function download(opt, url){
    where='\tonCompleted'
    console.log(where, url)
    if('done'===localStorage.getItem(url)){
        console.log('Has downloaded.',url)
        return 
    }

    chrome.downloads.search({url:url},
    function(items){
        if (items.length > 0){
            console.log(where, items)
            console.log(where, "file[", url ,"] was download yet. Do nothing.")
            return
        }
        console.log(where, "start an donwload task of:", url)
        
        end = url.indexOf('?')
        end = end ==-1 ? url.length : end
        var filename = url.substring(url.lastIndexOf('/')+1, end);
        var option = {
                url: url,
                conflictAction: "overwrite",
                filename: opt.save_dir + filename, 
                saveAs:false,
                method:'GET'
            }
        // begin to donwload
        chrome.downloads.download(option)
        localStorage.setItem(url, 'done')
    })
}

callbackFunc = function(opt){
    function callback(details){
        var url = details.url;

        if(! opt.file_extends.test(url) ){
            //console.log("file extensions not match", url)
            return;
        }
        console.log("Finish URL:", url)
        console.log(details)
        // TODO: used the responseHeader Content-Disposition: inline; filename="4ec4%2F6198%2F1a..." as filename
        var find_content_length_header = false
        for (var i = 0; i < details.responseHeaders.length; ++i) {
            //# maybe didn't had the header of 'Content-Length'.
            if (details.responseHeaders[i].name.toLowerCase() === 'content-length') {
                find_content_length_header = true
                var contentLength = parseInt(details.responseHeaders[i].value);
                if (isNaN(contentLength) || contentLength < opt.mini_content_length ){
                    // console.log(opt, "File mini setting was =[",opt.mini_content_length, 
                    //     "], now response-length=", contentLength, url)
                    return;
                }
                break;
            }
        }

        if (find_content_length_header){
            download(opt, url)
        } else{
            download(opt, url)
            console.log("Did not know the content-length, also download URL", url)
        }
    }
    return callback;
}
// 只监听mp3文件
// filter = {urls:["*://*/*.mp3"]} the URL patterns Format:https://developer.chrome.com/extensions/match_patterns
// for testing debug
//chrome.webRequest.onCompleted.addListener(callbackFunc(getOption()), {urls: ["<all_urls>"]}, ["responseHeaders"]);

var global_callback_function = null;

function init_donwloader(opt){
    opt.file_extends = new RegExp(opt.file_extends)

    if (global_callback_function != null){
        chrome.webRequest.onCompleted.removeListener(global_callback_function)
        console.log('removeListener.')
    }

    if(opt.enable_me) {
        global_callback_function = callbackFunc(opt)
        chrome.webRequest.onCompleted.addListener(global_callback_function, 
            {urls: [opt.domain_urls]},
            ["responseHeaders"]
        );
    }
}

chrome.extension.onRequest.addListener(function(request, sender, callback) {
    console.log("background.js get command request:", request)
    var opt = request
    init_donwloader(opt)
});

var plugin_key ="chuantong.huang@gmail.com-donwloader"
var opt = JSON.parse(localStorage.getItem(plugin_key));
if(opt.enable_me) {
    init_donwloader(opt)
}