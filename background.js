chrome.runtime.onInstalled.addListener(() => {
  // 확장 프로그램 설치 시 기본 차단 상태와 차단 목록을 초기화
  chrome.storage.sync.set({ blockingEnabled: false, blockedUrls: [] });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.blockingEnabled !== undefined) {
    // 차단 상태 변경 시
    if (message.blockingEnabled) {
      enableBlocking();
    } else {
      disableBlocking();
    }
  }

  if (message.blockedUrls) {
    // 차단할 URL 목록이 업데이트된 경우
    updateBlockingRules(message.blockedUrls);
  }
});

// 차단 규칙 적용 함수
function enableBlocking() {
  chrome.storage.sync.get({ blockedUrls: [] }, function(data) {
    updateBlockingRules(data.blockedUrls);
  });
}

// 차단 규칙 제거 함수
function disableBlocking() {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1, 2, 3, 4, 5]  // 차단 규칙 제거 (이전에 사용한 ID 제거)
  }, () => {
    console.log('Blocking disabled');
  });
}

// 차단 규칙 업데이트 함수
function updateBlockingRules(urls) {
  const rules = urls.map((url, index) => ({
    id: index + 1,
    priority: 1,
    action: { type: "block" },
    condition: { urlFilter: url, resourceTypes: ["main_frame"] }
  }));

  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: rules,
    removeRuleIds: rules.map(rule => rule.id)  // 기존에 있던 동일 ID 규칙 삭제 후 추가
  }, () => {
    console.log('Blocking rules updated');
  });
}
