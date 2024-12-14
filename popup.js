document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleButton');
    const urlInput = document.getElementById('urlInput');
    const addUrlButton = document.getElementById('addUrlButton');
  
    // 스토리지에서 현재 차단 상태 가져오기
    chrome.storage.sync.get({ blockingEnabled: false }, function(data) {
      updateButtonState(data.blockingEnabled);
    });
  
    // 차단 상태 토글
    toggleButton.addEventListener('click', function() {
      chrome.storage.sync.get({ blockingEnabled: false }, function(data) {
        const newState = !data.blockingEnabled;
  
        // 새로운 상태 저장
        chrome.storage.sync.set({ blockingEnabled: newState }, function() {
          updateButtonState(newState);
  
          // 백그라운드 스크립트로 메시지 보내기
          chrome.runtime.sendMessage({ blockingEnabled: newState });
        });
      });
    });
  
    // URL 추가 버튼 클릭 시 동작
    addUrlButton.addEventListener('click', function() {
      const url = urlInput.value.trim(); // 입력된 URL
  
      if (url) {
        // 스토리지에서 현재 저장된 URL 목록 가져오기
        chrome.storage.sync.get({ blockedUrls: [] }, function(data) {
          const blockedUrls = data.blockedUrls;
  
          // 입력된 URL을 차단 목록에 추가
          blockedUrls.push(url);
  
          // 새 차단 목록 저장
          chrome.storage.sync.set({ blockedUrls: blockedUrls }, function() {
            // 백그라운드 스크립트로 차단 목록 업데이트 메시지 보내기
            chrome.runtime.sendMessage({ blockedUrls: blockedUrls });
            urlInput.value = ''; // 입력 필드 초기화
            alert('url registered successfully');
          });
        });
      } else {
        alert('write down url to block');
      }
    });
  
    // 버튼 상태와 텍스트를 업데이트하는 함수
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
  