import PublicLayout from '../../components/PublicLayout'

export const metadata = {
  title: 'Help Center — KrewStage',
  description: 'Find answers to common questions about KrewStage. Learn how to create a profile, post projects, join bands and connect with venues.',
}

export default function Layout({ children }) {
  return <PublicLayout>{children}</PublicLayout>
}
