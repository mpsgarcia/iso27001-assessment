'use client'

import { useEffect, useRef, useState } from 'react'
import { StatusAvaliacao } from '@/lib/types'

const OPTIONS: { value: StatusAvaliacao; label: string; icon: string; color: string }[] = [
  { value: 'nao_preenchido',      label: 'Não preenchido',      icon: 'radio_button_unchecked', color: '#7F7F7F' },
  { value: 'atende_totalmente',   label: 'Atende Totalmente',   icon: 'check_circle',           color: '#009668' },
  { value: 'atende_parcialmente', label: 'Atende Parcialmente', icon: 'pending',                color: '#B85A00' },
  { value: 'nao_atende',          label: 'Não atende',          icon: 'cancel',                 color: '#CC2200' },
  { value: 'nao_aplicavel',       label: 'Não Aplicável',       icon: 'do_not_disturb_on',      color: '#4B1196' },
]

interface Props {
  value: StatusAvaliacao
  onChange: (v: StatusAvaliacao) => void
}

export default function StatusSelect({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0]

  function close() {
    setClosing(true)
    setTimeout(() => {
      setOpen(false)
      setClosing(false)
    }, 160)
  }

  function toggle() {
    if (open) close()
    else setOpen(true)
  }

  function select(v: StatusAvaliacao) {
    onChange(v)
    close()
  }

  // Click outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close()
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={toggle}
        className="w-full flex items-center justify-between gap-sm px-md py-sm rounded-[12px] font-body text-[15px] transition-all"
        style={{
          minHeight: '50px',
          background: '#FFFFFF',
          border: open ? '1px solid #FF7400' : '1px solid rgba(45,45,45,0.16)',
          boxShadow: open ? '0 0 0 3px rgba(255,116,0,0.14)' : 'none',
          color: '#2D2D2D',
          transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
        }}
      >
        <span className="flex items-center gap-sm">
          <span
            className="material-symbols-outlined text-[20px] flex-shrink-0"
            style={{ color: selected.color, transition: 'color 0.18s ease' }}
          >
            {selected.icon}
          </span>
          <span style={{ transition: 'color 0.18s ease' }}>{selected.label}</span>
        </span>
        <span
          className="material-symbols-outlined text-[20px] flex-shrink-0"
          style={{
            color: '#7F7F7F',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          expand_more
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute z-50 w-full mt-1 rounded-[14px] overflow-hidden"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(45,45,45,0.12)',
            boxShadow: '0 12px 40px rgba(45,45,45,0.14)',
            animation: closing
              ? 'dropdownOut 0.16s ease both'
              : 'dropdownIn 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
          }}
        >
          {OPTIONS.map((opt, i) => {
            const isSelected = opt.value === value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => select(opt.value)}
                className="w-full flex items-center gap-sm px-md py-sm text-left font-body text-[14px] transition-all"
                style={{
                  background: isSelected ? 'rgba(255,116,0,0.06)' : 'transparent',
                  color: isSelected ? '#FF7400' : '#2D2D2D',
                  borderBottom: i < OPTIONS.length - 1 ? '1px solid rgba(45,45,45,0.05)' : 'none',
                  fontWeight: isSelected ? 600 : 400,
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'rgba(45,45,45,0.03)'
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent'
                }}
              >
                <span
                  className="material-symbols-outlined text-[18px] flex-shrink-0"
                  style={{ color: isSelected ? '#FF7400' : opt.color }}
                >
                  {opt.icon}
                </span>
                {opt.label}
                {isSelected && (
                  <span className="material-symbols-outlined text-[16px] ml-auto" style={{ color: '#FF7400' }}>
                    check
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
