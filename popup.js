document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleButton');
    const urlInput = document.getElementById('urlInput');
    const addUrlButton = document.getElementById('addUrlButton');
  
    chrome.storage.sync.get({ blockingEnabled: false }, function(data) {
      updateButtonState(data.blockingEnabled);
    });
  
    toggleButton.addEventListener('click', function() {
      chrome.storage.sync.get({ blockingEnabled: false }, function(data) {
        const newState = !data.blockingEnabled;

        chrome.storage.sync.set({ blockingEnabled: newState }, function() {
          updateButtonState(newState);
  
          chrome.runtime.sendMessage({ blockingEnabled: newState });
        });
      });
    });
  
    addUrlButton.addEventListener('click', function() {
      const url = urlInput.value.trim(); 
  
      if (url) {
        chrome.storage.sync.get({ blockedUrls: [] }, function(data) {
          const blockedUrls = data.blockedUrls;

          blockedUrls.push(url);
  
          chrome.storage.sync.set({ blockedUrls: blockedUrls }, function() {
            chrome.runtime.sendMessage({ blockedUrls: blockedUrls });
            urlInput.value = ''; 
            alert('url registered successfully');
          });
        });
      } else {
        alert('write down url to block');
      }
    });
  
    function updateButtonState(isEnabled) {
      if (isEnabled) {
        toggleButton.textContent = 'turn off blocking';
        toggleButton.classList.remove('off');
      } else {
        toggleButton.textContent = 'turn on blocking';
        toggleButton.classList.add('off');
      }
    }
  });
  