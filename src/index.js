import React from 'react'
import ReactDOM from 'react-dom'
import ReactBlockstack from 'react-blockstack'
import { AppConfig } from 'blockstack'
import App from './App'
import Auth from './Auth'
import Search from './Search'
import Upload from './Upload'

// Require Sass file so webpack can build it
//import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-material-design/dist/css/bootstrap-material-design.css'
import './styles/style.css'

const appConfig = new AppConfig()
const blockstack = ReactBlockstack(appConfig)

ReactDOM.render(<App/>, document.getElementById('App'))
// ReactDOM.render(<Upload/>, document.getElementById('Upload'))
ReactDOM.render(<Search/>, document.getElementById('Search'))
ReactDOM.render(<Auth/>, document.getElementById('Auth'))
