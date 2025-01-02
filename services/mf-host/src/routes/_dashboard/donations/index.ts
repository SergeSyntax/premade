import DonationList from '@/donations/containers/DonationList'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/donations/')({
  component: DonationList,
})
