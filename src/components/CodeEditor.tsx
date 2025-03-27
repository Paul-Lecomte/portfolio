import Editor from "@monaco-editor/react";

const CodeEditor = ({ file, onSave }: { file: any; onSave: (id: number, content: string) => void }) => {
    const handleEditorChange = (value: string | undefined) => {
        if (file) {
            onSave(file.id, value || "");
        }
    };

    return (
        <div className="w-full h-full">
            <Editor
                height="100%"
                defaultLanguage="javascript"
                defaultValue={file?.content || ""}
                theme="vs-dark"
                onChange={handleEditorChange}
            />
        </div>
    );
};

export default CodeEditor;