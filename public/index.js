let title = $('#bookmark-title-input');
let url = $('#bookmark-url-input');
let folder = $('#bookmark-folder-input');
let newFolder = $('#new-folder-input');

const showFolders = () => {
  document.querySelector('#main-folder-display').innerHTML = '';
  var hitAPI = new XMLHttpRequest();
  hitAPI.open('GET', '/api/folders', true);
  hitAPI.send();
  hitAPI.onreadystatechange = function() {
    if (hitAPI.readyState === XMLHttpRequest.DONE) {
      if (hitAPI.status === 200) {
        let result = JSON.parse(hitAPI.responseText);
        $('#section-title').html('<h2>Folders: </h2>');
        document.querySelector('#bookmark-folder-input').innerHTML = '';

        let defaultOption = document.createElement('OPTION');
        let text = document.createTextNode('Folder Name for this Bookmark');

        defaultOption.appendChild(text);
        document.querySelector('#bookmark-folder-input').appendChild(defaultOption);
        for (var i = 0; i < result.length; i++) {
          let opt = document.createElement('OPTION');
          opt.value = result[i].folderTitle;
          let text1 = document.createTextNode(result[i].folderTitle);
          opt.appendChild(text1);
          document.querySelector('#bookmark-folder-input').appendChild(opt);
          $('#main-folder-display').append(`
            <div>
            <h3 onClick="showURLs('${result[i].folderTitle}')">${result[i].folderTitle}
            </div>
            `);
        }
      } else {
        console.error('There was a problem with the API call.');
      }
    }
  }
}

const showURLs = (folderTitle) => {
  document.querySelector('#main-folder-display').innerHTML = '';
  var hitAPI = new XMLHttpRequest();
  hitAPI.open('GET', `/api/folders/${folderTitle}/urls`, true);
  hitAPI.send();
  hitAPI.onreadystatechange = function() {
    if (hitAPI.readyState === XMLHttpRequest.DONE) {
      if (hitAPI.status === 200) {
        let result = JSON.parse(hitAPI.responseText);
        $('#back-button').html(`<button onClick="showFolders()">Go Back</button>`);
        $('#main-folder-display').append(`
          <button onClick="sortByPopularity('ascending', '${folderTitle}')">Sort by Popularity--Ascending</button>
        `);
        let urls = result.map((url) => {
          const longURL = url.longURL;
          const urlID = url.id;
          const folderTitle = url.parentFolder;
          const createdAt = url.created_at.slice(0,10);
          $('#section-title').html(`<h2>Selected Folder: ${url.parentFolder}</h2>`);
          $('#main-folder-display').append(`
            <div class="url-container">
            <p id="${url.id}"
            class="${url.parentFolder}
            clickable-link"
            >
            <p class="short-url" onClick="goToRealURL('${longURL}', '${urlID}', '${folderTitle}')">${url.shortURL}<p>
            </p>
            <p> Date added: ${createdAt} </p>
            <p>Times visited: ${url.clickCount}</p>
            </div>
            `);
        })
      } else {
        console.error('There was a problem with the API call.');
      }
    }
  }
}

const increaseClickCount = (longURL, urlID, folderTitle) => {
  axios.get(`/api/folders/${folderTitle}/urls/${urlID}`)
}

const goToRealURL = (longURL, urlID, folderTitle) => {
  let windowObjectReference;
    windowObjectReference = window.open(`${longURL}`)
  increaseClickCount(longURL, urlID, folderTitle);
}

showFolders();

const saveURL = () => {
  let longURL = $('#bookmark-url-input').val();
  let parentFolder = $('#bookmark-folder-input').val();
  let validation = /http(s?):\/\/+/;
  if (!longURL.match(validation)) {
    alert('Please enter in a valid URL containing http:// or https://.');
    return;
  }
  if (parentFolder === 'Folder Name for this Bookmark') {
    alert('Your entry must include a folder name.');
    return;
  }
  setEphemeralNotification(longURL);
  axios.post('/api/folders/${folderTitle}/urls', {
    longURL,
    parentFolder,
    folder_id: 1167,
    clickCount: 0,
    requestType: 'bookmark-update',
  })
}

