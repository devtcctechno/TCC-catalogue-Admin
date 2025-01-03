import dynamic from 'next/dynamic'

// ! To avoid 'Window is not defined' error
const Editor = dynamic(() => import('../../../customComponents/ck-editor'), { ssr: false });

export default Editor