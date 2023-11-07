package com.bdos.ssafywiki.bookmark.repository;

import com.bdos.ssafywiki.bookmark.entity.Bookmark;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    @Query("select b from Bookmark b join fetch b.document join fetch b.user where b.user.id = :userId")
    Page<Bookmark> findAllByUserId(Long userId, Pageable pageable);

    @Query("select b from Bookmark b join fetch b.document where b.document.id = :docsId")
    Optional<Bookmark> findByDocsId(Long docsId);
}