package com.bdos.ssafywiki.revision.dto;

import com.bdos.ssafywiki.document.dto.DocumentDto;
import com.bdos.ssafywiki.document.entity.Document;
import com.bdos.ssafywiki.user.dto.UserDto;
import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;

public class RevisionDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @ToString
    @Builder
    public static class Response {
        private Long docsId;
        private String author;
        private String title;
        private String content;
        private boolean deleted;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @ToString
    public static class Version{
        private Long id;
        private Long number;
        private Long diffAmount;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;
        private String comment;
        private Long originId;
        private Long originNumber;
        private UserDto.Version user;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @ToString
    public static class Detail{
        private Long id;
        private Long number;
        private String content;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;
        private DocumentDto.Detail document;
    }
}