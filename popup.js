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
    let folderName = document.getElementById("name_textbox").value.split(/[ ,]+/)
    for (var i =0; i < bookmarks.length; i++) {
        var bookmark = bookmarks[i];
        if (bookmark.url) {
            console.log("bookmark: "+ bookmark.title + " ~  " + bookmark.url);
        }

        if (bookmark.children) {
            process_bookmarks(bookmark.children);
        }
    }
}

function myAction(input) { 
    console.log("input value is : " + input.value);
    // do processing with data
    // you need to right click the extension icon and choose "inspect popup"
    // to view the messages appearing on the console.
    console.log("http://www.youtube.com/watch_videos?video_ids=")
    console.log("listing bookmarks: " );
    chrome.bookmarks.getTree( process_bookmarks );
}

function documentEvents() {    
  document.getElementById('ok_btn').addEventListener('click', 
    function() { myAction(document.getElementById('name_textbox'));
  });

  // you can add listeners for other objects ( like other buttons ) here 
}