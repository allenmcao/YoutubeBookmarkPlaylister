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

document.addEventListener('DOMContentLoaded', documentEvents, false);

function process_bookmarks(bookmarks) {
    // Search for bookmark folder that matches name
    const folderNames = document.getElementById("name_textbox").value.split(/[ ,]+/);
    const excess = document.getElementById("excess").checked
    matchedFolders = [];
    bookmarkStack = [bookmarks[0]];

    while (bookmarkStack.length > 0) {
        let bookmark = bookmarkStack.pop();
        if (folderNames.indexOf(bookmark.title) > -1) {
            matchedFolders.push(bookmark);
        }

        else if (bookmark.children && bookmark.children.length > 0) {
            bookmarkStack.push(...bookmark.children)
        }
    }

    const playlist_prefix = "http://www.youtube.com/watch_videos?video_ids=";
    let video_count = 0
    let playlist_index = 0
    let playlists = ["http://www.youtube.com/watch_videos?video_ids="]

    while (matchedFolders.length > 0) {
        let bookmark = matchedFolders.pop();
        if (bookmark.children && bookmark.children.length > 0) {
            matchedFolders.push(...bookmark.children)
        }
        else if (bookmark.url && bookmark.url.includes("youtube.com/watch")) {
            video_count += 1
            if (video_count >= 51) {
                playlists[playlist_index] += "&disable_polymer=true"
                video_count = 1
                playlist_index += 1
                playlists[playlist_index] = playlist_prefix
            }
            const re = /(?<=youtube\.com\/watch.*v\=)[^\&]*/;
            playlists[playlist_index] += bookmark.url.match(re)[0] + ",";
        }
    }
    if (excess) {
        for (var i = playlists.length - 1; i >= 0; i--) {
            chrome.tabs.create({ "active": false, url: playlists[i] });
        }
    } else {
        chrome.tabs.create({"active": false, url: playlists[0]})
    }
}

function myAction(input) { 
    // do processing with data
    // you need to right click the extension icon and choose "inspect popup"
    // to view the messages appearing on the console.
    chrome.bookmarks.getTree( process_bookmarks );
}

function documentEvents() {    
  document.getElementById('ok_btn').addEventListener('click', 
    function() { myAction(document.getElementById('name_textbox'));
  });

  // you can add listeners for other objects ( like other buttons ) here 
}