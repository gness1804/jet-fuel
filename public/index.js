let title = $('#bookmark-title-input');
let url = $('#bookmark-url-input');
let folder = $('#bookmark-folder-input');
let newFolder = $('#new-folder-input');

const makeAPICall = () => {
  var hitAPI = new XMLHttpRequest();
  hitAPI.open('GET', '/bookmarks', true);
  hitAPI.send();
  hitAPI.onreadystatechange = function() {
    if (hitAPI.readyState === XMLHttpRequest.DONE) {
      if (hitAPI.status === 200) {
        document.querySelector('#bookmark-folder-input').innerHTML = '';

        let defaultOption = document.createElement('OPTION');
        let text = document.createTextNode('Folder Name for this Bookmark');

        defaultOption.appendChild(text);
        document.querySelector('#bookmark-folder-input').appendChild(defaultOption);
        for (let prop in JSON.parse(hitAPI.responseText)) {
          let opt = document.createElement('OPTION');
          opt.value = prop;
          let text1 = document.createTextNode(prop);
          opt.appendChild(text1);
          document.querySelector('#bookmark-folder-input').appendChild(opt);
        }
        console.log('The server response', JSON.parse(hitAPI.responseText));
      } else {
        console.error('There was a problem with the API call.');
      }
    }
  }
}

function fetchDisplay() {
  var hitAPI = new XMLHttpRequest();
  hitAPI.open('GET', '/bookmarks', true);
  hitAPI.send();
  hitAPI.onreadystatechange = function() {
    if(hitAPI.readyState === XMLHttpRequest.DONE) {
      if (hitAPI.status === 200) {
        let response = JSON.parse(hitAPI.responseText)

        let folderTitles = Object.keys(response);
        let folders = response[folderTitles];

        $.each(response, function(folderTitle, value) {
          // console.log(Object.keys(value))
          // console.log('folderTitle', value.folderTitle)
          var folderTitle = $(`<li class='folder-li'>` + folderTitle + `</li>`)
          $('#folders-list').append(folderTitle)
          // console.log('urlssss', value.urls)
          let urls = value.urls.map((url) => {
            $.each(url, function(a, b) {
              // console.log('key:', a, 'value:', b)
              if(a==='longURL'){
                console.log('val', b)
                folderTitle.append(b)
              }
            })
          });
        })
      }
    }
  }
}

// displayFolders() {
//   console.log('display')
// }



makeAPICall();
fetchDisplay();
//TODO look up IIFEs in ES6

const saveURL = () => {
  axios.post('/bookmarks', {
    link: url.val(),
    parentFolder: folder.val(),
    bookmarkId: Math.floor(((Date.now()) / 1000000000) * Math.random()),
    dateAddedRaw: Date.now(),
    dateAddedHumanReadable: new Date(),
    clickCount: 0,
    requestType: 'bookmark-update',
  })
}

const saveFolder = () => {
  axios.post('/bookmarks', {
    folderTitle: newFolder.val(),
    folderId: Math.floor(((Date.now()) / 1000000000) * Math.random()),
    requestType: 'folder-update',
  })
}

//create bookmarks
$('#submit-button').on('click', () => {
  saveURL();
  setTimeout(makeAPICall, 300);
  makeAPICall();
})

//create folders
$('#create-folder-button').on('click', () => {
 saveFolder();
 setTimeout(makeAPICall, 300);
 makeAPICall();
})
