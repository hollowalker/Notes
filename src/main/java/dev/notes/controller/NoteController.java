package dev.notes.controller;

import dev.notes.domain.Note;
import dev.notes.repository.WeightRepo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/notes")
public class NoteController {

    private final WeightRepo postRepo;

    @Autowired
    public NoteController(WeightRepo postRepo) {
        this.postRepo = postRepo;
    }

    @RequestMapping(method = RequestMethod.GET)
    public List<Note> list() {
        return postRepo.findAll();
    }

    @RequestMapping(method = RequestMethod.POST)
    public Note create(@RequestBody Note post) {
        return postRepo.save(post);
    }

    @RequestMapping(method = RequestMethod.PUT, value = "/{id}")
    public Note update(
            @PathVariable("id") Note postFromDb,
            @RequestBody Note post
    ) {
        BeanUtils.copyProperties(post, postFromDb, "id");
        return postRepo.save(postFromDb);
    }

    @RequestMapping(method = RequestMethod.DELETE, value = "/{id}")
    public void delete(@PathVariable("id") Note post) {
        postRepo.delete(post);
    }
}
