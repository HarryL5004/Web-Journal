package com.harrytleung.projects.restapijournalservice.page;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("pages")
public class Page {
    @Id private String id;
    private String title;
    private String content;
    private LocalDateTime lastUpdatedTime;
    private String journalId;

    public Page() {}

    public Page(String id, String title, String content, LocalDateTime lastUpdatedTime, String journalId) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.lastUpdatedTime = lastUpdatedTime;
        this.journalId = journalId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getLastUpdatedTime() {
        return lastUpdatedTime;
    }

    public void setLastUpdatedTime(LocalDateTime lastUpdatedTime) {
        this.lastUpdatedTime = lastUpdatedTime;
    }

    public String getJournalId() {
        return journalId;
    }

    public void setJournalId(String journalId) {
        this.journalId = journalId;
    }

    @Override
    public String toString() {
        return "Page [id=" + id + ", title=" + title + ", content=" + content + ", lastUpdatedTime=" + lastUpdatedTime
                + ", journalId=" + journalId + "]";
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        result = prime * result + ((title == null) ? 0 : title.hashCode());
        result = prime * result + ((content == null) ? 0 : content.hashCode());
        result = prime * result + ((lastUpdatedTime == null) ? 0 : lastUpdatedTime.hashCode());
        result = prime * result + ((journalId == null) ? 0 : journalId.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Page other = (Page) obj;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        if (title == null) {
            if (other.title != null)
                return false;
        } else if (!title.equals(other.title))
            return false;
        if (content == null) {
            if (other.content != null)
                return false;
        } else if (!content.equals(other.content))
            return false;
        if (lastUpdatedTime == null) {
            if (other.lastUpdatedTime != null)
                return false;
        } else if (!lastUpdatedTime.equals(other.lastUpdatedTime))
            return false;
        if (journalId == null) {
            if (other.journalId != null)
                return false;
        } else if (!journalId.equals(other.journalId))
            return false;
        return true;
    }
}
