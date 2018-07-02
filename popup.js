// let changeColor = document.getElementById('changeColor');

// chrome.storage.sync.get('color', function(data) {
// changeColor.style.backgroundColor = data.color;
// changeColor.setAttribute('value', data.color);
// });

// changeColor.onclick = function(element) {
//   let color = element.target.value;
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//       chrome.tabs.executeScript(
//         tabs[0].id,
//         {code: 'document.body.style.backgroundColor = "' + color + '";'});
//     });
// };

document.addEventListener('DOMContentLoaded', documentEvents  , false);

function process_bookmarks(bookmarks) {
    // Search for bookmark folder that matches name
    let folderNames = document.getElementById("name_textbox").value.split(/[ ,]+/);
    matchedFolders = [];
    bookmarkStack = [bookmarks[0]];

    while (bookmarkStack.length > 0) {
        var bookmark = bookmarkStack.pop();
        if (folderNames.indexOf(bookmark.title) > -1) {
            console.log("matching" + bookmark.title)
            matchedFolders.push(bookmark);
            console.log(matchedFolders);
        }

        else if (bookmark.children && bookmark.children.length > 0) {
            bookmarkStack.push(...bookmark.children)
        }
    }
    console.log("MIDWAY")
    console.log(matchedFolders)
    console.log("MIDWAY")

    var unlisted = "http://www.youtube.com/watch_videos?video_ids=";
    while (matchedFolders.length > 0) {
        var bookmark = matchedFolders.pop();
        if (bookmark.children && bookmark.children.length > 0) {
            bookmarkStack.push(...bookmark.children)
        }
        else if (bookmark.url.includes("youtube.com/watch")) {
            console.log("bookmark url" + bookmark.url)
            re = /(?=youtube\.com\/watch\?v\=)[^\&]*/;
            unlisted += bookmark.url.match();
        }
    }
    console.log(unlisted);
}

function myAction(input) { 
    console.log("input value is : " + input.value);
    // do processing with data
    // you need to right click the extension icon and choose "inspect popup"
    // to view the messages appearing on the console.
    console.log("http://www.youtube.com/watch_videos?video_ids=");
    console.log("listing bookmarks: " );
    chrome.bookmarks.getTree( process_bookmarks );
}

function documentEvents() {    
  document.getElementById('ok_btn').addEventListener('click', 
    function() { myAction(document.getElementById('name_textbox'));
  });

  // you can add listeners for other objects ( like other buttons ) here 
}