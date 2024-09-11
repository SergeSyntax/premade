import { MediaUpload } from '@/media/containers/MediaUpload'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_dashboard/upload')({
  component: MediaUpload
})