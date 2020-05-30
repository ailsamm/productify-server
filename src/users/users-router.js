const notesRouter = express.Router()
const jsonParser = express.json()

const serializeNote = note => ({
  id: note.id,
  note_name: xss(note.note_name),
  content: xss(note.content),
  folder_id: note.folder_id,
  modified: note.modified,
})

notesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    
    NotesService.getAllNotes(knexInstance)
      .then(notes => {
        res.json(notes.map(serializeNote))
      })
      .catch(next)
  })


  module.exports = notesRouter;