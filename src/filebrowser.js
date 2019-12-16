// @flow
import {useState, useEffect, useCallback, useRef} from 'react'
import { useBlockstack, useFilesList} from 'react-blockstack'
import { saveAs } from 'file-saver'
import {fromEvent} from 'file-selector'
import { Atom, swap, useAtom, deref } from "@dbeining/react-atom"
import { without, union, nth, concat, slice, isFunction } from 'lodash'
import fp, { extend, sortedIndex, isNull, trimStart, startsWith, isNumber, compose, sortedUniqBy,
             partial, filter, flow, isEmpty, merge, split, get, assoc } from 'lodash/fp'


function useAtomState (atom) {
  // like useState
  const state = useAtom(atom)
  const setState = useCallback((value) => {
    if (isFunction(value)) {
      swap(atom, value)
    } else {
      swap(atom, () => value)
    }
  },[atom])
  return [state, setState]
}

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
    // console.log("FILES:", files, filesList)
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

const trailAtom = Atom.of({trail: []})

export function useBrowser () {
  const {trail} = useAtom(trailAtom)
  var root = (isEmpty(trail) ? [] : [...trail, ""]).join("/")
  if (root === "/"){
    console.warn("Invalid root:", root, trail)
    root = ""
  }
  return {trail, setTrail: (trail) => swap(trailAtom, (obj) => ({...obj, trail: trail})),
          root}
}

const te = str => str.replace(/\/$/, '')
const toTrail = compose(split('/'), te)

export function useItem (item) {
  const {isDir, fileName, localName, root} = item
  const {setTrail} = useBrowser()
  const action = useCallback(isDir && (() => {
    const trail = toTrail(root + localName)
    console.log("TRAIL:", trail)
    setTrail(trail)
  }), [root, localName, isDir, setTrail])
  return {openAction: action}
}

function defaultFilter (type, match) {
  return ({"start": (name) => name.startsWith(match),
           "regexp": (name) => match.exec(name)
         }[type])
}

export function useFilter (match: string) {
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

function trashItem ({userSession, item, onComplete}) {
  const {isDir, fileName, localName, root} = item
  const deleteFile = (fileName) => (
    userSession.deleteFile(fileName)
    .then(() => removeFile(fileName))
    .catch(err => console.error("Failed to delete file:", err)))
  if (isDir) {
    const isSubFile = (filepath) => filepath.startsWith(root + localName)
    const files = deref(filesAtom).filter(isSubFile)   // keep children in item instead??
    console.log("To delete:", files)
    const deleted = files.map(deleteFile)
    Promise.all(deleted).then(() => onComplete())
  } else {
    deleteFile(fileName)
    .finally(() => onComplete())
  }
}

export function useTrash (item) {
  const { userSession } = useBlockstack()
  const [state, setState] = useState(true)
  const action = useCallback(() => {
    setState(false)
    trashItem({userSession, item, onComplete: () => setState(null)})
  }, [userSession, item])
  return [state, action]
}

const canonicalFilePath = (str) => str.replace(/^\//, '');

export function useUpload (props) {
  const {allowFolders} = props || {}
  const { userSession } = useBlockstack()
  const [progress, setProgress] = useState(null)
  const {root} = useBrowser() // could be argument
  const handleUpload = (files) => {
      setProgress(0)
      files.forEach( (file, ix) => {
        console.log("UPLOAD:", file)
        const localpath = file.path ? canonicalFilePath(file.path) : file.name
        const pathname = root + localpath
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
  const fileUploaderRef = useRef(null)
  const inputProps = merge({ref: fileUploaderRef, type:"file", onChange: onFileChange,
                            style: {display: 'none'}, multiple: true, accept: "*/*"}, {})
                          //(allowFolders ? {webkitdirectory: "", mozdirectory: "", directory: ""} : {})
  const uploadAction = useCallback(() => {
    // fileUploaderRef is not reactive...
    // and may not be consistent with inputProps... so test upload if changing.
    inputProps.ref.current.click()
  }, [inputProps])
  return ({uploadAction, inputProps, handleUpload, progress})
}

const localNameFn = (start, separator) =>
  (path) => ((ix) => path.substring(start, (ix === -1) ? path.length : ix+1))
            (path.indexOf(separator, start+1))

export function useLocal (files, root) {
  const [state, setState] = useState()
  useEffect(() => {
    if (files) {
      const getLocalName = localNameFn(root.length, '/')
      const isIncluded = compose(startsWith(root), file => file.fileName)
      const uniqForDir = sortedUniqBy(compose(getLocalName, file => file.fileName))
      const makeLocalItem = (item) => {
        const localName = getLocalName(item.fileName)
        const isDir = localName && localName.endsWith('/')
        return ({...item, localName, root, isDir})
      }
      //console.log("UNIQ1:", root, localName(root.length, '/')("MVP/foo"))  // expect "foo"
      //console.log("UNIQ2:", root, localName(root.length, '/')("MVP/foo/bar")) // expect "foo/"
      const items = uniqForDir(files.filter(isIncluded))
                   .map(makeLocalItem)
      setState(items)
    } else {
      setState(null)
    }
  }, [files, root])
  return state
}

const selectedAtom = Atom.of({})

export function useSelection () {
  const state = useAtom(selectedAtom)
  const selection = state.filter()
  // incomplete
}

export function useSelected (pathname) {
  const getter = get(pathname)
  const [state, setState] = useAtomState(selectedAtom)
  const isMultiSelect = false
  const toggle = useCallback(() => {
    if (isMultiSelect) {
      setState((state) => assoc(pathname, !getter(state), state))
    } else {
      setState((state) => ({[pathname]: !getter(state)}))
    }
  }, [pathname])
  return [getter(state), toggle]
}
