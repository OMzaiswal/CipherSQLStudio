"use client"

import { useState } from "react"

const { Editor } = require("@monaco-editor/react")

const SqlEditor = () => {

    const [query, setQuery] = useState('');

    const runQuery = () => {
        console.log(query)
    }

    return (
        <div>
            <Editor 
            height='50vh'
            defaultLanguage="sql"
            defaultValue="// Write your query here"
            theme="vs-dark"
            onChange={(value) => setQuery(value) }
            />

            <button
            >
                Run Query
            </button>
        </div>
    )
}

export default SqlEditor;