const setEphemeralNotification = (url) => {
  $('#ephemeral-notification').text(`You have added the following bookmark: ${url}.`).fadeIn();
  setTimeout(() => {
    $('#ephemeral-notification').fadeOut(5000);
  }, 500);
}

const saveFolder = () => {
  let folderTitle = newFolder.val();
  if (!folderTitle) {
    alert('You must add a folder name.');
    return;
  }
  axios.post('/api/folders', {
    folderTitle,
    requestType: 'folder-update',
  })
}

const sortByPopularity = (direction, folderTitle) => {
  console.log(folderTitle);
  document.querySelector('#main-folder-display').innerHTML = '';
  $('#main-folder-display').append(`
    <h3>
    ${folderTitle}
    </h3>
    `)
  var hitAPI = new XMLHttpRequest();
  hitAPI.open('GET', `/api/folders/${folderTitle}/urls`, true);
  hitAPI.send();
  hitAPI.onreadystatechange = function() {

    if (hitAPI.readyState === XMLHttpRequest.DONE) {
      if (hitAPI.status === 200) {
        let result = JSON.parse(hitAPI.responseText);
        let sortedURLs;
        if (direction === 'ascending') {
          sortedURLs = result.sort((a, b) => {
            return a.clickCount - b.clickCount
          });
        } else if (direction === 'descending') {
          sortedURLs = result.sort((a, b) => {
            return b.clickCount - a.clickCount
          });
        }
        let urls = sortedURLs.map((url) => {
          let longURL = url.longURL;
          let urlID = url.id;
          let folderName = url.parentFolder;
          const createdAt = url.created_at.slice(0,10);
          $('#main-folder-display').append(`
            <div">
            <p class="short-url" onClick="goToRealURL('${longURL}', '${urlID}')">${url.shortURL}<p>
            <p> Date added: ${createdAt}</p>
            <p>Times visited: ${url.clickCount}</p>
            </div>
            `);
        })
      } else {
        console.error('There was a problem with the API call.');
      }
    }
  }
}

const sortByDate = (direction, folderTitle) => {
  document.querySelector('#main-folder-display').innerHTML = '';
  $('#main-folder-display').append(`
    <h3>
    ${folderTitle}
    </h3>
    `)
  var hitAPI = new XMLHttpRequest();
  hitAPI.open('GET', `/api/folders/${folderTitle}/urls`, true);
  hitAPI.send();
  hitAPI.onreadystatechange = function() {
    if (hitAPI.readyState === XMLHttpRequest.DONE) {
      if (hitAPI.status === 200) {
        let result = JSON.parse(hitAPI.responseText);
        let sortedURLs;
        if (direction === 'ascending') {
          sortedURLs = result.sort((a, b) => {
            return a.rawDate - b.rawDate;
          });
        } else if (direction === 'descending') {
          sortedURLs = result.sort((a, b) => {
            return b.rawDate - a.rawDate;
          });
        }
        let urls = sortedURLs.map((url) => {
          let longURL = url.longURL;
          let urlID = url.id;
          const createdAt = url.created_at.slice(0,10);
          $('#main-folder-display').append(`
            <div">
            <p class="short-url" onClick="goToRealURL('${longURL}', '${urlID}')">${url.shortURL}<p>
            <p> Date added: ${createdAt}</p>
            <p>Number of visits for this URL: ${url.clickCount}</p>
            </div>
            `);
        })
      } else {
        console.error('There was a problem with the API call.');
      }
    }
  }
}


$('#submit-button').on('click', () => {
  saveURL();
  setTimeout(showFolders, 300);
  showFolders();
})

$('#create-folder-button').on('click', () => {
 saveFolder();
 setTimeout(showFolders, 300);
 showFolders();
})
