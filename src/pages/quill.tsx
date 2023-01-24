import dynamic from 'next/dynamic'
import { useMemo, useRef, useState } from 'react'
import { ReactQuillProps } from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill')
    interface Props extends ReactQuillProps {
      forwardedRef: any
    }
    return (props: Props) => <RQ ref={props.forwardedRef} {...props} />
  },
  { ssr: false }
)

export default function Quill() {
  const [value, setValue] = useState<string>()
  const quillRef = useRef<any>() // 本当はuseRef<ReactQuill>にしたいけど、dynamic importしているのでanyにするしかなさそう

  // 文字数をカウントしたい
  const strCount = useMemo(() => {
    if (!quillRef.current) return

    const editor = quillRef.current.getEditor()
    const unprivilegedEditor = quillRef.current.makeUnprivilegedEditor(editor)
    return unprivilegedEditor.getLength() - 1
  }, [value])

  return (
    <div style={{ height: '100vh', margin: '100px auto', width: 500 }}>
      <ReactQuill
        forwardedRef={quillRef}
        theme="snow"
        value={value}
        onChange={(v) => setValue(v)}
      />
      <p>文字数：{strCount}</p>
    </div>
  )
}
