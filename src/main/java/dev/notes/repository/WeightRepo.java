package dev.notes.repository;

import dev.notes.domain.Note;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WeightRepo extends JpaRepository<Note, Long> {
}
