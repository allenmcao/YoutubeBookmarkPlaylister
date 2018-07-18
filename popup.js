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
        let bookmark = bookmarkStack.pop();
        if (folderNames.indexOf(bookmark.title) > -1) {
            console.log("matching")
            matchedFolders.push(bookmark);
            console.log(matchedFolders[0]);
        }

        else if (bookmark.children && bookmark.children.length > 0) {
            bookmarkStack.push(...bookmark.children)
        }
    }
    console.log("MIDWAY")
    console.log(matchedFolders[0])
    console.log("MIDWAY")

    const playlist_prefix = "http://www.youtube.com/watch_videos?video_ids=";
    let video_count = 0
    let playlist_index = 0
    let playlists = ["http://www.youtube.com/watch_videos?video_ids="]

    while (matchedFolders.length > 0) {
        var bookmark = matchedFolders.pop();
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
                console.log("YAY")
            }
            re = /(?<=youtube\.com\/watch.*v\=)[^\&]*/;
            playlists[playlist_index] += bookmark.url.match(re)[0] + ",";
        }
    }
    console.log(playlists)
    for (var i = 0; i < playlists.length; i++) {
        chrome.tabs.create({ "active": false, url: playlists[i] });
        // console.log("playlist no: "  + playlists[i])
    }
    // chrome.tabs.create({ "active": false, url: playlists[0] })
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