import {useState, useEffect, useCallback, useRef} from 'react'
import { useBlockstack, useFilesList} from 'react-blockstack'
import { saveAs } from 'file-saver'
import {fromEvent} from 'file-selector'
import { Atom, swap, useAtom } from "@dbeining/react-atom"
import { without, union } from 'lodash'

const matchAtom = Atom.of({match: ""})

export function useMatchGlobal() {
  const setMatch = (match) => swap(matchAtom, state => ({...state, match:match}))
  const {match} = useAtom(matchAtom)
  return [match, setMatch]
}

const uploadAtom = Atom.of([])

function insertFile (file) {
  swap(uploadAtom, files => union(files, [file]))
}

function removeFile (file) {
  swap(uploadAtom, files => {
    return (without(files, file))
  })
}

export function useFiles() {
  console.log("Load files")
  const uploaded = useAtom(uploadAtom)
  const [files] = useFilesList()
  return ([...uploaded, ...files])
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

export function useUpload () {
  const { userSession } = useBlockstack()
  const handleUpload = (files) => {
      files.forEach( (file) => {
          const name = file.name
          const pathname = name
          const reader = new FileReader()
          reader.onload = () => {
            const content = reader.result
            userSession.putFile(pathname, content)
            .then(() => insertFile(pathname))
            .catch(err => console.warn("Failed to upload file:", err))
          }
        reader.readAsArrayBuffer(file)
        }
    )}
  const onFileChange = (evt) => {
        fromEvent(evt).then(handleUpload)
      }
  const fileUploader = useRef(null)
  const inputProps = {ref: fileUploader, type:"file", onChange: onFileChange, style:{display: 'none'}}
  const uploadAction = () => {
      fileUploader.current.click()
    }
  return ({uploadAction, inputProps, handleUpload})
}
