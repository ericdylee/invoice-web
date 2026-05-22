# Slack Webhook URL 설정 방법

`settings.local.json`의 `env.SLACK_WEBHOOK_URL` 값을 채워주세요.

## 발급 순서

1. https://api.slack.com/apps 접속
2. **Create New App** → **From scratch** 클릭
3. 앱 이름 입력 후 알림 받을 워크스페이스 선택
4. 좌측 메뉴에서 **Incoming Webhooks** 클릭
5. **Activate Incoming Webhooks** 토글 ON
6. **Add New Webhook to Workspace** 클릭
7. 알림을 받을 채널 선택 후 **Allow**
8. 생성된 URL 복사 (`https://hooks.slack.com/services/T.../B.../...`)

## 설정 위치

`.claude/settings.local.json` 파일의 아래 부분에 붙여넣기:

```json
"env": {
  "SLACK_WEBHOOK_URL": "여기에 붙여넣기"
}
```

## 훅 동작

- **Notification hook** (`.claude/hooks/notification-hook.sh`): Claude가 작업 중 알림이 필요할 때 Slack으로 전송
- **Stop hook** (`.claude/hooks/stop-hook.sh`): Claude가 작업을 완료했을 때 Slack으로 전송
