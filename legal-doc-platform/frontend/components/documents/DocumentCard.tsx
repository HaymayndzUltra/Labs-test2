'use client'

import { useState } from 'react'
import { DocumentTextIcon, EyeIcon, ShareIcon, ArrowDownTrayIcon, ClockIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'

interface Document {
  id: string
  title: string
  fileName: string
  fileSize: number
  mimeType: string
  createdAt: string
  updatedAt: string
  status: 'draft' | 'active' | 'archived' | 'deleted'
  isConfidential: boolean
  legalHold: boolean
  caseTitle?: string
  clientName?: string
}

interface DocumentCardProps {
  document: Document
  onView: (document: Document) => void
  onShare: (document: Document) => void
  onDownload: (document: Document) => void
}

export default function DocumentCard({ document, onView, onShare, onDownload }: DocumentCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return '📄'
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝'
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊'
    if (mimeType.includes('image')) return '🖼️'
    return '📄'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      case 'deleted':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div
      className={`document-card group relative ${
        isHovered ? 'shadow-lg' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getFileIcon(document.mimeType)}</span>
          <div>
            <h3 className="font-medium text-legal-900 text-sm line-clamp-1">
              {document.title}
            </h3>
            <p className="text-xs text-legal-500">{document.fileName}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {document.isConfidential && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Confidential
            </span>
          )}
          {document.legalHold && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              Legal Hold
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 mb-4">
        {document.caseTitle && (
          <div className="text-xs text-legal-600">
            <span className="font-medium">Case:</span> {document.caseTitle}
          </div>
        )}
        {document.clientName && (
          <div className="text-xs text-legal-600">
            <span className="font-medium">Client:</span> {document.clientName}
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-legal-500">
          <span>{formatFileSize(document.fileSize)}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
            {document.status}
          </span>
        </div>
        
        <div className="flex items-center text-xs text-legal-500">
          <ClockIcon className="w-3 h-3 mr-1" />
          <span>Updated {format(new Date(document.updatedAt), 'MMM d, yyyy')}</span>
        </div>
      </div>

      {/* Actions */}
      <div className={`flex items-center justify-between pt-3 border-t border-legal-200 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      } transition-opacity duration-200`}>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(document)}
            className="p-1 text-legal-600 hover:text-primary-600 hover:bg-primary-50 rounded"
            title="View document"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onShare(document)}
            className="p-1 text-legal-600 hover:text-primary-600 hover:bg-primary-50 rounded"
            title="Share document"
          >
            <ShareIcon className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onDownload(document)}
            className="p-1 text-legal-600 hover:text-primary-600 hover:bg-primary-50 rounded"
            title="Download document"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
          </button>
        </div>
        
        <div className="text-xs text-legal-400">
          {format(new Date(document.createdAt), 'MMM d, yyyy')}
        </div>
      </div>
    </div>
  )
}
