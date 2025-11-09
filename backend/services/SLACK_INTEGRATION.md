# Slack Integration

This service automatically sends AI-generated project reports to Slack after analysis is complete.

## How It Works

1. User submits requirements via `/api/v1/requirements/submit`
2. Backend generates 3 reports (Functionality, Cost, Market Analysis)
3. Reports are saved to `project_analysis` table
4. **Automatically** sends formatted summary to Slack channel `#report_ai`

## Setup

### 1. Environment Variables

Add these to your `backend/.env`:

```env
# MCP Slack endpoint
MCP_SLACK_REPORTS_URL=http://localhost:3001/slack/post-message

# Optional auth token
MCP_SLACK_AUTH_TOKEN=

# Target channel (use ID for reliability)
SLACK_REPORTS_CHANNEL_ID=C09SLDMFQQY
SLACK_REPORTS_CHANNEL_NAME=report_ai

# Slack Bot Token (from OAuth & Permissions)
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
```

### 2. MCP Slack Server

You need an MCP Slack server running that accepts POST requests:

**Endpoint:** `POST /slack/post-message`

**Request Body:**
```json
{
  "channel": "C09SLDMFQQY",
  "text": "Message content here..."
}
```

**Response:**
```json
{
  "ok": true
}
```

### 3. Slack App Permissions

Your Slack app needs these OAuth scopes:
- `chat:write` - Post messages to channels
- `channels:read` - View basic channel info

## Message Format

The Slack message includes:

1. **Header** - Project name, company, budget, timeline
2. **Functional Overview** - Summary + key epics
3. **Cost & Effort Overview** - Summary + cost epics
4. **Market & Business Context** - Summary + market epics
5. **Suggested Jira Tickets** - Top 10 draft tickets

## Testing

### Manual Test

```bash
node backend/services/slack.service.js <project_id>
```

### Via API

The Slack notification happens automatically after successful analysis.

## Troubleshooting

### "MCP_SLACK_REPORTS_URL not set"
- Add the URL to your `.env` file
- Restart the backend server

### "MCP Slack post failed: HTTP 401"
- Check your `MCP_SLACK_AUTH_TOKEN`
- Verify your Slack bot token is valid

### "No matching project + company + project_analysis found"
- Ensure all 3 reports are generated before Slack notification
- Check the `project_analysis` table has data for that project

### Messages not appearing in Slack
- Verify the channel ID is correct
- Check bot is invited to the channel
- Review MCP server logs

## Non-Blocking

The Slack notification is **non-blocking** - if it fails, the API request still succeeds. Check server logs for Slack errors.
