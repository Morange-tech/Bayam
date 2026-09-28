'use client'

import { useEffect, useRef, useState } from 'react'
import { Bold, Italic, Link as LinkIcon, List } from 'lucide-react'
import { cn } from '@/lib/utils'

function markdownToHtml(markdown) {
  return markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .split('\n\n')
    .map((block) => {
      const lines = block.split('\n').filter(Boolean)
      if (lines.length > 0 && lines.every((line) => line.trim().startsWith('- '))) {
        return `<ul>${lines.map((line) => `<li>${line.trim().slice(2)}</li>`).join('')}</ul>`
      }
      return `<p>${block.replace(/\n/g, '<br />')}</p>`
    })
    .join('')
}

// A deliberately small "simple markdown editor" (bold/italic/list/link + write/preview tabs) instead of
// pulling in react-md-editor. DOMPurify is loaded lazily so nothing runs during server prerendering.
export default function MarkdownEditor({ value, onChange, placeholder }) {
  const [tab, setTab] = useState('write')
  const [sanitize, setSanitize] = useState(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    import('dompurify').then((mod) => setSanitize(() => mod.default.sanitize))
  }, [])

  function wrapSelection(before, after = before) {
    const textarea = textareaRef.current
    if (!textarea) return
    const { selectionStart, selectionEnd } = textarea
    const selected = value.slice(selectionStart, selectionEnd)
    const next = `${value.slice(0, selectionStart)}${before}${selected}${after}${value.slice(selectionEnd)}`
    onChange(next)
    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(selectionStart + before.length, selectionStart + before.length + selected.length)
    })
  }

  const previewHtml = sanitize ? sanitize(markdownToHtml(value || '')) : ''

  return (
    <div className="overflow-hidden rounded-lg border border-beige-border">
      <div className="flex items-center justify-between border-b border-beige-border bg-beige-base px-2 py-1.5">
        <div className="flex items-center gap-1">
          <ToolbarButton icon={Bold} label="Gras" onClick={() => wrapSelection('**')} />
          <ToolbarButton icon={Italic} label="Italique" onClick={() => wrapSelection('*')} />
          <ToolbarButton icon={List} label="Liste" onClick={() => wrapSelection('- ', '')} />
          <ToolbarButton icon={LinkIcon} label="Lien" onClick={() => wrapSelection('[', '](https://)')} />
        </div>
        <div className="flex gap-1 text-xs">
          <button
            type="button"
            onClick={() => setTab('write')}
            className={cn(
              'rounded px-2 py-1 font-medium',
              tab === 'write' ? 'bg-white text-violet-active shadow-sm' : 'text-gray-500'
            )}
          >
            Écrire
          </button>
          <button
            type="button"
            onClick={() => setTab('preview')}
            className={cn(
              'rounded px-2 py-1 font-medium',
              tab === 'preview' ? 'bg-white text-violet-active shadow-sm' : 'text-gray-500'
            )}
          >
            Aperçu
          </button>
        </div>
      </div>

      {tab === 'write' ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={8}
          placeholder={placeholder}
          className="w-full resize-y bg-white px-4 py-3 text-sm text-violet-deep focus:outline-none"
        />
      ) : (
        <div
          className="min-h-[176px] space-y-2 bg-white px-4 py-3 text-sm text-gray-600 [&_a]:text-violet-active [&_a]:underline [&_li]:ml-5 [&_ul]:list-disc"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      )}
    </div>
  )
}

function ToolbarButton({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center rounded text-gray-500 hover:bg-white hover:text-violet-active"
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  )
}
