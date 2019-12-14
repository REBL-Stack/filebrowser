import {useState, useEffect, useCallback, useRef} from 'react'
import { useBlockstack, useFilesList} from 'react-blockstack'
import { saveAs } from 'file-saver'
import {fromEvent} from 'file-selector'
import { Atom, swap, useAtom } from "@dbeining/react-atom"
import { without, union, nth, concat, slice } from 'lodash'
import fp, { extend, sortedIndex, isNull, trimStart } from 'lodash/fp'

// PR is on way in lodash after 4.17
const insert = (arr, item, index) => concat(slice(arr, 0, index), item, slice(arr, index))

const matchAtom = Atom.of({match: ""})

export function useMatchGlobal() {
  const setMatch = (match) => swap(matchAtom, state => ({...state, match:match}))
  const {match} = useAtom(matchAtom)
  return [match, setMatch]
}

const filesAtom = Atom.of([]) // file paths

export function useFiles() {
  const [state, setState] = useState()
  const files = useAtom(filesAtom)
  const [filesList, filecount] = useFilesList()
  useEffect(() => {
    swap(filesAtom, () => filesList)
  }, [filesList])
  useEffect(() => {
    // TODO: Reuse existing file objects
    setState(files.map((name) => ({fileName: name, fileSize: 0})))
  },[files])
  return [state, !isNull(filecount)]
}

function insertFile (file) {
  swap(filesAtom, (files) => {
    const index = sortedIndex(file, files)
    return( (nth(files, index) === file) ? files : insert(files, file, index) )
    //union(files, [file])
  })
}

function removeFile (file) {
  swap(filesAtom, (files) => without(files, file))
}

export function useBrowser () {

}

function defaultFilter (type, match) {
  return ({"start": (name) => name.startsWith(match),
           "regexp": (name) => match.exec(name)
         }[type])
}

export function useFilter (match) {
  const [reg, setReg] = useState()
  useEffect( () => {
     try {
       setReg(new RegExp(match) )
     }
     catch {
       setReg(null)
     }
  }, [match])
  const filter = useCallback(reg && defaultFilter("regexp", reg ), [reg])
  return ([filter])
}

export function useSave(content, filepath, onCompletion) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
          if (content) {
            setProgress(30)
            const blob =  (content && !(content instanceof Blob)) // always text?
                        ? new Blob([content], {type: "text/plain;charset=utf-8"})
                        : content
            setProgress(60)
            saveAs(blob, filepath)
            setProgress(100)
          }
        }, [content, filepath])
  useEffect(() => {
    if (progress === 100 && onCompletion) {
      onCompletion()}
    }, [progress, onCompletion])
  return {progress: progress, saved: progress === 100}
}

export function useTrash (filepath) {
  const { userSession } = useBlockstack()
  const [state, setState] = useState(true)
  const action = useCallback(() => {
    userSession.deleteFile(filepath)
    .then(() => {
      setState(null)
      removeFile(filepath)
    })
    .catch(err => console.error("Failed to delete file:", err))
  }, [userSession, filepath])
  return [state, action]
}

const canonicalFilePath = (str) => str.replace(/^\//, '');

export function useUpload () {
  const { userSession } = useBlockstack()
  const [progress, setProgress] = useState(null)
  const handleUpload = (files) => {
      setProgress(0)
      files.forEach( (file, ix) => {
        console.log("UPLOAD:", file)
        const pathname = file.path ? canonicalFilePath(file.path) : file.name
        const reader = new FileReader()
        reader.onload = () => {
          const content = reader.result
          userSession.putFile(pathname, content)
          .then(() => insertFile(pathname))
          .then(() => setProgress((progress) => progress && (progress + (1 / files.length) )))
          .catch(err => console.warn("Failed to upload file:", err))
          .finally(() => {if (ix === files.length-1) {setProgress(null)}})
        }
      reader.readAsArrayBuffer(file)
      }
    )}
  const onFileChange = (evt) => {
        fromEvent(evt).then(handleUpload)
      }
  const fileUploader = useRef(null)
  const inputProps = {ref: fileUploader, type:"file", onChange: onFileChange,
                      style: {display: 'none'}, multiple: true, accept: "*/*",
                      webkitdirectory: "", mozdirectory: "", directory: ""}
  const uploadAction = () => {
      fileUploader.current.click()
    }
  return ({uploadAction, inputProps, handleUpload, progress})
}
