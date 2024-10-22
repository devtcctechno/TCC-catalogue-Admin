import { EditorWrapper } from "../styles/editor"
import { useEffect, useState } from "react";
import { ContentBlock, ContentState, convertFromHTML, convertFromRaw, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import TCCReactEditor from "src/@core/components/react-draft-wysiwyg";
const TccEditor = (props: { getHtmlData?: any, data?: any, called?: boolean, errorData?: any, wrapperClassName?: any, readOnly?: any }) => {
    let state: any
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [errorData, setErrorData] = useState(false)
    useEffect(() => {
        props.getHtmlData(draftToHtml(convertToRaw(editorState.getCurrentContent())))
        const contentState = editorState.getCurrentContent();
        const isEmpty = !contentState.hasText();
        setErrorData(isEmpty);
    }, [editorState]);

    useEffect(() => {
        if (props.data !== <p></p>) {
            const blocksFromHTML = convertFromHTML(props.data);
            const content = ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap
            );
            state = EditorState.createWithContent(content)
            setEditorState(state)
        }
    }, [props.data]);

    useEffect(() => {
        if (props.errorData) {
            props.errorData(errorData)
        }
    }, [errorData])

    return (
        <div>
            <EditorWrapper>
                <TCCReactEditor editorState={editorState} readOnly={props.readOnly ? props.readOnly : false}
                    wrapperClassName={props?.wrapperClassName}
                    onEditorStateChange={(e) => {
                        setEditorState(e)
                    }}></TCCReactEditor>
            </EditorWrapper >
        </div >
    )
}

export default TccEditor